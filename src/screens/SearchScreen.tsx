import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { setCurrentTrack } from '../store/slices/contentSlice';
import { SearchBar } from '../components/common';
import { MeditationList } from '../components/meditation';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { searchMeditations } from '../services/mockData';
import { AudioTrack } from '../types/audio';
import { colors } from '../styles/colors';
import { debounce } from '../utils/helpers';

export const SearchScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { loadTrack } = useAudioPlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AudioTrack[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      if (query.trim().length === 0) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const results = searchMeditations(query);
      const audioTracks = results.map(meditation => ({
        id: meditation.id,
        title: meditation.title,
        url: meditation.audioUrl,
        duration: meditation.duration,
      }));
      
      setSearchResults(audioTracks);
      setIsSearching(false);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

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

  const EmptyState = () => {
    if (searchQuery.trim().length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Search Meditations</Text>
          <Text style={styles.emptySubtitle}>
            Find meditations by title, topic, or theme
          </Text>
        </View>
      );
    }

    if (isSearching) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptySubtitle}>Searching...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Results Found</Text>
        <Text style={styles.emptySubtitle}>
          Try searching for different keywords or topics
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search meditations, topics, themes..."
        autoFocus
      />
      
      {searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsHeader}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
          </Text>
          <MeditationList
            tracks={searchResults}
            onTrackPress={handleTrackPress}
            onFavoriteToggle={handleFavoriteToggle}
            favorites={favorites}
          />
        </View>
      ) : (
        <EmptyState />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
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