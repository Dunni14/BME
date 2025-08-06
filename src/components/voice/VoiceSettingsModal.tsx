import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { loadAvailableVoices } from '../../store/slices/contentSlice';
import { browserVoiceService } from '../../services/voiceGeneration/browserVoiceService';
import { colors } from '../../styles/colors';

interface VoiceSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { availableVoices } = useSelector((state: RootState) => state.content.audio);
  
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [speechVolume, setSpeechVolume] = useState(0.9);

  useEffect(() => {
    if (visible && availableVoices.length === 0) {
      dispatch(loadAvailableVoices());
    }
  }, [visible, dispatch, availableVoices.length]);

  const handleTestVoice = (voiceName?: string) => {
    const testText = "Welcome to your meditation. Find a comfortable position and take a deep breath. Let God's peace fill your heart as we begin this journey together.";
    
    // Use specific voice if provided, or test with current volume
    if (voiceName) {
      // Find the specific voice and test it
      const voice = availableVoices.find(v => v.name === voiceName);
      if (voice) {
        browserVoiceService.testVoiceWithOptions(testText, {
          voiceName: voice.name,
          rate: 0.7, // Fixed meditation pace
          pitch: 0.9, // Fixed comfortable pitch
          volume: speechVolume
        });
      }
    } else {
      // Test with current settings
      browserVoiceService.testVoiceWithOptions(testText, {
        voiceName: selectedVoice,
        rate: 0.7,
        pitch: 0.9,
        volume: speechVolume
      });
    }
  };

  const handleSaveSettings = () => {
    // Save settings to AsyncStorage or Redux
    const settings = {
      selectedVoice,
      speechVolume,
    };
    
    // You can dispatch an action to save these settings
    Alert.alert('Settings Saved', 'Your voice preferences have been saved.');
    onClose();
  };

  const renderVoiceItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.voiceItem,
        selectedVoice === item.name && styles.selectedVoiceItem,
      ]}
      onPress={() => setSelectedVoice(item.name)}
    >
      <View style={styles.voiceInfo}>
        <Text style={styles.voiceName}>{item.name}</Text>
        <Text style={styles.voiceDetails}>
          {item.lang} • {item.quality} Quality
        </Text>
      </View>
      <TouchableOpacity
        style={styles.testButton}
        onPress={() => handleTestVoice(item.name)}
      >
        <Ionicons name="play" size={16} color={colors.surface} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const VolumeSlider = () => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>
        Volume: {Math.round(speechVolume * 100)}%
      </Text>
      <View style={styles.sliderTrack}>
        <TouchableOpacity
          style={styles.sliderButton}
          onPress={() => setSpeechVolume(Math.max(0.1, speechVolume - 0.1))}
        >
          <Ionicons name="remove" size={16} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.sliderFill}>
          <View 
            style={[
              styles.sliderThumb, 
              { left: `${((speechVolume - 0.1) / 0.9) * 100}%` }
            ]} 
          />
        </View>
        <TouchableOpacity
          style={styles.sliderButton}
          onPress={() => setSpeechVolume(Math.min(1.0, speechVolume + 0.1))}
        >
          <Ionicons name="add" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Voice Settings</Text>
          <TouchableOpacity onPress={handleSaveSettings} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Voice Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Voice</Text>
            <FlatList
              data={availableVoices}
              renderItem={renderVoiceItem}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              style={styles.voiceList}
              showsVerticalScrollIndicator={true}
            />
          </View>

          {/* Volume Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Volume</Text>
            <VolumeSlider />
          </View>

          {/* Test Section */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.testAllButton}
              onPress={() => handleTestVoice()}
            >
              <Ionicons name="volume-high" size={20} color="white" />
              <Text style={styles.testAllButtonText}>
                Test Current Settings
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 16,
  },
  voiceList: {
    maxHeight: 250,
  },
  voiceItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  selectedVoiceItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
  },
  voiceDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  testButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: colors.primary,
    minWidth: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
    marginBottom: 8,
  },
  sliderTrack: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  sliderButton: {
    padding: 8,
    backgroundColor: colors.primary + '20',
    borderRadius: 16,
  },
  sliderFill: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    position: 'relative' as const,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    position: 'absolute' as const,
    top: -8,
    marginLeft: -10,
  },
  sliderHint: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic' as const,
    marginTop: 4,
  },
  testAllButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
  },
  testAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
};