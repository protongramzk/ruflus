import React, { useState, useEffect } from 'react';
import { Bill, BillRepeatType } from '../../types';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { t } from '../../utils/translations';

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
  lang?: string;
}

export const BillForm: React.FC<BillFormProps> = ({ onSubmit, onCancel, initialBill, lang }) => {
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
      setError(lang === 'id' ? 'Masukkan nominal tagihan yang valid (> 0)' : lang === 'ms' ? 'Sila masukkan jumlah bil yang sah (> 0)' : lang === 'ja' ? '有効な金額を入力してください（0より大きい値）' : '请输入有效的账单金额（大于 0）');
      return;
    }
    if (!title.trim()) {
      setError(lang === 'id' ? 'Nama tagihan harus diisi' : lang === 'ms' ? 'Nama bil mesti diisi' : lang === 'ja' ? '請求書名を入力してください' : '请输入账单名称');
      return;
    }
    if (!dueDate) {
      setError(lang === 'id' ? 'Tanggal jatuh tempo harus diisi' : lang === 'ms' ? 'Tarikh akhir mesti diisi' : lang === 'ja' ? '期日を入力してください' : '请选择到期日期');
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
        label={lang === 'id' ? 'Nama Tagihan' : lang === 'ms' ? 'Nama Bil' : lang === 'ja' ? '請求書名' : '账单名称'}
        placeholder={lang === 'id' ? 'Contoh: Tagihan Listrik atau BPJS' : lang === 'ms' ? 'Contoh: Bil Elektrik atau Internet' : lang === 'ja' ? '例: 電気代、ネット代' : '例如: 电费或水费账单'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label={lang === 'id' ? 'Nominal Tagihan' : lang === 'ms' ? 'Jumlah Bil' : lang === 'ja' ? '請求金額' : '账单金额'}
        type="number"
        placeholder={lang === 'id' ? 'Contoh: 150000' : lang === 'ms' ? 'Contoh: 150' : lang === 'ja' ? '例: 15000' : '例如: 1500'}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Input
        label={t('dueDate', lang)}
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />

      <Select
        label={t('repeat', lang)}
        value={repeat}
        onChange={(e) => setRepeat(e.target.value as BillRepeatType)}
        required
      >
        <option value="none">{lang === 'id' ? 'Satu Kali (None)' : lang === 'ms' ? 'Sekali Sahaja' : lang === 'ja' ? '1回のみ' : '单次'}</option>
        <option value="daily">{t('daily', lang)}</option>
        <option value="weekly">{t('weekly', lang)}</option>
        <option value="monthly">{t('monthly', lang)}</option>
        <option value="yearly">{t('yearly', lang)}</option>
      </Select>

      <Input
        label={t('note', lang)}
        placeholder={lang === 'id' ? 'Contoh: Kode pembayaran 012345' : lang === 'ms' ? 'Contoh: Kod pembayaran 012345' : lang === 'ja' ? '例: お支払いコード 012345' : '例如: 缴费代码 012345'}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {error && <p className="text-xs text-red-600 font-extrabold">{error}</p>}

      <div className="flex space-x-2 pt-2 border-t border-black/10">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          {t('cancel', lang)}
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          {initialBill ? t('save', lang) : t('add', lang)}
        </Button>
      </div>
    </form>
  );
};
