import React, { useState, useEffect } from 'react';
import {
  getTransactions,
  getCategories,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getProfile
} from '../utils/storage';
import { Transaction, Category, AppProfile } from '../types';
import { TransactionSummary } from '../components/finance/TransactionSummary';
import { TransactionFilter } from '../components/finance/TransactionFilter';
import { TransactionForm } from '../components/finance/TransactionForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { Filter, Plus } from 'lucide-react';
import { t, formatAmount, translateCategory, getLocale } from '../utils/translations';

interface FinanceProps {
  initialTxId?: string | null;
  onClearInitialId?: () => void;
}

export const Finance: React.FC<FinanceProps> = ({ initialTxId, onClearInitialId }) => {
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reloadData = () => {
    setProfile(getProfile());
    setTransactions(getTransactions());
    setCategories(getCategories());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Handle opening directly into detail page if routed from RecentTransactions
  useEffect(() => {
    if (initialTxId) {
      const txs = getTransactions();
      const found = txs.find(t => t.id === initialTxId);
      if (found) {
        setSelectedTx(found);
        setIsDetailOpen(true);
      }
      if (onClearInitialId) onClearInitialId();
    }
  }, [initialTxId]);

  if (!profile) return null;

  const lang = profile.language || 'id';

  // Apply filters
  const filteredTransactions = transactions.filter(t => {
    if (selectedType !== 'all' && t.type !== selectedType) return false;
    if (selectedCategory !== 'all' && t.categoryId !== selectedCategory) return false;

    const txDateStr = t.createdAt.split('T')[0];
    if (startDate && txDateStr < startDate) return false;
    if (endDate && txDateStr > endDate) return false;

    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Calculations
  const incomeTotal = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Form submits
  const handleAddTx = (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: string }) => {
    addTransaction(data);
    reloadData();
    setIsAddOpen(false);
  };

  const handleEditTx = (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: string }) => {
    if (selectedTx) {
      updateTransaction(selectedTx.id, {
        type: data.type,
        amount: data.amount,
        categoryId: data.categoryId,
        note: data.note,
        ...(data.createdAt ? { updatedAt: new Date().toISOString() } : {})
      });
      // Directly assign custom date if provided in raw format since our helper handles updates on general updates
      if (data.createdAt) {
        // Retrieve and overwrite specifically
        const all = getTransactions();
        const found = all.find(x => x.id === selectedTx.id);
        if (found) {
          found.createdAt = data.createdAt;
          localStorage.setItem('ruflus_transactions', JSON.stringify(all));
        }
      }
      reloadData();
      setIsEditOpen(false);
      setSelectedTx(null);
      setIsDetailOpen(false);
    }
  };

  const handleDeleteTx = () => {
    if (selectedTx) {
      const confirmMsg = lang === 'id' ? 'Apakah Anda yakin ingin menghapus transaksi ini?' : lang === 'ms' ? 'Adakah anda pasti ingin memadam transaksi ini?' : lang === 'ja' ? 'この取引を削除してもよろしいですか？' : '您确定要删除这条交易记录吗？';
      if (confirm(confirmMsg)) {
        deleteTransaction(selectedTx.id);
        reloadData();
        setSelectedTx(null);
        setIsDetailOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-black uppercase tracking-tight">{t('finance', lang)}</h1>
          <p className="text-xs text-gray-400 font-bold">
            {lang === 'id' ? 'Catat pengeluaran dan pemasukan harian' : lang === 'ms' ? 'Catat perbelanjaan dan pendapatan harian' : lang === 'ja' ? '日々の収支を記録します' : '记录每日收入与支出'}
          </p>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant={showFilters ? 'primary' : 'secondary'}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Transaction Summary */}
      <TransactionSummary
        income={incomeTotal}
        expense={expenseTotal}
        currency={profile.currency}
        lang={lang}
      />

      {/* Conditional Filter Section */}
      {showFilters && (
        <TransactionFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          lang={lang}
        />
      )}

      {/* Transaction List */}
      <div className="flex flex-col space-y-2 mt-2">
        <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-1.5">
          {lang === 'id' ? 'Riwayat Transaksi' : lang === 'ms' ? 'Rekod Transaksi' : lang === 'ja' ? '取引履歴' : '交易历史'} ({filteredTransactions.length})
        </h2>

        {filteredTransactions.length === 0 ? (
          <div className="py-12 border border-dashed border-black/20 text-center flex flex-col items-center justify-center space-y-2 bg-gray-50/50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {lang === 'id' ? 'Belum ada transaksi yang sesuai' : lang === 'ms' ? 'Tiada transaksi yang sepadan' : lang === 'ja' ? '該当する取引はありません' : '暂无符合条件的交易'}
            </span>
            <Button variant="secondary" onClick={() => setIsAddOpen(true)} className="text-xs px-3 py-1">
              {lang === 'id' ? 'Catat Sekarang' : lang === 'ms' ? 'Catat Sekarang' : lang === 'ja' ? '今すぐ記録する' : '立即记录'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {filteredTransactions.map(tx => {
              const cat = categories.find(c => c.id === tx.categoryId);
              const isInc = tx.type === 'income';
              const catNameTranslated = cat ? translateCategory(cat.id, cat.name, lang) : '';
              const dateStr = new Date(tx.createdAt).toLocaleDateString(getLocale(lang), {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              return (
                <Card
                  key={tx.id}
                  onClick={() => {
                    setSelectedTx(tx);
                    setIsDetailOpen(true);
                  }}
                  className="p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 truncate">
                      <div className="p-1.5 border border-black bg-white shrink-0">
                        <DynamicIcon name={cat?.icon || 'HelpCircle'} className="w-4 h-4 text-black" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-extrabold text-black uppercase tracking-wide truncate max-w-[150px]">
                          {tx.note || catNameTranslated || t('finance', lang)}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-bold">
                          {dateStr} • {catNameTranslated}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-xs font-extrabold ${isInc ? 'text-green-600' : 'text-black'}`}>
                        {isInc ? '+' : '-'} {formatAmount(tx.amount, profile.currency, lang)}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={() => setIsAddOpen(true)}
          className="p-4 bg-black text-white hover:bg-white hover:text-black border-2 border-black shadow-lg transition-all duration-150 flex items-center justify-center"
          style={{ borderRadius: '0px' }}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Modals */}
      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={t('addTransaction', lang)}>
        <TransactionForm
          categories={categories}
          onSubmit={handleAddTx}
          onCancel={() => setIsAddOpen(false)}
          lang={lang}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => { setIsDetailOpen(false); setSelectedTx(null); }} title={lang === 'id' ? 'Detail Transaksi' : lang === 'ms' ? 'Butiran Transaksi' : lang === 'ja' ? '取引の詳細' : '交易详情'}>
        {selectedTx && (
          <div className="flex flex-col space-y-4">
            <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-2">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t('amount', lang)}</span>
                <p className={`text-xl font-extrabold ${selectedTx.type === 'income' ? 'text-green-600' : 'text-black'}`}>
                  {selectedTx.type === 'income' ? '+' : '-'} {formatAmount(selectedTx.amount, profile.currency, lang)}
                </p>
              </div>

              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t('category', lang)}</span>
                <p className="text-xs font-extrabold text-black uppercase tracking-wide">
                  {categories.find(c => c.id === selectedTx.categoryId)?.name ? translateCategory(selectedTx.categoryId, categories.find(c => c.id === selectedTx.categoryId)!.name, lang) : '-'}
                </p>
              </div>

              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t('date', lang)}</span>
                <p className="text-xs font-medium text-black">
                  {new Date(selectedTx.createdAt).toLocaleString(getLocale(lang))}
                </p>
              </div>

              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t('note', lang)}</span>
                <p className="text-xs font-medium text-black">
                  {selectedTx.note || '-'}
                </p>
              </div>
            </div>

            <div className="flex space-x-2 pt-2 border-t border-black/10">
              <Button
                variant="danger"
                fullWidth
                onClick={handleDeleteTx}
              >
                {t('delete', lang)}
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  setIsDetailOpen(false);
                  setIsEditOpen(true);
                }}
              >
                {t('edit', lang)}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedTx(null); }} title={t('editTransaction', lang)}>
        <TransactionForm
          categories={categories}
          initialTx={selectedTx}
          onSubmit={handleEditTx}
          onCancel={() => {
            setIsEditOpen(false);
            setSelectedTx(null);
          }}
          lang={lang}
        />
      </Modal>
    </div>
  );
};
