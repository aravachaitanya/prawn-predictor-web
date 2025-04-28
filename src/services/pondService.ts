
import { generatePondPredictions, PondPrediction } from '@/utils/pondPredictions';
import { databaseService } from './databaseService';

// Define pond feeding record type
export interface PondFeedingRecord {
  id: string;
  pondName: string;
  pondSize: number;
  feedType: string;
  feedAmount: number;
  feedingTime: string;
  notes: string;
  date: string;
}

// Database store name for pond feeding records
const POND_FEEDING_STORE = 'pondFeedingRecords';

/**
 * PondService - Handles all pond related operations
 */
export const PondService = {
  /**
   * Initialize the pond service
   */
  initialize: async (): Promise<boolean> => {
    try {
      // Initialize the database
      await databaseService.initialize();
      
      // Migrate data from localStorage if needed
      const migrated = await PondService.migrateFromLocalStorage();
      
      return true;
    } catch (error) {
      console.error('Error initializing pond service:', error);
      return false;
    }
  },
  
  /**
   * Migrate data from localStorage to the database
   */
  migrateFromLocalStorage: async (): Promise<boolean> => {
    const POND_FEEDING_RECORDS_KEY = 'pond-feeding-records';
    const savedRecords = localStorage.getItem(POND_FEEDING_RECORDS_KEY);
    
    if (savedRecords) {
      try {
        const records: PondFeedingRecord[] = JSON.parse(savedRecords);
        
        // Only migrate if we have records and the database is empty
        const existingRecords = await databaseService.getAll<PondFeedingRecord>(POND_FEEDING_STORE);
        
        if (records.length > 0 && existingRecords.length === 0) {
          // Add each record to the database
          for (const record of records) {
            await databaseService.add(POND_FEEDING_STORE, record);
          }
          
          // Clear localStorage data after successful migration
          localStorage.removeItem(POND_FEEDING_RECORDS_KEY);
          
          return true;
        }
      } catch (error) {
        console.error('Error migrating data from localStorage:', error);
      }
    }
    
    return false;
  },

  /**
   * Get all pond feeding records from the database
   */
  getPondFeedingRecords: async (): Promise<PondFeedingRecord[]> => {
    try {
      const records = await databaseService.getAll<PondFeedingRecord>(POND_FEEDING_STORE);
      // Sort records by date (newest first)
      return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error loading pond feeding records:', error);
      return [];
    }
  },

  /**
   * Add a new pond feeding record
   */
  addPondFeedingRecord: async (record: PondFeedingRecord): Promise<PondFeedingRecord[]> => {
    try {
      await databaseService.add(POND_FEEDING_STORE, record);
      return PondService.getPondFeedingRecords();
    } catch (error) {
      console.error('Error adding pond feeding record:', error);
      return [];
    }
  },

  /**
   * Delete a pond feeding record
   */
  deletePondFeedingRecord: async (id: string): Promise<PondFeedingRecord[]> => {
    try {
      await databaseService.delete(POND_FEEDING_STORE, id);
      return PondService.getPondFeedingRecords();
    } catch (error) {
      console.error('Error deleting pond feeding record:', error);
      return [];
    }
  },

  /**
   * Generate pond predictions based on weather data
   */
  generatePondPredictions: (
    temperature: number,
    humidity: number,
    rainfall: number
  ): Record<string, PondPrediction> => {
    // Sample ponds data
    const ponds = [
      { id: '1', pondNumber: 'Pond 1', size: 2.5, feedingType: 'Standard' },
      { id: '2', pondNumber: 'Pond 2', size: 1.8, feedingType: 'Premium' },
      { id: '3', pondNumber: 'Pond 3', size: 3.2, feedingType: 'Organic' }
    ];
    
    return generatePondPredictions(temperature, humidity, rainfall, ponds);
  }
};
