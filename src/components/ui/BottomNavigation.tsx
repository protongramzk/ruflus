import React from 'react';
import { LayoutDashboard, Wallet, Users, Landmark, CreditCard, Settings as SettingsIcon } from 'lucide-react';

export type TabType = 'dashboard' | 'finance' | 'split' | 'savings' | 'bills' | 'settings';

interface BottomNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string; icon: React.FC<any> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'split', label: 'Split', icon: Users },
    { id: 'savings', label: 'Savings', icon: Landmark },
    { id: 'bills', label: 'Bills', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  // Cassava UI: Strict Bottom navigation layout, high contrast, orthogonal buttons.
  // Bipolar Inversion on Selected: white text on black background for selected tab.
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black z-40">
      <div className="flex h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center space-y-1 transition-all duration-100 ${
                isSelected
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-black/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
