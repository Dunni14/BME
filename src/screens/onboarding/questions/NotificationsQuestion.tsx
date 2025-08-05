import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles/colors';
import { QuestionLayout } from '../../../components/onboarding/QuestionLayout';

interface NotificationsQuestionProps {
  currentStep: number;
  totalSteps: number;
  notificationsEnabled: boolean;
  onNotificationsChange: (enabled: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export const NotificationsQuestion: React.FC<NotificationsQuestionProps> = ({
  currentStep,
  totalSteps,
  notificationsEnabled,
  onNotificationsChange,
  onNext,
  onBack,
}) => {
  return (
    <QuestionLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="Stay connected to your practice"
      subtitle="Would you like gentle reminders to help build your daily habit?"
      onNext={onNext}
      onBack={onBack}
      nextButtonText="Begin My Journey"
    >
      <View style={styles.content}>
        <View style={styles.notificationOptions}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              notificationsEnabled && styles.activeOptionCard,
            ]}
            onPress={() => onNotificationsChange(true)}
          >
            <View style={styles.optionHeader}>
              <Ionicons 
                name="notifications" 
                size={32} 
                color={notificationsEnabled ? colors.surface : colors.primary} 
              />
            </View>
            <Text style={[
              styles.optionTitle,
              notificationsEnabled && styles.activeOptionTitle
            ]}>
              Yes, send reminders
            </Text>
            <Text style={[
              styles.optionDescription,
              notificationsEnabled && styles.activeOptionDescription
            ]}>
              Get gentle nudges to help you maintain your spiritual practice
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              !notificationsEnabled && styles.activeOptionCard,
            ]}
            onPress={() => onNotificationsChange(false)}
          >
            <View style={styles.optionHeader}>
              <Ionicons 
                name="notifications-off" 
                size={32} 
                color={!notificationsEnabled ? colors.surface : colors.textSecondary} 
              />
            </View>
            <Text style={[
              styles.optionTitle,
              !notificationsEnabled && styles.activeOptionTitle
            ]}>
              No reminders
            </Text>
            <Text style={[
              styles.optionDescription,
              !notificationsEnabled && styles.activeOptionDescription
            ]}>
              I'll remember to practice on my own
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerInfo}>
          <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
          <Text style={styles.footerText}>
            You can change this setting anytime in your profile
          </Text>
        </View>
      </View>
    </QuestionLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 20, // Extra space for scrolling
  },
  notificationOptions: {
    gap: 16,
    marginBottom: 40,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  activeOptionCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionHeader: {
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  activeOptionTitle: {
    color: colors.surface,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  activeOptionDescription: {
    color: colors.surface,
    opacity: 0.9,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});