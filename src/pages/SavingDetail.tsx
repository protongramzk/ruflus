import React, { useState, useEffect } from 'react';
import {
  getSavingGoals,
  getSavingHistory,
  addSavingHistory,
  updateSavingGoal,
  deleteSavingGoal,
  getProfile
} from '../utils/storage';
import { SavingGoal, SavingHistory, AppProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { DepositForm } from '../components/savings/DepositForm';
import { GoalForm } from '../components/savings/GoalForm';
import { ArrowLeft, Trash2, Edit, ArrowUpCircle } from 'lucide-react';
import { t, formatAmount, getLocale } from '../utils/translations';

interface SavingDetailProps {
  goalId: string;
  onBack: () => void;
}

export const SavingDetail: React.FC<SavingDetailProps> = ({ goalId, onBack }) => {
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [goal, setGoal] = useState<SavingGoal | null>(null);
  const [histories, setHistories] = useState<SavingHistory[]>([]);

  // Modals
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const reloadData = () => {
    setProfile(getProfile());
    const goals = getSavingGoals();
    const found = goals.find(g => g.id === goalId);
    if (found) {
      setGoal(found);
    }
    const hist = getSavingHistory();
    setHistories(hist.filter(h => h.goalId === goalId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    reloadData();
  }, [goalId]);

  if (!goal || !profile) return null;

  const lang = profile.language || 'id';

  const percent = goal.targetAmount > 0
    ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
    : 0;

  const handleDeposit = (data: { amount: number; note: string }) => {
    addSavingHistory({
      goalId,
      amount: data.amount,
      note: data.note
    });
    reloadData();
    setIsDepositOpen(false);
  };

  const handleEditGoal = (data: { name: string; targetAmount: number; deadline: string; note: string }) => {
    updateSavingGoal(goalId, data);
    reloadData();
    setIsEditOpen(false);
  };

  const handleDeleteGoal = () => {
    const confirmMsg = lang === 'id' ? 'Apakah Anda yakin ingin menghapus target tabungan ini beserta seluruh riwayat setorannya?' : lang === 'ms' ? 'Adakah anda pasti ingin memadam sasaran simpanan ini bersama semua rekod simpanannya?' : lang === 'ja' ? 'この貯金目標とすべての貯金履歴を削除してもよろしいですか？' : '您确定要删除此储蓄目标及其所有储蓄记录吗？';
    if (confirm(confirmMsg)) {
      deleteSavingGoal(goalId);
      onBack();
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Back Header */}
      <button
        onClick={onBack}
        className="flex items-center text-xs font-bold text-black uppercase tracking-wider hover:underline self-start space-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('back', lang)}</span>
      </button>

      {/* Goal Header Panel */}
      <Card className="border-2 border-black p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-black text-black uppercase tracking-tight">{goal.name}</h1>
              <p className="text-xs text-gray-400 font-bold mt-0.5">{t('deadline', lang)}: {goal.deadline}</p>
            </div>
            <span className="text-sm font-black text-black">{percent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 border border-black bg-white">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/10">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t('currentSavings', lang)}</span>
              <p className="text-sm font-extrabold text-black mt-0.5">
                {formatAmount(goal.currentAmount, profile.currency, lang)}
              </p>
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t('remaining', lang)}</span>
              <p className="text-sm font-extrabold text-black mt-0.5">
                {formatAmount(Math.max(0, goal.targetAmount - goal.currentAmount), profile.currency, lang)}
              </p>
            </div>
          </div>

          {goal.note && (
            <div className="border border-dashed border-black/20 p-2.5 bg-gray-50 text-xs text-gray-600">
              <span className="font-bold text-[10px] uppercase block mb-1 text-black">{t('note', lang)}:</span>
              {goal.note}
            </div>
          )}
        </div>
      </Card>

      {/* Action triggers */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={() => setIsDepositOpen(true)}
          variant="primary"
          className="flex items-center justify-center gap-1 text-xs"
        >
          <ArrowUpCircle className="w-4 h-4" />
          {t('deposit', lang)}
        </Button>
        <Button
          onClick={() => setIsEditOpen(true)}
          variant="secondary"
          className="flex items-center justify-center gap-1 text-xs"
        >
          <Edit className="w-4 h-4" />
          {t('edit', lang)}
        </Button>
        <Button
          onClick={handleDeleteGoal}
          variant="danger"
          className="flex items-center justify-center gap-1 text-xs"
        >
          <Trash2 className="w-4 h-4" />
          {t('delete', lang)}
        </Button>
      </div>

      {/* Deposit Histories */}
      <div className="flex flex-col space-y-2 mt-2">
        <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-1.5">
          {t('depositHistory', lang)} ({histories.length})
        </h2>

        {histories.length === 0 ? (
          <div className="py-8 border border-dashed border-black/20 text-center text-xs text-gray-400 uppercase tracking-wider bg-gray-50/50">
            {t('none', lang)}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {histories.map(h => {
              const dStr = new Date(h.createdAt).toLocaleDateString(getLocale(lang), {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              return (
                <div key={h.id} className="border border-black bg-white p-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-extrabold text-black uppercase tracking-wide block">
                      {h.note || t('deposit', lang)}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">{dStr}</span>
                  </div>

                  <span className="font-black text-green-600 text-sm">
                    + {formatAmount(h.amount, profile.currency, lang)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Setor Modal */}
      <Modal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} title={t('deposit', lang)}>
        <DepositForm
          onSubmit={handleDeposit}
          onCancel={() => setIsDepositOpen(false)}
          lang={lang}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={t('edit', lang)}>
        <GoalForm
          onSubmit={handleEditGoal}
          onCancel={() => setIsEditOpen(false)}
          initialGoal={goal}
          lang={lang}
        />
      </Modal>
    </div>
  );
};
