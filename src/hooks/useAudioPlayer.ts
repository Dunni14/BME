import { useState, useEffect, useRef } from 'react';
import { audioService, AudioState, AudioTrack } from '../services/audioService';
import { ProgressService } from '../services/progressService';

export const useAudioPlayer = () => {
  const [audioState, setAudioState] = useState<AudioState>(audioService.getState());
  const startTimeRef = useRef<number | null>(null);
  const lastTrackRef = useRef<AudioTrack | null>(null);

  useEffect(() => {
    const unsubscribe = audioService.subscribe(setAudioState);
    return unsubscribe;
  }, []);

  // Track listening time and completion
  useEffect(() => {
    const currentTrack = audioService.getCurrentTrack();
    
    // When playback starts
    if (audioState.isPlaying && !startTimeRef.current) {
      startTimeRef.current = Date.now();
      lastTrackRef.current = currentTrack;
    }
    
    // When playback stops or pauses
    if (!audioState.isPlaying && startTimeRef.current && lastTrackRef.current) {
      const listeningTime = Date.now() - startTimeRef.current;
      
      // Track listening time
      ProgressService.trackListeningTime(listeningTime);
      
      // Check if meditation was completed (listened to at least 80% or finished)
      const progressPercentage = audioState.duration > 0 ? audioState.position / audioState.duration : 0;
      const isNearEnd = progressPercentage >= 0.8;
      const isFinished = audioState.position >= audioState.duration - 1000; // Within 1 second of end
      
      if (isNearEnd || isFinished) {
        ProgressService.completeMeditation(lastTrackRef.current.id, listeningTime);
      }
      
      startTimeRef.current = null;
    }
    
    // Reset timer when track changes
    if (currentTrack?.id !== lastTrackRef.current?.id) {
      startTimeRef.current = null;
      lastTrackRef.current = currentTrack;
    }
  }, [audioState.isPlaying, audioState.position, audioState.duration]);

  const loadTrack = async (track: AudioTrack) => {
    await audioService.loadTrack(track);
  };

  const play = async () => {
    await audioService.play();
  };

  const pause = async () => {
    await audioService.pause();
  };

  const stop = async () => {
    await audioService.stop();
  };

  const seekTo = async (positionMillis: number) => {
    await audioService.seekTo(positionMillis);
  };

  const setPlaybackSpeed = async (speed: number) => {
    await audioService.setPlaybackSpeed(speed);
  };

  const skipForward = async (seconds?: number) => {
    await audioService.skipForward(seconds);
  };

  const skipBackward = async (seconds?: number) => {
    await audioService.skipBackward(seconds);
  };

  const replay = async () => {
    await audioService.replay();
  };

  return {
    audioState,
    loadTrack,
    play,
    pause,
    stop,
    seekTo,
    setPlaybackSpeed,
    skipForward,
    skipBackward,
    replay,
    currentTrack: audioService.getCurrentTrack(),
  };
};