
import React, { useEffect, useRef, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import {
  Lock, Unlock, Send, KeyRound, RotateCw, CheckCheck,
  AlertTriangle, Sparkles, Trash2, ShieldCheck, UserCheck,
} from 'lucide-react';
import type { AuthSession, ChatMessage, ParticipantId } from '../types';
import { auth, db } from '../lib/firebase';
import { CHAT_USERS } from '../lib/chatConfig';

interface ChatViewProps {
  session: AuthSession | null;
  onLoginSuccess: (session: AuthSession) => void;
  onLockChat: () => void;
}

const room = 'main';
const messagesRef = collection(db, 'conversations', room, 'messages');

export const ChatView: React.FC<ChatViewProps> = ({
  session, onLoginSuccess, onLockChat,
}) => {
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [target, setTarget] = useState<'chamgadar' | 'chatgpt'>('chamgadar');
  const [loginError, setLoginError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState('');
  const [connected, setConnected] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearingChat, setIsClearingChat] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lockChat = async () => {
    try {
      await signOut(auth);
    } finally {
      onLockChat();
    }
  };

  useEffect(() => {
    if (!session || !auth.currentUser) {
      setMessages([]);
      setConnected(false);
      return;
    }

    setIsLoadingMessages(true);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(item => {
        const data = item.data();
        const sender = data.senderId as ParticipantId;
        return {
          id: item.id,
          conversationId: room,
          senderId: sender,
          senderName: data.senderName,
          text: data.text,
          timestamp: data.timestamp?.toDate
            ? data.timestamp.toDate().toISOString()
            : typeof data.timestamp === 'string'
              ? data.timestamp
              : new Date().toISOString(),
        } as ChatMessage;
      });
      setMessages(list);
      setConnected(true);
      setIsLoadingMessages(false);
      setChatError('');
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, error => {
      setConnected(false);
      setIsLoadingMessages(false);
      setChatError('Chat connection failed. Check your Firebase rules and internet connection.');
      console.error(error);
    });

    return unsubscribe;
  }, [session]);

  const handleLogin = async () => {
    if (!password) {
      setLoginError('Please enter your password.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      const account = CHAT_USERS[target];
      const credential = await signInWithEmailAndPassword(
        auth, account.email, password,
      );

      if (credential.user.uid !== account.uid) {
        await signOut(auth);
        throw new Error('This email does not match the selected account.');
      }

      const participant = {
        id: target,
        name: account.name,
        role: account.role,
        avatarColor: account.avatarColor,
      } as AuthSession['participant'];

      const token = await credential.user.getIdToken();
      setPassword('');
      onLoginSuccess({ token, participant });
    } catch (error) {
      const code = (error as { code?: string }).code;
      setLoginError(
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
          ? 'Email or password is incorrect.'
          : (error as Error).message || 'Login failed. Please try again.',
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSend = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = inputText.trim();
    const user = auth.currentUser;

    if (!text || !session || !user || isSending) return;

    setIsSending(true);
    setChatError('');

    try {
      const account = CHAT_USERS[session.participant.id];
      if (user.uid !== account.uid) {
        throw new Error('Your account does not match this chat session. Please log in again.');
      }

      await addDoc(messagesRef, {
        senderUid: user.uid,
        senderId: session.participant.id,
        senderName: session.participant.name,
        text,
        timestamp: serverTimestamp(),
      });

      setInputText('');
      inputRef.current?.focus();
    } catch (error) {
      setChatError((error as Error).message || 'Could not send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = async () => {
    if (!auth.currentUser || isClearingChat) return;
    setIsClearingChat(true);
    setChatError('');

    try {
      const snapshot = await getDocs(messagesRef);
      const items = snapshot.docs;

      // Firestore batches have a 500-operation limit.
      for (let i = 0; i < items.length; i += 450) {
        const batch = writeBatch(db);
        items.slice(i, i + 450).forEach(item => batch.delete(
          doc(db, 'conversations', room, 'messages', item.id),
        ));
        await batch.commit();
      }

      setShowClearConfirm(false);
    } catch (error) {
      setChatError('Could not clear chat. Please check your Firestore rules.');
      console.error(error);
    } finally {
      setIsClearingChat(false);
    }
  };

  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  if (!session) {
    return (
      <div className="max-w-md mx-auto my-6 sm:my-12 px-4 pb-20">
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8">
          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-950 border border-purple-800 flex items-center justify-center">
              <Lock className="w-7 h-7 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">StudyDuo Chat Access</h2>
            <p className="text-xs text-slate-400">Sign in to your private shared chat.</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950 border border-red-800 text-xs text-red-200">
              <AlertTriangle className="inline w-4 h-4 mr-2" />{loginError}
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-xs text-slate-300">
              Account
              <select
                value={target}
                onChange={e => setTarget(e.target.value as typeof target)}
                className="mt-1 w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
              >
                <option value="chamgadar">Admin Login</option>
                <option value="chatgpt">ChatGPT Login</option>
              </select>
            </label>

            <label className="block text-xs text-slate-300">
              Password
              <span className="relative block mt-1">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </span>
            </label>

            <button
              onClick={handleLogin}
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold disabled:opacity-50"
            >
              {loginLoading
                ? <><RotateCw className="inline w-4 h-4 animate-spin mr-2" />Signing in...</>
                : <><Unlock className="inline w-4 h-4 mr-2" />Unlock Chat</>}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            <ShieldCheck className="inline w-4 h-4 text-emerald-400 mr-2" />
            Private, real-time messaging using Firebase.
          </div>
        </div>
      </div>
    );
  }

  const isMe = (senderId: ParticipantId) => session.participant.id === senderId;

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-4.5rem)] md:h-[calc(100vh-5.5rem)] pb-16 md:pb-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-2xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-white text-sm">Shared StudyDuo Chat</div>
          <div className="text-xs text-slate-400">
            {connected ? '● Connected' : '○ Connecting'} · {session.participant.name}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowClearConfirm(true)} className="px-2.5 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs">
            <Trash2 className="inline w-4 h-4 mr-1" />Clear
          </button>
          <button onClick={lockChat} className="px-3 py-2 rounded-lg bg-red-950 border border-red-800 text-red-200 text-xs">
            <Lock className="inline w-4 h-4 mr-1" />Lock / Leave
          </button>
        </div>
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="max-w-sm w-full rounded-2xl bg-slate-900 border border-slate-700 p-5">
            <h3 className="text-white font-bold mb-2">Clear conversation?</h3>
            <p className="text-sm text-slate-300 mb-5">This removes messages for both users.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowClearConfirm(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-white">Cancel</button>
              <button onClick={handleClear} disabled={isClearingChat} className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50">
                {isClearingChat ? 'Clearing...' : 'Clear Chat'}
              </button>
            </div>
          </div>
        </div>
      )}

      {chatError && (
        <div className="p-3 bg-red-950 border border-red-800 text-red-200 text-xs">
          {chatError}
          <button className="ml-3 underline" onClick={() => setChatError('')}>Dismiss</button>
        </div>
      )}

      <div className="flex-1 min-h-0 bg-slate-950 border-x border-slate-800 p-4 overflow-y-auto space-y-4">
        {isLoadingMessages ? (
          <div className="text-center text-slate-400 py-10"><RotateCw className="inline animate-spin mr-2" />Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
            <h4 className="text-white font-semibold">Your shared conversation</h4>
            <p className="text-xs text-slate-400 mt-2">Send a message to start chatting.</p>
          </div>
        ) : messages.map((msg, index) => {
          const outgoing = isMe(msg.senderId);
          const previous = messages[index - 1];
          const newDay = !previous || formatDate(previous.timestamp) !== formatDate(msg.timestamp);

          return (
            <React.Fragment key={msg.id}>
              {newDay && <div className="text-center text-[10px] text-slate-400">{formatDate(msg.timestamp)}</div>}
              <div className={`flex flex-col ${outgoing ? 'items-end' : 'items-start'}`}>
                <div className={`text-[11px] mb-1 ${msg.senderId === 'chamgadar' ? 'text-purple-300' : 'text-cyan-300'}`}>
                  {msg.senderName} · {msg.senderId === 'chamgadar' ? 'Admin' : 'ChatGPT'}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md ${outgoing ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm' : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <div className="text-[10px] mt-1 text-right opacity-70">
                    {formatTime(msg.timestamp)} {outgoing && <CheckCheck className="inline w-3 h-3" />}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-b-2xl p-3">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            ref={inputRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            maxLength={2000}
            disabled={isSending}
            placeholder={`Message as ${session.participant.name}...`}
            className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
          />
          <button type="submit" disabled={isSending || !inputText.trim()} className="px-4 rounded-xl bg-purple-600 text-white disabled:opacity-40">
            {isSending ? <RotateCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
        <div className="text-[10px] text-slate-500 mt-2 text-right">{inputText.length}/2000</div>
      </div>
    </div>
  );
};
