
export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  GRAMMAR = 'GRAMMAR',
  VOCABULARY = 'VOCABULARY',
  READING = 'READING',
  WRITING = 'WRITING',
  SPEAKING = 'SPEAKING',
  LISTENING = 'LISTENING',
  CULTURE = 'CULTURE',
  COMMUNITY = 'COMMUNITY',
  OFFLINE = 'OFFLINE',
  PROFILE = 'PROFILE',
  STORE = 'STORE',
  MEDIA = 'MEDIA',
  TUTORS = 'TUTORS',
  FLASHCARDS = 'FLASHCARDS',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  CONTACT = 'CONTACT',
  REFER = 'REFER'
}

export type MembershipTier = 'LITE' | 'STANDARD' | 'PRO';

export type LearningPurpose = 
  | 'Daily Communication' 
  | 'Business' 
  | 'Travel' 
  | 'Academic' 
  | 'Personal Interest'
  | 'Career Advancement'
  | 'Communication with Family and Friends';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tokens: number;
  streak: number;
  level: number;
  xp: number;
  unlockedLanguages: string[];
  unlockedContent: string[];
  membershipTier: MembershipTier;
  aiMinutesUsed: number;
  dailyMinutesLimit: number;
}

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  mastery: number; // 0 to 100
  lastReviewed: string;
  example: string;
  source?: string;
}

export interface GrammarNote {
  topic: string;
  explanation: string;
  examples: string[];
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  timestamp: string;
}
