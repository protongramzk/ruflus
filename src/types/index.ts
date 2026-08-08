export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  type: TransactionType;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string; // e.g., 'default'
  note: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  note: string;
  createdAt: string; // ISO String
}

export interface SavingHistory {
  id: string;
  goalId: string;
  amount: number;
  note: string;
  createdAt: string; // ISO String
}

export interface SplitGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string; // ISO String
}

export interface SplitMember {
  id: string;
  groupId: string;
  name: string;
}

export interface SplitExpense {
  id: string;
  groupId: string;
  payerId: string; // SplitMember id
  title: string;
  amount: number;
  createdAt: string; // ISO String
}

export interface SplitShare {
  id: string;
  expenseId: string;
  memberId: string; // SplitMember id
  amount: number;
  settled: boolean;
}

export type BillRepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  repeat: BillRepeatType;
  paid: boolean;
  note: string;
}

export interface AppProfile {
  name: string;
  currency: string; // e.g. 'Rp' or '$'
  language?: 'id' | 'ms' | 'ja' | 'zh';
  theme?: string;
  darkMode?: boolean;
  density?: 'compact' | 'default' | 'comfortable';
  radius?: 'sharp' | 'small' | 'medium' | 'large' | 'pill';
}
