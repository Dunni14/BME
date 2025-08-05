import { useState, useEffect } from 'react';
import { ProgressService } from '../services/progressService';
import { UserProgress } from '../types/user';

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const userProgress = await ProgressService.getProgress();
      setProgress(userProgress);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackListeningTime = async (milliseconds: number) => {
    try {
      await ProgressService.trackListeningTime(milliseconds);
      await loadProgress(); // Refresh progress
    } catch (error) {
      console.error('Error tracking listening time:', error);
    }
  };

  const completeMeditation = async (meditationId: string, listeningTime: number) => {
    try {
      await ProgressService.completeMeditation(meditationId, listeningTime);
      await loadProgress(); // Refresh progress
    } catch (error) {
      console.error('Error completing meditation:', error);
    }
  };

  const resetProgress = async () => {
    try {
      await ProgressService.resetProgress();
      await loadProgress(); // Refresh progress
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  const getStreakMessage = () => {
    if (!progress) return '';
    return ProgressService.getStreakMessage(progress.currentStreak);
  };

  const getLevel = () => {
    if (!progress) return { level: 1, nextLevelMinutes: 60 };
    return ProgressService.calculateLevel(progress.totalListeningTime);
  };

  return {
    progress,
    loading,
    trackListeningTime,
    completeMeditation,
    resetProgress,
    getStreakMessage,
    getLevel,
    refreshProgress: loadProgress,
  };
};