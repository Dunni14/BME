import { MeditationContent, Category } from '../types/content';
import { AudioTrack } from '../types/audio';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Faith',
    description: 'Strengthen your faith through guided meditation',
    iconName: 'heart',
    color: '#6366f1',
  },
  {
    id: '2',
    name: 'Peace',
    description: 'Find inner peace and tranquility',
    iconName: 'leaf',
    color: '#10b981',
  },
  {
    id: '3',
    name: 'Hope',
    description: 'Discover hope in challenging times',
    iconName: 'sunny',
    color: '#f59e0b',
  },
  {
    id: '4',
    name: 'Love',
    description: 'Experience God\'s unconditional love',
    iconName: 'heart-circle',
    color: '#ef4444',
  },
  {
    id: '5',
    name: 'Gratitude',
    description: 'Cultivate a heart of thankfulness',
    iconName: 'flower',
    color: '#8b5cf6',
  },
  {
    id: '6',
    name: 'Strength',
    description: 'Draw strength from the Lord',
    iconName: 'shield',
    color: '#06b6d4',
  },
];

export const mockMeditations: MeditationContent[] = [
  {
    id: '1',
    title: 'Walking by Faith',
    description: 'A meditation on trusting God when you cannot see the way forward',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 600000, // 10 minutes
    category: 'Faith',
    tags: ['trust', 'faith', 'guidance'],
    bibleVerse: '2 Corinthians 5:7 - For we walk by faith, not by sight.',
    transcript: 'In this meditation, we explore what it means to walk by faith...',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '2',
    title: 'Peace Like a River',
    description: 'Experience the peace that surpasses understanding',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 480000, // 8 minutes
    category: 'Peace',
    tags: ['peace', 'calm', 'rest'],
    bibleVerse: 'Isaiah 48:18 - Oh, that you had heeded My commandments! Then your peace would have been like a river.',
    transcript: 'Let us enter into God\'s perfect peace...',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
  },
  {
    id: '3',
    title: 'Hope in the Storm',
    description: 'Finding hope when life feels overwhelming',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 720000, // 12 minutes
    category: 'Hope',
    tags: ['hope', 'storms', 'perseverance'],
    bibleVerse: 'Romans 8:28 - And we know that in all things God works for the good of those who love him.',
    transcript: 'Even in the midst of life\'s storms, we can find hope...',
    createdAt: '2024-01-17T07:30:00Z',
    updatedAt: '2024-01-17T07:30:00Z',
  },
  {
    id: '4',
    title: 'Unconditional Love',
    description: 'Resting in God\'s perfect and unchanging love',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 540000, // 9 minutes
    category: 'Love',
    tags: ['love', 'acceptance', 'grace'],
    bibleVerse: 'Romans 8:38-39 - For I am convinced that neither death nor life... will be able to separate us from the love of God.',
    transcript: 'God\'s love for you is perfect and complete...',
    createdAt: '2024-01-18T08:15:00Z',
    updatedAt: '2024-01-18T08:15:00Z',
  },
  {
    id: '5',
    title: 'Grateful Heart',
    description: 'Cultivating thanksgiving in all circumstances',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 420000, // 7 minutes
    category: 'Gratitude',
    tags: ['gratitude', 'thanksgiving', 'joy'],
    bibleVerse: '1 Thessalonians 5:18 - Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.',
    transcript: 'Let us cultivate hearts of gratitude...',
    createdAt: '2024-01-19T06:45:00Z',
    updatedAt: '2024-01-19T06:45:00Z',
  },
  {
    id: '6',
    title: 'Strength in Weakness',
    description: 'Discovering God\'s power in our weakness',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 660000, // 11 minutes
    category: 'Strength',
    tags: ['strength', 'weakness', 'power'],
    bibleVerse: '2 Corinthians 12:9 - My grace is sufficient for you, for my power is made perfect in weakness.',
    transcript: 'When we are weak, He is strong...',
    createdAt: '2024-01-20T07:00:00Z',
    updatedAt: '2024-01-20T07:00:00Z',
  },
];

// Convert meditations to AudioTrack format for the audio service
export const mockAudioTracks: AudioTrack[] = mockMeditations.map(meditation => ({
  id: meditation.id,
  title: meditation.title,
  url: meditation.audioUrl,
  duration: meditation.duration,
}));

export const getMeditationsByCategory = (categoryName: string): MeditationContent[] => {
  return mockMeditations.filter(meditation => meditation.category === categoryName);
};

export const getMeditationById = (id: string): MeditationContent | undefined => {
  return mockMeditations.find(meditation => meditation.id === id);
};

export const getAudioTrackById = (id: string): AudioTrack | undefined => {
  return mockAudioTracks.find(track => track.id === id);
};

export const searchMeditations = (query: string): MeditationContent[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockMeditations.filter(meditation =>
    meditation.title.toLowerCase().includes(lowercaseQuery) ||
    meditation.description.toLowerCase().includes(lowercaseQuery) ||
    meditation.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    meditation.category.toLowerCase().includes(lowercaseQuery)
  );
};