import React, { useState, useEffect } from 'react';
import { getBills, updateBill, deleteBill, getProfile } from '../utils/storage';
import { Bill, AppProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { BillForm } from '../components/bills/BillForm';
import { ArrowLeft, Trash2, Edit, CheckSquare, Square } from 'lucide-react';
import { t, formatAmount } from '../utils/translations';

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

  const lang = profile.language || 'id';

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
    const confirmMsg = lang === 'id' ? 'Apakah Anda yakin ingin menghapus tagihan ini?' : lang === 'ms' ? 'Adakah anda pasti ingin memadam bil ini?' : lang === 'ja' ? 'この請求書を削除してもよろしいですか？' : '您确定要删除此账单吗？';
    if (confirm(confirmMsg)) {
      deleteBill(billId);
      onBack();
    }
  };

  const repeatLabels: Record<string, string> = {
    none: lang === 'id' ? 'Satu Kali (None)' : lang === 'ms' ? 'Sekali Sahaja' : lang === 'ja' ? '1回のみ' : '单次',
    daily: t('daily', lang),
    weekly: t('weekly', lang),
    monthly: t('monthly', lang),
    yearly: t('yearly', lang)
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Back Header */}
      <button
        onClick={onBack}
        className="flex items-center text-xs font-bold text-black uppercase tracking-wider hover:underline self-start space-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('back', lang)}</span>
      </button>

      {/* Detail Card */}
      <Card className="border-2 border-black p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-lg font-black text-black uppercase tracking-tight ${bill.paid ? 'line-through text-gray-400' : ''}`}>
                {bill.title}
              </h1>
              <p className="text-xs text-gray-400 font-bold mt-0.5">{t('dueDate', lang)}: {bill.dueDate}</p>
            </div>

            {bill.paid ? (
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">
                {t('paid', lang).toUpperCase()}
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest border border-red-600 text-red-600 px-2 py-0.5">
                {t('unpaid', lang).toUpperCase()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-black/10 text-xs">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{lang === 'id' ? 'Nominal Tagihan' : lang === 'ms' ? 'Jumlah Bil' : lang === 'ja' ? '請求金額' : '账单金额'}</span>
              <p className="text-sm font-extrabold text-black mt-0.5">
                {formatAmount(bill.amount, profile.currency, lang)}
              </p>
            </div>
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{t('repeat', lang)}</span>
              <p className="text-sm font-extrabold text-black mt-0.5 uppercase tracking-wide">
                {repeatLabels[bill.repeat] || bill.repeat}
              </p>
            </div>
          </div>

          {bill.note && (
            <div className="border border-dashed border-black/20 p-2.5 bg-gray-50 text-xs text-gray-600">
              <span className="font-bold text-[10px] uppercase block mb-1 text-black">{t('note', lang)}:</span>
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
              {lang === 'id' ? 'Tandai Belum Dibayar' : lang === 'ms' ? 'Tanda Belum Dibayar' : lang === 'ja' ? '未払いに戻す' : '标记为未支付'}
            </>
          ) : (
            <>
              <CheckSquare className="w-4 h-4" />
              {t('markAsPaid', lang)}
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
            {lang === 'id' ? 'Ubah Tagihan' : lang === 'ms' ? 'Ubah Bil' : lang === 'ja' ? '請求書を変更' : '修改账单'}
          </Button>
          <Button
            onClick={handleDelete}
            variant="danger"
            className="flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            {lang === 'id' ? 'Hapus Tagihan' : lang === 'ms' ? 'Padam Bil' : lang === 'ja' ? '請求書を削除' : '删除账单'}
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={lang === 'id' ? 'Ubah Tagihan' : lang === 'ms' ? 'Ubah Bil' : lang === 'ja' ? '請求書を変更' : '修改账单'}>
        <BillForm
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditOpen(false)}
          initialBill={bill}
          lang={lang}
        />
      </Modal>
    </div>
  );
};
