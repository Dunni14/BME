import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState } from '../store';
import { selectMeditationFromGenre } from '../store/slices/contentSlice';
import { colors } from '../styles/colors';
import { getGenreById, getMeditationFromGenre } from '../services/mockData';

interface RouteParams {
  meditationId: string;
  genreId: string;
}

type MoodType = 'peaceful' | 'anxious' | 'grateful' | 'struggling' | 'seeking' | 'joyful';
type IntentionType = 'peace' | 'guidance' | 'healing' | 'strength' | 'connection' | 'growth';

const moods: Array<{ id: MoodType; label: string; icon: string; color: string }> = [
  { id: 'peaceful', label: 'Peaceful', icon: 'leaf-outline', color: '#48BB78' },
  { id: 'anxious', label: 'Anxious', icon: 'alert-circle-outline', color: '#ED8936' },
  { id: 'grateful', label: 'Grateful', icon: 'heart-outline', color: '#9F7AEA' },
  { id: 'struggling', label: 'Struggling', icon: 'cloud-outline', color: '#4A5568' },
  { id: 'seeking', label: 'Seeking', icon: 'compass-outline', color: '#38B2AC' },
  { id: 'joyful', label: 'Joyful', icon: 'sunny-outline', color: '#D69E2E' },
];

const intentions: Array<{ id: IntentionType; label: string; description: string; icon: string }> = [
  { id: 'peace', label: 'Find Peace', description: 'Seek calm in God\'s presence', icon: 'leaf-outline' },
  { id: 'guidance', label: 'Seek Guidance', description: 'Ask for divine direction', icon: 'compass-outline' },
  { id: 'healing', label: 'Find Healing', description: 'Experience God\'s restorative power', icon: 'medical-outline' },
  { id: 'strength', label: 'Gain Strength', description: 'Draw power from the Lord', icon: 'fitness-outline' },
  { id: 'connection', label: 'Feel Connection', description: 'Draw closer to God', icon: 'heart-outline' },
  { id: 'growth', label: 'Spiritual Growth', description: 'Mature in faith and wisdom', icon: 'trending-up-outline' },
];

const getComfortingMessage = (mood: MoodType, meditationTitle: string, genreTitle: string): string => {
  const messages = {
    peaceful: `Beautiful. Your peaceful heart is already preparing for this time with God. This ${genreTitle.toLowerCase()} meditation will nurture that calm within you.`,
    anxious: `It's okay to feel anxious - God sees your heart and cares for your worries. This ${genreTitle.toLowerCase()} meditation is designed to bring you His perfect peace that surpasses understanding.`,
    grateful: `What a wonderful heart posture. Your gratitude opens the door to experience even more of God's goodness through this ${genreTitle.toLowerCase()} time together.`,
    struggling: `Thank you for your honesty. In our struggles, God draws especially near. This ${genreTitle.toLowerCase()} meditation will remind you that you're not alone - His strength is made perfect in weakness.`,
    seeking: `Your seeking heart delights the Lord. He promises that those who seek Him will find Him. This ${genreTitle.toLowerCase()} meditation will guide you into His loving presence.`,
    joyful: `Your joy is a gift from the Lord! Let's carry that joy into this ${genreTitle.toLowerCase()} meditation and allow God to multiply it as we spend time in His presence.`
  };
  
  return messages[mood];
};

export const MeditationPreparationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { meditationId, genreId } = route.params as RouteParams;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [selectedIntention, setSelectedIntention] = useState<IntentionType | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  const meditation = getMeditationFromGenre(genreId, meditationId);
  const genre = getGenreById(genreId);
  const totalSteps = 4;

  const handleClose = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      Animated.sequence([
        Animated.timing(fadeAnim, { duration: 200, toValue: 0, useNativeDriver: true }),
        Animated.timing(fadeAnim, { duration: 200, toValue: 1, useNativeDriver: true })
      ]).start();
      setCurrentStep(currentStep + 1);
    } else {
      startMeditation();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, { duration: 200, toValue: 0, useNativeDriver: true }),
        Animated.timing(fadeAnim, { duration: 200, toValue: 1, useNativeDriver: true })
      ]).start();
      setCurrentStep(currentStep - 1);
    }
  };

  const startMeditation = () => {
    // Set the meditation in Redux and navigate to the player
    if (meditation && genre) {
      dispatch(selectMeditationFromGenre({ genre, meditation }));
    }
    (navigation as any).navigate('MeditationPlayer', {
      meditationId,
      genreId,
      skipPreparation: true // Flag to avoid infinite loop
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 2: return selectedMood !== null;
      case 3: return selectedIntention !== null;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Welcome to Your Meditation</Text>
            <Text style={styles.stepSubtitle}>
              Let's prepare your heart and mind for this time with God
            </Text>
            
            <View style={styles.meditationInfo}>
              <View style={[styles.genreIcon, { backgroundColor: genre?.color + '20' }]}>
                <Ionicons name={genre?.icon as any} size={32} color={genre?.color} />
              </View>
              <Text style={styles.meditationTitle}>{meditation?.title}</Text>
              {meditation?.subtitle && (
                <Text style={styles.meditationSubtitle}>{meditation.subtitle}</Text>
              )}
              <Text style={styles.meditationDuration}>{meditation?.duration} minutes</Text>
            </View>

            <View style={styles.preparationTips}>
              <Text style={styles.tipsTitle}>To get the most from this time:</Text>
              <View style={styles.tip}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.tipText}>Find a quiet, comfortable space</Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.tipText}>Put away distractions</Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.tipText}>Open your heart to God's presence</Text>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>How are you feeling today?</Text>
            <Text style={styles.stepSubtitle}>
              Understanding your current state helps us tailor this experience
            </Text>
            
            <View style={styles.moodGrid}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodCard,
                    selectedMood === mood.id && styles.selectedMoodCard,
                    { borderColor: mood.color }
                  ]}
                  onPress={() => setSelectedMood(mood.id)}
                >
                  <Ionicons 
                    name={mood.icon as any} 
                    size={28} 
                    color={selectedMood === mood.id ? colors.surface : mood.color} 
                  />
                  <Text style={[
                    styles.moodLabel,
                    selectedMood === mood.id && styles.selectedMoodLabel
                  ]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedMood && (
              <View style={styles.comfortingMessage}>
                <Text style={styles.comfortingText}>
                  {getComfortingMessage(selectedMood, meditation?.title || '', genre?.title || '')}
                </Text>
              </View>
            )}
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What is your intention?</Text>
            <Text style={styles.stepSubtitle}>
              Set a purpose for this time of meditation and prayer
            </Text>
            
            <ScrollView style={styles.intentionsContainer} showsVerticalScrollIndicator={false}>
              {intentions.map((intention) => (
                <TouchableOpacity
                  key={intention.id}
                  style={[
                    styles.intentionCard,
                    selectedIntention === intention.id && styles.selectedIntentionCard
                  ]}
                  onPress={() => setSelectedIntention(intention.id)}
                >
                  <Ionicons 
                    name={intention.icon as any} 
                    size={24} 
                    color={selectedIntention === intention.id ? colors.surface : colors.primary} 
                  />
                  <View style={styles.intentionText}>
                    <Text style={[
                      styles.intentionLabel,
                      selectedIntention === intention.id && styles.selectedIntentionLabel
                    ]}>
                      {intention.label}
                    </Text>
                    <Text style={[
                      styles.intentionDescription,
                      selectedIntention === intention.id && styles.selectedIntentionDescription
                    ]}>
                      {intention.description}
                    </Text>
                  </View>
                  {selectedIntention === intention.id && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.surface} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Today's Scripture</Text>
            <Text style={styles.stepSubtitle}>
              Reflect on this verse as we begin
            </Text>
            
            {meditation?.scriptureReferences && meditation.scriptureReferences.length > 0 && (
              <View style={styles.scriptureContainer}>
                <View style={styles.scriptureHeader}>
                  <Ionicons name="book" size={24} color={genre?.color || colors.primary} />
                  <Text style={[styles.scriptureReference, { color: genre?.color || colors.primary }]}>
                    {meditation.scriptureReferences[0].book} {meditation.scriptureReferences[0].chapter}:
                    {meditation.scriptureReferences[0].verseStart}
                    {meditation.scriptureReferences[0].verseEnd && 
                      `-${meditation.scriptureReferences[0].verseEnd}`}
                  </Text>
                </View>
                <Text style={styles.scriptureText}>
                  "{meditation.scriptureReferences[0].text}"
                </Text>
                <Text style={styles.scriptureTranslation}>
                  — {meditation.scriptureReferences[0].translation}
                </Text>
              </View>
            )}

            <View style={styles.readyContainer}>
              <Text style={styles.readyTitle}>You are prepared</Text>
              <Text style={styles.readyText}>
                Take a deep breath and let God's peace fill your heart as we begin this meditation together.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  if (!meditation || !genre) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: genre.color + '05' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prepare for Meditation</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${(currentStep / totalSteps) * 100}%`,
                backgroundColor: genre.color 
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{currentStep} of {totalSteps}</Text>
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderStep()}
        </ScrollView>
      </Animated.View>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: genre.color },
            !canProceed() && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Begin Meditation' : 'Continue'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContent: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  stepSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  meditationInfo: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  genreIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  meditationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  meditationSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  meditationDuration: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  preparationTips: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  moodCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: '45%',
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedMoodCard: {
    backgroundColor: colors.primary,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginTop: 8,
  },
  selectedMoodLabel: {
    color: colors.surface,
  },
  comfortingMessage: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  comfortingText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  intentionsContainer: {
    maxHeight: 400,
  },
  intentionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedIntentionCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  intentionText: {
    flex: 1,
    marginLeft: 16,
  },
  intentionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  selectedIntentionLabel: {
    color: colors.surface,
  },
  intentionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedIntentionDescription: {
    color: colors.surface,
    opacity: 0.9,
  },
  scriptureContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: 32,
  },
  scriptureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scriptureReference: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  scriptureText: {
    fontSize: 18,
    color: colors.text,
    lineHeight: 28,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  scriptureTranslation: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  readyContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  readyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  readyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
    marginRight: 8,
  },
});