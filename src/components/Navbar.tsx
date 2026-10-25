import React from 'react';
import { Lock, Unlock, Shield, Users, MessageSquare, Download } from 'lucide-react';
import { AuthSession } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface NavbarProps {
  currentTab: 'home' | 'chat' | 'study';
  setCurrentTab: (tab: 'home' | 'chat' | 'study') => void;
  session: AuthSession | null;
  onLockChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  session,
  onLockChat,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-900/20 group-hover:shadow-purple-700/30 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                StudyDuo
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/40 text-purple-300">
                Private
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              2-Person Encrypted Duo & Class 10 CBSE
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'home'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentTab('chat')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
              currentTab === 'chat'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
            {session ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>
          <button
            onClick={() => setCurrentTab('study')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'study'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Class 10 Study
          </button>
        </nav>

        {/* Status / Quick Lock Controls */}
        <div className="flex items-center gap-2">
          {isInstallable && !isInstalled && (
            <button
              onClick={install}
              title="Install StudyDuo on your Android home screen"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-900/40 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-purple-200" />
              <span>Install App</span>
            </button>
          )}

          {session ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: session.participant.avatarColor }}
                />
                <span className="text-xs font-semibold text-slate-200">
                  {session.participant.name}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                  {session.participant.role}
                </span>
              </div>

              <button
                onClick={onLockChat}
                title="Lock chat immediately and revoke session"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-800/60 text-red-200 text-xs font-semibold shadow-sm transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden xs:inline">Lock Chat</span>
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setCurrentTab('chat')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 text-xs cursor-pointer hover:border-purple-800/50 hover:text-slate-200 transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Chat is Locked</span>
              <span className="sm:hidden">Locked</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
