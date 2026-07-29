import React, { useState, useEffect } from 'react';
import { Bill, BillRepeatType } from '../../types';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';

interface BillFormProps {
  onSubmit: (data: {
    title: string;
    amount: number;
    dueDate: string;
    repeat: BillRepeatType;
    paid: boolean;
    note: string;
  }) => void;
  onCancel: () => void;
  initialBill?: Bill | null;
}

export const BillForm: React.FC<BillFormProps> = ({ onSubmit, onCancel, initialBill }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [repeat, setRepeat] = useState<BillRepeatType>('none');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialBill) {
      setTitle(initialBill.title);
      setAmount(initialBill.amount.toString());
      setDueDate(initialBill.dueDate);
      setRepeat(initialBill.repeat);
      setNote(initialBill.note || '');
    } else {
      setTitle('');
      setAmount('');
      setDueDate('');
      setRepeat('none');
      setNote('');
    }
  }, [initialBill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setError('Masukkan nominal tagihan yang valid (> 0)');
      return;
    }
    if (!title.trim()) {
      setError('Nama tagihan harus diisi');
      return;
    }
    if (!dueDate) {
      setError('Tanggal jatuh tempo harus diisi');
      return;
    }
    setError('');

    onSubmit({
      title,
      amount: numAmt,
      dueDate,
      repeat,
      paid: initialBill ? initialBill.paid : false,
      note
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <Input
        label="Nama Tagihan"
        placeholder="Contoh: Tagihan Listrik atau BPJS"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Nominal Tagihan"
        type="number"
        placeholder="Contoh: 150000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Input
        label="Jatuh Tempo"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />

      <Select
        label="Pengulangan"
        value={repeat}
        onChange={(e) => setRepeat(e.target.value as BillRepeatType)}
        required
      >
        <option value="none">Satu Kali (None)</option>
        <option value="daily">Harian</option>
        <option value="weekly">Mingguan</option>
        <option value="monthly">Bulanan</option>
        <option value="yearly">Tahunan</option>
      </Select>

      <Input
        label="Catatan"
        placeholder="Contoh: Kode pembayaran 012345"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {error && <p className="text-xs text-red-600 font-extrabold">{error}</p>}

      <div className="flex space-x-2 pt-2 border-t border-black/10">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          {initialBill ? 'Simpan' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
};
