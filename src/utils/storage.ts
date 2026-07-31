import {
  Category,
  Transaction,
  SavingGoal,
  SavingHistory,
  SplitGroup,
  SplitMember,
  SplitExpense,
  SplitShare,
  Bill,
  AppProfile
} from '../types';

// Storage keys
const KEYS = {
  CATEGORIES: 'ruflus_categories',
  TRANSACTIONS: 'ruflus_transactions',
  SAVING_GOALS: 'ruflus_saving_goals',
  SAVING_HISTORY: 'ruflus_saving_history',
  SPLIT_GROUPS: 'ruflus_split_groups',
  SPLIT_MEMBERS: 'ruflus_split_members',
  SPLIT_EXPENSES: 'ruflus_split_expenses',
  SPLIT_SHARES: 'ruflus_split_shares',
  BILLS: 'ruflus_bills',
  PROFILE: 'ruflus_profile'
};

// Generic read/write helpers
function getItem<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    return defaultValue;
  }
}

function setItem<T>(key: string, val: T): void {
  localStorage.setItem(key, JSON.stringify(val));
}

// Default Seed Data
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-in-gaji', name: 'Gaji', icon: 'Briefcase', type: 'income' },
  { id: 'cat-in-bonus', name: 'Bonus', icon: 'Award', type: 'income' },
  { id: 'cat-in-investasi', name: 'Investasi', icon: 'TrendingUp', type: 'income' },
  { id: 'cat-in-lain', name: 'Lain-lain (Masuk)', icon: 'PlusCircle', type: 'income' },
  { id: 'cat-ex-makan', name: 'Makanan & Minuman', icon: 'Utensils', type: 'expense' },
  { id: 'cat-ex-transport', name: 'Transportasi', icon: 'Car', type: 'expense' },
  { id: 'cat-ex-belanja', name: 'Belanja', icon: 'ShoppingBag', type: 'expense' },
  { id: 'cat-ex-hiburan', name: 'Hiburan', icon: 'Smile', type: 'expense' },
  { id: 'cat-ex-tagihan', name: 'Tagihan', icon: 'CreditCard', type: 'expense' },
  { id: 'cat-ex-lain', name: 'Lain-lain (Keluar)', icon: 'MinusCircle', type: 'expense' }
];

const DEFAULT_PROFILE: AppProfile = {
  name: 'Pengguna Ruflus',
  currency: 'Rp',
  language: 'id'
};

// Initialize Storage with Seed Data
export function initializeStorage() {
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    setItem(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  }
  if (!localStorage.getItem(KEYS.PROFILE)) {
    setItem(KEYS.PROFILE, DEFAULT_PROFILE);
  } else {
    // Migrate old profile to add language if it doesn't exist
    const p = getProfile();
    if (!p.language) {
      p.language = 'id';
      setItem(KEYS.PROFILE, p);
    }
  }
  // Initialize others with empty array if they do not exist
  const arrKeys = [
    KEYS.TRANSACTIONS,
    KEYS.SAVING_GOALS,
    KEYS.SAVING_HISTORY,
    KEYS.SPLIT_GROUPS,
    KEYS.SPLIT_MEMBERS,
    KEYS.SPLIT_EXPENSES,
    KEYS.SPLIT_SHARES,
    KEYS.BILLS
  ];
  arrKeys.forEach(k => {
    if (!localStorage.getItem(k)) {
      setItem(k, []);
    }
  });
}

// Profile CRUD
export function getProfile(): AppProfile {
  return getItem<AppProfile>(KEYS.PROFILE, DEFAULT_PROFILE);
}

export function updateProfile(profile: Partial<AppProfile>): AppProfile {
  const current = getProfile();
  const updated = { ...current, ...profile };
  setItem(KEYS.PROFILE, updated);
  return updated;
}

// Categories
export function getCategories(): Category[] {
  return getItem<Category[]>(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
}

export function addCategory(cat: Omit<Category, 'id'>): Category {
  const list = getCategories();
  const newCat = { ...cat, id: `cat-${Date.now()}` };
  list.push(newCat);
  setItem(KEYS.CATEGORIES, list);
  return newCat;
}

// Transactions
export function getTransactions(): Transaction[] {
  return getItem<Transaction[]>(KEYS.TRANSACTIONS, []);
}

export function addTransaction(tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
  const list = getTransactions();
  const now = new Date().toISOString();
  const newTx: Transaction = {
    ...tx,
    id: `tx-${Date.now()}`,
    createdAt: now,
    updatedAt: now
  };
  list.push(newTx);
  setItem(KEYS.TRANSACTIONS, list);
  return newTx;
}

export function updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Transaction | null {
  const list = getTransactions();
  const idx = list.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const updatedTx = { ...list[idx], ...updates, updatedAt: now };
  list[idx] = updatedTx;
  setItem(KEYS.TRANSACTIONS, list);
  return updatedTx;
}

export function deleteTransaction(id: string): boolean {
  const list = getTransactions();
  const filtered = list.filter(t => t.id !== id);
  if (filtered.length === list.length) return false;
  setItem(KEYS.TRANSACTIONS, filtered);
  return true;
}

// Saving Goals
export function getSavingGoals(): SavingGoal[] {
  return getItem<SavingGoal[]>(KEYS.SAVING_GOALS, []);
}

export function addSavingGoal(goal: Omit<SavingGoal, 'id' | 'currentAmount' | 'createdAt'>): SavingGoal {
  const list = getSavingGoals();
  const newGoal: SavingGoal = {
    ...goal,
    id: `goal-${Date.now()}`,
    currentAmount: 0,
    createdAt: new Date().toISOString()
  };
  list.push(newGoal);
  setItem(KEYS.SAVING_GOALS, list);
  return newGoal;
}

export function updateSavingGoal(id: string, updates: Partial<Omit<SavingGoal, 'id' | 'createdAt'>>): SavingGoal | null {
  const list = getSavingGoals();
  const idx = list.findIndex(g => g.id === id);
  if (idx === -1) return null;
  const updated = { ...list[idx], ...updates };
  list[idx] = updated;
  setItem(KEYS.SAVING_GOALS, list);
  return updated;
}

export function deleteSavingGoal(id: string): boolean {
  const list = getSavingGoals();
  const filtered = list.filter(g => g.id !== id);
  if (filtered.length === list.length) return false;
  setItem(KEYS.SAVING_GOALS, filtered);
  // Also clean history
  const history = getSavingHistory();
  const filteredHistory = history.filter(h => h.goalId !== id);
  setItem(KEYS.SAVING_HISTORY, filteredHistory);
  return true;
}

// Saving History
export function getSavingHistory(): SavingHistory[] {
  return getItem<SavingHistory[]>(KEYS.SAVING_HISTORY, []);
}

export function addSavingHistory(hist: Omit<SavingHistory, 'id' | 'createdAt'>): SavingHistory {
  const list = getSavingHistory();
  const newHist: SavingHistory = {
    ...hist,
    id: `sh-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  list.push(newHist);
  setItem(KEYS.SAVING_HISTORY, list);

  // Update target amount in Saving Goal
  const goals = getSavingGoals();
  const goalIdx = goals.findIndex(g => g.id === hist.goalId);
  if (goalIdx !== -1) {
    goals[goalIdx].currentAmount += hist.amount;
    setItem(KEYS.SAVING_GOALS, goals);
  }

  return newHist;
}

// Bills
export function getBills(): Bill[] {
  return getItem<Bill[]>(KEYS.BILLS, []);
}

export function addBill(bill: Omit<Bill, 'id'>): Bill {
  const list = getBills();
  const newBill: Bill = {
    ...bill,
    id: `bill-${Date.now()}`
  };
  list.push(newBill);
  setItem(KEYS.BILLS, list);
  return newBill;
}

export function updateBill(id: string, updates: Partial<Omit<Bill, 'id'>>): Bill | null {
  const list = getBills();
  const idx = list.findIndex(b => b.id === id);
  if (idx === -1) return null;
  const updated = { ...list[idx], ...updates };
  list[idx] = updated;
  setItem(KEYS.BILLS, list);
  return updated;
}

export function deleteBill(id: string): boolean {
  const list = getBills();
  const filtered = list.filter(b => b.id !== id);
  if (filtered.length === list.length) return false;
  setItem(KEYS.BILLS, filtered);
  return true;
}

// Split Groups
export function getSplitGroups(): SplitGroup[] {
  return getItem<SplitGroup[]>(KEYS.SPLIT_GROUPS, []);
}

export function addSplitGroup(group: Omit<SplitGroup, 'id' | 'createdAt'>, memberNames: string[]): SplitGroup {
  const list = getSplitGroups();
  const newGroup: SplitGroup = {
    ...group,
    id: `group-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  list.push(newGroup);
  setItem(KEYS.SPLIT_GROUPS, list);

  // Add members
  const members = getSplitMembers();
  memberNames.forEach((name, i) => {
    members.push({
      id: `member-${newGroup.id}-${i}-${Date.now()}`,
      groupId: newGroup.id,
      name
    });
  });
  setItem(KEYS.SPLIT_MEMBERS, members);

  return newGroup;
}

export function getSplitMembers(): SplitMember[] {
  return getItem<SplitMember[]>(KEYS.SPLIT_MEMBERS, []);
}

export function getGroupMembers(groupId: string): SplitMember[] {
  return getSplitMembers().filter(m => m.groupId === groupId);
}

export function getSplitExpenses(): SplitExpense[] {
  return getItem<SplitExpense[]>(KEYS.SPLIT_EXPENSES, []);
}

export function getGroupExpenses(groupId: string): SplitExpense[] {
  return getSplitExpenses().filter(e => e.groupId === groupId);
}

export function getSplitShares(): SplitShare[] {
  return getItem<SplitShare[]>(KEYS.SPLIT_SHARES, []);
}

export function getExpenseShares(expenseId: string): SplitShare[] {
  return getSplitShares().filter(s => s.expenseId === expenseId);
}

export function addSplitExpense(expense: Omit<SplitExpense, 'id' | 'createdAt'>, shares: { memberId: string; amount: number }[]): SplitExpense {
  const expenses = getSplitExpenses();
  const newExpense: SplitExpense = {
    ...expense,
    id: `exp-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  expenses.push(newExpense);
  setItem(KEYS.SPLIT_EXPENSES, expenses);

  const globalShares = getSplitShares();
  shares.forEach((sh, i) => {
    globalShares.push({
      id: `share-${newExpense.id}-${i}-${Date.now()}`,
      expenseId: newExpense.id,
      memberId: sh.memberId,
      amount: sh.amount,
      settled: false
    });
  });
  setItem(KEYS.SPLIT_SHARES, globalShares);

  return newExpense;
}

export function deleteSplitExpense(expenseId: string): boolean {
  const expenses = getSplitExpenses();
  const filteredExp = expenses.filter(e => e.id !== expenseId);
  if (filteredExp.length === expenses.length) return false;
  setItem(KEYS.SPLIT_EXPENSES, filteredExp);

  // Delete associated shares
  const shares = getSplitShares();
  const filteredShares = shares.filter(s => s.expenseId !== expenseId);
  setItem(KEYS.SPLIT_SHARES, filteredShares);
  return true;
}

export function settleGroup(groupId: string): void {
  // Mark all shares in group expenses as settled
  const expenses = getGroupExpenses(groupId);
  const expIds = expenses.map(e => e.id);
  const shares = getSplitShares();
  shares.forEach(s => {
    if (expIds.includes(s.expenseId)) {
      s.settled = true;
    }
  });
  setItem(KEYS.SPLIT_SHARES, shares);
}

export function deleteSplitGroup(groupId: string): void {
  const groups = getSplitGroups();
  setItem(KEYS.SPLIT_GROUPS, groups.filter(g => g.id !== groupId));

  const members = getSplitMembers();
  setItem(KEYS.SPLIT_MEMBERS, members.filter(m => m.groupId !== groupId));

  const expenses = getGroupExpenses(groupId);
  const expIds = expenses.map(e => e.id);

  const allExpenses = getSplitExpenses();
  setItem(KEYS.SPLIT_EXPENSES, allExpenses.filter(e => e.groupId !== groupId));

  const shares = getSplitShares();
  setItem(KEYS.SPLIT_SHARES, shares.filter(s => !expIds.includes(s.expenseId)));
}

// Backup & Restore Handlers
export function backupData(): string {
  const backup: Record<string, any> = {};
  Object.entries(KEYS).forEach(([_, storageKey]) => {
    backup[storageKey] = localStorage.getItem(storageKey);
  });
  return JSON.stringify(backup);
}

export function restoreData(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr) as Record<string, string | null>;
    Object.entries(KEYS).forEach(([_, storageKey]) => {
      if (parsed[storageKey] !== undefined && parsed[storageKey] !== null) {
        localStorage.setItem(storageKey, parsed[storageKey]);
      }
    });
    return true;
  } catch (e) {
    return false;
  }
}
