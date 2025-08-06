import { Meditation } from '../../types/content';
import { GeneratedAudio } from '../voiceGeneration/browserVoiceService';

interface CachedAudio {
  id: string;
  meditationId: string;
  audioBlob: Blob;
  url: string;
  duration: number;
  voiceUsed: string;
  generatedAt: Date;
  lastAccessed: Date;
}

export class AudioCacheService {
  private dbName = 'MeditationAudioCache';
  private dbVersion = 1;
  private storeName = 'audioFiles';
  private db: IDBDatabase | null = null;
  private memoryCache: Map<string, CachedAudio> = new Map();

  constructor() {
    this.initializeDB();
  }

  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Failed to open IndexedDB');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Audio cache database initialized');
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('meditationId', 'meditationId', { unique: false });
          store.createIndex('generatedAt', 'generatedAt', { unique: false });
        }
      };
    });
  }

  public async cacheAudio(
    meditationId: string, 
    generatedAudio: GeneratedAudio
  ): Promise<string> {
    
    const cachedAudio: CachedAudio = {
      id: `meditation_${meditationId}_${Date.now()}`,
      meditationId,
      audioBlob: generatedAudio.blob,
      url: generatedAudio.url,
      duration: generatedAudio.duration,
      voiceUsed: generatedAudio.voiceUsed,
      generatedAt: new Date(),
      lastAccessed: new Date()
    };

    // Store in memory cache for quick access
    this.memoryCache.set(meditationId, cachedAudio);

    // Store in IndexedDB for persistence
    try {
      await this.storeInIndexedDB(cachedAudio);
      console.log(`Cached audio for meditation ${meditationId}`);
    } catch (error) {
      console.error('Failed to cache audio in IndexedDB:', error);
    }

    return cachedAudio.url;
  }

  public async getCachedAudio(meditationId: string): Promise<string | null> {
    // Check memory cache first
    if (this.memoryCache.has(meditationId)) {
      const cached = this.memoryCache.get(meditationId)!;
      cached.lastAccessed = new Date();
      return cached.url;
    }

    // Check IndexedDB
    try {
      const cached = await this.getFromIndexedDB(meditationId);
      if (cached) {
        // Recreate blob URL (they don't persist between sessions)
        const newUrl = URL.createObjectURL(cached.audioBlob);
        cached.url = newUrl;
        cached.lastAccessed = new Date();
        
        // Update memory cache
        this.memoryCache.set(meditationId, cached);
        
        // Update IndexedDB with new access time
        await this.storeInIndexedDB(cached);
        
        return newUrl;
      }
    } catch (error) {
      console.error('Failed to retrieve cached audio:', error);
    }

    return null;
  }

  public async hasCachedAudio(meditationId: string): Promise<boolean> {
    return this.memoryCache.has(meditationId) || (await this.getFromIndexedDB(meditationId)) !== null;
  }

  private async storeInIndexedDB(cachedAudio: CachedAudio): Promise<void> {
    if (!this.db) await this.initializeDB();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(cachedAudio);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getFromIndexedDB(meditationId: string): Promise<CachedAudio | null> {
    if (!this.db) await this.initializeDB();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('meditationId');
      const request = index.get(meditationId);

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async clearCache(): Promise<void> {
    // Clear memory cache
    this.memoryCache.clear();

    // Clear IndexedDB
    if (!this.db) await this.initializeDB();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('Audio cache cleared');
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async getCacheSize(): Promise<number> {
    let totalSize = 0;

    // Add memory cache size
    this.memoryCache.forEach(cached => {
      totalSize += cached.audioBlob.size;
    });

    return totalSize;
  }

  public async cleanupOldCache(maxAgeInDays: number = 7): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAgeInDays);

    // Clean memory cache
    for (const [key, cached] of this.memoryCache.entries()) {
      if (cached.lastAccessed < cutoffDate) {
        URL.revokeObjectURL(cached.url);
        this.memoryCache.delete(key);
      }
    }

    // Clean IndexedDB
    if (!this.db) await this.initializeDB();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('generatedAt');
      const range = IDBKeyRange.upperBound(cutoffDate);
      
      const request = index.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          console.log('Old cache entries cleaned up');
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const audioCacheService = new AudioCacheService();