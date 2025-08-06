import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../store';
import { setPlaylist } from '../store/slices/contentSlice';
import { AudioPlayer } from '../components/audio';
import { colors } from '../styles/colors';
import { christianMeditationGenres, getAllAudioTracks } from '../services/mockData';
import { MeditationGenre } from '../types/content';

export const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { currentTrack } = useSelector((state: RootState) => state.content);

  useEffect(() => {
    // Initialize playlist with all audio tracks
    dispatch(setPlaylist(getAllAudioTracks()));
  }, [dispatch]);

  const handleGenrePress = (genre: MeditationGenre) => {
    (navigation as any).navigate('GenreDetail', { genre });
  };

  const handleSearchPress = () => {
    (navigation as any).navigate('Search');
  };

  const renderGenreCard = ({ item }: { item: MeditationGenre }) => (
    <TouchableOpacity
      style={[styles.genreCard, { borderLeftColor: item.color }]}
      onPress={() => handleGenrePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.genreHeader}>
        <View style={[styles.genreIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon as any} size={24} color={item.color} />
        </View>
        <View style={styles.genreInfo}>
          <Text style={styles.genreTitle}>{item.title}</Text>
          <Text style={styles.genreDescription}>{item.shortDescription}</Text>
        </View>
        <View style={styles.genreStats}>
          <Text style={styles.meditationCount}>{item.meditations.length}</Text>
          <Text style={styles.meditationLabel}>meditation{item.meditations.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>
      
      <View style={styles.genreFooter}>
        <View style={styles.audienceTag}>
          <Text style={[styles.audienceText, { color: item.color }]}>
            {item.targetAudience === 'everyone' ? 'For Everyone' : 
             item.targetAudience === 'new_believers' ? 'New Believers' :
             item.targetAudience === 'struggling' ? 'Those Struggling' :
             'Growing Christians'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const renderWelcomeSection = () => (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeTitle}>Find Peace in God's Presence</Text>
      <Text style={styles.welcomeSubtitle}>
        Explore guided Christian meditations designed to deepen your faith and bring you closer to God
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Christian Meditation</Text>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
          <Ionicons name="search" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={christianMeditationGenres}
        renderItem={renderGenreCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.genreList}
        ListHeaderComponent={renderWelcomeSection}
      />
      
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
  welcomeSection: {
    padding: 20,
    backgroundColor: colors.surface,
    marginBottom: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  genreList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  genreCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  genreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  genreIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  genreInfo: {
    flex: 1,
  },
  genreTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  genreDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  genreStats: {
    alignItems: 'center',
  },
  meditationCount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  meditationLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  genreFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audienceTag: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  audienceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  playerContainer: {
    backgroundColor: colors.background,
  },
});