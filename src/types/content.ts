export interface MeditationContent {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number; // in milliseconds
  category: string;
  tags: string[];
  bibleVerse?: string;
  transcript?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  meditations: string[]; // meditation IDs
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}