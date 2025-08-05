import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { QuestionLayout } from '../../../components/onboarding/QuestionLayout';

const experienceLevels = [
  { id: 'beginner', title: 'New to Meditation', description: 'I\'m just starting my spiritual journey' },
  { id: 'some-experience', title: 'Some Experience', description: 'I\'ve done some meditation or prayer before' },
  { id: 'regular-practice', title: 'Regular Practice', description: 'I meditate or pray regularly' },
  { id: 'experienced', title: 'Very Experienced', description: 'I have an established spiritual practice' }
];

interface ExperienceQuestionProps {
  currentStep: number;
  totalSteps: number;
  experienceLevel: string;
  onExperienceChange: (level: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ExperienceQuestion: React.FC<ExperienceQuestionProps> = ({
  currentStep,
  totalSteps,
  experienceLevel,
  onExperienceChange,
  onNext,
  onBack,
}) => {
  return (
    <QuestionLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="What's your meditation experience?"
      subtitle="This helps us recommend the right content for you"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!experienceLevel}
    >
      <View style={styles.experienceOptions}>
        {experienceLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.experienceCard,
              experienceLevel === level.id && styles.activeExperienceCard,
            ]}
            onPress={() => onExperienceChange(level.id)}
          >
            <Text style={[
              styles.experienceTitle,
              experienceLevel === level.id && styles.activeExperienceTitle
            ]}>
              {level.title}
            </Text>
            <Text style={[
              styles.experienceDescription,
              experienceLevel === level.id && styles.activeExperienceDescription
            ]}>
              {level.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </QuestionLayout>
  );
};

const styles = StyleSheet.create({
  experienceOptions: {
    gap: 16,
    paddingBottom: 20, // Extra space for scrolling
  },
  experienceCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  activeExperienceCard: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  activeExperienceTitle: {
    color: colors.surface,
  },
  experienceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  activeExperienceDescription: {
    color: colors.surface,
    opacity: 0.9,
  },
});