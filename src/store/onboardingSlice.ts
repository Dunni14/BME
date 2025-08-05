import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
}

const initialState: OnboardingState = {
  hasCompletedOnboarding: false,
  currentStep: 0,
  totalSteps: 6, // Welcome -> Goals -> Experience -> Length -> Time -> Notifications -> Complete
  isLoading: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingCompleted: (state) => {
      state.hasCompletedOnboarding = true;
      state.currentStep = state.totalSteps;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    resetOnboarding: (state) => {
      state.hasCompletedOnboarding = false;
      state.currentStep = 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setOnboardingCompleted,
  setCurrentStep,
  nextStep,
  previousStep,
  resetOnboarding,
  setLoading,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;