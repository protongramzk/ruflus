import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../utils/storage';
import { AppProfile } from '../types';
import { ProfileSection } from '../components/settings/ProfileSection';
import { BackupRestore } from '../components/settings/BackupRestore';
import { AIExport } from '../components/settings/AIExport';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { t } from '../utils/translations';

interface SettingsProps {
  onRefreshData: () => void;
}

const THEMES = [
  { id: 'monochrome', name: 'Monochrome', color: '#000000' },
  { id: 'slate', name: 'Slate', color: '#475569' },
  { id: 'emerald', name: 'Emerald', color: '#059669' },
  { id: 'forest', name: 'Forest', color: '#15803d' },
  { id: 'mint', name: 'Mint', color: '#0d9488' },
  { id: 'ocean', name: 'Ocean', color: '#0284c7' },
  { id: 'sky', name: 'Sky', color: '#0ea5e9' },
  { id: 'indigo', name: 'Indigo', color: '#4f46e5' },
  { id: 'purple', name: 'Purple', color: '#7c3aed' },
  { id: 'lavender', name: 'Lavender', color: '#8b5cf6' },
  { id: 'crimson', name: 'Crimson', color: '#dc2626' },
  { id: 'rose', name: 'Rose', color: '#db2777' },
  { id: 'sunset', name: 'Sunset', color: '#ea580c' },
  { id: 'coral', name: 'Coral', color: '#f43f5e' },
  { id: 'amber', name: 'Amber', color: '#d97706' },
  { id: 'olive', name: 'Olive', color: '#65a30d' },
  { id: 'teal', name: 'Teal', color: '#0d9488' },
  { id: 'sand', name: 'Sand', color: '#b45309' },
  { id: 'cocoa', name: 'Cocoa', color: '#78350f' },
  { id: 'plum', name: 'Plum', color: '#86198f' },
  { id: 'cyber', name: 'Cyberpunk', color: '#eab308' },
  { id: 'neon', name: 'Neon', color: '#16a34a' },
  { id: 'clay', name: 'Clay', color: '#c2410c' },
  { id: 'charcoal', name: 'Charcoal', color: '#374151' },
];

export const Settings: React.FC<SettingsProps> = ({ onRefreshData }) => {
  const [profile, setProfile] = useState<AppProfile | null>(null);

  const loadProfileData = () => {
    setProfile(getProfile());
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  if (!profile) return null;

  const lang = profile.language || 'id';

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
    updateProfile({ language: e.target.value as any });
    loadProfileData();
    onRefreshData();
  };

  const handleThemeSelect = (themeId: string) => {
    updateProfile({ theme: themeId });
    loadProfileData();
    onRefreshData();
  };

  const handleDarkModeChange = (isDark: boolean) => {
    updateProfile({ darkMode: isDark });
    loadProfileData();
    onRefreshData();
  };

  const activeTheme = profile.theme || 'monochrome';

  return (
    <div className="flex flex-col space-y-4 pb-24">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black text-black uppercase tracking-tight">
          {t('settingsTitle', lang)}
        </h1>
        <p className="text-xs text-gray-400 font-bold">
          {t('settingsSubtitle', lang)}
        </p>
      </div>

      {/* Profile Card Section */}
      <ProfileSection
        currentName={profile.name}
        onSave={handleSaveName}
      />

      {/* Language Config */}
      <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">
          {t('languageLabel', lang)}
        </span>
        <Select
          value={lang}
          onChange={handleLanguageChange}
        >
          <option value="id">Bahasa Indonesia (ID)</option>
          <option value="ms">Bahasa Melayu (MS)</option>
          <option value="ja">日本語 (JA)</option>
          <option value="zh">中文 (ZH)</option>
        </Select>
      </div>

      {/* Currency Config */}
      <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">
          {t('currencyLabel', lang)}
        </span>
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

      {/* Display Mode (Dark / Light) */}
      <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">
          {t('darkModeLabel', lang)}
        </span>
        <div className="flex space-x-2">
          <Button
            variant={!profile.darkMode ? 'primary' : 'secondary'}
            onClick={() => handleDarkModeChange(false)}
            fullWidth
          >
            {t('lightMode', lang)}
          </Button>
          <Button
            variant={profile.darkMode ? 'primary' : 'secondary'}
            onClick={() => handleDarkModeChange(true)}
            fullWidth
          >
            {t('darkMode', lang)}
          </Button>
        </div>
      </div>

      {/* Theme Swatches Selection */}
      <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">
          {t('themeLabel', lang)}
        </span>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map((th) => {
            const isSelected = activeTheme === th.id;
            return (
              <button
                key={th.id}
                onClick={() => handleThemeSelect(th.id)}
                className={`p-2 border transition-all duration-150 flex flex-col items-center space-y-1 ${
                  isSelected
                    ? 'border-2 border-black bg-black text-white font-extrabold'
                    : 'border-black/20 bg-white text-black hover:border-black'
                }`}
              >
                <div
                  className="w-5 h-5 border border-black shrink-0"
                  style={{ backgroundColor: th.color }}
                />
                <span className="text-[9px] uppercase tracking-tighter truncate w-full text-center">
                  {th.name}
                </span>
              </button>
            );
          })}
        </div>
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
      <Card title={t('aboutTitle', lang)} className="bg-white">
        <div className="text-xs text-gray-600 font-medium space-y-2">
          <p>
            <strong className="text-black uppercase">{t('aboutTitle', lang)} v1.0.0</strong> - {t('aboutDesc1', lang)}
          </p>
          <p>
            {t('aboutDesc2', lang)}
          </p>
          <p className="pt-2 border-t border-black/10 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
            {t('aboutFooter', lang)}
          </p>
        </div>
      </Card>
    </div>
  );
};
