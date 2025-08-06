export interface MeditationGenre {
  id: string;
  title: string;
  description: string;
  shortDescription: string; // For cards
  icon: string; // Icon name for the genre
  color: string; // Theme color for the genre
  tags: string[];
  targetAudience: 'everyone' | 'new_believers' | 'struggling' | 'growing';
  meditations: Meditation[];
}

export interface Meditation {
  id: string;
  title: string;
  subtitle?: string; // Short tagline
  description: string;
  duration: number; // in minutes
  audioUrl: string;
  scriptText?: string; // Full meditation script for TTS generation
  scriptureReferences: ScriptureReference[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  genreId: string;
  order?: number; // Order within the genre
}

export interface ScriptureReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  translation: string;
  text: string;
}

export interface MeditationSeries {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  genres: string[]; // Genre IDs included in this series
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Legacy types for backward compatibility during transition
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