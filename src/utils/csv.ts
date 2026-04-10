import { Transaction, TransactionType } from '../types';
import { fromBaseUnit } from './moneyUtils';
import { normalizeCategory } from './categoryUtils';

export const generateCSV = (transactions: Transaction[]): string => {
  const headers = ['Date', 'Amount', 'Category', 'Type', 'Description'];
  const rows = transactions.map((t) => [
    t.date.toISOString().split('T')[0],
    fromBaseUnit(t.amount).toString(),
    t.category, // Stored as normalized lowercase
    t.type,
    t.description.replace(/,/g, ' '), // Basic CSV escaping for description
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
};

export interface CSVParseResult {
  data: Omit<Transaction, 'id' | 'createdAt'>[];
  errors: string[];
}

export const parseCSV = (csvContent: string, userId: string): CSVParseResult => {
  const lines = csvContent.split(/\r?\n/).filter((line) => line.trim() !== '');
  if (lines.length < 2) return { data: [], errors: ['File is empty or missing headers'] };

  const [headerLine, ...dataLines] = lines;
  const headers = headerLine.split(',').map((h) => h.trim().toLowerCase());
  
  const dateIdx = headers.indexOf('date');
  const amountIdx = headers.indexOf('amount');
  const categoryIdx = headers.indexOf('category');
  const typeIdx = headers.indexOf('type');
  const descIdx = headers.indexOf('description');

  if (dateIdx === -1 || amountIdx === -1 || categoryIdx === -1 || typeIdx === -1) {
    return { data: [], errors: ['Missing required headers: Date, Amount, Category, or Type'] };
  }

  const results: Omit<Transaction, 'id' | 'createdAt'>[] = [];
  const errors: string[] = [];

  dataLines.forEach((line, i) => {
    const values = line.split(',').map((v) => v.trim());
    const dateStr = values[dateIdx];
    const amountStr = values[amountIdx];
    const category = values[categoryIdx];
    const typeStr = values[typeIdx]?.toLowerCase();
    const description = descIdx !== -1 ? values[descIdx] : '';

    const date = new Date(dateStr);
    
    // Parse amount as float (human-readable). The TransactionsContext will handle base-unit conversion.
    const amount = parseFloat(amountStr);

    if (isNaN(date.getTime())) {
      errors.push(`Row ${i + 2}: Invalid date format ('${dateStr}')`);
      return;
    }
    if (isNaN(amount) || (amount === 0 && amountStr !== '0')) {
      errors.push(`Row ${i + 2}: Invalid amount ('${amountStr}')`);
      return;
    }
    if (typeStr !== 'income' && typeStr !== 'expense') {
      errors.push(`Row ${i + 2}: Invalid type ('${typeStr}'). Must be 'income' or 'expense'`);
      return;
    }
    if (!category) {
      errors.push(`Row ${i + 2}: Missing category`);
      return;
    }

    results.push({
      date,
      amount, // Stored as integer
      category: normalizeCategory(category),
      type: typeStr as TransactionType,
      description: description || (typeStr === 'income' ? 'Capital Addition' : 'General Expense'),
      userId,
    });
  });

  return { data: results, errors };
};
