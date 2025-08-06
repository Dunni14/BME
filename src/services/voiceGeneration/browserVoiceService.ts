import { Meditation } from '../../types/content';
import * as Speech from 'expo-speech';

export interface VoiceOptions {
  rate?: number; // 0.1 to 10, default 1
  pitch?: number; // 0 to 2, default 1
  volume?: number; // 0 to 1, default 1
  voiceName?: string;
}

export interface GeneratedAudio {
  blob: Blob;
  url: string;
  duration: number; // estimated duration in seconds
  voiceUsed: string;
}

export class BrowserVoiceService {
  private voices: Speech.Voice[] = [];
  private isVoicesLoaded: boolean = false;
  private currentUtterance: string | null = null;

  constructor() {
    this.initializeVoices();
  }

  private async initializeVoices(): Promise<void> {
    try {
      this.voices = await Speech.getAvailableVoicesAsync();
      this.isVoicesLoaded = true;
      console.log('Available voices:', this.voices.map(v => `${v.name} (${v.language})`));
    } catch (error) {
      console.error('Failed to load voices:', error);
      this.isVoicesLoaded = true; // Still allow service to work with default voice
    }
  }

  private getBestMeditationVoice(): Speech.Voice | null {
    if (!this.isVoicesLoaded || this.voices.length === 0) return null;

    // Priority order for meditation-friendly voices
    const preferredVoices = [
      // iOS - Excellent quality
      'Samantha', 'Alex', 'Victoria', 'Karen',
      
      // Android - Very good
      'en-us-x-sfg#female_1-local', 'en-us-x-sfg#male_1-local',
      'en-US-language', 'English',
      
      // Generic fallbacks
      'com.apple.ttsbundle.Samantha-compact',
      'com.apple.ttsbundle.siri_female_en-US_compact'
    ];

    // Try to find preferred voices
    for (const voiceName of preferredVoices) {
      const voice = this.voices.find(v => 
        v.name.includes(voiceName) || v.name === voiceName || v.identifier.includes(voiceName)
      );
      if (voice) return voice;
    }

    // Fallback: any English voice
    const englishVoice = this.voices.find(v => 
      v.language.startsWith('en-US') || v.language.startsWith('en')
    );
    
    return englishVoice || this.voices[0] || null;
  }

  public getAvailableVoices(): Array<{name: string, lang: string, quality: string}> {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.language,
      quality: this.getVoiceQuality(voice.name)
    }));
  }

  private getVoiceQuality(voiceName: string): string {
    if (voiceName.includes('Samantha') || voiceName.includes('Alex') || 
        voiceName.includes('Google')) return 'High';
    if (voiceName.includes('Microsoft') || voiceName.includes('Ava')) return 'Medium';
    return 'Basic';
  }

  private enhanceTextForMeditation(text: string): string {
    return text
      // Add natural pauses
      .replace(/\.\s/g, '. <break time="2s"/> ')
      .replace(/\?\s/g, '? <break time="2s"/> ')
      .replace(/!\s/g, '! <break time="2s"/> ')
      .replace(/,\s/g, ', <break time="0.8s"/> ')
      .replace(/:\s/g, ': <break time="1.5s"/> ')
      .replace(/;\s/g, '; <break time="1.2s"/> ')
      
      // Special meditation phrases
      .replace(/let us pray/gi, '<break time="3s"/> Let us pray. <break time="3s"/> ')
      .replace(/amen/gi, '<break time="1.5s"/> Amen. <break time="2s"/> ')
      .replace(/scripture says/gi, '<break time="2s"/> Scripture says: <break time="1.5s"/> ')
      .replace(/breathe/gi, '<break time="1s"/> breathe <break time="2s"/> ')
      
      // Paragraph breaks
      .replace(/\n\s*\n/g, ' <break time="3s"/> ')
      .replace(/\n/g, ' <break time="1.5s"/> ')
      
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  public async generateMeditationAudio(
    meditation: Meditation, 
    options: VoiceOptions = {}
  ): Promise<GeneratedAudio> {
    
    // Ensure voices are loaded
    if (!this.isVoicesLoaded) {
      await this.initializeVoices();
    }

    const voice = this.getBestMeditationVoice();
    const voiceName = voice?.name || 'Default';

    // Get text for meditation
    const text = meditation.scriptText || meditation.description;
    if (!text) {
      throw new Error('No text available for meditation');
    }

    // Clean text for speech (remove markdown-style formatting)
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown  
      .replace(/\n\s*\n/g, '\n\n') // Normalize paragraph breaks
      .trim();

    // Estimate duration (rough calculation)
    const wordCount = cleanText.split(' ').length;
    const speechRate = options.rate || 0.7;
    const estimatedDuration = Math.ceil((wordCount / (120 * speechRate)) * 60); // words per minute adjusted for rate

    try {
      // Store current utterance for pause/resume functionality
      this.currentUtterance = cleanText;

      // Start speaking with Expo Speech
      await Speech.speak(cleanText, {
        voice: voice?.identifier,
        rate: speechRate,
        pitch: options.pitch || 0.9,
        volume: options.volume || 0.9,
      });

      // Create a simple blob for compatibility (though not used in RN)
      const blob = new Blob([cleanText], { type: 'text/plain' });
      
      return {
        blob,
        url: '', // Not applicable in React Native
        duration: estimatedDuration,
        voiceUsed: voiceName
      };

    } catch (error: any) {
      console.error('Audio generation failed:', error);
      throw new Error(`Failed to generate audio: ${error?.message || 'Unknown error'}`);
    }
  }


  public async testVoice(text: string = "This is a test of the meditation voice."): Promise<void> {
    const voice = this.getBestMeditationVoice();
    const voiceName = voice?.name || 'Default';

    try {
      console.log(`Testing voice: ${voiceName}`);
      await Speech.speak(text, {
        voice: voice?.identifier,
        rate: 0.7,
        pitch: 0.9,
        volume: 0.9,
      });
    } catch (error) {
      console.error('Voice test failed:', error);
    }
  }

  public stopSpeaking(): void {
    Speech.stop();
    this.currentUtterance = null;
  }

  public pauseSpeaking(): void {
    Speech.pause();
  }

  public resumeSpeaking(): void {
    Speech.resume();
  }
}

// Singleton instance for app-wide use
export const browserVoiceService = new BrowserVoiceService();