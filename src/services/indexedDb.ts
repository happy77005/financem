import { Transaction, Category, User, FilterOptions, TransactionType } from '../types';
import { normalizeCategory } from '../utils/categoryUtils';
import { toBaseUnit } from '../utils/moneyUtils';

const DB_NAME = 'FinanceDashboard';
const DB_VERSION = 2;
const STORES = {
  transactions: 'transactions',
  categories: 'categories',
  users: 'users',
};

export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.db) return Promise.resolve();
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        this.initPromise = null;
        reject(request.error);
      };

      request.onsuccess = async () => {
        this.db = request.result;
        try {
          await this.migrateData();
          resolve();
        } catch (err) {
          this.initPromise = null;
          reject(err);
        }
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORES.transactions)) {
          const transStore = db.createObjectStore(STORES.transactions, { keyPath: 'id' });
          transStore.createIndex('userId', 'userId', { unique: false });
          transStore.createIndex('date', 'date', { unique: false });
          transStore.createIndex('category', 'category', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.categories)) {
          db.createObjectStore(STORES.categories, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.users)) {
          db.createObjectStore(STORES.users, { keyPath: 'id' });
        }
      };
    });

    return this.initPromise;
  }

  async addTransaction(transaction: Transaction): Promise<string> {
    const normalized = {
      ...transaction,
      category: normalizeCategory(transaction.category),
    };
    return this.addRecord(STORES.transactions, normalized);
  }

  async updateTransaction(transaction: Transaction): Promise<void> {
    const normalized = {
      ...transaction,
      category: normalizeCategory(transaction.category),
    };
    return this.updateRecord(STORES.transactions, normalized);
  }

  async deleteTransaction(id: string): Promise<void> {
    return this.deleteRecord(STORES.transactions, id);
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.getRecord(STORES.transactions, id);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.getAllRecords(STORES.transactions);
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return this.getRecordsByIndex(STORES.transactions, 'userId', userId);
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([STORES.transactions], 'readonly');
      const store = transaction.objectStore(STORES.transactions);
      const index = store.index('date');
      const range = IDBKeyRange.bound(startDate.getTime(), endDate.getTime());
      const request = index.getAll(range);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async addCategory(category: Category): Promise<string> {
    const normalized = {
      ...category,
      id: normalizeCategory(category.id), // Categories use normalized ID
      name: category.name, // Keep display name as provided
    };
    return this.addRecord(STORES.categories, normalized);
  }

  async updateCategory(category: Category): Promise<void> {
    const normalized = {
      ...category,
      id: normalizeCategory(category.id),
    };
    return this.updateRecord(STORES.categories, normalized);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.deleteRecord(STORES.categories, normalizeCategory(id));
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.getRecord(STORES.categories, normalizeCategory(id));
  }

  async getAllCategories(): Promise<Category[]> {
    return this.getAllRecords(STORES.categories);
  }

  async addUser(user: User): Promise<string> {
    return this.addRecord(STORES.users, user);
  }

  async updateUser(user: User): Promise<void> {
    return this.updateRecord(STORES.users, user);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.getRecord(STORES.users, id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.getAllRecords(STORES.users);
  }

  async getTransactionsByCategory(category: string): Promise<Transaction[]> {
    return this.getRecordsByIndex(STORES.transactions, 'category', normalizeCategory(category));
  }

  async getTransactionsByType(userId: string, type: TransactionType): Promise<Transaction[]> {
    const allTransactions = await this.getTransactionsByUser(userId);
    return allTransactions.filter((t) => t.type === type);
  }

  async filterTransactions(userId: string, filters: FilterOptions): Promise<Transaction[]> {
    let transactions = await this.getTransactionsByUser(userId);

    if (filters.startDate && filters.endDate) {
      transactions = transactions.filter(
        (t) => t.date >= filters.startDate! && t.date <= filters.endDate!
      );
    }

    if (filters.category) {
      const normalizedCat = normalizeCategory(filters.category);
      transactions = transactions.filter((t) => normalizeCategory(t.category) === normalizedCat);
    }

    if (filters.type) {
      transactions = transactions.filter((t) => t.type === filters.type);
    }

    if (filters.minAmount !== undefined) {
      // filters.minAmount is expected as integer (paise) from the UI if standardizing
      // but for robustness we check if we need to convert. 
      // Assuming UI sends what's expected in the plan (Paise)
      transactions = transactions.filter((t) => t.amount >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      transactions = transactions.filter((t) => t.amount <= filters.maxAmount!);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      transactions = transactions.filter((t) =>
        t.description.toLowerCase().includes(searchLower)
      );
    }

    return transactions;
  }

  async deleteTransactionsByIds(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.deleteTransaction(id);
    }
  }

  async getCategoriesByType(type: TransactionType): Promise<Category[]> {
    const allCategories = await this.getAllCategories();
    return allCategories.filter((c) => c.type === type);
  }

  async clearAll(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const transaction = this.db.transaction(
      [STORES.transactions, STORES.categories, STORES.users],
      'readwrite'
    );

    return new Promise((resolve, reject) => {
      transaction.objectStore(STORES.transactions).clear();
      transaction.objectStore(STORES.categories).clear();
      transaction.objectStore(STORES.users).clear();

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

  private async migrateData(): Promise<void> {
    if (!this.db) return;

    // We check and migrate only if needed.
    const allTransactions = await this.getAllTransactions();
    const allCategories = await this.getAllCategories();
    
    // If the DB is fresh, no migration needed
    if (allTransactions.length === 0 && allCategories.length === 0) return;

    // Heuristic: If we find any decimal amounts, it's definitely v1 data.
    // If it's all integers but we haven't set a 'migration_v2' flag, we might still check.
    const hasDecimals = allTransactions.some(t => !Number.isInteger(t.amount)); 
    
    // Normalize categories to check if any aren't lowercase
    const needsCatNormalization = allCategories.some(c => c.id !== normalizeCategory(c.id));

    if (!hasDecimals && !needsCatNormalization) return;

    const tx = this.db.transaction([STORES.transactions, STORES.categories], 'readwrite');
    const transStore = tx.objectStore(STORES.transactions);
    const catStore = tx.objectStore(STORES.categories);

    // 1. Migrate Transactions (Amount -> Integer, Category -> Lowercase)
    allTransactions.forEach(t => {
      const updated = {
        ...t,
        amount: Number.isInteger(t.amount) ? t.amount : toBaseUnit(t.amount),
        category: normalizeCategory(t.category),
      };
      transStore.put(updated);
    });

    // 2. Migrate Categories (ID -> Lowercase)
    allCategories.forEach(c => {
      const normalizedId = normalizeCategory(c.id);
      if (normalizedId !== c.id) {
        catStore.delete(c.id);
        catStore.put({ ...c, id: normalizedId });
      }
    });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private addRecord<T extends { id: string }>(storeName: string, record: T): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(record);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as string);
    });
  }

  private updateRecord<T extends { id: string }>(storeName: string, record: T): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(record);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private deleteRecord(storeName: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private getRecord<T>(storeName: string, id: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private getAllRecords<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private getRecordsByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

export const indexedDbService = new IndexedDBService();
