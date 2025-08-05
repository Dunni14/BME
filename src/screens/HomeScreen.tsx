import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setCurrentTrack, setPlaylist } from '../store/slices/contentSlice';
import { MeditationList } from '../components/meditation';
import { AudioPlayer } from '../components/audio';
import { CategoryFilter } from '../components/common';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { colors } from '../styles/colors';
import { mockAudioTracks, mockMeditations, mockCategories, getMeditationsByCategory } from '../services/mockData';
import { AudioTrack } from '../types/audio';

export const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTrack } = useSelector((state: RootState) => state.content);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { loadTrack } = useAudioPlayer();

  useEffect(() => {
    // Initialize playlist with mock data
    dispatch(setPlaylist(mockAudioTracks));
  }, [dispatch]);

  const handleTrackPress = async (track: AudioTrack) => {
    dispatch(setCurrentTrack(track));
    await loadTrack(track);
  };

  const handleFavoriteToggle = (trackId: string) => {
    setFavorites(prev => 
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  // Filter meditations based on selected category
  const filteredMeditations = useMemo(() => {
    if (!selectedCategory) {
      return mockMeditations;
    }
    
    const category = mockCategories.find(cat => cat.id === selectedCategory);
    if (!category) {
      return mockMeditations;
    }
    
    return getMeditationsByCategory(category.name);
  }, [selectedCategory]);

  // Convert meditations to audio tracks for display
  const audioTracks = filteredMeditations.map(meditation => ({
    id: meditation.id,
    title: meditation.title,
    url: meditation.audioUrl,
    duration: meditation.duration,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {selectedCategory 
            ? mockCategories.find(cat => cat.id === selectedCategory)?.name || 'Meditations'
            : 'Featured Meditations'
          }
        </Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <CategoryFilter
        categories={mockCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      
      <View style={styles.content}>
        <MeditationList
          tracks={audioTracks}
          onTrackPress={handleTrackPress}
          onFavoriteToggle={handleFavoriteToggle}
          favorites={favorites}
        />
      </View>
      
      {currentTrack && (
        <View style={styles.playerContainer}>
          <AudioPlayer />
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  searchButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  playerContainer: {
    backgroundColor: colors.background,
    paddingBottom: 16,
    marginBottom: 16, // Additional spacing when player is visible
  },
});