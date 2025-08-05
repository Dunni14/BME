import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { colors } from '../../styles/colors';

interface AudioPlayerProps {
  onPlayPause?: () => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  onPlayPause,
  onSkipForward,
  onSkipBackward,
}) => {
  const { audioState, play, pause, skipForward, skipBackward } = useAudioPlayer();

  const handlePlayPause = async () => {
    if (audioState.isPlaying) {
      await pause();
    } else {
      await play();
    }
    onPlayPause?.();
  };

  const handleSkipForward = async () => {
    await skipForward(15);
    onSkipForward?.();
  };

  const handleSkipBackward = async () => {
    await skipBackward(15);
    onSkipBackward?.();
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(audioState.position)}</Text>
        <Text style={styles.timeText}>{formatTime(audioState.duration)}</Text>
      </View>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleSkipBackward}
          disabled={!audioState.isLoaded}
        >
          <Ionicons 
            name="play-skip-back" 
            size={24} 
            color={audioState.isLoaded ? colors.primary : colors.textSecondary} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, !audioState.isLoaded && styles.disabledButton]}
          onPress={handlePlayPause}
          disabled={!audioState.isLoaded || audioState.isLoading}
        >
          {audioState.isLoading ? (
            <Ionicons name="refresh" size={32} color={colors.surface} />
          ) : (
            <Ionicons
              name={audioState.isPlaying ? "pause" : "play"}
              size={32}
              color={colors.surface}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleSkipForward}
          disabled={!audioState.isLoaded}
        >
          <Ionicons 
            name="play-skip-forward" 
            size={24} 
            color={audioState.isLoaded ? colors.primary : colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {audioState.error && (
        <Text style={styles.errorText}>{audioState.error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    backgroundColor: colors.primary,
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});