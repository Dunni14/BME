import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { MeditationCard } from './MeditationCard';
import { AudioTrack } from '../../types/audio';
import { colors } from '../../styles/colors';

interface MeditationListProps {
  tracks: AudioTrack[];
  onTrackPress: (track: AudioTrack) => void;
  onFavoriteToggle?: (trackId: string) => void;
  favorites?: string[];
  title?: string;
}

export const MeditationList: React.FC<MeditationListProps> = ({
  tracks,
  onTrackPress,
  onFavoriteToggle,
  favorites = [],
  title,
}) => {
  const renderItem = ({ item }: { item: AudioTrack }) => (
    <MeditationCard
      track={item}
      onPress={() => onTrackPress(item)}
      onFavorite={onFavoriteToggle ? () => onFavoriteToggle(item.id) : undefined}
      isFavorite={favorites.includes(item.id)}
    />
  );

  const renderHeader = () => {
    if (!title) return null;
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No meditations available</Text>
    </View>
  );

  return (
    <FlatList
      data={tracks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});