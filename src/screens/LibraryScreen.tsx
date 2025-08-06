import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { christianMeditationGenres, christianMeditationSeries } from '../services/mockData';
import { MeditationGenre, MeditationSeries } from '../types/content';
import { colors } from '../styles/colors';

type FilterType = 'all' | 'everyone' | 'new_believers' | 'struggling' | 'growing';

export const LibraryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const handleGenrePress = (genre: MeditationGenre) => {
    (navigation as any).navigate('GenreDetail', { genre });
  };

  const handleSeriesPress = (series: MeditationSeries) => {
    // TODO: Implement series detail screen navigation
    console.log('Series pressed:', series.title);
  };

  const filteredGenres = christianMeditationGenres.filter(genre => {
    if (selectedFilter === 'all') return true;
    return genre.targetAudience === selectedFilter;
  });

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case 'all':
        return 'All';
      case 'everyone':
        return 'Everyone';
      case 'new_believers':
        return 'New Believers';
      case 'struggling':
        return 'Struggling';
      case 'growing':
        return 'Growing';
      default:
        return 'All';
    }
  };

  const renderFilterButton = (filter: FilterType) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.activeFilterButtonText
        ]}
      >
        {getFilterLabel(filter)}
      </Text>
    </TouchableOpacity>
  );

  const renderGenreCard = ({ item }: { item: MeditationGenre }) => (
    <TouchableOpacity
      style={[styles.genreCard, { borderLeftColor: item.color }]}
      onPress={() => handleGenrePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.genreHeader}>
        <View style={[styles.genreIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon as any} size={28} color={item.color} />
        </View>
        <View style={styles.genreInfo}>
          <Text style={styles.genreTitle}>{item.title}</Text>
          <Text style={styles.genreDescription}>{item.shortDescription}</Text>
        </View>
        <View style={styles.genreStats}>
          <Text style={[styles.meditationCount, { color: item.color }]}>
            {item.meditations.length}
          </Text>
          <Text style={styles.meditationLabel}>sessions</Text>
        </View>
      </View>
      
      <View style={styles.genreFooter}>
        <View style={styles.genreTags}>
          <View style={[styles.audienceTag, { backgroundColor: item.color + '15' }]}>
            <Text style={[styles.audienceText, { color: item.color }]}>
              {item.targetAudience === 'everyone' ? 'For Everyone' : 
               item.targetAudience === 'new_believers' ? 'New Believers' :
               item.targetAudience === 'struggling' ? 'Those Struggling' :
               'Growing Christians'}
            </Text>
          </View>
          <View style={styles.durationTag}>
            <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
            <Text style={styles.durationText}>
              {item.meditations.reduce((total, meditation) => total + meditation.duration, 0)} min total
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const renderSeriesCard = ({ item }: { item: MeditationSeries }) => (
    <TouchableOpacity
      style={styles.seriesCard}
      onPress={() => handleSeriesPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.seriesHeader}>
        <View style={styles.seriesIcon}>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.seriesInfo}>
          <Text style={styles.seriesTitle}>{item.title}</Text>
          <Text style={styles.seriesDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
      
      <View style={styles.seriesFooter}>
        <Text style={styles.seriesDays}>{item.totalDays} days</Text>
        <View style={[styles.difficultyBadge, { 
          backgroundColor: 
            item.difficulty === 'beginner' ? '#48BB78' + '20' :
            item.difficulty === 'intermediate' ? '#ED8936' + '20' :
            '#9F7AEA' + '20'
        }]}>
          <Text style={[styles.difficultyText, { 
            color: 
              item.difficulty === 'beginner' ? '#48BB78' :
              item.difficulty === 'intermediate' ? '#ED8936' :
              '#9F7AEA'
          }]}>
            {item.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Meditation Library</Text>
          <Text style={styles.subtitle}>
            Explore guided meditations organized by spiritual themes and journeys
          </Text>
          
          {/* Filter Buttons */}
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Filter by audience:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filtersScrollView}
              contentContainerStyle={styles.filtersContent}
            >
              {(['all', 'everyone', 'new_believers', 'struggling', 'growing'] as FilterType[]).map(renderFilterButton)}
            </ScrollView>
          </View>

          {/* Meditation Series Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guided Series</Text>
            <Text style={styles.sectionSubtitle}>
              Structured journeys for focused spiritual growth
            </Text>
            <FlatList
              data={christianMeditationSeries}
              renderItem={renderSeriesCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.seriesList}
              ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            />
          </View>

          {/* Meditation Genres Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Meditation Topics
              {selectedFilter !== 'all' && (
                <Text style={styles.filterIndicator}> • {getFilterLabel(selectedFilter)}</Text>
              )}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {filteredGenres.length} meditation topics available
            </Text>
          </View>

          <FlatList
            data={filteredGenres}
            renderItem={renderGenreCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
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
    lineHeight: 24,
  },
  
  // Filters
  filtersContainer: {
    marginBottom: 32,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  filtersScrollView: {
    flexGrow: 0,
  },
  filtersContent: {
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeFilterButtonText: {
    color: colors.surface,
  },
  
  // Sections
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  filterIndicator: {
    color: colors.primary,
    fontSize: 18,
  },
  
  // Series Cards
  seriesList: {
    paddingLeft: 2,
  },
  seriesCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    width: 280,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  seriesHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  seriesIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  seriesInfo: {
    flex: 1,
  },
  seriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  seriesDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  seriesFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seriesDays: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  
  // Genre Cards
  genreCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  genreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  genreIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  genreInfo: {
    flex: 1,
  },
  genreTitle: {
    fontSize: 18,
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
    fontSize: 20,
    fontWeight: '700',
  },
  meditationLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  genreFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genreTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audienceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  audienceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  durationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});