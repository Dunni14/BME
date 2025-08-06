import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { clearCurrentTrack, generateMeditationAudio, clearAudioError } from '../../store/slices/contentSlice';
import { browserVoiceService } from '../../services/voiceGeneration/browserVoiceService';
import { colors } from '../../styles/colors';

export const AudioPlayer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { 
    currentTrack,
    currentMeditation,
    currentGenre,
    audio: { 
      isGenerating, 
      currentAudioUrl, 
      error: audioError,
      generationProgress 
    }
  } = useSelector((state: RootState) => state.content);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [canUseVoice, setCanUseVoice] = useState(true);

  useEffect(() => {
    // TTS is supported in React Native via Expo Speech
    setCanUseVoice(true);
  }, []);

  useEffect(() => {
    if (audioError) {
      Alert.alert('Audio Generation Failed', audioError, [
        { text: 'OK', onPress: () => dispatch(clearAudioError()) }
      ]);
    }
  }, [audioError, dispatch]);

  const handleGenerateAudio = async () => {
    if (!currentMeditation) return;
    
    try {
      dispatch(generateMeditationAudio({ 
        meditation: currentMeditation,
        forceRegenerate: false 
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to generate audio');
    }
  };

  const handlePlayPause = () => {
    if (!currentMeditation) return;

    if (isPlaying) {
      browserVoiceService.pauseSpeaking();
      setIsPlaying(false);
    } else {
      // Use TTS if meditation has script text
      if (currentMeditation.scriptText || currentMeditation.description) {
        try {
          console.log('Starting TTS for meditation:', currentMeditation.title);
          console.log('Script text length:', currentMeditation.scriptText?.length || 0);
          setIsPlaying(true);
          browserVoiceService.generateMeditationAudio(currentMeditation);
        } catch (error) {
          console.error('TTS Error:', error);
          setIsPlaying(false);
          Alert.alert('Playback Error', 'Failed to play meditation audio');
        }
      } else {
        console.log('No script text available for meditation:', currentMeditation.title);
        Alert.alert('No Script Available', 'This meditation does not have a script available for text-to-speech.');
      }
    }
  };

  const handleStop = () => {
    browserVoiceService.stopSpeaking();
    setIsPlaying(false);
  };

  const handleTestVoice = () => {
    browserVoiceService.testVoice("This is how your meditation will sound.");
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

  if (!currentTrack || !currentMeditation) {
    return null;
  }

  if (!canUseVoice) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Voice functionality is not available in your browser
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Track Info Section - Tappable */}
      <TouchableOpacity style={styles.trackInfo} onPress={handlePlayerTap} activeOpacity={0.7}>
        <View style={styles.trackDetails}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.trackSubtitle} numberOfLines={1}>
            {currentMeditation.subtitle || `${currentMeditation.duration} min meditation`}
          </Text>
        </View>
      </TouchableOpacity>

      {isGenerating && (
        <View style={styles.generationStatus}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.generationText}>Preparing...</Text>
        </View>
      )}

      {/* Controls Section */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleTestVoice}
          disabled={isGenerating}
        >
          <Ionicons name="volume-medium" size={18} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, isGenerating && styles.disabledButton]}
          onPress={handlePlayPause}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Ionicons name="refresh" size={20} color={colors.surface} />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={20}
              color={colors.surface}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleStop}
          disabled={!isPlaying && !isGenerating}
        >
          <Ionicons 
            name="stop" 
            size={18} 
            color={(isPlaying || isGenerating) ? colors.error : colors.textSecondary} 
          />
        </TouchableOpacity>

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => dispatch(clearCurrentTrack())}>
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
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
    minHeight: 70,
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
    marginRight: 12,
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
  trackSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  generationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  generationText: {
    marginLeft: 6,
    color: colors.primary,
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontSize: 12,
    textAlign: 'center',
    padding: 16,
  },
});