import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from '../store';
import { setOnboardingCompleted, nextStep } from '../store/onboardingSlice';
import { updatePreferences } from '../store/slices/userSlice';
import { WelcomeScreen, PreferencesScreen } from '../screens/onboarding';
import { StorageService } from '../services/storageService';
import { UserPreferences } from '../types/user';

const Stack = createStackNavigator();

export const OnboardingFlow: React.FC = () => {
  const dispatch = useDispatch();
  const { currentStep } = useSelector((state: RootState) => state.onboarding);

  const handleGetStarted = () => {
    dispatch(nextStep());
  };

  const handlePreferencesComplete = async (preferences: UserPreferences) => {
    try {
      // Save preferences to storage
      await StorageService.setUserPreferences(preferences);
      await StorageService.setOnboardingCompleted();
      
      // Update Redux state
      dispatch(updatePreferences(preferences));
      dispatch(setOnboardingCompleted());
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome">
        {() => 
          currentStep === 0 ? (
            <WelcomeScreen onGetStarted={handleGetStarted} />
          ) : (
            <PreferencesScreen onComplete={handlePreferencesComplete} />
          )
        }
      </Stack.Screen>
    </Stack.Navigator>
  );
};