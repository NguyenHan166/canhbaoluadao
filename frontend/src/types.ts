/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = string;

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content?: string; // Markdown or HTML segments
  category: Category;
  categoryLabel: string;
  thumbnail: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  isHero?: boolean;
  isSubHero?: boolean;
  showOnHome?: boolean;
  warningLevel?: 'low' | 'medium' | 'high' | 'critical';
  sourceName?: string;
  sourceUrl?: string;
  quickSummaryPoints?: string[];
  tactics?: string[];
  signs?: string[];
  prevention?: string[];
  whatToDoIfScammed?: string[];
}

export interface Handbook {
  id: string;
  category: string;
  title: string;
  summary: string;
  steps: string[];
  difficulty: string;
  recommendFor: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScamReport {
  id: string;
  userId?: string;
  ticketId?: string;
  statusMessage?: string;
  reporterName?: string;
  reporterContact?: string;
  scamType: string;
  platform: 'facebook' | 'zalo' | 'sms' | 'call' | 'email' | 'website' | 'tmdt' | 'other';
  targetInfo: string; // link, phone number, bank account, etc.
  description: string;
  location?: string;
  screenshotUrl?: string;
  createdAt: string;
  status: 'pending' | 'verified' | 'attention';
  likesCount: number;
  commentsCount: number;
}

export interface QuickCheckResult {
  query: string;
  type: 'phone' | 'url' | 'content' | 'unknown';
  status: 'dangerous' | 'suspicious' | 'safe' | 'unverified';
  score: number; // 0 to 100 dangerous scale
  title: string;
  description: string;
  details: string[];
  recommendations: string[];
}

export interface SafetyTip {
  id: string;
  title: string;
  icon: string;
  summary: string;
  points: string[];
}

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  isGoogleUser?: boolean;
}

export interface Comment {
  id: string;
  articleSlug: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userEmail?: string;
  content: string;
  createdAt: string;
  likesCount: number;
}

