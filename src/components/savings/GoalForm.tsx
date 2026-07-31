import React, { useState, useEffect } from 'react';
import { SavingGoal } from '../../types';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { t } from '../../utils/translations';

interface GoalFormProps {
  onSubmit: (data: {
    name: string;
    targetAmount: number;
    deadline: string;
    note: string;
  }) => void;
  onCancel: () => void;
  initialGoal?: SavingGoal | null;
  lang?: string;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel, initialGoal, lang }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialGoal) {
      setName(initialGoal.name);
      setTargetAmount(initialGoal.targetAmount.toString());
      setDeadline(initialGoal.deadline);
      setNote(initialGoal.note || '');
    } else {
      setName('');
      setTargetAmount('');
      setDeadline('');
      setNote('');
    }
  }, [initialGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(targetAmount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setError(lang === 'id' ? 'Masukkan nominal target tabungan yang valid (> 0)' : lang === 'ms' ? 'Sila masukkan sasaran simpanan yang sah (> 0)' : lang === 'ja' ? '有効な目標金額を入力してください（0より大きい値）' : '请输入有效的储蓄目标金额（大于 0）');
      return;
    }
    if (!name.trim()) {
      setError(lang === 'id' ? 'Nama target tabungan harus diisi' : lang === 'ms' ? 'Nama sasaran simpanan mesti diisi' : lang === 'ja' ? '目標名を入力してください' : '请输入目标名称');
      return;
    }
    if (!deadline) {
      setError(lang === 'id' ? 'Tanggal tenggat waktu harus diisi' : lang === 'ms' ? 'Tarikh akhir mesti diisi' : lang === 'ja' ? '期日を入力してください' : '请选择截止日期');
      return;
    }
    setError('');

    onSubmit({
      name,
      targetAmount: numAmt,
      deadline,
      note
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <Input
        label={lang === 'id' ? 'Nama Target Tabungan' : lang === 'ms' ? 'Nama Sasaran Simpanan' : lang === 'ja' ? '目標名' : '储蓄目标名称'}
        placeholder={lang === 'id' ? 'Contoh: Beli Laptop Baru atau Menikah' : lang === 'ms' ? 'Contoh: Beli Laptop Baru atau Kahwin' : lang === 'ja' ? '例: 新しいノートPC、結婚資金' : '例如: 购买新电脑或结婚资金'}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label={t('targetAmount', lang)}
        type="number"
        placeholder={lang === 'id' ? 'Contoh: 10000000' : lang === 'ms' ? 'Contoh: 10000' : lang === 'ja' ? '例: 100000' : '例如: 10000'}
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        required
      />

      <Input
        label={t('deadline', lang)}
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />

      <Textarea
        label={t('note', lang)}
        placeholder={lang === 'id' ? 'Contoh: Menyisihkan 500rb per bulan' : lang === 'ms' ? 'Contoh: Simpan 500 sebulan' : lang === 'ja' ? '例: 毎月5000円を貯金する' : '例如: 每月存入500元'}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {error && <p className="text-xs text-red-600 font-extrabold">{error}</p>}

      <div className="flex space-x-2 pt-2 border-t border-black/10">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          {t('cancel', lang)}
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          {initialGoal ? t('save', lang) : t('add', lang)}
        </Button>
      </div>
    </form>
  );
};
