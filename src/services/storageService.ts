import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, UserProgress } from '../types/user';
import { STORAGE_KEYS } from '../utils/constants';

export class StorageService {
  // User Preferences
  static async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  static async setUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error setting user preferences:', error);
    }
  }

  // User Progress
  static async getUserProgress(): Promise<UserProgress | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  static async setUserProgress(progress: UserProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error setting user progress:', error);
    }
  }

  // Favorites
  static async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  static async setFavorites(favorites: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error setting favorites:', error);
    }
  }

  static async addToFavorites(meditationId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(meditationId)) {
        favorites.push(meditationId);
        await this.setFavorites(favorites);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  static async removeFromFavorites(meditationId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(id => id !== meditationId);
      await this.setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }

  // Onboarding
  static async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_ONBOARDING);
      return data === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  static async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_ONBOARDING, 'true');
    } catch (error) {
      console.error('Error setting onboarding completed:', error);
    }
  }

  // Last Played Track
  static async getLastPlayedTrack(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_PLAYED_TRACK);
    } catch (error) {
      console.error('Error getting last played track:', error);
      return null;
    }
  }

  static async setLastPlayedTrack(trackId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_PLAYED_TRACK, trackId);
    } catch (error) {
      console.error('Error setting last played track:', error);
    }
  }

  // Generic storage methods
  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item:', error);
    }
  }

  // Clear all data
  static async clearAllData(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}