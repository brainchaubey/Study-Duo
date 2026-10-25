export type ParticipantId = 'chamgadar' | 'chatgpt';

export interface Participant {
  id: ParticipantId;
  name: string;
  role: 'Admin' | 'Study Partner';
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: ParticipantId;
  senderName: string;
  text: string;
  timestamp: string; // ISO string
}

export interface AuthSession {
  token: string;
  participant: Participant;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  title: string;
  subtopicCount?: number;
  mcqs: MCQQuestion[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  iconName: string;
  color: string;
  description: string;
  chapters: Chapter[];
}

export interface ParticipantStudyProgress {
  participantId: string;
  completedChapters: string[]; // chapter IDs
  quizScores: Record<string, { score: number; total: number; timestamp: string }>;
  updatedAt: string;
}
