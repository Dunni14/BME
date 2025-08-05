import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles/colors';
import { QuestionLayout } from '../../../components/onboarding/QuestionLayout';

const preferredTimes = [
  { id: 'morning', title: 'Morning', icon: 'sunny', description: 'Start my day with God' },
  { id: 'midday', title: 'Midday', icon: 'partly-sunny', description: 'Pause and reflect during the day' },
  { id: 'evening', title: 'Evening', icon: 'moon', description: 'Wind down and give thanks' },
  { id: 'flexible', title: 'Flexible', icon: 'time', description: 'Whenever I have time' }
];

interface TimeQuestionProps {
  currentStep: number;
  totalSteps: number;
  preferredTime: string;
  onTimeChange: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const TimeQuestion: React.FC<TimeQuestionProps> = ({
  currentStep,
  totalSteps,
  preferredTime,
  onTimeChange,
  onNext,
  onBack,
}) => {
  return (
    <QuestionLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="When do you prefer to meditate?"
      subtitle="We can send gentle reminders at your preferred time"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!preferredTime}
    >
      <View style={styles.timeOptions}>
        {preferredTimes.map((time) => (
          <TouchableOpacity
            key={time.id}
            style={[
              styles.timeCard,
              preferredTime === time.id && styles.activeTimeCard,
            ]}
            onPress={() => onTimeChange(time.id)}
          >
            <View style={styles.timeHeader}>
              <Ionicons 
                name={time.icon as any} 
                size={36} 
                color={preferredTime === time.id ? colors.surface : colors.primary} 
              />
            </View>
            <Text style={[
              styles.timeTitle,
              preferredTime === time.id && styles.activeTimeTitle
            ]}>
              {time.title}
            </Text>
            <Text style={[
              styles.timeDescription,
              preferredTime === time.id && styles.activeTimeDescription
            ]}>
              {time.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </QuestionLayout>
  );
};

const styles = StyleSheet.create({
  timeOptions: {
    gap: 16,
    paddingBottom: 20, // Extra space for scrolling
  },
  timeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  activeTimeCard: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  timeHeader: {
    marginBottom: 16,
  },
  timeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  activeTimeTitle: {
    color: colors.surface,
  },
  timeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  activeTimeDescription: {
    color: colors.surface,
    opacity: 0.9,
  },
});