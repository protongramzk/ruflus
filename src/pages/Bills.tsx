import React, { useState, useEffect } from 'react';
import { getBills, addBill, getProfile } from '../utils/storage';
import { Bill, AppProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { BillForm } from '../components/bills/BillForm';
import { Plus, CreditCard, AlertCircle } from 'lucide-react';

interface BillsProps {
  onViewBill: (id: string) => void;
}

export const Bills: React.FC<BillsProps> = ({ onViewBill }) => {
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Tabs: 'unpaid' | 'paid'
  const [activeTab, setActiveTab] = useState<'unpaid' | 'paid'>('unpaid');

  const reloadData = () => {
    setProfile(getProfile());
    setBills(getBills());
  };

  useEffect(() => {
    reloadData();
  }, []);

  if (!profile) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // Divide into Overdue and Upcoming
  const unpaidBills = bills.filter(b => !b.paid);
  const paidBills = bills.filter(b => b.paid).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const overdueBills = unpaidBills.filter(b => b.dueDate < todayStr).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const upcomingBills = unpaidBills.filter(b => b.dueDate >= todayStr).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const handleCreateBill = (data: Omit<Bill, 'id'>) => {
    addBill(data);
    reloadData();
    setIsAddOpen(false);
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-black uppercase tracking-tight">Bills</h1>
          <p className="text-xs text-gray-400 font-bold">Ingat dan bayar tagihan tepat waktu</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border border-black p-1 bg-gray-50">
        <button
          onClick={() => setActiveTab('unpaid')}
          className={`flex-1 py-1.5 text-xs font-extrabold uppercase tracking-widest transition-all duration-100 ${
            activeTab === 'unpaid'
              ? 'bg-black text-white'
              : 'text-black hover:bg-black/5'
          }`}
        >
          Belum Dibayar ({unpaidBills.length})
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`flex-1 py-1.5 text-xs font-extrabold uppercase tracking-widest transition-all duration-100 ${
            activeTab === 'paid'
              ? 'bg-black text-white'
              : 'text-black hover:bg-black/5'
          }`}
        >
          Sudah Dibayar ({paidBills.length})
        </button>
      </div>

      {/* Bills list content */}
      <div className="flex flex-col space-y-4 mt-2">
        {activeTab === 'unpaid' ? (
          <>
            {/* Overdue Section */}
            {overdueBills.length > 0 && (
              <div className="flex flex-col space-y-2">
                <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-widest flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Lewat Jatuh Tempo ({overdueBills.length})
                </h3>

                <div className="flex flex-col space-y-2">
                  {overdueBills.map(bill => (
                    <Card
                      key={bill.id}
                      onClick={() => onViewBill(bill.id)}
                      className="border-red-600 border bg-red-50/10 p-3"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-extrabold text-black uppercase tracking-wide truncate max-w-[150px]">
                            {bill.title}
                          </h4>
                          <p className="text-[10px] text-red-600 font-bold mt-0.5">
                            Sangat terlambat! Jatuh tempo: {bill.dueDate}
                          </p>
                        </div>
                        <span className="text-xs font-extrabold text-red-600">
                          {profile.currency} {bill.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Section */}
            <div className="flex flex-col space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-1.5">
                Mendatang ({upcomingBills.length})
              </h3>

              {upcomingBills.length === 0 && overdueBills.length === 0 ? (
                <div className="py-12 border border-dashed border-black/20 text-center flex flex-col items-center justify-center space-y-2 bg-gray-50/50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Bebas Tagihan! Belum ada tagihan aktif.
                  </span>
                  <Button variant="secondary" onClick={() => setIsAddOpen(true)} className="text-xs px-3 py-1">
                    Tambah Tagihan
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  {upcomingBills.map(bill => (
                    <Card
                      key={bill.id}
                      onClick={() => onViewBill(bill.id)}
                      className="p-3"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-extrabold text-black uppercase tracking-wide truncate max-w-[150px]">
                            {bill.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 font-bold mt-0.5">
                            Jatuh tempo: {bill.dueDate}
                          </p>
                        </div>
                        <span className="text-xs font-extrabold text-black">
                          {profile.currency} {bill.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Paid Bills */
          <div className="flex flex-col space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-black border-b border-black pb-1.5">
              Sudah Dibayar ({paidBills.length})
            </h3>

            {paidBills.length === 0 ? (
              <div className="py-12 border border-dashed border-black/20 text-center text-xs text-gray-400 uppercase tracking-wider bg-gray-50/50">
                Belum ada tagihan terbayar
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                {paidBills.map(bill => (
                  <Card
                    key={bill.id}
                    onClick={() => onViewBill(bill.id)}
                    className="p-3 bg-gray-50/50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-extrabold text-black uppercase tracking-wide truncate max-w-[150px] line-through">
                          {bill.title}
                        </h4>
                        <p className="text-[10px] text-green-600 font-bold mt-0.5">
                          LUNAS pada {bill.dueDate}
                        </p>
                      </div>
                      <span className="text-xs font-extrabold text-black line-through">
                        {profile.currency} {bill.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
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

      {/* Add Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Tambah Tagihan Baru">
        <BillForm
          onSubmit={handleCreateBill}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>
    </div>
  );
};
