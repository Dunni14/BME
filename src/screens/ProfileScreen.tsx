import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout, updatePreferences } from '../store/slices/userSlice';
import { resetOnboarding } from '../store/onboardingSlice';
import { StorageService } from '../services/storageService';
import { useProgress } from '../hooks/useProgress';
import { colors } from '../styles/colors';
import { formatTime } from '../utils/helpers';

export const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, username, preferences } = useSelector((state: RootState) => state.user);
  const { progress, getStreakMessage, getLevel, refreshProgress } = useProgress();

  useEffect(() => {
    refreshProgress();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
          },
        },
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show the welcome screens again. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            dispatch(resetOnboarding());
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your preferences, favorites, and progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAllData();
              dispatch(logout());
              dispatch(resetOnboarding());
            } catch (error) {
              console.error('Error clearing data:', error);
            }
          },
        },
      ]
    );
  };

  const toggleNotifications = async () => {
    const newPreferences = {
      ...preferences,
      notificationsEnabled: !preferences.notificationsEnabled,
    };
    dispatch(updatePreferences(newPreferences));
    await StorageService.setUserPreferences(newPreferences);
  };


  const StatsCard = ({ icon, title, value, subtitle }: {
    icon: string;
    title: string;
    value: string;
    subtitle?: string;
  }) => (
    <View style={styles.statsCard}>
      <Ionicons name={icon as any} size={24} color={colors.primary} />
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
      {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
    </View>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement,
    destructive = false 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    rightElement?: React.ReactNode;
    destructive?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={destructive ? colors.error : colors.primary} 
        />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, destructive && { color: colors.error }]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color={colors.surface} />
            </View>
            <Text style={styles.profileName}>
              {isAuthenticated ? username : 'Guest User'}
            </Text>
            <Text style={styles.profileStatus}>
              {isAuthenticated ? 'Signed In' : 'Not Signed In'}
            </Text>
          </View>

          {/* Stats Section */}
          {progress && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              
              {/* Streak Message */}
              <View style={styles.streakMessage}>
                <Text style={styles.streakText}>{getStreakMessage()}</Text>
              </View>
              
              {/* Level Progress */}
              <View style={styles.levelCard}>
                <View style={styles.levelHeader}>
                  <Text style={styles.levelTitle}>Level {getLevel().level}</Text>
                  <Text style={styles.levelSubtitle}>
                    {getLevel().nextLevelMinutes - progress.totalListeningTime} minutes to next level
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${(progress.totalListeningTime / getLevel().nextLevelMinutes) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.statsGrid}>
                <StatsCard
                  icon="time"
                  title="Total Time"
                  value={`${progress.totalListeningTime}m`}
                  subtitle="Minutes listened"
                />
                <StatsCard
                  icon="checkmark-circle"
                  title="Completed"
                  value={progress.meditationsCompleted.toString()}
                  subtitle="Meditations"
                />
                <StatsCard
                  icon="flame"
                  title="Current Streak"
                  value={`${progress.currentStreak} days`}
                />
                <StatsCard
                  icon="trophy"
                  title="Best Streak"
                  value={`${progress.longestStreak} days`}
                />
              </View>
            </View>
          )}

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="notifications"
                title="Notifications"
                subtitle={preferences.notificationsEnabled ? 'Enabled' : 'Disabled'}
                onPress={toggleNotifications}
                rightElement={
                  <View style={[
                    styles.toggle, 
                    preferences.notificationsEnabled && styles.toggleActive
                  ]}>
                    <View style={[
                      styles.toggleIndicator,
                      preferences.notificationsEnabled && styles.toggleIndicatorActive
                    ]} />
                  </View>
                }
              />
              <SettingItem
                icon="speedometer"
                title="Playback Speed"
                subtitle={`${preferences.playbackSpeed}x`}
                onPress={() => {}}
              />
              <SettingItem
                icon="play-circle"
                title="Auto-play Next"
                subtitle={preferences.autoPlay ? 'Enabled' : 'Disabled'}
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.settingsGroup}>
              {!isAuthenticated ? (
                <SettingItem
                  icon="log-in"
                  title="Sign In"
                  subtitle="Save your progress and sync across devices"
                  onPress={() => {}}
                />
              ) : (
                <SettingItem
                  icon="log-out"
                  title="Sign Out"
                  onPress={handleLogout}
                />
              )}
            </View>
          </View>

          {/* Advanced Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="refresh"
                title="Reset Onboarding"
                subtitle="Show welcome screens again"
                onPress={handleResetOnboarding}
              />
              <SettingItem
                icon="trash"
                title="Clear All Data"
                subtitle="Delete all preferences and progress"
                onPress={handleClearData}
                destructive
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  statsSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  settingsGroup: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
  },
  toggleIndicatorActive: {
    alignSelf: 'flex-end',
  },
  streakMessage: {
    backgroundColor: `${colors.secondary}15`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary,
    textAlign: 'center',
  },
  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  levelHeader: {
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  levelSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});