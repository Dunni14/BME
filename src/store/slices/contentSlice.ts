import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioTrack } from '../../types/audio';

interface ContentState {
  currentTrack?: AudioTrack;
  playlist: AudioTrack[];
  favorites: string[];
}

const initialState: ContentState = {
  playlist: [],
  favorites: [],
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<AudioTrack>) => {
      state.currentTrack = action.payload;
    },
    setPlaylist: (state, action: PayloadAction<AudioTrack[]>) => {
      state.playlist = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
  },
});

export const { setCurrentTrack, setPlaylist, addToFavorites, removeFromFavorites } = contentSlice.actions;
export default contentSlice.reducer;