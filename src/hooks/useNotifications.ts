import { useState, useEffect } from 'react';
import { NotificationService, NotificationConfig } from '../services/notificationService';

export const useNotifications = () => {
  const [config, setConfig] = useState<NotificationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    loadConfig();
    checkPermissions();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const notificationConfig = await NotificationService.getConfig();
      setConfig(notificationConfig);
    } catch (error) {
      console.error('Error loading notification config:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    try {
      // In a real implementation, you would check actual notification permissions here
      setHasPermission(true); // Placeholder
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      setHasPermission(false);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const granted = await NotificationService.requestPermissions();
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const updateConfig = async (updates: Partial<NotificationConfig>) => {
    try {
      if (!config) return;

      const newConfig = { ...config, ...updates };
      await NotificationService.updateConfig(newConfig);
      setConfig(newConfig);

      // Handle specific updates
      if (updates.enabled === false) {
        await NotificationService.cancelDailyReminder();
      } else if (updates.reminderTime && newConfig.enabled) {
        await NotificationService.scheduleDailyReminder(updates.reminderTime);
      }
    } catch (error) {
      console.error('Error updating notification config:', error);
    }
  };

  const enableNotifications = async (reminderTime?: string) => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return false;
    }

    await updateConfig({ 
      enabled: true, 
      reminderTime: reminderTime || config?.reminderTime 
    });

    if (reminderTime || config?.reminderTime) {
      await NotificationService.scheduleDailyReminder(reminderTime || config!.reminderTime!);
    }

    return true;
  };

  const disableNotifications = async () => {
    await updateConfig({ enabled: false });
    await NotificationService.cancelDailyReminder();
  };

  const setReminderTime = async (time: string) => {
    await updateConfig({ reminderTime: time });
    
    if (config?.enabled) {
      await NotificationService.scheduleDailyReminder(time);
    }
  };

  const toggleNotificationType = async (type: keyof NotificationConfig['types']) => {
    if (!config) return;

    const newTypes = {
      ...config.types,
      [type]: !config.types[type],
    };

    await updateConfig({ types: newTypes });
  };

  const sendTestNotification = async (type: 'daily' | 'streak' | 'newContent' = 'daily') => {
    try {
      switch (type) {
        case 'daily':
          // Would send a test daily reminder
          console.log('Test daily notification sent (placeholder)');
          break;
        case 'streak':
          await NotificationService.sendStreakReminder(7);
          break;
        case 'newContent':
          await NotificationService.sendNewContentNotification('Test Meditation');
          break;
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  return {
    config,
    loading,
    hasPermission,
    requestPermissions,
    updateConfig,
    enableNotifications,
    disableNotifications,
    setReminderTime,
    toggleNotificationType,
    sendTestNotification,
    refreshConfig: loadConfig,
  };
};