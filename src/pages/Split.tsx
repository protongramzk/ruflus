import React, { useState, useEffect } from 'react';
import {
  getSplitGroups,
  getSplitMembers,
  addSplitGroup,
  getProfile,
  getSplitExpenses,
  getSplitShares
} from '../utils/storage';
import { SplitGroup, SplitMember, SplitExpense, SplitShare, AppProfile } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { GroupForm } from '../components/split/GroupForm';
import { Users, Plus } from 'lucide-react';
import { t, formatAmount } from '../utils/translations';

interface SplitProps {
  onViewGroup: (groupId: string) => void;
}

export const Split: React.FC<SplitProps> = ({ onViewGroup }) => {
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [groups, setGroups] = useState<SplitGroup[]>([]);
  const [members, setMembers] = useState<SplitMember[]>([]);
  const [expenses, setExpenses] = useState<SplitExpense[]>([]);
  const [shares, setShares] = useState<SplitShare[]>([]);

  // Tabs: 'active' | 'settled'
  const [activeTab, setActiveTab] = useState<'active' | 'settled'>('active');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const reloadData = () => {
    setProfile(getProfile());
    setGroups(getSplitGroups());
    setMembers(getSplitMembers());
    setExpenses(getSplitExpenses());
    setShares(getSplitShares());
  };

  useEffect(() => {
    reloadData();
  }, []);

  if (!profile) return null;

  const lang = profile.language || 'id';

  // Filter groups as settled or active
  // A group is settled if ALL expenses shares are settled
  const groupsWithStatus = groups.map(group => {
    const groupExpenses = expenses.filter(e => e.groupId === group.id);
    const expIds = groupExpenses.map(e => e.id);
    const groupShares = shares.filter(s => expIds.includes(s.expenseId));

    // If no expenses, it is technically active
    const isSettled = groupShares.length > 0 && groupShares.every(s => s.settled);
    const totalAmount = groupExpenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      ...group,
      isSettled,
      totalAmount,
      memberCount: members.filter(m => m.groupId === group.id).length
    };
  });

  const filteredGroups = groupsWithStatus.filter(g =>
    activeTab === 'settled' ? g.isSettled : !g.isSettled
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCreateGroup = (data: { name: string; description: string; members: string[] }) => {
    addSplitGroup({ name: data.name, description: data.description }, data.members);
    reloadData();
    setIsCreateOpen(false);
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-black uppercase tracking-tight">{t('split', lang)}</h1>
          <p className="text-xs text-gray-400 font-bold">
            {lang === 'id' ? 'Patungan bersama teman & keluarga' : lang === 'ms' ? 'Kongsi bil bersama rakan & keluarga' : lang === 'ja' ? '友達や家族との割り勘を管理します' : '与朋友和家人分摊账单'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border border-black p-1 bg-gray-50">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-1.5 text-xs font-extrabold uppercase tracking-widest transition-all duration-100 ${
            activeTab === 'active'
              ? 'bg-black text-white'
              : 'text-black hover:bg-black/5'
          }`}
        >
          {lang === 'id' ? 'Grup Aktif' : lang === 'ms' ? 'Kumpulan Aktif' : lang === 'ja' ? 'アクティブ' : '活动分组'}
        </button>
        <button
          onClick={() => setActiveTab('settled')}
          className={`flex-1 py-1.5 text-xs font-extrabold uppercase tracking-widest transition-all duration-100 ${
            activeTab === 'settled'
              ? 'bg-black text-white'
              : 'text-black hover:bg-black/5'
          }`}
        >
          {lang === 'id' ? 'Selesai (Settled)' : lang === 'ms' ? 'Selesai' : lang === 'ja' ? '精算済み' : '已结清'}
        </button>
      </div>

      {/* Groups List */}
      <div className="flex flex-col space-y-2 mt-2">
        {filteredGroups.length === 0 ? (
          <div className="py-12 border border-dashed border-black/20 text-center flex flex-col items-center justify-center space-y-2 bg-gray-50/50">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {activeTab === 'settled'
                ? (lang === 'id' ? 'Belum ada patungan selesai' : lang === 'ms' ? 'Tiada kongsi bil selesai' : lang === 'ja' ? '精算済みのグループはありません' : '暂无已结清的分账')
                : (lang === 'id' ? 'Belum ada patungan aktif' : lang === 'ms' ? 'Tiada kongsi bil aktif' : lang === 'ja' ? 'アクティブなグループはありません' : '暂无进行中的分账')}
            </span>
            <Button variant="secondary" onClick={() => setIsCreateOpen(true)} className="text-xs px-3 py-1">
              {t('createGroup', lang)}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {filteredGroups.map(g => (
              <Card
                key={g.id}
                onClick={() => onViewGroup(g.id)}
                className="p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="truncate pr-2">
                    <h3 className="text-sm font-extrabold text-black uppercase tracking-wide truncate max-w-[180px]">
                      {g.name}
                    </h3>
                    <p className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">
                      {g.description || t('none', lang)}
                    </p>
                    <div className="flex items-center space-x-1.5 mt-2 text-[10px] text-gray-500 font-bold">
                      <Users className="w-3 h-3 text-black" />
                      <span>{g.memberCount} {t('members', lang)}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400 block">
                      {t('groupSpend', lang)}
                    </span>
                    <span className="text-xs font-black text-black">
                      {formatAmount(g.totalAmount, profile.currency, lang)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="p-4 bg-black text-white hover:bg-white hover:text-black border-2 border-black shadow-lg transition-all duration-150 flex items-center justify-center"
          style={{ borderRadius: '0px' }}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Create Group Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title={t('createGroup', lang)}>
        <GroupForm
          onSubmit={handleCreateGroup}
          onCancel={() => setIsCreateOpen(false)}
          lang={lang}
        />
      </Modal>
    </div>
  );
};
