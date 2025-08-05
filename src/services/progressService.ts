import { StorageService } from './storageService';
import { UserProgress } from '../types/user';

export class ProgressService {
  private static readonly MINIMUM_LISTENING_TIME = 30000; // 30 seconds in milliseconds

  static async initializeProgress(): Promise<UserProgress> {
    const defaultProgress: UserProgress = {
      totalListeningTime: 0,
      meditationsCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastMeditationDate: undefined,
    };

    try {
      const existingProgress = await StorageService.getUserProgress();
      return existingProgress || defaultProgress;
    } catch (error) {
      console.error('Error initializing progress:', error);
      return defaultProgress;
    }
  }

  static async trackListeningTime(milliseconds: number): Promise<void> {
    try {
      const progress = await this.initializeProgress();
      progress.totalListeningTime += Math.floor(milliseconds / 60000); // Convert to minutes
      await StorageService.setUserProgress(progress);
    } catch (error) {
      console.error('Error tracking listening time:', error);
    }
  }

  static async completeMeditation(meditationId: string, listeningTime: number): Promise<void> {
    try {
      // Only count as completed if user listened for minimum time
      if (listeningTime < this.MINIMUM_LISTENING_TIME) {
        return;
      }

      const progress = await this.initializeProgress();
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Update completion count
      progress.meditationsCompleted += 1;
      
      // Update total listening time
      progress.totalListeningTime += Math.floor(listeningTime / 60000);

      // Update streak
      const lastDate = progress.lastMeditationDate;
      if (lastDate) {
        const lastMeditationDate = new Date(lastDate);
        const todayDate = new Date(today);
        const daysDifference = Math.floor(
          (todayDate.getTime() - lastMeditationDate.getTime()) / (1000 * 3600 * 24)
        );

        if (daysDifference === 1) {
          // Consecutive day - increment streak
          progress.currentStreak += 1;
        } else if (daysDifference === 0) {
          // Same day - don't change streak
        } else {
          // Gap in days - reset streak
          progress.currentStreak = 1;
        }
      } else {
        // First meditation ever
        progress.currentStreak = 1;
      }

      // Update longest streak
      if (progress.currentStreak > progress.longestStreak) {
        progress.longestStreak = progress.currentStreak;
      }

      // Update last meditation date
      progress.lastMeditationDate = today;

      await StorageService.setUserProgress(progress);
    } catch (error) {
      console.error('Error completing meditation:', error);
    }
  }

  static async updateStreak(): Promise<void> {
    try {
      const progress = await this.initializeProgress();
      const today = new Date().toISOString().split('T')[0];
      const lastDate = progress.lastMeditationDate;

      if (!lastDate) return;

      const lastMeditationDate = new Date(lastDate);
      const todayDate = new Date(today);
      const daysDifference = Math.floor(
        (todayDate.getTime() - lastMeditationDate.getTime()) / (1000 * 3600 * 24)
      );

      // If more than 1 day has passed, reset streak
      if (daysDifference > 1) {
        progress.currentStreak = 0;
        await StorageService.setUserProgress(progress);
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  static async getProgress(): Promise<UserProgress> {
    try {
      await this.updateStreak(); // Update streak before returning
      return await this.initializeProgress();
    } catch (error) {
      console.error('Error getting progress:', error);
      return await this.initializeProgress();
    }
  }

  static async resetProgress(): Promise<void> {
    try {
      const defaultProgress: UserProgress = {
        totalListeningTime: 0,
        meditationsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastMeditationDate: undefined,
      };
      await StorageService.setUserProgress(defaultProgress);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }

  static getStreakMessage(streak: number): string {
    if (streak === 0) {
      return "Start your meditation journey today!";
    } else if (streak === 1) {
      return "Great start! Keep it up!";
    } else if (streak < 7) {
      return `${streak} days strong! You're building a habit!`;
    } else if (streak < 30) {
      return `${streak} days in a row! Excellent consistency!`;
    } else {
      return `${streak} days streak! You're a meditation master!`;
    }
  }

  static calculateLevel(totalMinutes: number): { level: number; nextLevelMinutes: number } {
    // Level system: every 60 minutes = 1 level
    const level = Math.floor(totalMinutes / 60) + 1;
    const nextLevelMinutes = level * 60;
    return { level, nextLevelMinutes };
  }
}