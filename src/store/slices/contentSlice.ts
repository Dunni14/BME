import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AudioTrack } from '../../types/audio';
import { MeditationGenre, Meditation } from '../../types/content';

interface ContentState {
  currentTrack?: AudioTrack;
  currentGenre?: MeditationGenre;
  currentMeditation?: Meditation;
  playlist: AudioTrack[];
  favorites: string[]; // Meditation IDs
  searchQuery: string;
  searchResults: Meditation[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

const initialState: ContentState = {
  playlist: [],
  favorites: [],
  searchQuery: '',
  searchResults: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // Track and playback actions
    setCurrentTrack: (state, action: PayloadAction<AudioTrack>) => {
      state.currentTrack = action.payload;
    },
    setPlaylist: (state, action: PayloadAction<AudioTrack[]>) => {
      state.playlist = action.payload;
    },
    setPlaybackState: (state, action: PayloadAction<{ isPlaying: boolean; currentTime?: number; duration?: number }>) => {
      state.isPlaying = action.payload.isPlaying;
      if (action.payload.currentTime !== undefined) {
        state.currentTime = action.payload.currentTime;
      }
      if (action.payload.duration !== undefined) {
        state.duration = action.payload.duration;
      }
    },
    
    // Genre and meditation actions
    setCurrentGenre: (state, action: PayloadAction<MeditationGenre>) => {
      state.currentGenre = action.payload;
    },
    setCurrentMeditation: (state, action: PayloadAction<Meditation>) => {
      state.currentMeditation = action.payload;
    },
    selectMeditationFromGenre: (state, action: PayloadAction<{ genre: MeditationGenre; meditation: Meditation }>) => {
      state.currentGenre = action.payload.genre;
      state.currentMeditation = action.payload.meditation;
      
      // Convert meditation to audio track
      const audioTrack: AudioTrack = {
        id: action.payload.meditation.id,
        title: action.payload.meditation.title,
        url: action.payload.meditation.audioUrl,
        duration: action.payload.meditation.duration * 60 * 1000, // Convert minutes to milliseconds
      };
      state.currentTrack = audioTrack;
    },
    
    // Favorites actions
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const meditationId = action.payload;
      if (state.favorites.includes(meditationId)) {
        state.favorites = state.favorites.filter(id => id !== meditationId);
      } else {
        state.favorites.push(meditationId);
      }
    },
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.favorites = action.payload;
    },
    
    // Search actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Meditation[]>) => {
      state.searchResults = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },
    
    // Navigation and state actions
    resetCurrentSelection: (state) => {
      state.currentGenre = undefined;
      state.currentMeditation = undefined;
    },
    clearCurrentTrack: (state) => {
      state.currentTrack = undefined;
      state.currentMeditation = undefined;
      state.isPlaying = false;
      state.currentTime = 0;
      state.duration = 0;
    },
  },
});

export const { 
  // Track and playback
  setCurrentTrack, 
  setPlaylist,
  setPlaybackState,
  clearCurrentTrack,
  
  // Genres and meditations
  setCurrentGenre,
  setCurrentMeditation,
  selectMeditationFromGenre,
  resetCurrentSelection,
  
  // Favorites
  addToFavorites, 
  removeFromFavorites,
  toggleFavorite,
  setFavorites,
  
  // Search
  setSearchQuery,
  setSearchResults,
  clearSearch,
} = contentSlice.actions;

export default contentSlice.reducer;