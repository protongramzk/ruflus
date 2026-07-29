import React from 'react';
import { SplitGroup, SplitMember, SplitExpense, SplitShare } from '../../types';
import { Card } from '../ui/Card';
import { Users } from 'lucide-react';

interface ActiveSplitProps {
  groups: SplitGroup[];
  members: SplitMember[];
  expenses: SplitExpense[];
  shares: SplitShare[];
  currency: string;
  onViewAll: () => void;
}

export const ActiveSplit: React.FC<ActiveSplitProps> = ({
  groups,
  members,
  expenses,
  shares,
  currency,
  onViewAll
}) => {
  // We want to count:
  // 1. Total Piutang (Someone owes me, i.e., I paid but others haven't settled)
  // 2. Total Utang (I owe someone else, i.e., others paid and my share isn't settled)
  // To keep this local-first simpler, we assume the current user is always the "Member" named "Saya" (or the first member of any group if "Saya" isn't present, or we can check who is "Saya").
  // Let's standardise: In any group, the current user has a member item with name "Saya".
  // If no "Saya" member exists, we don't have personal credit/debts for that group.

  let totalReceivable = 0; // Piutang
  let totalPayable = 0; // Utang

  groups.forEach(group => {
    const groupMembers = members.filter(m => m.groupId === group.id);
    const userMember = groupMembers.find(m => m.name.toLowerCase() === 'saya' || m.name.toLowerCase() === 'me');
    if (!userMember) return;

    const groupExpenses = expenses.filter(e => e.groupId === group.id);
    groupExpenses.forEach(expense => {
      const expenseShares = shares.filter(s => s.expenseId === expense.id && !s.settled);
      if (expenseShares.length === 0) return;

      if (expense.payerId === userMember.id) {
        // I paid! Others owe me.
        // My piutang is the sum of shares belonging to other members
        const othersShares = expenseShares.filter(s => s.memberId !== userMember.id);
        const othersOwe = othersShares.reduce((sum, s) => sum + s.amount, 0);
        totalReceivable += othersOwe;
      } else {
        // Someone else paid! I might owe them.
        const myShare = expenseShares.find(s => s.memberId === userMember.id);
        if (myShare) {
          totalPayable += myShare.amount;
        }
      }
    });
  });

  return (
    <Card title="Active Split" className="w-full">
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-black p-3 bg-gray-50">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-600">▲ Total Piutang</span>
            <p className="text-sm font-extrabold text-black mt-1">
              {currency} {totalReceivable.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="border border-black p-3 bg-gray-50">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-600">▼ Total Utang</span>
            <p className="text-sm font-extrabold text-black mt-1">
              {currency} {totalPayable.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-500 uppercase tracking-wider">Grup Patungan Aktif</span>
          <span className="font-extrabold text-black flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {groups.length}
          </span>
        </div>
      </div>
      <button
        onClick={onViewAll}
        className="w-full text-center text-[10px] font-extrabold uppercase tracking-widest mt-4 pt-2 border-t border-black/10 hover:underline text-black"
      >
        Kelola Grup Patungan →
      </button>
    </Card>
  );
};
