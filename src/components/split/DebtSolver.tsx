import React from 'react';
import { SplitMember, SplitExpense, SplitShare } from '../../types';
import { Card } from '../ui/Card';

interface DebtSolverProps {
  members: SplitMember[];
  expenses: SplitExpense[];
  shares: SplitShare[];
  currency: string;
}

export interface Settlement {
  from: string; // memberId
  to: string; // memberId
  amount: number;
}

export function calculateSettlements(
  members: SplitMember[],
  expenses: SplitExpense[],
  shares: SplitShare[]
): Settlement[] {
  // Let's compute the net balance of each member.
  // Net balance = (what member paid/contributed) - (what member owes for their shares).
  // Positive balance means member should receive money.
  // Negative balance means member should pay money.

  const netBalances: Record<string, number> = {};

  // Initialize
  members.forEach(m => {
    netBalances[m.id] = 0;
  });

  // Calculate contributions from expenses paid
  expenses.forEach(exp => {
    if (netBalances[exp.payerId] !== undefined) {
      netBalances[exp.payerId] += exp.amount;
    }
  });

  // Calculate owes from shares
  // Only include shares of expenses belonging to these expenses
  const expIds = expenses.map(e => e.id);
  const relevantShares = shares.filter(s => expIds.includes(s.expenseId) && !s.settled);

  relevantShares.forEach(share => {
    if (netBalances[share.memberId] !== undefined) {
      netBalances[share.memberId] -= share.amount;
    }
  });

  // Now perform simple debt matching algorithm (greedy approach).
  // Separate into debtors (negative balance) and creditors (positive balance).
  const debtors: { memberId: string; balance: number }[] = [];
  const creditors: { memberId: string; balance: number }[] = [];

  Object.entries(netBalances).forEach(([memberId, bal]) => {
    // Avoid floating point precision issues
    if (Math.abs(bal) < 0.05) return;
    if (bal < 0) {
      debtors.push({ memberId, balance: bal });
    } else {
      creditors.push({ memberId, balance: bal });
    }
  });

  // Sort both lists so we resolve larger amounts or keep it ordered
  debtors.sort((a, b) => a.balance - b.balance); // most negative first
  creditors.sort((a, b) => b.balance - a.balance); // most positive first

  const settlements: Settlement[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const oweAmount = Math.abs(debtor.balance);
    const creditAmount = creditor.balance;

    const settledAmt = Math.min(oweAmount, creditAmount);

    if (settledAmt > 0.05) {
      settlements.push({
        from: debtor.memberId,
        to: creditor.memberId,
        amount: settledAmt
      });
    }

    debtor.balance += settledAmt;
    creditor.balance -= settledAmt;

    if (Math.abs(debtor.balance) < 0.05) dIdx++;
    if (Math.abs(creditor.balance) < 0.05) cIdx++;
  }

  return settlements;
}

export const DebtSolver: React.FC<DebtSolverProps> = ({ members, expenses, shares, currency }) => {
  const settlements = calculateSettlements(members, expenses, shares);

  return (
    <Card title="Rekomendasi Pelunasan (Settlement)" className="border-2 border-black">
      {settlements.length === 0 ? (
        <div className="py-2 text-center text-xs text-green-600 font-extrabold uppercase tracking-widest">
          ✓ SEMUA TAGIHAN SUDAH LUNAS / SEIMBANG
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          {settlements.map((settle, idx) => {
            const fromName = members.find(m => m.id === settle.from)?.name || 'Seseorang';
            const toName = members.find(m => m.id === settle.to)?.name || 'Seseorang';

            return (
              <div
                key={idx}
                className="flex items-center justify-between border border-black p-2.5 bg-gray-50/50 text-xs font-bold"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-red-600 uppercase tracking-wide truncate max-w-[100px]">{fromName}</span>
                  <span className="text-gray-400 font-medium">bayar ke</span>
                  <span className="text-green-600 uppercase tracking-wide truncate max-w-[100px]">{toName}</span>
                </div>
                <span className="text-black shrink-0">
                  {currency} {settle.amount.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
