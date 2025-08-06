import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { RootState } from '../store';
import { clearCurrentTrack, generateMeditationAudio } from '../store/slices/contentSlice';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { browserVoiceService } from '../services/voiceGeneration/browserVoiceService';
import { VoiceSettingsModal } from '../components/voice/VoiceSettingsModal';
import { colors } from '../styles/colors';
import { getGenreById, getMeditationFromGenre } from '../services/mockData';

interface RouteParams {
  meditationId?: string;
  genreId?: string;
}

export const MeditationPlayerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { audioState, play, pause, skipForward, skipBackward, seekTo } = useAudioPlayer();
  const { currentTrack } = useSelector((state: RootState) => state.content);
  const [isSliding, setIsSliding] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const { meditationId, genreId } = route.params as RouteParams;

  // Get meditation details from genre data
  const meditation = meditationId && genreId ? 
    getMeditationFromGenre(genreId, meditationId) : null;
  const genre = genreId ? getGenreById(genreId) : null;

  useEffect(() => {
    console.log('MeditationPlayerScreen mounted with:', { meditationId, genreId });
    console.log('Current track in Redux:', currentTrack);
    
    return () => {
      console.log('MeditationPlayerScreen unmounting');
    };
  }, [meditationId, genreId, currentTrack]);

  const handlePlayPause = async () => {
    if (audioState.isPlaying) {
      await pause();
      browserVoiceService.pauseSpeaking();
    } else {
      // Try TTS first if meditation has script text
      if (meditation?.scriptText) {
        try {
          await browserVoiceService.generateMeditationAudio(meditation);
          // TTS doesn't use the traditional audio state, so we simulate it
        } catch (error) {
          console.error('TTS failed, trying regular audio:', error);
          await play();
        }
      } else {
        await play();
      }
    }
  };

  const handleClose = () => {
    // Just close the full-screen player, keep the audio playing
    // The mini player should remain active
    console.log('Closing full-screen player, keeping audio playing');
    navigation.goBack();
  };

  const handleStop = () => {
    // This actually stops the audio and clears the track
    dispatch(clearCurrentTrack());
    navigation.goBack();
  };

  const handleSeek = async (value: number) => {
    if (!isSliding) return;
    await seekTo(value);
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSeekValue = () => {
    if (audioState.duration === 0) return 0;
    return audioState.position / audioState.duration;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, genre && { backgroundColor: genre.color + '10' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="chevron-down" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
          <Ionicons name="stop" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Meditation Artwork/Icon */}
        <View style={styles.artworkContainer}>
          <View style={[styles.artwork, { backgroundColor: (genre?.color || colors.primary) + '20' }]}>
            <Ionicons 
              name={genre?.icon as any || 'musical-notes'} 
              size={80} 
              color={genre?.color || colors.primary} 
            />
          </View>
        </View>

        {/* Track Info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          {meditation?.subtitle && (
            <Text style={styles.trackSubtitle}>{meditation.subtitle}</Text>
          )}
          {genre && (
            <Text style={[styles.genreLabel, { color: genre.color }]}>
              {genre.title}
            </Text>
          )}
        </View>

        {/* Scripture Reference */}
        {meditation?.scriptureReferences && meditation.scriptureReferences.length > 0 && (
          <View style={styles.scriptureContainer}>
            <View style={styles.scriptureHeader}>
              <Ionicons name="book-outline" size={20} color={colors.primary} />
              <Text style={styles.scriptureReference}>
                {meditation.scriptureReferences[0].book} {meditation.scriptureReferences[0].chapter}:
                {meditation.scriptureReferences[0].verseStart}
                {meditation.scriptureReferences[0].verseEnd && 
                  `-${meditation.scriptureReferences[0].verseEnd}`}
              </Text>
            </View>
            <Text style={styles.scriptureText}>
              "{meditation.scriptureReferences[0].text}"
            </Text>
            <Text style={styles.scriptureTranslation}>
              — {meditation.scriptureReferences[0].translation}
            </Text>
          </View>
        )}

        {/* Description */}
        {meditation?.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>About This Meditation</Text>
            <Text style={styles.descriptionText}>{meditation.description}</Text>
          </View>
        )}
      </ScrollView>

      {/* Player Controls */}
      <View style={styles.playerContainer}>
        {/* Progress Display */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(audioState.position)}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${getSeekValue() * 100}%`,
                  backgroundColor: genre?.color || colors.primary 
                }
              ]} 
            />
          </View>
          <Text style={styles.timeText}>{formatTime(audioState.duration)}</Text>
        </View>

        {/* Main Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => skipBackward(15)}
            disabled={!audioState.isLoaded}
          >
            <Ionicons 
              name="play-skip-back" 
              size={32} 
              color={audioState.isLoaded ? colors.text : colors.textSecondary} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.playButton, 
              { backgroundColor: genre?.color || colors.primary },
              !audioState.isLoaded && styles.disabledButton
            ]}
            onPress={handlePlayPause}
            disabled={!audioState.isLoaded || audioState.isLoading}
          >
            {audioState.isLoading ? (
              <Ionicons name="refresh" size={40} color={colors.surface} />
            ) : (
              <Ionicons
                name={audioState.isPlaying ? "pause" : "play"}
                size={40}
                color={colors.surface}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => skipForward(15)}
            disabled={!audioState.isLoaded}
          >
            <Ionicons 
              name="play-skip-forward" 
              size={32} 
              color={audioState.isLoaded ? colors.text : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Additional Controls */}
        <View style={styles.additionalControls}>
          <TouchableOpacity 
            style={styles.additionalButton}
            onPress={() => browserVoiceService.testVoice("This is how your meditation will sound.")}
          >
            <Ionicons name="volume-medium" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.additionalButton}
            onPress={() => setShowVoiceSettings(true)}
          >
            <Ionicons name="settings-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.additionalButton}>
            <Ionicons name="heart-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {audioState.error && (
        <Text style={styles.errorText}>{audioState.error}</Text>
      )}

      <VoiceSettingsModal
        visible={showVoiceSettings}
        onClose={() => setShowVoiceSettings(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  stopButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  artworkContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  artwork: {
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  trackInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  trackTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  trackSubtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  genreLabel: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  scriptureContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  scriptureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scriptureReference: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  scriptureText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  scriptureTranslation: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginVertical: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  playerContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    marginBottom: 24,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  additionalButton: {
    padding: 12,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    margin: 16,
  },
});