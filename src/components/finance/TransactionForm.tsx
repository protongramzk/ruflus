import React, { useState, useEffect } from 'react';
import { Category, Transaction } from '../../types';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: {
    type: 'income' | 'expense';
    amount: number;
    categoryId: string;
    accountId: string;
    note: string;
    createdAt?: string; // custom date
  }) => void;
  onCancel: () => void;
  initialTx?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  categories,
  onSubmit,
  onCancel,
  initialTx
}) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [customDate, setCustomDate] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialTx) {
      setType(initialTx.type);
      setAmount(initialTx.amount.toString());
      setCategoryId(initialTx.categoryId);
      setNote(initialTx.note);
      setCustomDate(initialTx.createdAt.split('T')[0]);
    } else {
      setType('expense');
      setAmount('');
      setCategoryId('');
      setNote('');
      setCustomDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialTx]);

  // Sync category options with current selected type
  const filteredCategories = categories.filter(c => c.type === type);

  useEffect(() => {
    if (!initialTx && filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [type, categories, initialTx]);

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    const cats = categories.filter(c => c.type === newType);
    if (cats.length > 0) {
      setCategoryId(cats[0].id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setError('Masukkan nominal transaksi yang valid (> 0)');
      return;
    }
    if (!categoryId) {
      setError('Silakan pilih kategori');
      return;
    }
    setError('');

    // If custom date is filled, pack it into ISOString format
    let finalCreatedAt: string | undefined;
    if (customDate) {
      const d = new Date(customDate);
      if (!isNaN(d.getTime())) {
        finalCreatedAt = d.toISOString();
      }
    }

    onSubmit({
      type,
      amount: numAmt,
      categoryId,
      accountId: 'default',
      note,
      createdAt: finalCreatedAt
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {/* Type Switch - Cassava UI: monochrome contrast buttons */}
      <div className="flex border border-black p-1 bg-gray-50">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`flex-1 py-1.5 text-xs font-extrabold uppercase tracking-widest transition-all duration-100 ${
            type === 'expense'
              ? 'bg-black text-white'
              : 'text-black hover:bg-black/5'
          }`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`flex-1 py-1.5 text-xs font-extrabold uppercase tracking-widest transition-all duration-100 ${
            type === 'income'
              ? 'bg-black text-white'
              : 'text-black hover:bg-black/5'
          }`}
        >
          Pemasukan
        </button>
      </div>

      <Input
        label="Nominal"
        type="number"
        placeholder="Contoh: 50000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Select
        label="Kategori"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        {filteredCategories.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Input
        label="Tanggal Transaksi"
        type="date"
        value={customDate}
        onChange={(e) => setCustomDate(e.target.value)}
        required
      />

      <Input
        label="Catatan"
        type="text"
        placeholder="Contoh: Beli makan siang"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {error && <p className="text-xs text-red-600 font-extrabold">{error}</p>}

      <div className="flex space-x-2 pt-2 border-t border-black/10">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          {initialTx ? 'Simpan' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
};
