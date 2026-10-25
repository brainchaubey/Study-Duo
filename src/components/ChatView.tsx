import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Unlock, 
  Send, 
  KeyRound, 
  RotateCw, 
  Wifi, 
  WifiOff, 
  CheckCheck,
  AlertTriangle,
  Sparkles,
  Trash2,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { AuthSession, ChatMessage, ParticipantId } from '../types';

interface ChatViewProps {
  session: AuthSession | null;
  onLoginSuccess: (session: AuthSession) => void;
  onLockChat: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  session,
  onLoginSuccess,
  onLockChat,
}) => {
  // Login State
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeLoginTarget, setActiveLoginTarget] = useState<'Chamgadar' | 'ChatGPT' | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isConnectedSSE, setIsConnectedSSE] = useState(false);
  const [isClearingChat, setIsClearingChat] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom helper
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  // 1. Fetch Messages & Setup Real-time SSE when Session is active
  useEffect(() => {
    if (!session) {
      setMessages([]);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnectedSSE(false);
      return;
    }

    let isMounted = true;
    setIsLoadingMessages(true);
    setChatError(null);

    // Fetch existing messages from free container server memory
    fetch('/api/chat/messages', {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            onLockChat();
            throw new Error('Chat session has expired or is invalid.');
          }
          throw new Error('Failed to load conversation.');
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setMessages(data.messages || []);
          setIsLoadingMessages(false);
          setTimeout(() => scrollToBottom(false), 50);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setChatError(err.message);
          setIsLoadingMessages(false);
        }
      });

    // Real-Time SSE Connection for cross-device instant messaging
    const sseUrl = `/api/chat/stream?token=${encodeURIComponent(session.token)}`;
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      if (isMounted) setIsConnectedSSE(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'NEW_MESSAGE' && payload.message) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.message.id)) return prev;
            return [...prev, payload.message];
          });
          setTimeout(() => scrollToBottom(true), 50);
        } else if (payload.type === 'CHAT_CLEARED') {
          setMessages([]);
        } else if (payload.type === 'SESSION_REVOKED') {
          onLockChat();
        }
      } catch (e) {
        // SSE heartbeat
      }
    };

    eventSource.onerror = () => {
      if (isMounted) setIsConnectedSSE(false);
    };

    return () => {
      isMounted = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [session]);

  // Handle Login submission with target account
  const handlePerformLogin = async (targetAccount: 'Chamgadar' | 'ChatGPT') => {
    if (!password.trim()) {
      setLoginError('Please enter your password first.');
      return;
    }

    setLoginLoading(true);
    setActiveLoginTarget(targetAccount);
    setLoginError(null);

    try {
      const res = await fetch('/api/chat/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: targetAccount, password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Incorrect password for ${targetAccount === 'Chamgadar' ? 'Admin' : 'ChatGPT'} Login.`);
      }

      setPassword('');
      onLoginSuccess({
        token: data.token,
        participant: data.participant,
      });
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify your password.');
    } finally {
      setLoginLoading(false);
      setActiveLoginTarget(null);
    }
  };

  // Handle Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend || !session || isSending) return;

    setIsSending(true);
    setChatError(null);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ text: textToSend }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          onLockChat();
          throw new Error('Your session expired. Please unlock chat again.');
        }
        throw new Error(data.error || 'Failed to send message.');
      }

      setInputText('');
      // If SSE is slightly delayed, optimistically render
      if (data.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
        setTimeout(() => scrollToBottom(true), 50);
      }
      inputRef.current?.focus();
    } catch (err: any) {
      setChatError(err.message || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  // Handle Clear / Reset Chat
  const handleClearChat = async () => {
    if (!session || isClearingChat) return;
    setIsClearingChat(true);

    try {
      const res = await fetch('/api/chat/messages/clear', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (res.ok) {
        setMessages([]);
        setShowClearConfirm(false);
      } else {
        throw new Error('Failed to reset chat.');
      }
    } catch (err: any) {
      setChatError(err.message || 'Could not clear chat.');
    } finally {
      setIsClearingChat(false);
    }
  };

  // Helper format time
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Helper format date separator
  const formatDateHeader = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  // ----------------------------------------------------
  // 1. LOCKED CHAT GATE
  // ----------------------------------------------------
  if (!session) {
    return (
      <div className="max-w-md mx-auto my-6 sm:my-12 px-4 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 shadow-inner">
              <Lock className="w-7 h-7 text-purple-400" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                StudyDuo Chat Access
              </h2>
              <p className="text-xs text-slate-400">
                Shared private channel. Enter your password to enter as Admin or ChatGPT.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800/80 flex items-start gap-2.5 text-xs text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Password Input Form */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Access Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                {/* Masked password field - never shows plaintext password, never autofills */}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  autoComplete="new-password"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-600 outline-none transition-all font-mono tracking-widest"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      // Default to Admin if not specified
                      handlePerformLogin('Chamgadar');
                    }
                  }}
                />
              </div>
            </div>

            {/* Two Login Buttons: Admin Login & ChatGPT Login */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => handlePerformLogin('Chamgadar')}
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loginLoading && activeLoginTarget === 'Chamgadar' ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Verifying Admin Credentials...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-purple-200" />
                    <span>Admin Login</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handlePerformLogin('ChatGPT')}
                disabled={loginLoading}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/60 border border-slate-700 text-cyan-300 font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loginLoading && activeLoginTarget === 'ChatGPT' ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-cyan-200" />
                    <span>Verifying ChatGPT Credentials...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-cyan-300" />
                    <span>ChatGPT Login</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Free real-time messaging between connected devices.</span>
            </p>
            <p className="text-[10px] text-slate-500 pl-5">
              Sessions are volatile. Leaving or refreshing the app locks the chat automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. UNLOCKED REAL-TIME CHAT
  // ----------------------------------------------------
  const isMe = (senderId: ParticipantId) => session.participant.id === senderId;

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-4.5rem)] md:h-[calc(100vh-5.5rem)] pb-16 md:pb-4">
      {/* Top Bar with Connection Status, Participant Details & Clear Option */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-t-2xl px-4 py-3 flex items-center justify-between shrink-0 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-md"
            style={{ 
              backgroundColor: session.participant.avatarColor === '#8b5cf6' ? '#2e1065' : '#083344',
              color: session.participant.avatarColor,
              border: `1px solid ${session.participant.avatarColor}60`
            }}
          >
            {session.participant.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">
                Shared StudyDuo Chat
              </span>
              {/* Clear Connection Status Pill */}
              {isConnectedSSE ? (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/90 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/90 border border-rose-800/60 px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Disconnected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Active as <strong className="text-slate-200">{session.participant.name}</strong> ({session.participant.role})
            </p>
          </div>
        </div>

        {/* Action Controls: Clear Chat & Lock / Leave */}
        <div className="flex items-center gap-2">
          {/* Clear / Reset Chat Button */}
          <button
            onClick={() => setShowClearConfirm(true)}
            title="Reset conversation"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>

          {/* Lock / Leave Chat Button */}
          <button
            onClick={onLockChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold shadow-sm transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span>Lock / Leave</span>
          </button>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <Trash2 className="w-5 h-5 text-red-400" />
              <h3>Clear Conversation?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will reset the temporary chat and clear all message bubbles on both connected devices.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleClearChat}
                disabled={isClearingChat}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                {isClearingChat ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Yes, Clear Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {chatError && (
        <div className="p-2.5 bg-red-950/80 border-x border-red-800 text-xs text-red-300 flex items-center justify-between">
          <span>{chatError}</span>
          <button 
            onClick={() => setChatError(null)}
            className="text-red-400 hover:text-white font-semibold text-xs ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Message Feed */}
      <div className="flex-1 bg-slate-950/90 border-x border-slate-800 p-4 overflow-y-auto space-y-4">
        {isLoadingMessages ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
            <RotateCw className="w-6 h-6 animate-spin text-purple-400" />
            <p className="text-xs">Connecting to shared live room...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-white font-semibold text-sm">
              StudyDuo Shared Conversation
            </h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Chat in real time between your devices. Type a message below to start!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const outgoing = isMe(msg.senderId);
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const isDifferentDay = !prevMsg || 
              formatDateHeader(prevMsg.timestamp) !== formatDateHeader(msg.timestamp);

            return (
              <React.Fragment key={msg.id}>
                {isDifferentDay && (
                  <div className="flex justify-center my-3">
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full shadow-sm">
                      {formatDateHeader(msg.timestamp)}
                    </span>
                  </div>
                )}

                <div className={`flex flex-col ${outgoing ? 'items-end' : 'items-start'}`}>
                  {/* Sender identity label (if not consecutive or incoming) */}
                  {(!prevMsg || prevMsg.senderId !== msg.senderId || isDifferentDay) && (
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span 
                        className="text-[11px] font-semibold"
                        style={{
                          color: msg.senderId === 'chamgadar' ? '#c084fc' : '#22d3ee'
                        }}
                      >
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {msg.senderId === 'chamgadar' ? '(Admin)' : '(ChatGPT)'}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-md transition-all ${
                      outgoing
                        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white rounded-tr-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed select-text">
                      {msg.text}
                    </p>
                    <div
                      className={`text-[10px] mt-1 flex items-center gap-1 justify-end ${
                        outgoing ? 'text-purple-200/80' : 'text-slate-400'
                      }`}
                    >
                      <span>{formatTime(msg.timestamp)}</span>
                      {outgoing && <CheckCheck className="w-3 h-3 text-purple-200" />}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="bg-slate-900 border border-slate-800 rounded-b-2xl p-3 shrink-0 shadow-xl">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Type a message as ${session.participant.name}... (Press Enter to send)`}
            maxLength={2000}
            disabled={isSending}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />

          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-purple-900/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <RotateCw className="w-4 h-4 animate-spin text-purple-200" />
            ) : (
              <>
                <span className="hidden sm:inline">Send</span>
                <Send className="w-4 h-4 text-purple-200" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-1">
          <span>Enter to send • Real-time free chat</span>
          <span>{inputText.length} / 2000</span>
        </div>
      </div>
    </div>
  );
};
