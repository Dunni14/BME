import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles/colors';
import { QuestionLayout } from '../../../components/onboarding/QuestionLayout';

const sessionLengths = [
  { id: '5-min', title: '5 minutes', description: 'Quick daily moments', icon: 'flash' },
  { id: '10-min', title: '10 minutes', description: 'Short focused sessions', icon: 'time' },
  { id: '15-min', title: '15 minutes', description: 'Balanced practice', icon: 'hourglass' },
  { id: '20-min', title: '20+ minutes', description: 'Deep dive sessions', icon: 'infinite' }
];

interface LengthQuestionProps {
  currentStep: number;
  totalSteps: number;
  preferredLength: string;
  onLengthChange: (length: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LengthQuestion: React.FC<LengthQuestionProps> = ({
  currentStep,
  totalSteps,
  preferredLength,
  onLengthChange,
  onNext,
  onBack,
}) => {
  return (
    <QuestionLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="How much time do you have?"
      subtitle="Choose your ideal session length"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!preferredLength}
    >
      <View style={styles.lengthOptions}>
        {sessionLengths.map((length) => (
          <TouchableOpacity
            key={length.id}
            style={[
              styles.lengthCard,
              preferredLength === length.id && styles.activeLengthCard,
            ]}
            onPress={() => onLengthChange(length.id)}
          >
            <View style={styles.lengthHeader}>
              <Ionicons 
                name={length.icon as any} 
                size={32} 
                color={preferredLength === length.id ? colors.surface : colors.primary} 
              />
            </View>
            <Text style={[
              styles.lengthTitle,
              preferredLength === length.id && styles.activeLengthTitle
            ]}>
              {length.title}
            </Text>
            <Text style={[
              styles.lengthDescription,
              preferredLength === length.id && styles.activeLengthDescription
            ]}>
              {length.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </QuestionLayout>
  );
};

const styles = StyleSheet.create({
  lengthOptions: {
    gap: 16,
    paddingBottom: 20, // Extra space for scrolling
  },
  lengthCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  activeLengthCard: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  lengthHeader: {
    marginBottom: 16,
  },
  lengthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  activeLengthTitle: {
    color: colors.surface,
  },
  lengthDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activeLengthDescription: {
    color: colors.surface,
    opacity: 0.9,
  },
});