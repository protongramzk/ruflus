import React from 'react';
import { Card } from '../ui/Card';
import { TRANSLATIONS } from '../../utils/i18n';
import { AppLanguage } from '../../types';

interface BalanceSummaryProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  currency: string;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  totalBalance,
  monthlyIncome,
  monthlyExpense,
  currency
}) => {
  // Let's standardise translations, load profile inside settings, or pass label as props.
  // Let's use currency formatted outputs
  const formatAmt = (val: number) => {
    return `${currency} ${val.toLocaleString('id-ID')}`;
  };

  return (
    <Card className="p-5 border-2 border-black">
      <div className="flex flex-col space-y-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Balance</span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-black">
            {formatAmt(totalBalance)}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-black/10">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-600 flex items-center">
              ▲ Income
            </span>
            <p className="text-sm font-extrabold text-black mt-1">
              {formatAmt(monthlyIncome)}
            </p>
          </div>
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-600 flex items-center">
              ▼ Expense
            </span>
            <p className="text-sm font-extrabold text-black mt-1">
              {formatAmt(monthlyExpense)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
