import React, { useState, useEffect } from 'react';
import {
  getSplitGroups,
  getGroupMembers,
  getGroupExpenses,
  getSplitShares,
  addSplitExpense,
  deleteSplitExpense,
  settleGroup,
  deleteSplitGroup,
  getProfile
} from '../utils/storage';
import { SplitGroup, SplitMember, SplitExpense, SplitShare, AppProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ExpenseForm } from '../components/split/ExpenseForm';
import { DebtSolver } from '../components/split/DebtSolver';
import { ArrowLeft, Trash2, Check, Plus } from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n';

interface SplitDetailProps {
  groupId: string;
  onBack: () => void;
}

export const SplitDetail: React.FC<SplitDetailProps> = ({ groupId, onBack }) => {
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [group, setGroup] = useState<SplitGroup | null>(null);
  const [members, setMembers] = useState<SplitMember[]>([]);
  const [expenses, setExpenses] = useState<SplitExpense[]>([]);
  const [shares, setShares] = useState<SplitShare[]>([]);

  // Modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const reloadData = () => {
    setProfile(getProfile());
    const groups = getSplitGroups();
    const found = groups.find(g => g.id === groupId);
    if (found) {
      setGroup(found);
    }
    setMembers(getGroupMembers(groupId));
    setExpenses(getGroupExpenses(groupId));
    setShares(getSplitShares());
  };

  useEffect(() => {
    reloadData();
  }, [groupId]);

  if (!group || !profile) return null;

  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.id;

  // Check if all bills are settled
  const expIds = expenses.map(e => e.id);
  const groupShares = shares.filter(s => expIds.includes(s.expenseId));
  const isSettled = groupShares.length > 0 && groupShares.every(s => s.settled);

  // Group Stats
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpenseSubmit = (data: {
    payerId: string;
    title: string;
    amount: number;
    shares: { memberId: string; amount: number }[];
  }) => {
    addSplitExpense({
      groupId,
      payerId: data.payerId,
      title: data.title,
      amount: data.amount
    }, data.shares);

    reloadData();
    setIsAddExpenseOpen(false);
  };

  const handleDeleteExpense = (expId: string) => {
    if (confirm(t.confirmDeleteExpense)) {
      deleteSplitExpense(expId);
      reloadData();
    }
  };

  const handleSettleGroup = () => {
    if (confirm(t.confirmSettleGroup)) {
      settleGroup(groupId);
      reloadData();
    }
  };

  const handleDeleteGroup = () => {
    if (confirm(t.confirmDeleteGroup)) {
      deleteSplitGroup(groupId);
      onBack();
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Back Header */}
      <button
        onClick={onBack}
        className="flex items-center text-xs font-bold text-black uppercase tracking-wider hover:underline self-start space-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.back}</span>
      </button>

      {/* Group Detail Header Card */}
      <Card className="border-2 border-black p-4">
        <div className="flex flex-col space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-black text-black uppercase tracking-tight">{group.name}</h1>
              <p className="text-xs text-gray-500 mt-0.5">{group.description || t.noDescription}</p>
            </div>

            {isSettled ? (
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                SETTLED
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest border border-black text-black px-2 py-0.5">
                ACTIVE
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-black/10 text-xs">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t.groupTotalSpend}</span>
              <p className="text-sm font-extrabold text-black mt-0.5">
                {profile.currency} {totalSpend.toLocaleString('id-ID')}
              </p>
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t.membersLabel}</span>
              <p className="text-sm font-extrabold text-black mt-0.5">
                {members.map(m => m.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Debt Solver Panel */}
      {!isSettled && expenses.length > 0 && (
        <DebtSolver
          members={members}
          expenses={expenses}
          shares={shares}
          currency={profile.currency}
        />
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {!isSettled && expenses.length > 0 && (
          <Button
            onClick={handleSettleGroup}
            variant="primary"
            className="flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {t.markAsSettledBtn}
          </Button>
        )}
        <Button
          onClick={handleDeleteGroup}
          variant="danger"
          className={`flex items-center justify-center gap-1.5 ${isSettled || expenses.length === 0 ? 'col-span-2' : ''}`}
        >
          <Trash2 className="w-4 h-4" />
          {t.deleteGroupBtn}
        </Button>
      </div>

      {/* Expense History List */}
      <div className="flex flex-col space-y-2 mt-2">
        <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-1.5">
          {t.recentTransactions} ({expenses.length})
        </h2>

        {expenses.length === 0 ? (
          <div className="py-12 border border-dashed border-black/20 text-center flex flex-col items-center justify-center space-y-2 bg-gray-50/50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {t.noRecentTransactions}
            </span>
            <Button variant="secondary" onClick={() => setIsAddExpenseOpen(true)} className="text-xs px-3 py-1">
              {t.addExpenseTitle}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {expenses.map(exp => {
              const payerName = members.find(m => m.id === exp.payerId)?.name || 'Seseorang';
              const dateStr = new Date(exp.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short'
              });

              return (
                <div
                  key={exp.id}
                  className="border border-black bg-white p-3 flex flex-col space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-black uppercase tracking-wide truncate max-w-[150px]">
                        {exp.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                        {t.paidBy}: {payerName} • {dateStr}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-black">
                        {profile.currency} {exp.amount.toLocaleString('id-ID')}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1 border border-black hover:bg-red-600 hover:text-white transition-all text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Share distributions breakdown */}
                  <div className="pt-2 border-t border-black/5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-bold text-gray-500">
                    {shares.filter(s => s.expenseId === exp.id).map(share => {
                      const mName = members.find(m => m.id === share.memberId)?.name || 'Seseorang';
                      return (
                        <span key={share.id} className={share.settled ? 'line-through text-gray-400' : ''}>
                          {mName}: {profile.currency} {share.amount.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {!isSettled && (
        <div className="fixed bottom-20 right-4 z-30">
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="p-4 bg-black text-white hover:bg-white hover:text-black border-2 border-black shadow-lg transition-all duration-150 flex items-center justify-center"
            style={{ borderRadius: '0px' }}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Add Expense Modal */}
      <Modal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} title={t.addExpenseTitle}>
        <ExpenseForm
          members={members}
          onSubmit={handleAddExpenseSubmit}
          onCancel={() => setIsAddExpenseOpen(false)}
        />
      </Modal>
    </div>
  );
};
