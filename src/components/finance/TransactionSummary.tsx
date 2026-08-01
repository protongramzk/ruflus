import React from 'react';
import { Card } from '../ui/Card';
import { t, formatAmount } from '../../utils/translations';

interface TransactionSummaryProps {
  income: number;
  expense: number;
  currency: string;
  lang?: string;
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({ income, expense, currency, lang }) => {
  const balance = income - expense;
  const formatAmt = (val: number) => formatAmount(val, currency, lang);

  return (
    <Card className="border-2 border-black p-4">
      <div className="grid grid-cols-3 gap-2 divide-x divide-black/10">
        <div className="px-1 text-center">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-green-600">{t('income', lang)}</span>
          <p className="text-sm font-extrabold text-black mt-1">{formatAmt(income)}</p>
        </div>
        <div className="px-1 text-center">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-red-600">{t('expense', lang)}</span>
          <p className="text-sm font-extrabold text-black mt-1">{formatAmt(expense)}</p>
        </div>
        <div className="px-1 text-center">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-500">{lang === 'id' ? 'Saldo' : lang === 'ms' ? 'Baki' : lang === 'ja' ? '残高' : '余额'}</span>
          <p className="text-sm font-extrabold text-black mt-1">{formatAmt(balance)}</p>
        </div>
      </div>
    </Card>
  );
};
