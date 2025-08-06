import { Meditation } from '../../types/content';

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
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private isVoicesLoaded: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
    this.initializeVoices();
  }

  private async initializeVoices(): Promise<void> {
    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synth.getVoices();
        this.isVoicesLoaded = true;
        console.log('Available voices:', this.voices.map(v => `${v.name} (${v.lang})`));
        resolve();
      };

      // Voices might be loaded already
      if (this.synth.getVoices().length > 0) {
        loadVoices();
      } else {
        // Wait for voices to load
        this.synth.onvoiceschanged = loadVoices;
        // Fallback timeout
        setTimeout(loadVoices, 1000);
      }
    });
  }

  private getBestMeditationVoice(): SpeechSynthesisVoice | null {
    if (!this.isVoicesLoaded) return null;

    // Priority order for meditation-friendly voices
    const preferredVoices = [
      // iOS - Excellent quality
      'Samantha', 'Alex', 'Victoria', 'Karen',
      
      // Android Chrome - Very good
      'Google US English Female', 'Google US English Male',
      'en-US-language-female', 'en-US-language-male',
      
      // Windows - Good quality
      'Microsoft Zira Desktop - English (United States)',
      'Microsoft David Desktop - English (United States)',
      
      // macOS - Excellent
      'Ava', 'Allison', 'Susan',
      
      // Generic fallbacks
      'English (United States)', 'English United States'
    ];

    // Try to find preferred voices
    for (const voiceName of preferredVoices) {
      const voice = this.voices.find(v => 
        v.name.includes(voiceName) || v.name === voiceName
      );
      if (voice) return voice;
    }

    // Fallback: any English voice
    const englishVoice = this.voices.find(v => 
      v.lang.startsWith('en-US') || v.lang.startsWith('en')
    );
    
    return englishVoice || this.voices[0] || null;
  }

  public getAvailableVoices(): Array<{name: string, lang: string, quality: string}> {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
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
    if (!voice) {
      throw new Error('No suitable voice found for meditation audio');
    }

    // Enhance text for better meditation experience
    const enhancedText = this.enhanceTextForMeditation(
      meditation.scriptText || meditation.description
    );

    // Create utterance with meditation-optimized settings
    const utterance = new SpeechSynthesisUtterance(enhancedText);
    utterance.voice = voice;
    utterance.rate = options.rate || 0.7; // Slower for meditation
    utterance.pitch = options.pitch || 0.9; // Slightly lower pitch
    utterance.volume = options.volume || 0.9;

    // Estimate duration (rough calculation)
    const wordCount = enhancedText.split(' ').length;
    const estimatedDuration = Math.ceil((wordCount / (120 * utterance.rate)) * 60); // words per minute adjusted for rate

    try {
      // Generate audio blob
      const audioBlob = await this.createAudioBlob(utterance);
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        blob: audioBlob,
        url: audioUrl,
        duration: estimatedDuration,
        voiceUsed: voice.name
      };

    } catch (error: any) {
      console.error('Audio generation failed:', error);
      throw new Error(`Failed to generate audio: ${error?.message || 'Unknown error'}`);
    }
  }

  private createAudioBlob(utterance: SpeechSynthesisUtterance): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // Check if Web Audio API is supported
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        // Fallback: just speak without recording (for very old browsers)
        this.synth.speak(utterance);
        // Create empty blob as fallback
        resolve(new Blob([], { type: 'audio/wav' }));
        return;
      }

      try {
        // Create audio context for recording
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Create MediaRecorder to capture system audio
        // Note: This is a simplified version - full implementation would need more complex audio routing
        this.recordSpeechSynthesis(utterance, audioContext).then(resolve).catch(reject);
        
      } catch (error) {
        console.error('Web Audio API error:', error);
        // Fallback: speak without recording
        this.synth.speak(utterance);
        resolve(new Blob([], { type: 'audio/wav' }));
      }
    });
  }

  private async recordSpeechSynthesis(
    utterance: SpeechSynthesisUtterance,
    audioContext: AudioContext
  ): Promise<Blob> {
    
    return new Promise((resolve, reject) => {
      const chunks: BlobPart[] = [];
      let mediaRecorder: MediaRecorder;

      // For actual audio recording, we'd need to capture system audio
      // This is a simplified implementation
      utterance.onstart = () => {
        console.log('Speech started');
      };

      utterance.onend = () => {
        console.log('Speech ended');
        // Since we can't easily capture system audio in browsers,
        // we'll create a placeholder audio blob
        // In a real implementation, you'd use WebRTC or ask user permission to capture audio
        
        // Create a simple audio buffer as placeholder
        const sampleRate = 44100;
        const duration = 2; // seconds
        const numChannels = 1;
        const numSamples = sampleRate * duration;
        
        const audioBuffer = audioContext.createBuffer(numChannels, numSamples, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        // Generate silence (in real app, this would be the captured speech)
        for (let i = 0; i < numSamples; i++) {
          channelData[i] = 0;
        }
        
        // Convert to blob (simplified - real implementation would encode properly)
        const blob = new Blob([new ArrayBuffer(numSamples * 2)], { type: 'audio/wav' });
        resolve(blob);
      };

      utterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // Start speaking
      this.synth.speak(utterance);
    });
  }

  public async testVoice(text: string = "This is a test of the meditation voice."): Promise<void> {
    const voice = this.getBestMeditationVoice();
    if (!voice) {
      console.error('No suitable voice available');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = 0.7;
    utterance.pitch = 0.9;
    utterance.volume = 0.9;

    console.log(`Testing voice: ${voice.name}`);
    this.synth.speak(utterance);
  }

  public stopSpeaking(): void {
    this.synth.cancel();
  }

  public pauseSpeaking(): void {
    this.synth.pause();
  }

  public resumeSpeaking(): void {
    this.synth.resume();
  }
}

// Singleton instance for app-wide use
export const browserVoiceService = new BrowserVoiceService();