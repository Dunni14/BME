import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updatePreferences } from '../store/slices/userSlice';
import { StorageService } from '../services/storageService';
import { colors } from '../styles/colors';
import { PLAYBACK_SPEEDS } from '../utils/constants';

export const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { preferences } = useSelector((state: RootState) => state.user);

  const handlePreferenceUpdate = async (updates: Partial<typeof preferences>) => {
    try {
      const newPreferences = { ...preferences, ...updates };
      dispatch(updatePreferences(newPreferences));
      await StorageService.setUserPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  const toggleNotifications = () => {
    handlePreferenceUpdate({ notificationsEnabled: !preferences.notificationsEnabled });
  };

  const toggleAutoPlay = () => {
    handlePreferenceUpdate({ autoPlay: !preferences.autoPlay });
  };

  const updatePlaybackSpeed = (speed: number) => {
    handlePreferenceUpdate({ playbackSpeed: speed });
  };

  const updateReminderTime = () => {
    // TODO: Implement time picker
    Alert.alert('Coming Soon', 'Time picker will be available in a future update');
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color={colors.primary} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <TouchableOpacity onPress={onToggle}>
      <View style={[styles.toggle, value && styles.toggleActive]}>
        <View style={[styles.toggleIndicator, value && styles.toggleIndicatorActive]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>

          {/* Audio Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Audio</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="speedometer"
                title="Playback Speed"
                subtitle={`${preferences.playbackSpeed}x`}
                onPress={() => {}}
                rightElement={
                  <View style={styles.speedOptions}>
                    {PLAYBACK_SPEEDS.slice(0, 3).map((speed) => (
                      <TouchableOpacity
                        key={speed}
                        style={[
                          styles.speedButton,
                          preferences.playbackSpeed === speed && styles.activeSpeedButton,
                        ]}
                        onPress={() => updatePlaybackSpeed(speed)}
                      >
                        <Text
                          style={[
                            styles.speedText,
                            preferences.playbackSpeed === speed && styles.activeSpeedText,
                          ]}
                        >
                          {speed}x
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                }
              />
              <SettingItem
                icon="play-circle"
                title="Auto-play Next"
                subtitle={preferences.autoPlay ? 'Enabled' : 'Disabled'}
                onPress={toggleAutoPlay}
                rightElement={<Toggle value={preferences.autoPlay} onToggle={toggleAutoPlay} />}
              />
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="notifications"
                title="Push Notifications"
                subtitle={preferences.notificationsEnabled ? 'Enabled' : 'Disabled'}
                onPress={toggleNotifications}
                rightElement={
                  <Toggle value={preferences.notificationsEnabled} onToggle={toggleNotifications} />
                }
              />
              <SettingItem
                icon="time"
                title="Daily Reminder"
                subtitle={preferences.reminderTime || 'Not set'}
                onPress={updateReminderTime}
              />
            </View>
          </View>


          {/* Content */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Content</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="heart"
                title="Favorite Topics"
                subtitle={`${preferences.favoriteTopics.length} selected`}
                onPress={() => {
                  Alert.alert('Coming Soon', 'Topic preferences will be available in a future update');
                }}
              />
              <SettingItem
                icon="download"
                title="Download Quality"
                subtitle="High Quality"
                onPress={() => {
                  Alert.alert('Coming Soon', 'Download settings will be available in a future update');
                }}
              />
            </View>
          </View>

          {/* Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="analytics"
                title="Usage Analytics"
                subtitle="Help improve the app"
                onPress={() => {
                  Alert.alert('Coming Soon', 'Analytics settings will be available in a future update');
                }}
              />
              <SettingItem
                icon="shield"
                title="Privacy Policy"
                onPress={() => {
                  Alert.alert('Coming Soon', 'Privacy policy will be available in a future update');
                }}
              />
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.settingsGroup}>
              <SettingItem
                icon="information-circle"
                title="App Version"
                subtitle="1.0.0"
                onPress={() => {}}
                rightElement={<></>}
              />
              <SettingItem
                icon="help-circle"
                title="Help & Support"
                onPress={() => {
                  Alert.alert('Coming Soon', 'Help & support will be available in a future update');
                }}
              />
              <SettingItem
                icon="star"
                title="Rate the App"
                onPress={() => {
                  Alert.alert('Coming Soon', 'App rating will be available in a future update');
                }}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
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
  speedOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  speedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  activeSpeedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  speedText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  activeSpeedText: {
    color: colors.surface,
  },
});