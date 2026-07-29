import React, { useState, useEffect } from 'react';
import { SplitMember } from '../../types';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';

interface ExpenseFormProps {
  members: SplitMember[];
  onSubmit: (data: {
    payerId: string;
    title: string;
    amount: number;
    shares: { memberId: string; amount: number }[];
  }) => void;
  onCancel: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ members, onSubmit, onCancel }) => {
  const [payerId, setPayerId] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Keeps track of manual adjustments or split methods
  // Options: 'equal' (pembagian rata) or 'manual' (pembagian manual)
  const [splitMethod, setSplitMethod] = useState<'equal' | 'manual'>('equal');
  const [manualShares, setManualShares] = useState<Record<string, string>>({});

  useEffect(() => {
    if (members.length > 0) {
      setPayerId(members[0].id);

      // Initialize manual shares with empty strings
      const initShares: Record<string, string> = {};
      members.forEach(m => {
        initShares[m.id] = '';
      });
      setManualShares(initShares);
    }
  }, [members]);

  const handleManualShareChange = (memberId: string, value: string) => {
    setManualShares({
      ...manualShares,
      [memberId]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmt = parseFloat(amount);
    if (isNaN(totalAmt) || totalAmt <= 0) {
      setError('Masukkan nominal pengeluaran yang valid (> 0)');
      return;
    }
    if (!title.trim()) {
      setError('Nama pengeluaran / deskripsi harus diisi');
      return;
    }

    let finalShares: { memberId: string; amount: number }[] = [];

    if (splitMethod === 'equal') {
      // Divide equally among all members
      const shareAmount = totalAmt / members.length;
      finalShares = members.map(m => ({
        memberId: m.id,
        amount: shareAmount
      }));
    } else {
      // Manual validation
      let manualSum = 0;
      const sharesList = members.map(m => {
        const amt = parseFloat(manualShares[m.id] || '0');
        manualSum += isNaN(amt) ? 0 : amt;
        return {
          memberId: m.id,
          amount: isNaN(amt) ? 0 : amt
        };
      });

      if (Math.abs(manualSum - totalAmt) > 0.01) {
        setError(`Jumlah bagian manual (${manualSum.toLocaleString('id-ID')}) harus sama dengan total pengeluaran (${totalAmt.toLocaleString('id-ID')})`);
        return;
      }

      finalShares = sharesList;
    }

    setError('');
    onSubmit({
      payerId,
      title,
      amount: totalAmt,
      shares: finalShares
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <Input
        label="Nama Pengeluaran"
        placeholder="Contoh: Tiket Bioskop atau Makan Malam"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Nominal Pengeluaran"
        type="number"
        placeholder="Contoh: 150000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Select
        label="Siapa yang membayar?"
        value={payerId}
        onChange={(e) => setPayerId(e.target.value)}
        required
      >
        {members.map(m => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </Select>

      {/* Split Method Toggle */}
      <div className="flex flex-col space-y-1">
        <label className="text-xs uppercase font-bold tracking-wider text-black">Metode Pembagian</label>
        <div className="flex border border-black p-1 bg-gray-50">
          <button
            type="button"
            onClick={() => setSplitMethod('equal')}
            className={`flex-1 py-1 text-xs font-extrabold uppercase tracking-widest transition-all duration-100 ${
              splitMethod === 'equal'
                ? 'bg-black text-white'
                : 'text-black hover:bg-black/5'
            }`}
          >
            Bagi Rata
          </button>
          <button
            type="button"
            onClick={() => setSplitMethod('manual')}
            className={`flex-1 py-1 text-xs font-extrabold uppercase tracking-widest transition-all duration-100 ${
              splitMethod === 'manual'
                ? 'bg-black text-white'
                : 'text-black hover:bg-black/5'
            }`}
          >
            Manual
          </button>
        </div>
      </div>

      {/* Manual Split Fields */}
      {splitMethod === 'manual' && (
        <div className="border border-black p-3 bg-gray-50 flex flex-col space-y-2 max-h-[160px] overflow-y-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">Porsi Anggota:</span>
          {members.map(m => (
            <div key={m.id} className="flex items-center justify-between space-x-2">
              <span className="text-xs font-bold text-black truncate max-w-[150px]">{m.name}</span>
              <div className="w-32">
                <Input
                  type="number"
                  placeholder="0"
                  value={manualShares[m.id] || ''}
                  onChange={(e) => handleManualShareChange(m.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-600 font-extrabold">{error}</p>}

      <div className="flex space-x-2 pt-2 border-t border-black/10">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          Simpan Pengeluaran
        </Button>
      </div>
    </form>
  );
};
