import { Category, User } from '../types';
import { indexedDbService } from '../services/indexedDb';
import { normalizeCategory } from './categoryUtils';

export const defaultCategories: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Revenue', type: 'income', color: '#10b981', icon: 'Briefcase' },
  { name: 'Investment', type: 'income', color: '#3b82f6', icon: 'TrendingUp' },
  { name: 'Interest', type: 'income', color: '#8b5cf6', icon: 'Percent' },
  { name: 'Service Fees', type: 'income', color: '#f59e0b', icon: 'Settings' },
  { name: 'Other Income', type: 'income', color: '#6366f1', icon: 'MoreHorizontal' },

  { name: 'Salaries', type: 'expense', color: '#ef4444', icon: 'Users' },
  { name: 'Rent/Lease', type: 'expense', color: '#f97316', icon: 'Home' },
  { name: 'Utilities', type: 'expense', color: '#ec4899', icon: 'Zap' },
  { name: 'Marketing', type: 'expense', color: '#a855f7', icon: 'Megaphone' },
  { name: 'Software/Tools', type: 'expense', color: '#14b8a6', icon: 'Laptop' },
];

export const createDefaultUser = (): User => ({
  id: 'default-user',
  email: 'user@financedashboard.local',
  role: 'admin',
  currency: 'INR',
  createdAt: new Date(),
});

export const createViewerUser = (): User => ({
  id: 'viewer-user',
  email: 'viewer@financedashboard.local',
  role: 'viewer',
  currency: 'INR',
  createdAt: new Date(),
});

export const seedDefaultCategories = async (): Promise<void> => {
  const existingCategories = await indexedDbService.getAllCategories();
  const hasBusinessCategories = existingCategories.some(c => c.name === 'Revenue');

  if (hasBusinessCategories) {
    return;
  }

  // Clear all existing categories for a clean start with new normalized IDs
  const idsCat = existingCategories.map(c => c.id);
  for (const id of idsCat) {
    await indexedDbService.deleteCategory(id);
  }

  const categoriesToAdd: Category[] = defaultCategories.map((cat) => ({
    ...cat,
    id: normalizeCategory(cat.name),
    createdAt: new Date(),
  }));

  for (const category of categoriesToAdd) {
    await indexedDbService.addCategory(category);
  }
};

export const seedDefaultUsers = async (): Promise<void> => {
  const existingUsers = await indexedDbService.getAllUsers();

  if (existingUsers.length > 0) {
    return;
  }

  await indexedDbService.addUser(createDefaultUser());
  await indexedDbService.addUser(createViewerUser());
};

let initPromise: Promise<void> | null = null;

export const initializeDatabase = async (): Promise<void> => {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await indexedDbService.init();
      await seedDefaultCategories();
      await seedDefaultUsers();

      // Migration: Ensure existing users are converted to INR
      const users = await indexedDbService.getAllUsers();
      for (const user of users) {
        if (user.currency === 'USD') {
          await indexedDbService.updateUser({ ...user, currency: 'INR' });
        }
      }
    } catch (err) {
      initPromise = null; // Allow retry on failure
      throw err;
    }
  })();

  return initPromise;
};
