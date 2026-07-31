import React from 'react';
import { SplitGroup, SplitMember, SplitExpense, SplitShare, AppLanguage } from '../../types';
import { Card } from '../ui/Card';
import { Users } from 'lucide-react';
import { TRANSLATIONS } from '../../utils/i18n';

interface ActiveSplitProps {
  groups: SplitGroup[];
  members: SplitMember[];
  expenses: SplitExpense[];
  shares: SplitShare[];
  currency: string;
  onViewAll: () => void;
  lang: AppLanguage;
}

export const ActiveSplit: React.FC<ActiveSplitProps> = ({
  groups,
  members,
  expenses,
  shares,
  currency,
  onViewAll,
  lang
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.id;

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
        const othersShares = expenseShares.filter(s => s.memberId !== userMember.id);
        const othersOwe = othersShares.reduce((sum, s) => sum + s.amount, 0);
        totalReceivable += othersOwe;
      } else {
        const myShare = expenseShares.find(s => s.memberId === userMember.id);
        if (myShare) {
          totalPayable += myShare.amount;
        }
      }
    });
  });

  return (
    <Card title={t.activeSplit} className="w-full">
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-black p-3 bg-gray-50">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-600">▲ {t.totalReceivable}</span>
            <p className="text-sm font-extrabold text-black mt-1">
              {currency} {totalReceivable.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="border border-black p-3 bg-gray-50">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-600">▼ {t.totalPayable}</span>
            <p className="text-sm font-extrabold text-black mt-1">
              {currency} {totalPayable.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-500 uppercase tracking-wider">{t.activeSplitGroups}</span>
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
        {t.moreSplit} →
      </button>
    </Card>
  );
};
