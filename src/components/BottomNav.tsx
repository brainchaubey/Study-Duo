import React from 'react';
import { Home, MessageSquare, BookOpen, Lock, ShieldCheck } from 'lucide-react';
import { AuthSession } from '../types';

interface BottomNavProps {
  currentTab: 'home' | 'chat' | 'study';
  setCurrentTab: (tab: 'home' | 'chat' | 'study') => void;
  session: AuthSession | null;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  session,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            currentTab === 'home'
              ? 'text-purple-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Home</span>
        </button>

        {/* Chat (Core Focus) */}
        <button
          onClick={() => setCurrentTab('chat')}
          className={`relative flex flex-col items-center gap-1 py-1 px-5 rounded-2xl transition-all ${
            currentTab === 'chat'
              ? 'text-white bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/40 shadow-lg shadow-purple-900/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            {session ? (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            ) : (
              <Lock className="absolute -top-1 -right-1 w-2.5 h-2.5 text-amber-400" />
            )}
          </div>
          <span className="text-[11px] font-medium">Chat</span>
        </button>

        {/* Study */}
        <button
          onClick={() => setCurrentTab('study')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            currentTab === 'study'
              ? 'text-purple-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px]">Study</span>
        </button>
      </div>
    </nav>
  );
};
