import React, { useState, useEffect } from 'react';
import { SplitMember } from '../../types';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { t } from '../../utils/translations';

interface ExpenseFormProps {
  members: SplitMember[];
  onSubmit: (data: {
    payerId: string;
    title: string;
    amount: number;
    shares: { memberId: string; amount: number }[];
  }) => void;
  onCancel: () => void;
  lang?: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ members, onSubmit, onCancel, lang }) => {
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
      setError(lang === 'id' ? 'Masukkan nominal pengeluaran yang valid (> 0)' : lang === 'ms' ? 'Sila masukkan jumlah perbelanjaan yang sah (> 0)' : lang === 'ja' ? '有効な金額を入力してください（0より大きい値）' : '请输入有效的支出金额（大于 0）');
      return;
    }
    if (!title.trim()) {
      setError(lang === 'id' ? 'Nama pengeluaran / deskripsi harus diisi' : lang === 'ms' ? 'Nama perbelanjaan / keterangan mesti diisi' : lang === 'ja' ? '支出名を入力してください' : '请输入支出名称/说明');
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
        setError(lang === 'id' ? `Jumlah bagian manual (${manualSum.toLocaleString('id-ID')}) harus sama dengan total pengeluaran (${totalAmt.toLocaleString('id-ID')})` :
                 lang === 'ms' ? `Jumlah bahagian manual (${manualSum.toLocaleString('ms-MY')}) mestilah sama dengan jumlah perbelanjaan (${totalAmt.toLocaleString('ms-MY')})` :
                 lang === 'ja' ? `手動割り当ての合計金額（${manualSum.toLocaleString('ja-JP')}）は総支出金額（${totalAmt.toLocaleString('ja-JP')}）と一致する必要があります` :
                 `手动分摊的总额 (${manualSum.toLocaleString('zh-CN')}) 必须等于总支出金额 (${totalAmt.toLocaleString('zh-CN')})`);
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
        label={lang === 'id' ? 'Nama Pengeluaran' : lang === 'ms' ? 'Nama Perbelanjaan' : lang === 'ja' ? '支出名' : '支出名称'}
        placeholder={lang === 'id' ? 'Contoh: Tiket Bioskop atau Makan Malam' : lang === 'ms' ? 'Contoh: Tiket Wayang atau Makan Malam' : lang === 'ja' ? '例: 映画のチケット、ディナー' : '例如: 电影票或晚餐'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label={lang === 'id' ? 'Nominal Pengeluaran' : lang === 'ms' ? 'Jumlah Perbelanjaan' : lang === 'ja' ? '支出金額' : '支出金额'}
        type="number"
        placeholder={lang === 'id' ? 'Contoh: 150000' : lang === 'ms' ? 'Contoh: 150' : lang === 'ja' ? '例: 15000' : '例如: 1500'}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Select
        label={lang === 'id' ? 'Siapa yang membayar?' : lang === 'ms' ? 'Siapa yang membayar?' : lang === 'ja' ? '誰が支払いましたか？' : '谁付的款？'}
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
        <label className="text-xs uppercase font-bold tracking-wider text-black">
          {lang === 'id' ? 'Metode Pembagian' : lang === 'ms' ? 'Kaedah Pembahagian' : lang === 'ja' ? '割り勘方法' : '分摊方式'}
        </label>
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
            {lang === 'id' ? 'Bagi Rata' : lang === 'ms' ? 'Bahagi Rata' : lang === 'ja' ? '均等分割' : '均分'}
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
            {lang === 'id' ? 'Manual' : lang === 'ms' ? 'Manual' : lang === 'ja' ? '手動' : '手动'}
          </button>
        </div>
      </div>

      {/* Manual Split Fields */}
      {splitMethod === 'manual' && (
        <div className="border border-black p-3 bg-gray-50 flex flex-col space-y-2 max-h-[160px] overflow-y-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">
            {lang === 'id' ? 'Porsi Anggota:' : lang === 'ms' ? 'Bahagian Ahli:' : lang === 'ja' ? 'メンバーの負担額:' : '成员份额:'}
          </span>
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
          {t('cancel', lang)}
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          {lang === 'id' ? 'Simpan Pengeluaran' : lang === 'ms' ? 'Simpan Perbelanjaan' : lang === 'ja' ? '支出を保存' : '保存支出'}
        </Button>
      </div>
    </form>
  );
};
