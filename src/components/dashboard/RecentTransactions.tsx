import React from 'react';
import { Transaction, Category } from '../../types';
import { Card } from '../ui/Card';
import { DynamicIcon } from '../ui/DynamicIcon';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
  onViewAll: () => void;
  onTxClick: (id: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  categories,
  currency,
  onViewAll,
  onTxClick
}) => {
  // Sort by date desc, get first 5-10
  const sorted = [...transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card title="Recent Transactions">
      {sorted.length === 0 ? (
        <div className="py-4 text-center text-xs text-gray-500 uppercase tracking-wider">
          Belum ada transaksi
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-black/10">
          {sorted.map(tx => {
            const cat = categories.find(c => c.id === tx.categoryId);
            const isInc = tx.type === 'income';
            const dateStr = new Date(tx.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short'
            });

            return (
              <div
                key={tx.id}
                onClick={() => onTxClick(tx.id)}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-black/5 px-1 transition-all duration-100"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="p-1.5 border border-black bg-white text-black shrink-0">
                    <DynamicIcon name={cat?.icon || 'HelpCircle'} className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-extrabold text-black uppercase tracking-wide truncate max-w-[150px]">
                      {tx.note || cat?.name || 'Transaksi'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{dateStr} • {cat?.name}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-xs font-extrabold ${isInc ? 'text-green-600' : 'text-black'}`}>
                    {isInc ? '+' : '-'} {currency} {tx.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <button
        onClick={onViewAll}
        className="w-full text-center text-[10px] font-extrabold uppercase tracking-widest mt-4 pt-2 border-t border-black/10 hover:underline text-black"
      >
        Lihat Riwayat Transaksi →
      </button>
    </Card>
  );
};
