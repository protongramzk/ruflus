import React, { useState, useEffect } from 'react';
import { getBills, updateBill, deleteBill, getProfile } from '../utils/storage';
import { Bill, AppProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { BillForm } from '../components/bills/BillForm';
import { ArrowLeft, Trash2, Edit, CheckSquare, Square } from 'lucide-react';

interface BillDetailProps {
  billId: string;
  onBack: () => void;
}

export const BillDetail: React.FC<BillDetailProps> = ({ billId, onBack }) => {
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);

  // Modals
  const [isEditOpen, setIsEditOpen] = useState(false);

  const reloadData = () => {
    setProfile(getProfile());
    const list = getBills();
    const found = list.find(b => b.id === billId);
    if (found) {
      setBill(found);
    }
  };

  useEffect(() => {
    reloadData();
  }, [billId]);

  if (!bill || !profile) return null;

  const handleTogglePaid = () => {
    updateBill(billId, { paid: !bill.paid });
    reloadData();
  };

  const handleEditSubmit = (data: Omit<Bill, 'id'>) => {
    updateBill(billId, data);
    reloadData();
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus tagihan ini?')) {
      deleteBill(billId);
      onBack();
    }
  };

  const repeatLabels: Record<string, string> = {
    none: 'Satu Kali (None)',
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
    yearly: 'Tahunan'
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Back Header */}
      <button
        onClick={onBack}
        className="flex items-center text-xs font-bold text-black uppercase tracking-wider hover:underline self-start space-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali</span>
      </button>

      {/* Detail Card */}
      <Card className="border-2 border-black p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-lg font-black text-black uppercase tracking-tight ${bill.paid ? 'line-through text-gray-400' : ''}`}>
                {bill.title}
              </h1>
              <p className="text-xs text-gray-400 font-bold mt-0.5">Jatuh Tempo: {bill.dueDate}</p>
            </div>

            {bill.paid ? (
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                PAID
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest border border-red-600 text-red-600 px-2 py-0.5">
                UNPAID
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-black/10 text-xs">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">Nominal Tagihan</span>
              <p className="text-sm font-extrabold text-black mt-0.5">
                {profile.currency} {bill.amount.toLocaleString('id-ID')}
              </p>
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">Pengulangan</span>
              <p className="text-sm font-extrabold text-black mt-0.5 uppercase tracking-wide">
                {repeatLabels[bill.repeat] || bill.repeat}
              </p>
            </div>
          </div>

          {bill.note && (
            <div className="border border-dashed border-black/20 p-2.5 bg-gray-50 text-xs text-gray-600">
              <span className="font-bold text-[10px] uppercase block mb-1 text-black">Catatan Tagihan:</span>
              {bill.note}
            </div>
          )}
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col space-y-2">
        <Button
          onClick={handleTogglePaid}
          variant="primary"
          className="flex items-center justify-center gap-1.5"
        >
          {bill.paid ? (
            <>
              <Square className="w-4 h-4" />
              Tandai Belum Dibayar
            </>
          ) : (
            <>
              <CheckSquare className="w-4 h-4" />
              Tandai Sudah Dibayar
            </>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => setIsEditOpen(true)}
            variant="secondary"
            className="flex items-center justify-center gap-1.5"
          >
            <Edit className="w-4 h-4" />
            Ubah Tagihan
          </Button>
          <Button
            onClick={handleDelete}
            variant="danger"
            className="flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Tagihan
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Ubah Tagihan">
        <BillForm
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditOpen(false)}
          initialBill={bill}
        />
      </Modal>
    </div>
  );
};
