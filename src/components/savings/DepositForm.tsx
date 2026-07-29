import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface DepositFormProps {
  onSubmit: (data: { amount: number; note: string }) => void;
  onCancel: () => void;
}

export const DepositForm: React.FC<DepositFormProps> = ({ onSubmit, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setError('Masukkan nominal setoran yang valid (> 0)');
      return;
    }
    setError('');

    onSubmit({
      amount: numAmt,
      note
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <Input
        label="Nominal Setoran"
        type="number"
        placeholder="Contoh: 100000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Input
        label="Catatan / Sumber Dana"
        placeholder="Contoh: Sisa gaji bulan ini atau bonus"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {error && <p className="text-xs text-red-600 font-extrabold">{error}</p>}

      <div className="flex space-x-2 pt-2 border-t border-black/10">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          Setor Tabungan
        </Button>
      </div>
    </form>
  );
};
