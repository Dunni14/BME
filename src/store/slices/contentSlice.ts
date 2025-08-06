import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AudioTrack } from '../../types/audio';
import { MeditationGenre, Meditation } from '../../types/content';
import { browserVoiceService } from '../../services/voiceGeneration/browserVoiceService';
import { audioCacheService } from '../../services/storage/audioCacheService';

interface AudioState {
  isGenerating: boolean;
  generatingMeditationId: string | null;
  error: string | null;
  availableVoices: Array<{name: string, lang: string, quality: string}>;
  currentAudioUrl: string | null;
  generationProgress: number;
}

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
  audio: AudioState;
}

const initialAudioState: AudioState = {
  isGenerating: false,
  generatingMeditationId: null,
  error: null,
  availableVoices: [],
  currentAudioUrl: null,
  generationProgress: 0
};

const initialState: ContentState = {
  playlist: [],
  favorites: [],
  searchQuery: '',
  searchResults: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  audio: initialAudioState,
};

// Async thunk for generating meditation audio
export const generateMeditationAudio = createAsyncThunk(
  'content/generateMeditationAudio',
  async ({ meditation, forceRegenerate = false }: { 
    meditation: Meditation, 
    forceRegenerate?: boolean 
  }) => {
    try {
      // Check if audio is already cached (unless forcing regeneration)
      if (!forceRegenerate) {
        const cachedUrl = await audioCacheService.getCachedAudio(meditation.id);
        if (cachedUrl) {
          return { audioUrl: cachedUrl, fromCache: true };
        }
      }

      // Generate new audio
      const generatedAudio = await browserVoiceService.generateMeditationAudio(meditation);
      
      // Cache the audio
      const audioUrl = await audioCacheService.cacheAudio(meditation.id, generatedAudio);
      
      return { 
        audioUrl, 
        fromCache: false,
        duration: generatedAudio.duration,
        voiceUsed: generatedAudio.voiceUsed
      };
      
    } catch (error: any) {
      throw new Error(`Failed to generate audio: ${error.message}`);
    }
  }
);

// Async thunk for loading available voices
export const loadAvailableVoices = createAsyncThunk(
  'content/loadAvailableVoices',
  async () => {
    return browserVoiceService.getAvailableVoices();
  }
);

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

    // Audio generation actions
    clearAudioError: (state) => {
      state.audio.error = null;
    },
    
    setCurrentAudioUrl: (state, action: PayloadAction<string | null>) => {
      state.audio.currentAudioUrl = action.payload;
    },
    
    updateGenerationProgress: (state, action: PayloadAction<number>) => {
      state.audio.generationProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateMeditationAudio.pending, (state, action) => {
        state.audio.isGenerating = true;
        state.audio.generatingMeditationId = action.meta.arg.meditation.id;
        state.audio.error = null;
        state.audio.generationProgress = 0;
      })
      .addCase(generateMeditationAudio.fulfilled, (state, action) => {
        state.audio.isGenerating = false;
        state.audio.generatingMeditationId = null;
        state.audio.currentAudioUrl = action.payload.audioUrl;
        state.audio.generationProgress = 100;
        
        // Update the meditation with the audio URL
        if (state.currentMeditation?.id === action.meta.arg.meditation.id) {
          state.currentMeditation.audioUrl = action.payload.audioUrl;
        }
      })
      .addCase(generateMeditationAudio.rejected, (state, action) => {
        state.audio.isGenerating = false;
        state.audio.generatingMeditationId = null;
        state.audio.error = action.error.message || 'Failed to generate audio';
        state.audio.generationProgress = 0;
      })
      .addCase(loadAvailableVoices.fulfilled, (state, action) => {
        state.audio.availableVoices = action.payload;
      });
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

  // Audio generation
  clearAudioError,
  setCurrentAudioUrl,
  updateGenerationProgress,
} = contentSlice.actions;

export default contentSlice.reducer;