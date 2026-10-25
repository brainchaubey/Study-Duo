import React, { useState } from 'react';
import { Chapter, MCQQuestion } from '../types';
import { X, CheckCircle2, XCircle, Award, RotateCcw, HelpCircle } from 'lucide-react';

interface QuizModalProps {
  chapter: Chapter;
  subjectName: string;
  onClose: () => void;
  onSaveScore: (chapterId: string, score: number, total: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  chapter,
  subjectName,
  onClose,
  onSaveScore,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalQuestions = chapter.mcqs.length;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    chapter.mcqs.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setSubmitted(true);
    onSaveScore(chapter.id, score, totalQuestions);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const percentage = Math.round((score / totalQuestions) * 100);
  const allAnswered = chapter.mcqs.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40">
              {subjectName}
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              {chapter.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Result Card if Submitted */}
          {submitted && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Quiz Completed!</h4>
                  <p className="text-xs text-slate-300">
                    You scored <strong className="text-purple-300">{score}</strong> out of {totalQuestions} ({percentage}%)
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-6">
            {chapter.mcqs.map((q, qIndex) => {
              const selected = selectedAnswers[q.id];
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <p className="text-sm font-medium text-slate-100 leading-snug">
                      {q.question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-1 pl-8">
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selected === optIndex;
                      const isOptionCorrect = optIndex === q.correctIndex;

                      let buttonStyle = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60';

                      if (submitted) {
                        if (isOptionCorrect) {
                          buttonStyle = 'bg-emerald-950/70 border-emerald-600 text-emerald-200 font-medium';
                        } else if (isOptionSelected && !isCorrect) {
                          buttonStyle = 'bg-red-950/70 border-red-600 text-red-200';
                        }
                      } else if (isOptionSelected) {
                        buttonStyle = 'bg-purple-950/80 border-purple-500 text-purple-200 font-medium';
                      }

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          disabled={submitted}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-all ${buttonStyle}`}
                        >
                          <span className="w-5 h-5 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="flex-1 leading-normal">{opt}</span>
                          {submitted && isOptionCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {submitted && isOptionSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation when submitted */}
                  {submitted && (
                    <div className="mt-3 ml-8 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-purple-300">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>CBSE Concept Explanation:</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950/90 border-t border-slate-800 px-5 py-3 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {Object.keys(selectedAnswers).length} of {totalQuestions} answered
          </div>
          <div className="flex items-center gap-2">
            {!submitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-900/30"
              >
                Submit Answers
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
