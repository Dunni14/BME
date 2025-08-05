import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { nextStep, previousStep } from '../../store/onboardingSlice';
import { UserPreferences } from '../../types/user';
import { 
  GoalsQuestion,
  ExperienceQuestion,
  LengthQuestion,
  TimeQuestion,
  NotificationsQuestion
} from './questions';

interface PreferencesScreenProps {
  onComplete: (preferences: UserPreferences) => Promise<void>;
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ onComplete }) => {
  const dispatch = useDispatch();
  const { currentStep, totalSteps } = useSelector((state: RootState) => state.onboarding);
  
  // Spiritual onboarding state
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [preferredLength, setPreferredLength] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // App preferences state (with defaults)
  const playbackSpeed = 1.0;
  const autoPlay = false;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      dispatch(nextStep());
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  const handleBack = () => {
    dispatch(previousStep());
  };

  const handleComplete = () => {
    onComplete({
      playbackSpeed,
      autoPlay,
      favoriteTopics: selectedGoals,
      notificationsEnabled,
      experienceLevel,
      preferredLength,
      preferredTime,
      spiritualGoals: selectedGoals,
    });
  };

  // Render the appropriate question based on current step
  // Step 1: Goals, Step 2: Experience, Step 3: Length, Step 4: Time, Step 5: Notifications
  const renderCurrentQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <GoalsQuestion
            currentStep={currentStep}
            totalSteps={totalSteps}
            selectedGoals={selectedGoals}
            onGoalsChange={setSelectedGoals}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <ExperienceQuestion
            currentStep={currentStep}
            totalSteps={totalSteps}
            experienceLevel={experienceLevel}
            onExperienceChange={setExperienceLevel}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <LengthQuestion
            currentStep={currentStep}
            totalSteps={totalSteps}
            preferredLength={preferredLength}
            onLengthChange={setPreferredLength}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <TimeQuestion
            currentStep={currentStep}
            totalSteps={totalSteps}
            preferredTime={preferredTime}
            onTimeChange={setPreferredTime}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <NotificationsQuestion
            currentStep={currentStep}
            totalSteps={totalSteps}
            notificationsEnabled={notificationsEnabled}
            onNotificationsChange={setNotificationsEnabled}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return renderCurrentQuestion();
};