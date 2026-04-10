/**
 * Normalizes a category name to a lowercase, trimmed string.
 * This is the 'ID' format used for internal storage and deduplication.
 */
export const normalizeCategory = (category: string): string => {
  if (!category) return '';
  return category.trim().toLowerCase();
};

/**
 * Formats a normalized category name (lowercase) to a Title Case display name.
 * Handles slashes (Title/Case) and words correctly.
 */
export const formatCategoryDisplayName = (category: string): string => {
  if (!category) return 'Uncategorized';
  
  return category
    .split(/[\/\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(category.includes('/') ? '/' : ' ');
};

/**
 * Validates if a category string is acceptable for storage.
 */
export const isValidCategory = (category: string): boolean => {
  return typeof category === 'string' && category.trim().length > 0;
};
