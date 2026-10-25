import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

// Ensure storage directory exists for resilient persistence
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const STUDY_FILE = path.join(DATA_DIR, 'study_progress.json');

// Types
interface Participant {
  id: 'chamgadar' | 'chatgpt';
  name: string;
  role: 'Admin' | 'Study Partner';
  avatarColor: string;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: 'chamgadar' | 'chatgpt';
  senderName: string;
  text: string;
  timestamp: string;
}

interface ActiveSession {
  token: string;
  participant: Participant;
  createdAt: number;
  expiresAt: number;
}

// Credentials hashes (PBKDF2 SHA-512, 100,000 rounds)
// Admin: Chamgadar -> Password '17'
const CREDENTIALS = {
  chamgadar: {
    id: 'chamgadar' as const,
    name: 'Chamgadar',
    role: 'Admin' as const,
    avatarColor: '#8b5cf6', // Violet
    salt: 'chamgadar_duo_salt_2026',
    hash: '778ca1d29893dc6f354bb8432d93f2e92e0e8bd6e81f67088ac417ab985635d487c6c3b8797ee8cd5b63eedb2b908a8aa358f55398db750a5c759bad906f2d33',
  },
  chatgpt: {
    id: 'chatgpt' as const,
    name: 'ChatGPT',
    role: 'Study Partner' as const,
    avatarColor: '#06b6d4', // Cyan
    salt: 'chatgpt_duo_salt_2026',
    hash: '96c8bfbaf948901957ac3ad2b41bbbcb4e29b4dd109dab3de2aee708fb40f2b8cece2c4febde8dfda0d370ef6f4374e1fe5615bed3a0f0ab5b34bfa09ded10dd',
  },
};

// Rate limiter state
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return { allowed: true };

  if (entry.lockedUntil > now) {
    const waitSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  if (entry.lockedUntil <= now && entry.count >= 5) {
    // Reset window after lock period expires
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordLoginFailure(ip: string) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= 5) {
    entry.lockedUntil = now + 60 * 1000; // 1-minute lockout
  }
  loginAttempts.set(ip, entry);
}

function resetLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// In-memory active sessions (Revoked immediately on Logout / Leave Chat)
const activeSessions = new Map<string, ActiveSession>();

// In-memory SSE subscriber connections
interface SSEClient {
  id: string;
  res: express.Response;
  participantId: string;
}
const sseClients = new Set<SSEClient>();

// Persistent storage helpers
function loadStoredMessages(): ChatMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const content = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading stored messages:', err);
  }
  return [];
}

let messagesCache: ChatMessage[] = loadStoredMessages();

function saveStoredMessages(msgs: ChatMessage[]) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving messages:', err);
  }
}

function loadStudyProgress(): Record<string, any> {
  try {
    if (fs.existsSync(STUDY_FILE)) {
      const content = fs.readFileSync(STUDY_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading study progress:', err);
  }
  return {
    chamgadar: { completedChapters: [], quizScores: {}, updatedAt: new Date().toISOString() },
    chatgpt: { completedChapters: [], quizScores: {}, updatedAt: new Date().toISOString() },
  };
}

let studyProgressCache = loadStudyProgress();

function saveStudyProgress(data: Record<string, any>) {
  try {
    fs.writeFileSync(STUDY_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving study progress:', err);
  }
}

// Verification helper
function verifyPassword(candidate: string, salt: string, expectedHashHex: string): boolean {
  try {
    const candidateHash = crypto.pbkdf2Sync(candidate, salt, 100000, 64, 'sha512');
    const expectedBuffer = Buffer.from(expectedHashHex, 'hex');
    if (candidateHash.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(candidateHash, expectedBuffer);
  } catch {
    return false;
  }
}

// Authentication middleware
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Chat is locked. Authentication required.' });
    return;
  }

  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);

  if (!session) {
    res.status(401).json({ error: 'Invalid or revoked chat session.' });
    return;
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    res.status(401).json({ error: 'Chat session has expired. Please log in again.' });
    return;
  }

  (req as any).session = session;
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // --- API ROUTES ---

  // 1. Chat Login
  app.post('/api/chat/auth/login', (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      res.status(429).json({
        error: `Too many failed login attempts. Please wait ${rateCheck.waitSeconds} seconds.`,
      });
      return;
    }

    const { account, password } = req.body;
    if (!account || typeof account !== 'string' || !password || typeof password !== 'string') {
      res.status(400).json({ error: 'Account name and password are required.' });
      return;
    }

    const normalizedAccount = account.trim().toLowerCase();
    let targetConfig = null;

    if (normalizedAccount === 'chamgadar') {
      targetConfig = CREDENTIALS.chamgadar;
    } else if (normalizedAccount === 'chatgpt') {
      targetConfig = CREDENTIALS.chatgpt;
    }

    if (!targetConfig) {
      recordLoginFailure(clientIp);
      res.status(401).json({ error: 'Invalid account name or credentials.' });
      return;
    }

    const isValid = verifyPassword(password.trim(), targetConfig.salt, targetConfig.hash);
    if (!isValid) {
      recordLoginFailure(clientIp);
      res.status(401).json({ error: 'Incorrect password for this account.' });
      return;
    }

    // Login successful
    resetLoginAttempts(clientIp);

    // Generate high-entropy 256-bit token
    const token = crypto.randomBytes(32).toString('hex');
    const session: ActiveSession = {
      token,
      participant: {
        id: targetConfig.id,
        name: targetConfig.name,
        role: targetConfig.role,
        avatarColor: targetConfig.avatarColor,
      },
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // Max 24 hours (or revoked on lock/leave)
    };

    activeSessions.set(token, session);

    res.json({
      success: true,
      token,
      participant: session.participant,
    });
  });

  // 2. Chat Logout / Lock Session Revocation
  app.post('/api/chat/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    let token = req.body?.token;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    if (token && activeSessions.has(token)) {
      activeSessions.delete(token);
    }

    // Close any SSE connections associated with this token if any
    res.json({ success: true, message: 'Chat locked and session revoked successfully.' });
  });

  // 3. Verify Active Session
  app.get('/api/chat/auth/session', requireAuth, (req, res) => {
    const session: ActiveSession = (req as any).session;
    res.json({
      authenticated: true,
      participant: session.participant,
    });
  });

  // 4. Get Chat Messages (Requires active authentication)
  app.get('/api/chat/messages', requireAuth, (req, res) => {
    res.json({
      conversationId: 'studyduo_private_v1',
      messages: messagesCache,
    });
  });

  // 5. Send Chat Message (Requires active authentication)
  app.post('/api/chat/messages', requireAuth, (req, res) => {
    const session: ActiveSession = (req as any).session;
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      res.status(400).json({ error: 'Message text cannot be empty.' });
      return;
    }

    const trimmedText = text.trim();
    if (trimmedText.length > 2000) {
      res.status(400).json({ error: 'Message cannot exceed 2000 characters.' });
      return;
    }

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      conversationId: 'studyduo_private_v1',
      senderId: session.participant.id,
      senderName: session.participant.name,
      text: trimmedText,
      timestamp: new Date().toISOString(),
    };

    messagesCache.push(newMessage);
    saveStoredMessages(messagesCache);

    // Broadcast in real-time to all connected SSE clients
    const payload = JSON.stringify({ type: 'NEW_MESSAGE', message: newMessage });
    for (const client of sseClients) {
      try {
        client.res.write(`data: ${payload}\n\n`);
      } catch (err) {
        console.error('SSE client broadcast error:', err);
      }
    }

    res.status(201).json({ success: true, message: newMessage });
  });

  // 5b. Clear Chat / Reset Conversation (Requires active authentication)
  app.post('/api/chat/messages/clear', requireAuth, (req, res) => {
    messagesCache = [];
    saveStoredMessages(messagesCache);

    // Broadcast clear event to all active SSE subscribers
    const payload = JSON.stringify({ type: 'CHAT_CLEARED' });
    for (const client of sseClients) {
      try {
        client.res.write(`data: ${payload}\n\n`);
      } catch (err) {
        console.error('SSE client broadcast error on clear:', err);
      }
    }

    res.json({ success: true, message: 'Chat conversation reset successfully.' });
  });

  // 6. Real-time Chat Stream (Server-Sent Events)
  app.get('/api/chat/stream', (req, res) => {
    const token = (req.query.token as string) || '';
    const session = activeSessions.get(token);

    if (!session || Date.now() > session.expiresAt) {
      res.status(401).json({ error: 'Unauthorized stream connection.' });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const client: SSEClient = {
      id: crypto.randomBytes(8).toString('hex'),
      res,
      participantId: session.participant.id,
    };
    sseClients.add(client);

    // Initial sync
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', participant: session.participant })}\n\n`);

    // Heartbeat every 20 seconds to keep connection alive
    const heartbeat = setInterval(() => {
      // Validate session still exists
      if (!activeSessions.has(token)) {
        clearInterval(heartbeat);
        sseClients.delete(client);
        try {
          res.write(`data: ${JSON.stringify({ type: 'SESSION_REVOKED' })}\n\n`);
          res.end();
        } catch {}
        return;
      }
      try {
        res.write(': heartbeat\n\n');
      } catch {
        clearInterval(heartbeat);
        sseClients.delete(client);
      }
    }, 20000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients.delete(client);
    });
  });

  // 7. Get Study Progress
  app.get('/api/study/progress', (req, res) => {
    const participant = ((req.query.participant as string) || 'chamgadar').toLowerCase();
    const progress = studyProgressCache[participant] || {
      completedChapters: [],
      quizScores: {},
      updatedAt: new Date().toISOString(),
    };
    res.json({ participant, progress });
  });

  // 8. Save Study Progress
  app.post('/api/study/progress', (req, res) => {
    const { participant, completedChapters, quizScores } = req.body;
    const targetKey = participant && typeof participant === 'string' ? participant.toLowerCase() : 'chamgadar';

    if (!studyProgressCache[targetKey]) {
      studyProgressCache[targetKey] = { completedChapters: [], quizScores: {}, updatedAt: '' };
    }

    if (Array.isArray(completedChapters)) {
      studyProgressCache[targetKey].completedChapters = completedChapters;
    }

    if (quizScores && typeof quizScores === 'object') {
      studyProgressCache[targetKey].quizScores = {
        ...(studyProgressCache[targetKey].quizScores || {}),
        ...quizScores,
      };
    }

    studyProgressCache[targetKey].updatedAt = new Date().toISOString();
    saveStudyProgress(studyProgressCache);

    res.json({ success: true, progress: studyProgressCache[targetKey] });
  });

  // --- VITE MIDDLEWARE / STATIC FILES ---
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyDuo Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start StudyDuo server:', err);
  process.exit(1);
});
