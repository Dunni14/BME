import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setCurrentTrack } from '../store/slices/contentSlice';
import { MeditationList } from '../components/meditation';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { mockCategories, getMeditationsByCategory } from '../services/mockData';
import { AudioTrack } from '../types/audio';
import { colors } from '../styles/colors';

export const LibraryScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { loadTrack } = useAudioPlayer();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

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

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const getCategoryTracks = (categoryName: string) => {
    const meditations = getMeditationsByCategory(categoryName);
    return meditations.map(meditation => ({
      id: meditation.id,
      title: meditation.title,
      url: meditation.audioUrl,
      duration: meditation.duration,
    }));
  };

  if (selectedCategory) {
    const tracks = getCategoryTracks(selectedCategory);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedCategory}</Text>
        </View>
        
        <MeditationList
          tracks={tracks}
          onTrackPress={handleTrackPress}
          onFavoriteToggle={handleFavoriteToggle}
          favorites={favorites}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Meditation Library</Text>
          <Text style={styles.subtitle}>Explore meditations by category</Text>
          
          <View style={styles.categoriesGrid}>
            {mockCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { borderColor: category.color }]}
                onPress={() => handleCategoryPress(category.name)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
                  <Ionicons 
                    name={category.iconName as any} 
                    size={32} 
                    color={category.color} 
                  />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
                <View style={styles.categoryArrow}>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  categoryArrow: {
    alignSelf: 'flex-end',
  },
});