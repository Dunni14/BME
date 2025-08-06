import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { clearCurrentTrack } from '../../store/slices/contentSlice';
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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { audioState, play, pause, skipForward, skipBackward } = useAudioPlayer();
  const { currentTrack, currentMeditation, currentGenre } = useSelector((state: RootState) => state.content);

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

  const handleClose = () => {
    dispatch(clearCurrentTrack());
  };

  const handlePlayerTap = () => {
    if (currentMeditation && currentGenre) {
      (navigation as any).navigate('MeditationPlayer', {
        meditationId: currentMeditation.id,
        genreId: currentGenre.id
      });
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Track Info Section - Tappable */}
      <TouchableOpacity style={styles.trackInfo} onPress={handlePlayerTap} activeOpacity={0.7}>
        <View style={styles.trackDetails}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackTime}>
            {formatTime(audioState.position)} / {formatTime(audioState.duration)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Controls Section */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleSkipBackward}
          disabled={!audioState.isLoaded}
        >
          <Ionicons 
            name="play-skip-back" 
            size={20} 
            color={audioState.isLoaded ? colors.primary : colors.textSecondary} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, !audioState.isLoaded && styles.disabledButton]}
          onPress={handlePlayPause}
          disabled={!audioState.isLoaded || audioState.isLoading}
        >
          {audioState.isLoading ? (
            <Ionicons name="refresh" size={20} color={colors.surface} />
          ) : (
            <Ionicons
              name={audioState.isPlaying ? "pause" : "play"}
              size={20}
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
            size={20} 
            color={audioState.isLoaded ? colors.primary : colors.textSecondary} 
          />
        </TouchableOpacity>

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  trackInfo: {
    flex: 1,
    marginRight: 16,
  },
  trackDetails: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  trackTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
    marginLeft: 4,
  },
  playButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
});