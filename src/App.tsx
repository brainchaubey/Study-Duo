/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthSession } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ChatView } from './components/ChatView';
import { StudyView } from './components/StudyView';
import { testFirestoreConnection } from './lib/firebase';

export default function App() {
  // Navigation: 'home' | 'chat' | 'study'
  const [currentTab, setCurrentTab] = useState<'home' | 'chat' | 'study'>('home');

  // CRITICAL SECURITY INVARIANT:
  // Session is strictly volatile in React state.
  // Refreshing page, closing tab, or leaving revokes session automatically.
  const [session, setSession] = useState<AuthSession | null>(null);

  // Study progress state
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, { score: number; total: number; timestamp: string }>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show temporary toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initial Firestore connection test on boot per Firebase skill
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // 2. Load study progress for current participant (or default Chamgadar)
  useEffect(() => {
    const participantId = session ? session.participant.id : 'chamgadar';
    fetch(`/api/study/progress?participant=${participantId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.progress) {
          setCompletedChapters(data.progress.completedChapters || []);
          setQuizScores(data.progress.quizScores || {});
        }
      })
      .catch((err) => {
        console.warn('Could not load study progress:', err);
      });
  }, [session]);

  // Handle Login Success
  const handleLoginSuccess = (newSession: AuthSession) => {
    setSession(newSession);
    showToast(`Welcome back, ${newSession.participant.name}!`);
  };

  // Handle Lock / Leave Chat (Mandatory Revocation)
  const handleLockChat = async () => {
    if (session) {
      try {
        await fetch('/api/chat/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({ token: session.token }),
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }

    setSession(null);
    showToast('Chat locked and session revoked.');
    // Keep user in Chat tab or Home
  };

  // Handle Chapter Checkbox Toggle
  const handleToggleChapter = async (chapterId: string) => {
    const nextCompleted = completedChapters.includes(chapterId)
      ? completedChapters.filter((id) => id !== chapterId)
      : [...completedChapters, chapterId];

    setCompletedChapters(nextCompleted);

    // Save to backend
    const participantId = session ? session.participant.id : 'chamgadar';
    try {
      await fetch('/api/study/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant: participantId,
          completedChapters: nextCompleted,
        }),
      });
    } catch (err) {
      console.error('Failed to sync chapter progress:', err);
    }
  };

  // Handle Quiz Score Save
  const handleSaveQuizScore = async (chapterId: string, score: number, total: number) => {
    const updatedScores = {
      ...quizScores,
      [chapterId]: { score, total, timestamp: new Date().toISOString() },
    };
    setQuizScores(updatedScores);

    // Auto mark chapter as completed if passed with 60%+
    if (score / total >= 0.6 && !completedChapters.includes(chapterId)) {
      handleToggleChapter(chapterId);
    }

    const participantId = session ? session.participant.id : 'chamgadar';
    try {
      await fetch('/api/study/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant: participantId,
          quizScores: updatedScores,
        }),
      });
      showToast(`Quiz score saved: ${score}/${total}`);
    } catch (err) {
      console.error('Failed to sync quiz score:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        session={session}
        onLockChat={handleLockChat}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 animate-bounce bg-purple-950 border border-purple-700 text-purple-200 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl">
          {toastMessage}
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-4 sm:py-6">
        {currentTab === 'home' && (
          <HomeView
            onOpenChat={() => setCurrentTab('chat')}
            onOpenStudy={() => setCurrentTab('study')}
            session={session}
            completedChapters={completedChapters}
          />
        )}

        {currentTab === 'chat' && (
          <ChatView
            session={session}
            onLoginSuccess={handleLoginSuccess}
            onLockChat={handleLockChat}
          />
        )}

        {currentTab === 'study' && (
          <StudyView
            session={session}
            completedChapters={completedChapters}
            onToggleChapter={handleToggleChapter}
            quizScores={quizScores}
            onSaveQuizScore={handleSaveQuizScore}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        session={session}
      />
    </div>
  );
}
