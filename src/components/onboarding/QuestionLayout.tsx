import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { ProgressBar } from './ProgressBar';

interface QuestionLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextButtonText?: string;
  nextDisabled?: boolean;
  showNext?: boolean;
}

export const QuestionLayout: React.FC<QuestionLayoutProps> = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextButtonText = 'Continue',
  nextDisabled = false,
  showNext = true,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      {/* Back Button */}
      {currentStep > 0 && onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.questionContent}>
          {children}
        </View>
      </ScrollView>

      {/* Next Button */}
      {showNext && onNext && (
        <TouchableOpacity
          style={[styles.nextButton, nextDisabled && styles.disabledButton]}
          onPress={onNext}
          disabled={nextDisabled}
        >
          <Text style={[styles.nextButtonText, nextDisabled && styles.disabledButtonText]}>
            {nextButtonText}
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={nextDisabled ? colors.textSecondary : colors.surface} 
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100, // Extra space for next button
    flexGrow: 1,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  questionContent: {
    flex: 1,
    minHeight: 400, // Ensure minimum height for content
  },
  nextButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    margin: 24,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  disabledButton: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: colors.textSecondary,
  },
});