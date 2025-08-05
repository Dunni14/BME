import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { colors } from '../../styles/colors';

const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export const PlaybackSpeedControl: React.FC = () => {
  const { audioState, setPlaybackSpeed } = useAudioPlayer();

  const handleSpeedChange = async (speed: number) => {
    await setPlaybackSpeed(speed);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playback Speed</Text>
      <View style={styles.speedOptions}>
        {speedOptions.map((speed) => (
          <TouchableOpacity
            key={speed}
            style={[
              styles.speedButton,
              audioState.playbackSpeed === speed && styles.activeSpeedButton,
            ]}
            onPress={() => handleSpeedChange(speed)}
            disabled={!audioState.isLoaded}
          >
            <Text
              style={[
                styles.speedText,
                audioState.playbackSpeed === speed && styles.activeSpeedText,
                !audioState.isLoaded && styles.disabledText,
              ]}
            >
              {speed}x
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  speedOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  speedButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  activeSpeedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  speedText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeSpeedText: {
    color: colors.surface,
  },
  disabledText: {
    color: colors.textSecondary,
  },
});