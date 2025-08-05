import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { setCurrentTrack } from '../store/slices/contentSlice';
import { MeditationList } from '../components/meditation';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { StorageService } from '../services/storageService';
import { mockAudioTracks, getMeditationById } from '../services/mockData';
import { AudioTrack } from '../types/audio';
import { colors } from '../styles/colors';

export const FavoritesScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { loadTrack } = useAudioPlayer();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<AudioTrack[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    // Update favorite tracks when favorites change
    const tracks = favorites.map(favoriteId => {
      const meditation = getMeditationById(favoriteId);
      if (meditation) {
        return {
          id: meditation.id,
          title: meditation.title,
          url: meditation.audioUrl,
          duration: meditation.duration,
        };
      }
      return null;
    }).filter(Boolean) as AudioTrack[];
    
    setFavoriteTracks(tracks);
  }, [favorites]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await StorageService.getFavorites();
      setFavorites(storedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleTrackPress = async (track: AudioTrack) => {
    dispatch(setCurrentTrack(track));
    await loadTrack(track);
  };

  const handleFavoriteToggle = async (trackId: string) => {
    try {
      if (favorites.includes(trackId)) {
        await StorageService.removeFromFavorites(trackId);
        setFavorites(prev => prev.filter(id => id !== trackId));
      } else {
        await StorageService.addToFavorites(trackId);
        setFavorites(prev => [...prev, trackId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart icon on any meditation to add it to your favorites
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {favoriteTracks.length === 0 ? (
        <EmptyState />
      ) : (
        <MeditationList
          tracks={favoriteTracks}
          onTrackPress={handleTrackPress}
          onFavoriteToggle={handleFavoriteToggle}
          favorites={favorites}
          title="Your Favorites"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});