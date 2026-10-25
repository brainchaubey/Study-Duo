import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Circle, 
  Award, 
  BookOpen, 
  Calculator, 
  Atom, 
  Globe, 
  Languages, 
  Filter,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Chapter, Subject, AuthSession } from '../types';
import { CBSE_CLASS_10_SUBJECTS } from '../data/cbseClass10Data';
import { QuizModal } from './QuizModal';

interface StudyViewProps {
  session: AuthSession | null;
  completedChapters: string[];
  onToggleChapter: (chapterId: string) => void;
  quizScores: Record<string, { score: number; total: number; timestamp: string }>;
  onSaveQuizScore: (chapterId: string, score: number, total: number) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({
  session,
  completedChapters,
  onToggleChapter,
  quizScores,
  onSaveQuizScore,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('maths');
  const [activeQuizChapter, setActiveQuizChapter] = useState<{ chapter: Chapter; subjectName: string } | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const currentSubject = CBSE_CLASS_10_SUBJECTS.find((s) => s.id === selectedSubjectId) || CBSE_CLASS_10_SUBJECTS[0];

  // Calculations
  const totalAllChapters = CBSE_CLASS_10_SUBJECTS.reduce((acc, s) => acc + s.chapters.length, 0);
  const overallCompletedCount = completedChapters.length;
  const overallPercent = Math.round((overallCompletedCount / totalAllChapters) * 100);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-4 h-4" />;
      case 'Atom': return <Atom className="w-4 h-4" />;
      case 'Globe': return <Globe className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Languages': return <Languages className="w-4 h-4" />;
      default: return <GraduationCap className="w-4 h-4" />;
    }
  };

  const filteredChapters = currentSubject.chapters.filter((ch) =>
    ch.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-4xl mx-auto">
      {/* Top Banner / Progress Overview */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-900/40 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <GraduationCap className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                CBSE Class 10 Syllabus Tracker
              </h2>
              <p className="text-xs text-slate-400">
                Official 2026–27 Academic Curriculum with Chapter MCQ Tests
              </p>
            </div>
          </div>

          {/* Participant context badge */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>
              Progress saved for:{' '}
              <strong className="text-purple-300">
                {session ? session.participant.name : 'Chamgadar'}
              </strong>
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Overall Class 10 Syllabus Coverage</span>
            <span className="text-purple-300 font-bold">
              {overallCompletedCount} / {totalAllChapters} Chapters ({overallPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(overallPercent, 2)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CBSE_CLASS_10_SUBJECTS.map((subject) => {
          const isSelected = subject.id === selectedSubjectId;
          const completedInSub = subject.chapters.filter((c) => completedChapters.includes(c.id)).length;
          const subPercent = Math.round((completedInSub / subject.chapters.length) * 100);

          return (
            <button
              key={subject.id}
              onClick={() => setSelectedSubjectId(subject.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold shrink-0 transition-all ${
                isSelected
                  ? 'bg-purple-600/25 border-purple-500/80 text-white shadow-lg shadow-purple-950/40'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <span className={isSelected ? 'text-purple-300' : 'text-slate-500'}>
                {getSubjectIcon(subject.iconName)}
              </span>
              <span>{subject.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                isSelected ? 'bg-purple-950/90 text-purple-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {completedInSub}/{subject.chapters.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Header & Quick Search */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">
              {currentSubject.name}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
              Code: {currentSubject.code}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentSubject.description}
          </p>
        </div>

        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter chapters..."
          className="w-full sm:w-48 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-purple-500 text-xs text-white placeholder-slate-500 outline-none"
        />
      </div>

      {/* Chapter List */}
      <div className="space-y-3">
        {filteredChapters.map((ch) => {
          const isCompleted = completedChapters.includes(ch.id);
          const quizRecord = quizScores[ch.id];

          return (
            <div
              key={ch.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCompleted
                  ? 'bg-purple-950/20 border-purple-800/40'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Checkbox and Chapter Title */}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleChapter(ch.id)}
                  title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                    isCompleted
                      ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-700 hover:border-purple-400 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isCompleted ? 'text-purple-200 line-through decoration-purple-500/50' : 'text-white'}`}>
                      {ch.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{ch.mcqs.length} MCQ Practice Questions</span>
                    {quizRecord && (
                      <span className="text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800/40 px-1.5 py-0.2 rounded">
                        Last Score: {quizRecord.score}/{quizRecord.total}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button: MCQ Test */}
              <button
                type="button"
                onClick={() => setActiveQuizChapter({ chapter: ch, subjectName: currentSubject.name })}
                className="self-end sm:self-center px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-600/30 hover:border-purple-500 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-purple-200 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Award className="w-3.5 h-3.5 text-purple-400" />
                <span>{quizRecord ? 'Retake MCQ Test' : 'Start MCQ Test'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Active Quiz Modal */}
      {activeQuizChapter && (
        <QuizModal
          chapter={activeQuizChapter.chapter}
          subjectName={activeQuizChapter.subjectName}
          onClose={() => setActiveQuizChapter(null)}
          onSaveScore={onSaveQuizScore}
        />
      )}
    </div>
  );
};
