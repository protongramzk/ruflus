import React from 'react';
import { Card } from '../ui/Card';
import { t, formatAmount } from '../../utils/translations';

interface BalanceSummaryProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  currency: string;
  lang?: string;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  totalBalance,
  monthlyIncome,
  monthlyExpense,
  currency,
  lang
}) => {
  const formatAmt = (val: number) => {
    return formatAmount(val, currency, lang);
  };

  return (
    <Card className="p-5 border-2 border-black">
      <div className="flex flex-col space-y-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">{t('totalBalance', lang)}</span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-black">
            {formatAmt(totalBalance)}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-black/10">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-600 flex items-center">
              ▲ {t('monthlyIncome', lang)}
            </span>
            <p className="text-sm font-extrabold text-black mt-1">
              {formatAmt(monthlyIncome)}
            </p>
          </div>
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-600 flex items-center">
              ▼ {t('monthlyExpense', lang)}
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
