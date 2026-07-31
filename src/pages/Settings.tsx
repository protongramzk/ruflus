import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../utils/storage';
import { AppProfile } from '../types';
import { ProfileSection } from '../components/settings/ProfileSection';
import { BackupRestore } from '../components/settings/BackupRestore';
import { AIExport } from '../components/settings/AIExport';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Input';

interface SettingsProps {
  onRefreshData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onRefreshData }) => {
  const [profile, setProfile] = useState<AppProfile | null>(null);

  const loadProfileData = () => {
    setProfile(getProfile());
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  if (!profile) return null;

  const handleSaveName = (newName: string) => {
    updateProfile({ name: newName });
    loadProfileData();
    onRefreshData();
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateProfile({ currency: e.target.value });
    loadProfileData();
    onRefreshData();
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-black uppercase tracking-tight">Settings</h1>
        <p className="text-xs text-gray-400 font-bold">Sesuaikan preferensi aplikasi Anda</p>
      </div>

      {/* Profile Card Section */}
      <ProfileSection
        currentName={profile.name}
        onSave={handleSaveName}
      />

      {/* Currency Config */}
      <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">Mata Uang (Currency)</span>
        <Select
          value={profile.currency}
          onChange={handleCurrencyChange}
        >
          <option value="Rp">Rupiah (Rp)</option>
          <option value="$">US Dollar ($)</option>
          <option value="€">Euro (€)</option>
          <option value="¥">Yen (¥)</option>
          <option value="£">Pound (£)</option>
        </Select>
      </div>

      {/* Backup and Restore */}
      <BackupRestore
        onRestoreSuccess={() => {
          loadProfileData();
          onRefreshData();
        }}
      />

      {/* AI Export Tool */}
      <AIExport />

      {/* About Application */}
      <Card title="Tentang Ruflus" className="bg-white">
        <div className="text-xs text-gray-600 font-medium space-y-2">
          <p>
            <strong className="text-black uppercase">Ruflus v1.0.0</strong> - Satu aplikasi terintegrasi untuk mengelola seluruh urusan keuangan harian Anda: pencatatan personal, patungan bersama (split bills), target tabungan (savings goal), dan pengingat tagihan bulanan (bills reminder).
          </p>
          <p>
            Didesain menggunakan <strong className="text-black">Cassava UI Principles</strong>: clean visual, geometry orthogonal, zero border-radius, monochrome contrast, and offline-first data safety.
          </p>
          <p className="pt-2 border-t border-black/10 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
            Privat • Cepat • Ringan • Offline-First
          </p>
        </div>
      </Card>
    </div>
  );
};
