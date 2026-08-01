import React, { useEffect, useState } from 'react';
import {
  getProfile,
  getTransactions,
  getCategories,
  getSavingGoals,
  getBills,
  getSplitGroups,
  getSplitMembers,
  getSplitExpenses,
  getSplitShares
} from '../utils/storage';
import { AppProfile, Transaction, Category, SavingGoal, Bill, SplitGroup, SplitMember, SplitExpense, SplitShare } from '../types';
import { BalanceSummary } from '../components/dashboard/BalanceSummary';
import { SavingsOverview } from '../components/dashboard/SavingsOverview';
import { BillsReminder } from '../components/dashboard/BillsReminder';
import { ActiveSplit } from '../components/dashboard/ActiveSplit';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { TabType } from '../components/ui/BottomNavigation';
import { t, getLocale } from '../utils/translations';

interface DashboardProps {
  onNavigate: (tab: TabType, targetId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [groups, setGroups] = useState<SplitGroup[]>([]);
  const [members, setMembers] = useState<SplitMember[]>([]);
  const [expenses, setExpenses] = useState<SplitExpense[]>([]);
  const [shares, setShares] = useState<SplitShare[]>([]);

  useEffect(() => {
    setProfile(getProfile());
    setTransactions(getTransactions());
    setCategories(getCategories());
    setGoals(getSavingGoals());
    setBills(getBills());
    setGroups(getSplitGroups());
    setMembers(getSplitMembers());
    setExpenses(getSplitExpenses());
    setShares(getSplitShares());
  }, []);

  if (!profile) return null;

  const lang = profile.language || 'id';

  // Calculatations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  // Calculate current month's income and expenses
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.createdAt);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const formattedDate = new Date().toLocaleDateString(getLocale(lang), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
          {t('welcome', lang)}
        </span>
        <h1 className="text-xl font-black text-black uppercase tracking-tight">
          {profile.name}
        </h1>
        <p className="text-xs text-gray-400 font-bold">{formattedDate}</p>
      </div>

      {/* Balance Summary */}
      <BalanceSummary
        totalBalance={totalBalance}
        monthlyIncome={monthlyIncome}
        monthlyExpense={monthlyExpense}
        currency={profile.currency}
        lang={lang}
      />

      {/* Grid of Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SavingsOverview
          goals={goals.slice(0, 3)}
          currency={profile.currency}
          onViewAll={() => onNavigate('savings')}
          lang={lang}
        />

        <BillsReminder
          bills={bills}
          currency={profile.currency}
          onViewAll={() => onNavigate('bills')}
          lang={lang}
        />
      </div>

      <ActiveSplit
        groups={groups}
        members={members}
        expenses={expenses}
        shares={shares}
        currency={profile.currency}
        onViewAll={() => onNavigate('split')}
        lang={lang}
      />

      <RecentTransactions
        transactions={transactions}
        categories={categories}
        currency={profile.currency}
        onViewAll={() => onNavigate('finance')}
        onTxClick={(id) => onNavigate('finance', id)}
        lang={lang}
      />
    </div>
  );
};
