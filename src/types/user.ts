export interface User {
  id: string;
  username: string;
  email?: string;
  preferences: UserPreferences;
  progress: UserProgress;
}

export interface UserPreferences {
  playbackSpeed: number;
  autoPlay: boolean;
  favoriteTopics: string[];
  notificationsEnabled: boolean;
  reminderTime?: string;
  theme?: string;
  autoTheme?: boolean;
  // Spiritual onboarding data
  spiritualGoals?: string[];
  experienceLevel?: string;
  preferredLength?: string;
  preferredTime?: string;
}

export interface UserProgress {
  totalListeningTime: number; // in minutes
  meditationsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastMeditationDate?: string;
}