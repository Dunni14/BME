export const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export const SKIP_INTERVALS = {
  FORWARD: 15, // seconds
  BACKWARD: 15, // seconds
};

export const MEDITATION_CATEGORIES = {
  FAITH: 'Faith',
  HOPE: 'Hope',
  LOVE: 'Love',
  PEACE: 'Peace',
  JOY: 'Joy',
  FORGIVENESS: 'Forgiveness',
  GRATITUDE: 'Gratitude',
  STRENGTH: 'Strength',
  WISDOM: 'Wisdom',
  PRAYER: 'Prayer',
  HEALING: 'Healing',
  COMFORT: 'Comfort',
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: '@user_preferences',
  USER_PROGRESS: '@user_progress',
  FAVORITES: '@favorites',
  COMPLETED_ONBOARDING: '@completed_onboarding',
  LAST_PLAYED_TRACK: '@last_played_track',
};

export const API_ENDPOINTS = {
  BASE_URL: 'https://api.biblemeditation.app',
  MEDITATIONS: '/meditations',
  CATEGORIES: '/categories',
  USER: '/user',
  FAVORITES: '/favorites',
};

export const THEME = {
  HEADER_HEIGHT: 60,
  TAB_BAR_HEIGHT: 80,
  BORDER_RADIUS: 12,
  SHADOW: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
};