import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { AudioTrack } from '../../types/audio';

interface MeditationCardProps {
  track: AudioTrack;
  onPress: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export const MeditationCard: React.FC<MeditationCardProps> = ({
  track,
  onPress,
  onFavorite,
  isFavorite = false,
}) => {
  
  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="musical-notes" size={24} color={colors.primary} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {track.title}
          </Text>
          {track.duration && (
            <Text style={styles.duration}>
              {formatDuration(track.duration)}
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          {onFavorite && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={onFavorite}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? colors.error : colors.textSecondary}
              />
            </TouchableOpacity>
          )}
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    padding: 4,
  },
});