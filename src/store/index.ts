import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import contentSlice from './slices/contentSlice';
import onboardingSlice from './onboardingSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    content: contentSlice,
    onboarding: onboardingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;