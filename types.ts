
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  link: string; // Link to substack post
  content: string; // Full content for the in-app reader
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  cta: string;
  link: string; // Link to gumroad product
}

export interface ScriptureResponse {
  verse: string;
  reference: string;
  microLesson: string;
  reflectionQuestion: string;
  context?: string;
}

export interface ArticleInsight {
  corePrinciple: string;
  actionItem: string;
  reflection: string;
}

export interface MemberProfile {
  name: string;
  location: string;
  bio: string;
  imageUrl: string;
  joinDate: string;
}

export interface DailyTask {
  id: string;
  label: string;
  completed: boolean;
}

export enum NavSection {
  HOME = 'home',
  MISSION = 'mission',
  WRITINGS = 'writings',
  TOOL = 'tool',
  PRODUCTS = 'products',
  MEMBERS = 'members',
}
