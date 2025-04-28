
/**
 * Database service using IndexedDB for persistent client-side storage
 */

// Database configuration
const DB_NAME = 'prawnFarmDB';
const DB_VERSION = 1;
const STORES = {
  POND_FEEDING: 'pondFeedingRecords'
};

// Interface for database operations
interface DatabaseService {
  initialize(): Promise<boolean>;
  getAll<T>(storeName: string): Promise<T[]>;
  add<T>(storeName: string, item: T): Promise<T>;
  delete(storeName: string, id: string | number): Promise<void>;
  clear(storeName: string): Promise<void>;
}

/**
 * Initialize the database and create object stores
 */
const initializeDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Database error:', request.error);
      reject(request.error);
    };
    
    request.onsuccess = (event) => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create the pond feeding records store with an index on id
      if (!db.objectStoreNames.contains(STORES.POND_FEEDING)) {
        const store = db.createObjectStore(STORES.POND_FEEDING, { keyPath: 'id' });
        store.createIndex('pondName', 'pondName', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

let dbInstance: IDBDatabase | null = null;

/**
 * Get database instance
 */
const getDB = async (): Promise<IDBDatabase> => {
  if (!dbInstance) {
    dbInstance = await initializeDatabase();
  }
  return dbInstance;
};

/**
 * Implementation of the database service
 */
export const databaseService: DatabaseService = {
  /**
   * Initialize the database
   */
  async initialize(): Promise<boolean> {
    try {
      await getDB();
      return true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      return false;
    }
  },
  
  /**
   * Get all items from a store
   */
  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  /**
   * Add an item to a store
   */
  async add<T>(storeName: string, item: T): Promise<T> {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      
      request.onsuccess = () => {
        resolve(item);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  /**
   * Delete an item from a store
   */
  async delete(storeName: string, id: string | number): Promise<void> {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  
  /**
   * Clear all items from a store
   */
  async clear(storeName: string): Promise<void> {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
};

