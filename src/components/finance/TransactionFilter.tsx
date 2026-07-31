import React from 'react';
import { Category } from '../../types';
import { Select, Input } from '../ui/Input';
import { t, translateCategory } from '../../utils/translations';

interface TransactionFilterProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  lang?: string;
}

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  lang
}) => {
  return (
    <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
      <div className="text-xs font-black uppercase tracking-widest text-black border-b border-black/10 pb-1.5">
        {lang === 'id' ? 'Filter Transaksi' : lang === 'ms' ? 'Tapis Transaksi' : lang === 'ja' ? '取引フィルター' : '交易过滤'}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          label={lang === 'id' ? 'Tipe' : lang === 'ms' ? 'Jenis' : lang === 'ja' ? 'タイプ' : '类型'}
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">{lang === 'id' ? 'SEMUA TIPE' : lang === 'ms' ? 'SEMUA JENIS' : lang === 'ja' ? 'すべてのタイプ' : '所有类型'}</option>
          <option value="income">{t('income', lang).toUpperCase()}</option>
          <option value="expense">{t('expense', lang).toUpperCase()}</option>
        </Select>

        <Select
          label={t('category', lang)}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">{lang === 'id' ? 'SEMUA KATEGORI' : lang === 'ms' ? 'SEMUA KATEGORI' : lang === 'ja' ? 'すべてのカテゴリ' : '所有分类'}</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {translateCategory(c.id, c.name, lang)} ({c.type === 'income' ? 'IN' : 'OUT'})
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label={lang === 'id' ? 'Mulai Tanggal' : lang === 'ms' ? 'Tarikh Mula' : lang === 'ja' ? '開始日' : '开始日期'}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          label={lang === 'id' ? 'Sampai Tanggal' : lang === 'ms' ? 'Tarikh Akhir' : lang === 'ja' ? '終了日' : '结束日期'}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
};
