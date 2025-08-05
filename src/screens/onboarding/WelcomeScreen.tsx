import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="book" size={80} color={colors.primary} />
        </View>
        
        <Text style={styles.title}>Welcome to Bible Meditation</Text>
        <Text style={styles.subtitle}>
          Deepen your spiritual journey with guided meditations and reflections on God's Word
        </Text>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="headset" size={24} color={colors.secondary} />
            <Text style={styles.featureText}>Audio Meditations</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="heart" size={24} color={colors.secondary} />
            <Text style={styles.featureText}>Favorites & Bookmarks</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="trending-up" size={24} color={colors.secondary} />
            <Text style={styles.featureText}>Track Your Progress</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={onGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
        <Ionicons name="arrow-forward" size={20} color={colors.surface} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  features: {
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  button: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    margin: 32,
    gap: 8,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '600',
  },
});