import React from 'react';
import { SavingGoal } from '../../types';
import { Card } from '../ui/Card';

interface SavingsOverviewProps {
  goals: SavingGoal[];
  currency: string;
  onViewAll: () => void;
}

export const SavingsOverview: React.FC<SavingsOverviewProps> = ({ goals, currency, onViewAll }) => {
  return (
    <Card title="Savings Overview" className="w-full">
      {goals.length === 0 ? (
        <div className="py-4 text-center text-xs text-gray-500 uppercase tracking-wider">
          Belum ada target tabungan
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {goals.map(goal => {
            const percent = goal.targetAmount > 0
              ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
              : 0;

            return (
              <div key={goal.id} className="flex flex-col space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="uppercase tracking-wide text-black truncate max-w-[150px]">
                    {goal.name}
                  </span>
                  <span>
                    {percent}% ({currency} {goal.currentAmount.toLocaleString('id-ID')} / {goal.targetAmount.toLocaleString('id-ID')})
                  </span>
                </div>

                {/* Custom Orthogonal Progress Bar */}
                <div className="w-full h-3 border border-black bg-white">
                  <div
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
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
        Selengkapnya tentang Tabungan →
      </button>
    </Card>
  );
};
