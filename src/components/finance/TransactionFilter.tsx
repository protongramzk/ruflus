import React from 'react';
import { Category } from '../../types';
import { Select, Input } from '../ui/Input';

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
  setEndDate
}) => {
  return (
    <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
      <div className="text-xs font-black uppercase tracking-widest text-black border-b border-black/10 pb-1.5">
        Filter Transaksi
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Tipe"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">SEMUA TIPE</option>
          <option value="income">PEMASUKAN</option>
          <option value="expense">PENGELUARAN</option>
        </Select>

        <Select
          label="Kategori"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">SEMUA KATEGORI</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.type === 'income' ? 'IN' : 'OUT'})
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Mulai Tanggal"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          label="Sampai Tanggal"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
};
