import { createAudioPlayer, AudioSource } from 'expo-audio';

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

class AudioService {
  private player: any | null = null;
  private currentTrack: AudioTrack | null = null;
  private listeners: ((state: AudioState) => void)[] = [];
  private positionUpdateInterval: NodeJS.Timeout | null = null;
  private state: AudioState = {
    isLoaded: false,
    isPlaying: false,
    position: 0,
    duration: 0,
    playbackSpeed: 1.0,
    isLoading: false,
  };

  constructor() {
    this.initializeAudio();
  }

  private async initializeAudio() {
    // Audio session configuration is handled automatically by expo-audio
    console.log('Audio service initialized');
  }

  private updateState(updates: Partial<AudioState>) {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }

  private startPositionUpdates() {
    if (this.positionUpdateInterval) {
      clearInterval(this.positionUpdateInterval);
    }
    
    this.positionUpdateInterval = setInterval(() => {
      if (this.player && this.state.isPlaying) {
        try {
          this.updateState({
            position: this.player.currentTime * 1000, // Convert to milliseconds
            duration: this.player.duration * 1000, // Convert to milliseconds
            isPlaying: this.player.playing,
          });
        } catch (error) {
          console.error('Error getting playback status:', error);
        }
      }
    }, 250); // Update every 250ms
  }

  private stopPositionUpdates() {
    if (this.positionUpdateInterval) {
      clearInterval(this.positionUpdateInterval);
      this.positionUpdateInterval = null;
    }
  }

  public subscribe(listener: (state: AudioState) => void): () => void {
    this.listeners.push(listener);
    // Immediately call with current state
    listener(this.state);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public async loadTrack(track: AudioTrack): Promise<void> {
    try {
      this.updateState({ isLoading: true, error: undefined });

      // Create audio source
      const source: AudioSource = { uri: track.url };
      
      // Create new player
      this.player = createAudioPlayer(source);
      
      this.currentTrack = track;
      
      // Wait a bit for the player to initialize and check if loaded
      setTimeout(() => {
        if (this.player) {
          this.updateState({
            isLoaded: this.player.isLoaded,
            isPlaying: this.player.playing,
            position: this.player.currentTime * 1000,
            duration: this.player.duration * 1000,
            isLoading: false,
          });
        }
      }, 500);
      
    } catch (error) {
      console.error('Failed to load track:', error);
      this.updateState({
        error: `Failed to load audio: ${error}`,
        isLoading: false,
        isLoaded: false,
      });
    }
  }

  public async play(): Promise<void> {
    if (!this.player) return;

    try {
      this.player.play();
      this.updateState({ isPlaying: true });
      this.startPositionUpdates();
    } catch (error) {
      console.error('Failed to play:', error);
      this.updateState({ error: `Failed to play: ${error}` });
    }
  }

  public async pause(): Promise<void> {
    if (!this.player) return;

    try {
      this.player.pause();
      this.updateState({ isPlaying: false });
      this.stopPositionUpdates();
    } catch (error) {
      console.error('Failed to pause:', error);
      this.updateState({ error: `Failed to pause: ${error}` });
    }
  }

  public async stop(): Promise<void> {
    if (!this.player) return;

    try {
      this.player.pause();
      this.seekTo(0);
      this.updateState({ isPlaying: false, position: 0 });
      this.stopPositionUpdates();
    } catch (error) {
      console.error('Failed to stop:', error);
      this.updateState({ error: `Failed to stop: ${error}` });
    }
  }

  public async seekTo(positionMillis: number): Promise<void> {
    if (!this.player) return;

    try {
      const positionSeconds = positionMillis / 1000;
      this.player.seekTo(positionSeconds);
      this.updateState({ position: positionMillis });
    } catch (error) {
      console.error('Failed to seek:', error);
      this.updateState({ error: `Failed to seek: ${error}` });
    }
  }

  public async setPlaybackSpeed(speed: number): Promise<void> {
    if (!this.player) return;

    try {
      this.player.setPlaybackRate(speed);
      this.updateState({ playbackSpeed: speed });
    } catch (error) {
      console.error('Failed to set playback speed:', error);
      this.updateState({ error: `Failed to set speed: ${error}` });
    }
  }

  public async skipForward(seconds: number = 15): Promise<void> {
    const newPosition = Math.min(
      this.state.position + (seconds * 1000),
      this.state.duration
    );
    await this.seekTo(newPosition);
  }

  public async skipBackward(seconds: number = 15): Promise<void> {
    const newPosition = Math.max(this.state.position - (seconds * 1000), 0);
    await this.seekTo(newPosition);
  }

  public async replay(): Promise<void> {
    await this.seekTo(0);
    if (!this.state.isPlaying) {
      await this.play();
    }
  }

  public getCurrentTrack(): AudioTrack | null {
    return this.currentTrack;
  }

  public getState(): AudioState {
    return this.state;
  }

  public async cleanup(): Promise<void> {
    this.stopPositionUpdates();
    
    if (this.player) {
      try {
        // In expo-audio, no explicit remove method - just set to null
        this.player = null;
      } catch (error) {
        console.error('Failed to cleanup audio:', error);
      }
    }
    
    this.currentTrack = null;
    this.listeners = [];
    this.updateState({
      isLoaded: false,
      isPlaying: false,
      position: 0,
      duration: 0,
      playbackSpeed: 1.0,
      isLoading: false,
      error: undefined,
    });
  }
}

// Export singleton instance
export const audioService = new AudioService();