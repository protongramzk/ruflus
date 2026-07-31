import React from 'react';
import { Bill } from '../../types';
import { Card } from '../ui/Card';
import { Calendar, AlertCircle } from 'lucide-react';
import { t, formatAmount } from '../../utils/translations';

interface BillsReminderProps {
  bills: Bill[];
  currency: string;
  onViewAll: () => void;
  lang?: string;
}

export const BillsReminder: React.FC<BillsReminderProps> = ({ bills, currency, onViewAll, lang }) => {
  const unpaidBills = bills.filter(b => !b.paid);

  // Sort unpaid bills by due date to get the closest one
  const sortedUnpaid = [...unpaidBills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Overdue count
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = sortedUnpaid.filter(b => b.dueDate < todayStr).length;

  const nextBill = sortedUnpaid[0];

  return (
    <Card title={t('billsTitle', lang)}>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('unpaid', lang)}</span>
          <span className="text-lg font-extrabold text-black">{unpaidBills.length}</span>
        </div>

        {overdueCount > 0 && (
          <div className="flex items-center space-x-2 border border-red-600 bg-red-50/50 p-2 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-extrabold uppercase tracking-wide">
              {overdueCount} {t('overdueBills', lang).toUpperCase()}!
            </span>
          </div>
        )}

        {nextBill ? (
          <div className="border border-black p-3 bg-gray-50 flex items-start justify-between space-x-2">
            <div className="flex items-start space-x-2">
              <Calendar className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-extrabold text-black uppercase tracking-wide truncate max-w-[120px]">
                  {nextBill.title}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 font-bold">
                  {t('dueDate', lang)}: {nextBill.dueDate}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-extrabold text-black">
                {formatAmount(nextBill.amount, currency, lang)}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-2 text-center text-xs text-gray-500 uppercase tracking-wider border border-dashed border-black/20">
            {t('none', lang)}
          </div>
        )}
      </div>
      <button
        onClick={onViewAll}
        className="w-full text-center text-[10px] font-extrabold uppercase tracking-widest mt-4 pt-2 border-t border-black/10 hover:underline text-black"
      >
        {t('viewAll', lang)} →
      </button>
    </Card>
  );
};
