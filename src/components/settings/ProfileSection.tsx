import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ProfileSectionProps {
  currentName: string;
  onSave: (newName: string) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ currentName, onSave }) => {
  const [name, setName] = useState(currentName);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">Profil Pengguna</span>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan Nama Anda"
            required
          />
          <div className="flex space-x-2">
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)} className="py-1 text-xs">
              Batal
            </Button>
            <Button type="submit" variant="primary" className="py-1 text-xs">
              Simpan
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between items-center">
          <p className="text-sm font-extrabold text-black uppercase tracking-wide">{currentName}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-[10px] font-black uppercase tracking-widest border border-black px-2.5 py-1 bg-white hover:bg-black hover:text-white transition-all duration-100"
          >
            Ubah Nama
          </button>
        </div>
      )}
    </div>
  );
};
