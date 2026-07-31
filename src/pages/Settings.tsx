import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../utils/storage';
import { AppProfile, AppLanguage } from '../types';
import { ProfileSection } from '../components/settings/ProfileSection';
import { BackupRestore } from '../components/settings/BackupRestore';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Input';
import { TRANSLATIONS } from '../utils/i18n';

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

  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.id;

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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateProfile({ language: e.target.value as AppLanguage });
    loadProfileData();
    onRefreshData();
  };

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-black uppercase tracking-tight">{t.settings}</h1>
        <p className="text-xs text-gray-400 font-bold">{t.settingsSub}</p>
      </div>

      {/* Profile Card Section */}
      <ProfileSection
        currentName={profile.name}
        onSave={handleSaveName}
      />

      {/* Language Config */}
      <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">{t.languageLabel}</span>
        <Select
          value={profile.language}
          onChange={handleLanguageChange}
        >
          <option value="id">Bahasa Indonesia</option>
          <option value="ms">Bahasa Melayu</option>
          <option value="ja">日本語</option>
          <option value="zh">简体中文</option>
        </Select>
      </div>

      {/* Currency Config */}
      <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">{t.currencyLabel}</span>
        <Select
          value={profile.currency}
          onChange={handleCurrencyChange}
        >
          <option value="Rp">Rupiah (Rp - Indonesia)</option>
          <option value="RM">Ringgit (RM - Malaysia)</option>
          <option value="¥">Yen / Yuan (¥ - Japan / China)</option>
          <option value="$">US Dollar ($)</option>
          <option value="€">Euro (€)</option>
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

      {/* About Application */}
      <Card title={t.aboutTitle} className="bg-white">
        <div className="text-xs text-gray-600 font-medium space-y-2">
          <p>
            <strong className="text-black uppercase">Ruflus v1.0.0</strong> - {t.aboutText}
          </p>
          <p>
            Didesain menggunakan <strong className="text-black">Cassava UI Principles</strong>: clean visual, geometry orthogonal, zero border-radius, monochrome contrast, and offline-first data safety.
          </p>
          <p className="pt-2 border-t border-black/10 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
            {t.aboutFooter}
          </p>
        </div>
      </Card>
    </div>
  );
};
