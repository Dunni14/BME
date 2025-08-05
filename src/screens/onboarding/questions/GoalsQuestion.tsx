import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles/colors';
import { QuestionLayout } from '../../../components/onboarding/QuestionLayout';

const spiritualGoals = [
  { id: 'deepen-faith', title: 'Deepen My Faith', icon: 'heart', description: 'Grow closer to God through daily reflection' },
  { id: 'find-peace', title: 'Find Inner Peace', icon: 'leaf', description: 'Experience God\'s peace in daily life' },
  { id: 'build-habits', title: 'Build Daily Habits', icon: 'time', description: 'Establish consistent spiritual practices' },
  { id: 'understand-scripture', title: 'Understand Scripture', icon: 'book', description: 'Gain deeper biblical insights' },
  { id: 'prayer-life', title: 'Strengthen Prayer Life', icon: 'hands-up', description: 'Develop a more meaningful prayer practice' },
  { id: 'overcome-anxiety', title: 'Overcome Anxiety', icon: 'shield-checkmark', description: 'Find God\'s comfort in difficult times' }
];

interface GoalsQuestionProps {
  currentStep: number;
  totalSteps: number;
  selectedGoals: string[];
  onGoalsChange: (goals: string[]) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const GoalsQuestion: React.FC<GoalsQuestionProps> = ({
  currentStep,
  totalSteps,
  selectedGoals,
  onGoalsChange,
  onNext,
  onBack,
}) => {
  const toggleGoal = (goalId: string) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter(id => id !== goalId)
      : [...selectedGoals, goalId];
    onGoalsChange(newGoals);
  };

  return (
    <QuestionLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      title="What are your spiritual goals?"
      subtitle="Select all that resonate with you"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={selectedGoals.length === 0}
    >
      <View style={styles.goalsGrid}>
        {spiritualGoals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              selectedGoals.includes(goal.id) && styles.activeGoalCard,
            ]}
            onPress={() => toggleGoal(goal.id)}
          >
            <View style={styles.goalHeader}>
              <Ionicons 
                name={goal.icon as any} 
                size={24} 
                color={selectedGoals.includes(goal.id) ? colors.surface : colors.primary} 
              />
              <Text style={[
                styles.goalTitle,
                selectedGoals.includes(goal.id) && styles.activeGoalTitle
              ]}>
                {goal.title}
              </Text>
            </View>
            <Text style={[
              styles.goalDescription,
              selectedGoals.includes(goal.id) && styles.activeGoalDescription
            ]}>
              {goal.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </QuestionLayout>
  );
};

const styles = StyleSheet.create({
  goalsGrid: {
    gap: 16,
    paddingBottom: 20, // Extra space for scrolling
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  activeGoalCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  activeGoalTitle: {
    color: colors.surface,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  activeGoalDescription: {
    color: colors.surface,
    opacity: 0.9,
  },
});