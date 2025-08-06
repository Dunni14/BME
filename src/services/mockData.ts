import { MeditationGenre, Meditation, MeditationSeries, MeditationContent, Category } from '../types/content';
import { AudioTrack } from '../types/audio';

export const christianMeditationGenres: MeditationGenre[] = [
  {
    id: 'evening-peace',
    title: 'Evening Peace',
    description: 'Find rest and restoration in God\'s presence as you end your day',
    shortDescription: 'End your day in God\'s peace',
    icon: 'moon-outline',
    color: '#4A5568', // Soft gray-blue
    tags: ['evening', 'rest', 'peace', 'sleep'],
    targetAudience: 'everyone',
    meditations: [
      {
        id: 'ep1',
        title: 'Releasing the Day',
        subtitle: 'Let go and let God',
        description: 'Surrender your worries and accomplishments to God\'s loving care',
        duration: 12,
        audioUrl: 'releasing-day.mp3',
        scriptureReferences: [{
          book: '1 Peter',
          chapter: 5,
          verseStart: 7,
          translation: 'NIV',
          text: 'Cast all your anxiety on him because he cares for you.'
        }],
        difficulty: 'beginner',
        tags: ['surrender', 'worry', 'trust'],
        genreId: 'evening-peace'
      },
      {
        id: 'ep2',
        title: 'Resting in His Love',
        subtitle: 'You are deeply loved',
        description: 'Experience the security of God\'s unconditional love as you prepare for sleep',
        duration: 15,
        audioUrl: 'resting-love.mp3',
        scriptureReferences: [{
          book: 'Romans',
          chapter: 8,
          verseStart: 38,
          verseEnd: 39,
          translation: 'NIV',
          text: 'For I am convinced that neither death nor life... will be able to separate us from the love of God'
        }],
        difficulty: 'beginner',
        tags: ['love', 'security', 'identity'],
        genreId: 'evening-peace'
      },
      {
        id: 'ep3',
        title: 'Tomorrow\'s Grace',
        subtitle: 'His mercies are new every morning',
        description: 'Find hope for tomorrow in God\'s faithful promises',
        duration: 10,
        audioUrl: 'tomorrow-grace.mp3',
        scriptureReferences: [{
          book: 'Lamentations',
          chapter: 3,
          verseStart: 22,
          verseEnd: 23,
          translation: 'NIV',
          text: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail'
        }],
        difficulty: 'beginner',
        tags: ['hope', 'new beginnings', 'mercy'],
        genreId: 'evening-peace'
      }
    ]
  },

  {
    id: 'morning-strength',
    title: 'Morning Strength',
    description: 'Start your day rooted in God\'s strength and purpose',
    shortDescription: 'Begin with divine strength',
    icon: 'sunny-outline',
    color: '#D69E2E', // Warm gold
    tags: ['morning', 'strength', 'purpose', 'energy'],
    targetAudience: 'everyone',
    meditations: [
      {
        id: 'ms1',
        title: 'Armor of God',
        subtitle: 'Equipped for today\'s battles',
        description: 'Put on the full armor of God to face whatever comes your way',
        duration: 12,
        audioUrl: 'armor-god.mp3',
        scriptureReferences: [{
          book: 'Ephesians',
          chapter: 6,
          verseStart: 10,
          verseEnd: 11,
          translation: 'NIV',
          text: 'Be strong in the Lord and in his mighty power. Put on the full armor of God'
        }],
        difficulty: 'intermediate',
        tags: ['spiritual warfare', 'protection', 'strength'],
        genreId: 'morning-strength'
      },
      {
        id: 'ms2',
        title: 'Today\'s Purpose',
        subtitle: 'Aligned with His will',
        description: 'Seek God\'s direction and purpose for the day ahead',
        duration: 10,
        audioUrl: 'today-purpose.mp3',
        scriptureReferences: [{
          book: 'Proverbs',
          chapter: 3,
          verseStart: 5,
          verseEnd: 6,
          translation: 'NIV',
          text: 'Trust in the Lord with all your heart and lean not on your own understanding'
        }],
        difficulty: 'beginner',
        tags: ['purpose', 'guidance', 'trust'],
        genreId: 'morning-strength'
      },
      {
        id: 'ms3',
        title: 'Renewed Mind',
        subtitle: 'Think on these things',
        description: 'Set your mind on things above and be transformed by God\'s truth',
        duration: 8,
        audioUrl: 'renewed-mind.mp3',
        scriptureReferences: [{
          book: 'Philippians',
          chapter: 4,
          verseStart: 8,
          translation: 'NIV',
          text: 'Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right...'
        }],
        difficulty: 'intermediate',
        tags: ['mindset', 'truth', 'transformation'],
        genreId: 'morning-strength'
      }
    ]
  },

  {
    id: 'anxiety-peace',
    title: 'Overcoming Anxiety',
    description: 'Find God\'s perfect peace in the midst of worry and fear',
    shortDescription: 'Trade anxiety for peace',
    icon: 'heart-outline',
    color: '#38B2AC', // Calming teal
    tags: ['anxiety', 'worry', 'peace', 'fear'],
    targetAudience: 'struggling',
    meditations: [
      {
        id: 'ap1',
        title: 'Be Still',
        subtitle: 'In stillness, find His presence',
        description: 'Learn to quiet anxious thoughts and rest in God\'s sovereignty',
        duration: 15,
        audioUrl: 'be-still.mp3',
        scriptureReferences: [{
          book: 'Psalm',
          chapter: 46,
          verseStart: 10,
          translation: 'NIV',
          text: 'Be still, and know that I am God'
        }],
        difficulty: 'beginner',
        tags: ['stillness', 'presence', 'sovereignty'],
        genreId: 'anxiety-peace'
      },
      {
        id: 'ap2',
        title: 'Perfect Peace',
        subtitle: 'Mind stayed on Him',
        description: 'Experience the peace that passes understanding through focused trust',
        duration: 12,
        audioUrl: 'perfect-peace.mp3',
        scriptureReferences: [{
          book: 'Isaiah',
          chapter: 26,
          verseStart: 3,
          translation: 'NIV',
          text: 'You will keep in perfect peace those whose minds are steadfast'
        }],
        difficulty: 'intermediate',
        tags: ['peace', 'trust', 'focus'],
        genreId: 'anxiety-peace'
      },
      {
        id: 'ap3',
        title: 'Fear Not',
        subtitle: 'He is with you',
        description: 'Replace fear with faith through God\'s promises of His presence',
        duration: 10,
        audioUrl: 'fear-not.mp3',
        scriptureReferences: [{
          book: 'Isaiah',
          chapter: 41,
          verseStart: 10,
          translation: 'NIV',
          text: 'So do not fear, for I am with you; do not be dismayed, for I am your God'
        }],
        difficulty: 'beginner',
        tags: ['fear', 'faith', 'presence'],
        genreId: 'anxiety-peace'
      }
    ]
  },

  {
    id: 'spiritual-growth',
    title: 'Spiritual Growth',
    description: 'Deepen your relationship with God through contemplative practices',
    shortDescription: 'Grow deeper in faith',
    icon: 'leaf-outline',
    color: '#48BB78', // Growth green
    tags: ['growth', 'maturity', 'relationship', 'contemplation'],
    targetAudience: 'growing',
    meditations: [
      {
        id: 'sg1',
        title: 'Abiding in Him',
        subtitle: 'Connected to the vine',
        description: 'Learn what it means to remain in Christ and bear much fruit',
        duration: 18,
        audioUrl: 'abiding-him.mp3',
        scriptureReferences: [{
          book: 'John',
          chapter: 15,
          verseStart: 5,
          translation: 'NIV',
          text: 'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit'
        }],
        difficulty: 'advanced',
        tags: ['abiding', 'fruitfulness', 'connection'],
        genreId: 'spiritual-growth'
      },
      {
        id: 'sg2',
        title: 'Walking in the Spirit',
        subtitle: 'Led by His Spirit',
        description: 'Cultivate sensitivity to the Holy Spirit\'s leading in daily life',
        duration: 15,
        audioUrl: 'walking-spirit.mp3',
        scriptureReferences: [{
          book: 'Galatians',
          chapter: 5,
          verseStart: 25,
          translation: 'NIV',
          text: 'Since we live by the Spirit, let us keep in step with the Spirit'
        }],
        difficulty: 'intermediate',
        tags: ['holy spirit', 'guidance', 'spiritual sensitivity'],
        genreId: 'spiritual-growth'
      }
    ]
  },

  {
    id: 'forgiveness-healing',
    title: 'Forgiveness & Healing',
    description: 'Experience God\'s forgiveness and learn to forgive others',
    shortDescription: 'Healing through forgiveness',
    icon: 'bandage-outline',
    color: '#9F7AEA', // Healing purple
    tags: ['forgiveness', 'healing', 'mercy', 'grace'],
    targetAudience: 'struggling',
    meditations: [
      {
        id: 'fh1',
        title: 'Receiving Grace',
        subtitle: 'His mercy is new',
        description: 'Accept God\'s complete forgiveness and let go of guilt and shame',
        duration: 14,
        audioUrl: 'receiving-grace.mp3',
        scriptureReferences: [{
          book: '1 John',
          chapter: 1,
          verseStart: 9,
          translation: 'NIV',
          text: 'If we confess our sins, he is faithful and just and will forgive us our sins'
        }],
        difficulty: 'beginner',
        tags: ['grace', 'confession', 'mercy'],
        genreId: 'forgiveness-healing'
      },
      {
        id: 'fh2',
        title: 'Forgiving Others',
        subtitle: 'As Christ forgave you',
        description: 'Find freedom through releasing others from their offenses',
        duration: 16,
        audioUrl: 'forgiving-others.mp3',
        scriptureReferences: [{
          book: 'Ephesians',
          chapter: 4,
          verseStart: 32,
          translation: 'NIV',
          text: 'Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you'
        }],
        difficulty: 'intermediate',
        tags: ['forgiveness', 'release', 'freedom'],
        genreId: 'forgiveness-healing'
      }
    ]
  },

  {
    id: 'gratitude-praise',
    title: 'Gratitude & Praise',
    description: 'Cultivate a heart of thanksgiving and worship',
    shortDescription: 'A thankful heart',
    icon: 'musical-notes-outline',
    color: '#ED8936', // Warm orange
    tags: ['gratitude', 'thanksgiving', 'praise', 'worship'],
    targetAudience: 'everyone',
    meditations: [
      {
        id: 'gp1',
        title: 'Counting Blessings',
        subtitle: 'Every good gift',
        description: 'Recognize and celebrate God\'s goodness in your daily life',
        duration: 10,
        audioUrl: 'counting-blessings.mp3',
        scriptureReferences: [{
          book: 'James',
          chapter: 1,
          verseStart: 17,
          translation: 'NIV',
          text: 'Every good and perfect gift is from above'
        }],
        difficulty: 'beginner',
        tags: ['blessings', 'recognition', 'goodness'],
        genreId: 'gratitude-praise'
      }
    ]
  }
];

export const christianMeditationSeries: MeditationSeries[] = [
  {
    id: 'new-believer-journey',
    title: '21 Days of Foundation',
    description: 'Essential meditations for new believers to establish spiritual practices',
    totalDays: 21,
    genres: ['morning-strength', 'spiritual-growth', 'gratitude-praise'],
    difficulty: 'beginner'
  },
  {
    id: 'overcoming-worry',
    title: '14 Days of Peace',
    description: 'Transform anxiety into peace through God\'s promises',
    totalDays: 14,
    genres: ['anxiety-peace', 'evening-peace'],
    difficulty: 'beginner'
  },
  {
    id: 'deeper-walk',
    title: '30 Days Deeper',
    description: 'Advanced practices for mature believers seeking deeper intimacy with God',
    totalDays: 30,
    genres: ['spiritual-growth', 'forgiveness-healing'],
    difficulty: 'advanced'
  }
];

// Helper functions for working with genres
export const getGenreById = (id: string): MeditationGenre | undefined => {
  return christianMeditationGenres.find(genre => genre.id === id);
};

export const getMeditationFromGenre = (genreId: string, meditationId: string): Meditation | undefined => {
  const genre = getGenreById(genreId);
  return genre?.meditations.find(meditation => meditation.id === meditationId);
};

export const getAllMeditations = (): Meditation[] => {
  return christianMeditationGenres.flatMap(genre => genre.meditations);
};

export const searchMeditations = (query: string): Meditation[] => {
  const lowercaseQuery = query.toLowerCase();
  const allMeditations = getAllMeditations();
  
  return allMeditations.filter(meditation =>
    meditation.title.toLowerCase().includes(lowercaseQuery) ||
    meditation.subtitle?.toLowerCase().includes(lowercaseQuery) ||
    meditation.description.toLowerCase().includes(lowercaseQuery) ||
    meditation.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    meditation.scriptureReferences.some(ref => 
      ref.book.toLowerCase().includes(lowercaseQuery) ||
      ref.text.toLowerCase().includes(lowercaseQuery)
    )
  );
};

export const getMeditationsByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Meditation[] => {
  const allMeditations = getAllMeditations();
  return allMeditations.filter(meditation => meditation.difficulty === difficulty);
};

export const getMeditationsByTargetAudience = (audience: 'everyone' | 'new_believers' | 'struggling' | 'growing'): MeditationGenre[] => {
  return christianMeditationGenres.filter(genre => genre.targetAudience === audience);
};

// Convert meditations to AudioTrack format for the audio service
export const getAudioTracksFromGenre = (genreId: string): AudioTrack[] => {
  const genre = getGenreById(genreId);
  if (!genre) return [];
  
  return genre.meditations.map(meditation => ({
    id: meditation.id,
    title: meditation.title,
    url: meditation.audioUrl,
    duration: meditation.duration * 60 * 1000, // Convert minutes to milliseconds
  }));
};

export const getAllAudioTracks = (): AudioTrack[] => {
  const allMeditations = getAllMeditations();
  return allMeditations.map(meditation => ({
    id: meditation.id,
    title: meditation.title,
    url: meditation.audioUrl,
    duration: meditation.duration * 60 * 1000, // Convert minutes to milliseconds
  }));
};

// Legacy compatibility functions
export const mockCategories: Category[] = christianMeditationGenres.map(genre => ({
  id: genre.id,
  name: genre.title,
  description: genre.description,
  iconName: genre.icon.replace('-outline', ''),
  color: genre.color,
}));

export const mockMeditations: MeditationContent[] = getAllMeditations().map(meditation => ({
  id: meditation.id,
  title: meditation.title,
  description: meditation.description,
  audioUrl: meditation.audioUrl,
  duration: meditation.duration * 60 * 1000, // Convert minutes to milliseconds
  category: getGenreById(meditation.genreId)?.title || 'Unknown',
  tags: meditation.tags,
  bibleVerse: meditation.scriptureReferences[0]?.text || '',
  transcript: '',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}));

export const mockAudioTracks: AudioTrack[] = getAllAudioTracks();

export const getMeditationsByCategory = (categoryName: string): MeditationContent[] => {
  const genre = christianMeditationGenres.find(g => g.title === categoryName);
  if (!genre) return [];
  
  return genre.meditations.map(meditation => ({
    id: meditation.id,
    title: meditation.title,
    description: meditation.description,
    audioUrl: meditation.audioUrl,
    duration: meditation.duration * 60 * 1000,
    category: genre.title,
    tags: meditation.tags,
    bibleVerse: meditation.scriptureReferences[0]?.text || '',
    transcript: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }));
};

export const getMeditationById = (id: string): MeditationContent | undefined => {
  return mockMeditations.find(meditation => meditation.id === id);
};

export const getAudioTrackById = (id: string): AudioTrack | undefined => {
  return mockAudioTracks.find(track => track.id === id);
};