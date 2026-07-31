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
import { TRANSLATIONS } from '../utils/i18n';

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

  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.id;

  // Apply filters
  const filteredTransactions = transactions.filter(tx => {
    if (selectedType !== 'all' && tx.type !== selectedType) return false;
    if (selectedCategory !== 'all' && tx.categoryId !== selectedCategory) return false;

    const txDateStr = tx.createdAt.split('T')[0];
    if (startDate && txDateStr < startDate) return false;
    if (endDate && txDateStr > endDate) return false;

    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Calculations
  const incomeTotal = filteredTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const expenseTotal = filteredTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

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
      if (data.createdAt) {
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
      if (confirm(t.confirmDeleteTx)) {
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
          <h1 className="text-xl font-black text-black uppercase tracking-tight">{t.finance}</h1>
          <p className="text-xs text-gray-400 font-bold">{t.financeSub}</p>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant={showFilters ? 'primary' : 'secondary'}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          {t.filter}
        </Button>
      </div>

      {/* Transaction Summary */}
      <TransactionSummary
        income={incomeTotal}
        expense={expenseTotal}
        currency={profile.currency}
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
        />
      )}

      {/* Transaction List */}
      <div className="flex flex-col space-y-2 mt-2">
        <h2 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-1.5">
          {t.txHistory} ({filteredTransactions.length})
        </h2>

        {filteredTransactions.length === 0 ? (
          <div className="py-12 border border-dashed border-black/20 text-center flex flex-col items-center justify-center space-y-2 bg-gray-50/50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {t.noTxFound}
            </span>
            <Button variant="secondary" onClick={() => setIsAddOpen(true)} className="text-xs px-3 py-1">
              {t.addNow}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {filteredTransactions.map(tx => {
              const cat = categories.find(c => c.id === tx.categoryId);
              const isInc = tx.type === 'income';
              const localeMap: Record<string, string> = { id: 'id-ID', ms: 'ms-MY', ja: 'ja-JP', zh: 'zh-CN' };
              const currentLocale = localeMap[profile.language] || 'id-ID';

              const dateStr = new Date(tx.createdAt).toLocaleDateString(currentLocale, {
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
                          {tx.note || cat?.name || 'Transaksi'}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-bold">
                          {dateStr} • {cat?.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-xs font-extrabold ${isInc ? 'text-green-600' : 'text-black'}`}>
                        {isInc ? '+' : '-'} {profile.currency} {tx.amount.toLocaleString('id-ID')}
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
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={t.addTx}>
        <TransactionForm
          categories={categories}
          onSubmit={handleAddTx}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => { setIsDetailOpen(false); setSelectedTx(null); }} title={t.txDetail}>
        {selectedTx && (
          <div className="flex flex-col space-y-4">
            <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-2">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t.amount}</span>
                <p className={`text-xl font-extrabold ${selectedTx.type === 'income' ? 'text-green-600' : 'text-black'}`}>
                  {selectedTx.type === 'income' ? '+' : '-'} {profile.currency} {selectedTx.amount.toLocaleString('id-ID')}
                </p>
              </div>

              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t.category}</span>
                <p className="text-xs font-extrabold text-black uppercase tracking-wide">
                  {categories.find(c => c.id === selectedTx.categoryId)?.name || '-'}
                </p>
              </div>

              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t.date}</span>
                <p className="text-xs font-medium text-black">
                  {new Date(selectedTx.createdAt).toLocaleString('id-ID')}
                </p>
              </div>

              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t.note}</span>
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
                {t.delete}
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  setIsDetailOpen(false);
                  setIsEditOpen(true);
                }}
              >
                {t.edit}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedTx(null); }} title={t.txEdit}>
        <TransactionForm
          categories={categories}
          initialTx={selectedTx}
          onSubmit={handleEditTx}
          onCancel={() => {
            setIsEditOpen(false);
            setSelectedTx(null);
          }}
        />
      </Modal>
    </div>
  );
};
