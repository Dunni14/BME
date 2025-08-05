import React from 'react';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from '../store';
import { OnboardingFlow } from './OnboardingFlow';
import { MainNavigator } from './MainNavigator';

const Stack = createStackNavigator();

export const AppFlow: React.FC = () => {
  const { hasCompletedOnboarding } = useSelector((state: RootState) => state.onboarding);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {hasCompletedOnboarding ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingFlow} />
      )}
    </Stack.Navigator>
  );
};