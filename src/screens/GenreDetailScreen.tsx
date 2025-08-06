import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from '../store';
import { setCurrentTrack, selectMeditationFromGenre } from '../store/slices/contentSlice';
import { AudioPlayer } from '../components/audio';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { colors } from '../styles/colors';
import { MeditationGenre, Meditation } from '../types/content';
import { AudioTrack } from '../types/audio';

interface RouteParams {
  genre: MeditationGenre;
}

export const GenreDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { loadTrack } = useAudioPlayer();
  const { currentTrack } = useSelector((state: RootState) => state.content);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const { genre } = route.params as RouteParams;

  const handleMeditationPress = async (meditation: Meditation) => {
    // Use the new action that sets both genre and meditation
    dispatch(selectMeditationFromGenre({ genre, meditation }));
    
    const audioTrack: AudioTrack = {
      id: meditation.id,
      title: meditation.title,
      url: meditation.audioUrl,
      duration: meditation.duration * 60 * 1000, // Convert minutes to milliseconds
    };
    
    await loadTrack(audioTrack);
    
    // Navigate to meditation preparation screen first
    (navigation as any).navigate('MeditationPreparation', {
      meditationId: meditation.id,
      genreId: genre.id
    });
  };

  const handleFavoriteToggle = (meditationId: string) => {
    setFavorites(prev => 
      prev.includes(meditationId)
        ? prev.filter(id => id !== meditationId)
        : [...prev, meditationId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#48BB78';
      case 'intermediate':
        return '#ED8936';
      case 'advanced':
        return '#9F7AEA';
      default:
        return colors.textSecondary;
    }
  };

  const renderMeditationCard = ({ item, index }: { item: Meditation; index: number }) => (
    <TouchableOpacity 
      style={styles.meditationCard} 
      onPress={() => handleMeditationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.meditationHeader}>
        <View style={styles.meditationNumber}>
          <Text style={[styles.numberText, { color: genre.color }]}>{index + 1}</Text>
        </View>
        
        <View style={styles.meditationContent}>
          <Text style={styles.meditationTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.meditationSubtitle}>{item.subtitle}</Text>
          )}
          <Text style={styles.meditationDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={styles.meditationActions}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleFavoriteToggle(item.id)}
          >
            <Ionicons
              name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
              size={24}
              color={favorites.includes(item.id) ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.meditationFooter}>
        <View style={styles.meditationMeta}>
          <View style={styles.durationTag}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.durationText}>{item.duration} min</Text>
          </View>
          
          <View style={[styles.difficultyTag, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
              {item.difficulty}
            </Text>
          </View>
        </View>

        {item.scriptureReferences.length > 0 && (
          <View style={styles.scripturePreview}>
            <Ionicons name="book-outline" size={14} color={genre.color} />
            <Text style={[styles.scriptureText, { color: genre.color }]} numberOfLines={1}>
              {item.scriptureReferences[0].book} {item.scriptureReferences[0].chapter}:{item.scriptureReferences[0].verseStart}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderGenreHeader = () => (
    <View style={[styles.genreHeader, { backgroundColor: genre.color + '10' }]}>
      <View style={styles.genreHeaderContent}>
        <View style={[styles.genreIcon, { backgroundColor: genre.color + '20' }]}>
          <Ionicons name={genre.icon as any} size={32} color={genre.color} />
        </View>
        
        <View style={styles.genreInfo}>
          <Text style={styles.genreTitle}>{genre.title}</Text>
          <Text style={styles.genreDescription}>{genre.description}</Text>
          
          <View style={styles.genreStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: genre.color }]}>
                {genre.meditations.length}
              </Text>
              <Text style={styles.statLabel}>Meditations</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: genre.color }]}>
                {genre.meditations.reduce((total, meditation) => total + meditation.duration, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Minutes</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.audienceIndicator}>
        <Text style={[styles.audienceText, { color: genre.color }]}>
          {genre.targetAudience === 'everyone' ? 'For Everyone' : 
           genre.targetAudience === 'new_believers' ? 'New Believers' :
           genre.targetAudience === 'struggling' ? 'Those Struggling' :
           'Growing Christians'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: genre.color }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{genre.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={genre.meditations}
        renderItem={renderMeditationCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.meditationList}
        ListHeaderComponent={renderGenreHeader}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.surface,
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Compensate for back button
  },
  headerSpacer: {
    width: 40,
  },
  genreHeader: {
    padding: 20,
    marginBottom: 20,
  },
  genreHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  genreIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  genreInfo: {
    flex: 1,
  },
  genreTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  genreDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  genreStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  audienceIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  audienceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  meditationList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  meditationCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  meditationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  meditationNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '600',
  },
  meditationContent: {
    flex: 1,
  },
  meditationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  meditationSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  meditationDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  meditationActions: {
    marginLeft: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  meditationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meditationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  durationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  scripturePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scriptureText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  playerContainer: {
    backgroundColor: colors.background,
  },
});