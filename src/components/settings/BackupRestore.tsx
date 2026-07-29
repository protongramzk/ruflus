import React, { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { backupData, restoreData } from '../../utils/storage';
import { Download, Upload, AlertCircle } from 'lucide-react';

interface BackupRestoreProps {
  onRestoreSuccess: () => void;
}

export const BackupRestore: React.FC<BackupRestoreProps> = ({ onRestoreSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBackup = () => {
    try {
      const dataStr = backupData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ruflus_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSuccess('Cadangan data berhasil diunduh.');
      setError('');
    } catch (e) {
      setError('Gagal membuat cadangan data.');
      setSuccess('');
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonStr = event.target?.result as string;
        const ok = restoreData(jsonStr);
        if (ok) {
          setSuccess('Data berhasil dipulihkan dari cadangan.');
          setError('');
          onRestoreSuccess();
        } else {
          setError('File cadangan tidak valid.');
          setSuccess('');
        }
      } catch (err) {
        setError('Gagal membaca file cadangan.');
        setSuccess('');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="border border-black p-4 bg-gray-50 flex flex-col space-y-3">
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-black">Cadangan & Pemulihan (Backup/Restore)</span>

      <p className="text-xs text-gray-500 font-medium">
        Ekspor seluruh data keuangan Anda ke file JSON lokal, atau impor dari file cadangan yang ada.
      </p>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <Button
          type="button"
          variant="secondary"
          onClick={handleBackup}
          className="flex items-center justify-center gap-1 text-xs"
        >
          <Download className="w-4 h-4" />
          Ekspor JSON
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={handleRestoreClick}
          className="flex items-center justify-center gap-1 text-xs"
        >
          <Upload className="w-4 h-4" />
          Impor JSON
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
      </div>

      {success && (
        <p className="text-xs text-green-600 font-extrabold flex items-center gap-1">
          ✓ {success}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 font-extrabold flex items-center gap-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
