import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Trash2, Plus } from 'lucide-react';

interface GroupFormProps {
  onSubmit: (data: { name: string; description: string; members: string[] }) => void;
  onCancel: () => void;
}

export const GroupForm: React.FC<GroupFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // By default, let's prefill the creator "Saya" as first member
  const [members, setMembers] = useState<string[]>(['Saya', '']);
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
      setError('Nama grup patungan harus diisi');
      return;
    }

    const cleanedMembers = members.map(m => m.trim()).filter(m => m !== '');
    if (cleanedMembers.length < 2) {
      setError('Masukkan minimal 2 anggota (termasuk "Saya")');
      return;
    }

    // Ensure member names are unique
    const unique = new Set(cleanedMembers.map(m => m.toLowerCase()));
    if (unique.size !== cleanedMembers.length) {
      setError('Nama anggota tidak boleh ada yang duplikat');
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
        label="Nama Grup Patungan"
        placeholder="Contoh: Trip Bali atau Makan Malam"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="Deskripsi"
        placeholder="Contoh: Pengeluaran liburan"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Member Lists */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center border-b border-black/10 pb-1">
          <span className="text-xs font-black uppercase tracking-wider text-black">Anggota Grup ({members.filter(m => m.trim() !== '').length})</span>
          <button
            type="button"
            onClick={handleAddMember}
            className="text-[10px] font-black uppercase tracking-widest text-black border border-black px-2 py-1 bg-white hover:bg-black hover:text-white transition-all"
          >
            + Anggota
          </button>
        </div>

        <div className="flex flex-col space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {members.map((member, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className="flex-1">
                <Input
                  placeholder={`Nama Anggota ${idx + 1}`}
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
          Batal
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          Buat Grup
        </Button>
      </div>
    </form>
  );
};
