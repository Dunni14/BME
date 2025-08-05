import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences } from '../../types/user';

interface UserState {
  isAuthenticated: boolean;
  username?: string;
  preferences: UserPreferences;
}

const initialState: UserState = {
  isAuthenticated: false,
  preferences: {
    playbackSpeed: 1.0,
    autoPlay: false,
    favoriteTopics: [],
    notificationsEnabled: false,
    theme: 'light',
    autoTheme: false,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string }>) => {
      state.isAuthenticated = true;
      state.username = action.payload.username;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = undefined;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const { login, logout, updatePreferences } = userSlice.actions;
export default userSlice.reducer;