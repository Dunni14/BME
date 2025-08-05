export interface AudioTrack {
  id: string;
  title: string;
  url: string;
  duration?: number;
}

export interface AudioState {
  isLoaded: boolean;
  isPlaying: boolean;
  position: number;
  duration: number;
  playbackSpeed: number;
  isLoading: boolean;
  error?: string;
}