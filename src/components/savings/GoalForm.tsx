import React, { useState, useEffect } from 'react';
import { SavingGoal } from '../../types';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

interface GoalFormProps {
  onSubmit: (data: {
    name: string;
    targetAmount: number;
    deadline: string;
    note: string;
  }) => void;
  onCancel: () => void;
  initialGoal?: SavingGoal | null;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel, initialGoal }) => {
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
      setError('Masukkan nominal target tabungan yang valid (> 0)');
      return;
    }
    if (!name.trim()) {
      setError('Nama target tabungan harus diisi');
      return;
    }
    if (!deadline) {
      setError('Tanggal tenggat waktu harus diisi');
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
        label="Nama Target Tabungan"
        placeholder="Contoh: Beli Laptop Baru atau Menikah"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="Nominal Target"
        type="number"
        placeholder="Contoh: 10000000"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        required
      />

      <Input
        label="Tenggat Waktu (Deadline)"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />

      <Textarea
        label="Catatan"
        placeholder="Contoh: Menyisihkan 500rb per bulan"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {error && <p className="text-xs text-red-600 font-extrabold">{error}</p>}

      <div className="flex space-x-2 pt-2 border-t border-black/10">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          {initialGoal ? 'Simpan Perubahan' : 'Buat Target'}
        </Button>
      </div>
    </form>
  );
};
