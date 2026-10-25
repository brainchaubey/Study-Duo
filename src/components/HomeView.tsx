import React from 'react';
import { 
  Lock, 
  Unlock, 
  MessageSquare, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { AuthSession } from '../types';
import { CBSE_CLASS_10_SUBJECTS } from '../data/cbseClass10Data';
import { PWAInstallBanner } from './PWAInstallBanner';

interface HomeViewProps {
  onOpenChat: () => void;
  onOpenStudy: () => void;
  session: AuthSession | null;
  completedChapters: string[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenChat,
  onOpenStudy,
  session,
  completedChapters,
}) => {
  const totalChapters = CBSE_CLASS_10_SUBJECTS.reduce((acc, s) => acc + s.chapters.length, 0);
  const completedCount = completedChapters.length;
  const progressPercent = Math.round((completedCount / totalChapters) * 100);

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-purple-900/30 p-6 sm:p-8 shadow-2xl shadow-purple-950/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/50 text-purple-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Dedicated 2-Person Private Study Space</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Private Real-Time Chat & <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                CBSE Class 10 Companion
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Designed specifically for two authorized participants: <strong className="text-purple-300">Chamgadar</strong> and <strong className="text-cyan-300">ChatGPT</strong>. Real-time messaging with instant session revocation and persistent CBSE 2026–27 syllabus tracking.
            </p>
          </div>

          {/* Quick CTA */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 transition-all flex items-center justify-center gap-2 group"
            >
              <MessageSquare className="w-4 h-4 text-purple-200" />
              <span>{session ? 'Continue Chat' : 'Unlock Chat Room'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenStudy}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>View Syllabus & MCQs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Free Android Installation Banner */}
      <PWAInstallBanner />

      {/* Two Authorized Seats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Participant 1: Chamgadar (Admin) */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-800/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-300 font-bold text-base shadow-sm">
                C
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Chamgadar</h3>
                <span className="text-[11px] font-medium text-purple-400 bg-purple-950/80 border border-purple-800/40 px-2 py-0.5 rounded">
                  Admin Seat
                </span>
              </div>
            </div>
            {session?.participant.id === 'chamgadar' ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Session
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full">
                <Lock className="w-3 h-3 text-slate-400" />
                Locked
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Authorized administrator account. Access gate requires the requested credential key. Session auto-locks upon departure.
          </p>
        </div>

        {/* Participant 2: ChatGPT (Study Partner) */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-800/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-300 font-bold text-base shadow-sm">
                P
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">ChatGPT</h3>
                <span className="text-[11px] font-medium text-cyan-400 bg-cyan-950/80 border border-cyan-800/40 px-2 py-0.5 rounded">
                  Study Partner Seat
                </span>
              </div>
            </div>
            {session?.participant.id === 'chatgpt' ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Session
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full">
                <Lock className="w-3 h-3 text-slate-400" />
                Locked
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Second authorized duo seat. Dedicated channel connection for collaborative study sessions and quiz practice.
          </p>
        </div>
      </div>

      {/* Class 10 Syllabus Progress Summary */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-semibold text-white">
              CBSE Class 10 Syllabus Progress
            </h2>
          </div>
          <button
            onClick={onOpenStudy}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>Open Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Overall Completion</span>
            <span className="font-semibold text-purple-300">
              {completedCount} of {totalChapters} chapters ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progressPercent, 2)}%` }}
            />
          </div>
        </div>

        {/* Subject Mini-Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {CBSE_CLASS_10_SUBJECTS.map((subject) => {
            const subjectCompleted = subject.chapters.filter((c) =>
              completedChapters.includes(c.id)
            ).length;
            const pct = Math.round((subjectCompleted / subject.chapters.length) * 100);

            return (
              <div
                key={subject.id}
                onClick={onOpenStudy}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="text-[11px] font-semibold text-slate-300 truncate">
                  {subject.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-500">
                  {subjectCompleted}/{subject.chapters.length} Ch.
                </div>
                <div className="mt-1.5 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Architecture Notes */}
      <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs text-slate-400 space-y-2.5">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Security & Privacy Architecture</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 leading-normal">
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <span><strong>Volatile Session:</strong> Leaving chat, closing the tab, or refreshing immediately locks conversation history.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <span><strong>Server Cryptography:</strong> Passwords verified via salted PBKDF2; never hardcoded in client bundles.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <span><strong>Authorized 2-Person Scope:</strong> No public registration, no third-party contacts, and no discovery.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <span><strong>Persistent History:</strong> Validated messages persist securely and sync across sessions when authenticated.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
