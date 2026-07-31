import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Trash2 } from 'lucide-react';
import { t } from '../../utils/translations';

interface GroupFormProps {
  onSubmit: (data: { name: string; description: string; members: string[] }) => void;
  onCancel: () => void;
  lang?: string;
}

export const GroupForm: React.FC<GroupFormProps> = ({ onSubmit, onCancel, lang }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // By default, let's prefill the creator "Saya" as first member
  const defaultMe = lang === 'id' ? 'Saya' : lang === 'ms' ? 'Saya' : lang === 'ja' ? '自分' : '我';
  const [members, setMembers] = useState<string[]>([defaultMe, '']);
  const [error, setError] = useState('');

  const handleAddMember = () => {
    setMembers([...members, '']);
  };

  const handleMemberChange = (index: number, val: string) => {
    const updated = [...members];
    updated[index] = val;
    setMembers(updated);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length <= 1) return;
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === 'id' ? 'Nama grup patungan harus diisi' : lang === 'ms' ? 'Nama kumpulan bil mesti diisi' : lang === 'ja' ? 'グループ名を入力してください' : '请输入分组名称');
      return;
    }

    const cleanedMembers = members.map(m => m.trim()).filter(m => m !== '');
    if (cleanedMembers.length < 2) {
      setError(lang === 'id' ? 'Masukkan minimal 2 anggota' : lang === 'ms' ? 'Sila masukkan sekurang-kurangnya 2 ahli' : lang === 'ja' ? '2人以上のメンバーを入力してください' : '请至少输入2位成员');
      return;
    }

    // Ensure member names are unique
    const unique = new Set(cleanedMembers.map(m => m.toLowerCase()));
    if (unique.size !== cleanedMembers.length) {
      setError(lang === 'id' ? 'Nama anggota tidak boleh ada yang duplikat' : lang === 'ms' ? 'Nama ahli tidak boleh bertindih' : lang === 'ja' ? 'メンバー名は重複できません' : '成员名称不能重复');
      return;
    }

    setError('');
    onSubmit({
      name,
      description,
      members: cleanedMembers
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <Input
        label={t('groupName', lang)}
        placeholder={lang === 'id' ? 'Contoh: Trip Bali atau Makan Malam' : lang === 'ms' ? 'Contoh: Makan Malam' : lang === 'ja' ? '例: 旅行代、ディナー' : '例如: 晚餐聚餐'}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label={t('description', lang)}
        placeholder={lang === 'id' ? 'Contoh: Pengeluaran liburan' : lang === 'ms' ? 'Contoh: Perbelanjaan cuti' : lang === 'ja' ? '例: 旅行のすべての支出' : '例如: 假期的所有支出'}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Member Lists */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center border-b border-black/10 pb-1">
          <span className="text-xs font-black uppercase tracking-wider text-black">{t('members', lang)} ({members.filter(m => m.trim() !== '').length})</span>
          <button
            type="button"
            onClick={handleAddMember}
            className="text-[10px] font-black uppercase tracking-widest text-black border border-black px-2 py-1 bg-white hover:bg-black hover:text-white transition-all"
          >
            + {lang === 'id' ? 'Anggota' : lang === 'ms' ? 'Ahli' : lang === 'ja' ? 'メンバー' : '成员'}
          </button>
        </div>

        <div className="flex flex-col space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {members.map((member, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  placeholder={lang === 'id' ? `Nama Anggota ${idx + 1}` : lang === 'ms' ? `Nama Ahli ${idx + 1}` : lang === 'ja' ? `メンバー名 ${idx + 1}` : `成员名称 ${idx + 1}`}
                  value={member}
                  onChange={(e) => handleMemberChange(idx, e.target.value)}
                  required={idx < 2} // Require at least first two slots to be filled
                />
              </div>
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(idx)}
                  className="p-2 border border-black text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-red-600 font-extrabold">{error}</p>}

      <div className="flex space-x-2 pt-2 border-t border-black/10">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          {t('cancel', lang)}
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          {t('createGroup', lang)}
        </Button>
      </div>
    </form>
  );
};
