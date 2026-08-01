import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { t } from '../../utils/translations';

interface DepositFormProps {
  onSubmit: (data: { amount: number; note: string }) => void;
  onCancel: () => void;
  lang?: string;
}

export const DepositForm: React.FC<DepositFormProps> = ({ onSubmit, onCancel, lang }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setError(lang === 'id' ? 'Masukkan nominal setoran yang valid (> 0)' : lang === 'ms' ? 'Sila masukkan nominal simpanan yang sah (> 0)' : lang === 'ja' ? '有効な貯金金額を入力してください（0より大きい値）' : '请输入有效的存入金额（大于 0）');
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
        label={lang === 'id' ? 'Nominal Setoran' : lang === 'ms' ? 'Jumlah Simpanan' : lang === 'ja' ? '貯金金額' : '存入金额'}
        type="number"
        placeholder={lang === 'id' ? 'Contoh: 100000' : lang === 'ms' ? 'Contoh: 100' : lang === 'ja' ? '例: 10000' : '例如: 1000'}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Input
        label={lang === 'id' ? 'Catatan / Sumber Dana' : lang === 'ms' ? 'Nota / Sumber Dana' : lang === 'ja' ? 'メモ / 資金源' : '备注 / 资金来源'}
        placeholder={lang === 'id' ? 'Contoh: Sisa gaji bulan ini atau bonus' : lang === 'ms' ? 'Contoh: Baki gaji bulan ini atau bonus' : lang === 'ja' ? '例: 今月の給与の残り、ボーナス' : '例如: 本月工资结余或奖金'}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {error && <p className="text-xs text-red-600 font-extrabold">{error}</p>}

      <div className="flex space-x-2 pt-2 border-t border-black/10">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          {t('cancel', lang)}
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          {t('deposit', lang)}
        </Button>
      </div>
    </form>
  );
};
