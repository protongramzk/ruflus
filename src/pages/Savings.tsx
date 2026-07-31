import React, { useState, useEffect } from 'react';
import { getSavingGoals, addSavingGoal, getProfile } from '../utils/storage';
import { SavingGoal, AppProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { GoalForm } from '../components/savings/GoalForm';
import { Plus } from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n';

interface SavingsProps {
  onViewGoal: (id: string) => void;
}

export const Savings: React.FC<SavingsProps> = ({ onViewGoal }) => {
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const reloadData = () => {
    setProfile(getProfile());
    setGoals(getSavingGoals());
  };

  useEffect(() => {
    reloadData();
  }, []);

  if (!profile) return null;

  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.id;

  const handleCreateGoal = (data: { name: string; targetAmount: number; deadline: string; note: string }) => {
    addSavingGoal(data);
    reloadData();
    setIsAddOpen(false);
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-black uppercase tracking-tight">{t.savings}</h1>
          <p className="text-xs text-gray-400 font-bold">{t.savingsSub}</p>
        </div>
      </div>

      {/* Goal List */}
      <div className="flex flex-col space-y-2 mt-2">
        <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-1.5">
          {t.activeGoals} ({goals.length})
        </h2>

        {goals.length === 0 ? (
          <div className="py-12 border border-dashed border-black/20 text-center flex flex-col items-center justify-center space-y-2 bg-gray-50/50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {t.noGoals}
            </span>
            <Button variant="secondary" onClick={() => setIsAddOpen(true)} className="text-xs px-3 py-1">
              {t.startSavingNow}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            {goals.map(goal => {
              const percent = goal.targetAmount > 0
                ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                : 0;

              return (
                <Card
                  key={goal.id}
                  onClick={() => onViewGoal(goal.id)}
                  className="p-4"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-extrabold text-black uppercase tracking-wide truncate max-w-[180px]">
                          {goal.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                          {t.savingGoalDeadline}: {goal.deadline}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-black">
                          {percent}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 border border-black bg-white">
                      <div
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-1">
                      <span>{t.total}: {profile.currency} {goal.currentAmount.toLocaleString('id-ID')}</span>
                      <span>Target: {profile.currency} {goal.targetAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={() => setIsAddOpen(true)}
          className="p-4 bg-black text-white hover:bg-white hover:text-black border-2 border-black shadow-lg transition-all duration-150 flex items-center justify-center"
          style={{ borderRadius: '0px' }}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={t.startSavingNow}>
        <GoalForm
          onSubmit={handleCreateGoal}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>
    </div>
  );
};
