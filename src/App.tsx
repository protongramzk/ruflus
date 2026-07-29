import React, { useState, useEffect } from 'react';
import { initializeStorage } from './utils/storage';
import { BottomNavigation, TabType } from './components/ui/BottomNavigation';
import { Dashboard } from './pages/Dashboard';
import { Finance } from './pages/Finance';
import { Split } from './pages/Split';
import { SplitDetail } from './pages/SplitDetail';
import { Savings } from './pages/Savings';
import { SavingDetail } from './pages/SavingDetail';
import { Bills } from './pages/Bills';
import { BillDetail } from './pages/BillDetail';
import { Settings } from './pages/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Custom navigation parameters for subpages
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);
  const [currentBillId, setCurrentBillId] = useState<string | null>(null);
  const [initialTxId, setInitialTxId] = useState<string | null>(null);

  // Trigger state updates
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initializeStorage();
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleNavigation = (tab: TabType, targetId?: string) => {
    setActiveTab(tab);

    // Clear subpages
    setCurrentGroupId(null);
    setCurrentGoalId(null);
    setCurrentBillId(null);
    setInitialTxId(null);

    if (tab === 'split' && targetId) {
      setCurrentGroupId(targetId);
    } else if (tab === 'savings' && targetId) {
      setCurrentGoalId(targetId);
    } else if (tab === 'bills' && targetId) {
      setCurrentBillId(targetId);
    } else if (tab === 'finance' && targetId) {
      setInitialTxId(targetId);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard key={refreshKey} onNavigate={handleNavigation} />;

      case 'finance':
        return (
          <Finance
            key={refreshKey}
            initialTxId={initialTxId}
            onClearInitialId={() => setInitialTxId(null)}
          />
        );

      case 'split':
        if (currentGroupId) {
          return (
            <SplitDetail
              key={`${refreshKey}-${currentGroupId}`}
              groupId={currentGroupId}
              onBack={() => {
                setCurrentGroupId(null);
                handleRefresh();
              }}
            />
          );
        }
        return (
          <Split
            key={refreshKey}
            onViewGroup={(id) => setCurrentGroupId(id)}
          />
        );

      case 'savings':
        if (currentGoalId) {
          return (
            <SavingDetail
              key={`${refreshKey}-${currentGoalId}`}
              goalId={currentGoalId}
              onBack={() => {
                setCurrentGoalId(null);
                handleRefresh();
              }}
            />
          );
        }
        return (
          <Savings
            key={refreshKey}
            onViewGoal={(id) => setCurrentGoalId(id)}
          />
        );

      case 'bills':
        if (currentBillId) {
          return (
            <BillDetail
              key={`${refreshKey}-${currentBillId}`}
              billId={currentBillId}
              onBack={() => {
                setCurrentBillId(null);
                handleRefresh();
              }}
            />
          );
        }
        return (
          <Bills
            key={refreshKey}
            onViewBill={(id) => setCurrentBillId(id)}
          />
        );

      case 'settings':
        return (
          <Settings
            key={refreshKey}
            onRefreshData={handleRefresh}
          />
        );

      default:
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  // Cassava UI Layout wrapper
  return (
    <div className="bg-white min-h-screen text-black flex flex-col items-center">
      <div className="w-full max-w-lg min-h-screen border-x border-black/10 flex flex-col relative bg-white">
        {/* Top Sticky Branded Strip */}
        <div className="sticky top-0 z-40 bg-white border-b border-black flex items-center justify-between px-4 h-12 shrink-0">
          <span className="text-sm font-black uppercase tracking-widest text-black">RUFLUS</span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">OFFLINE-FIRST</span>
        </div>

        {/* Scrollable contents wrapper */}
        <div className="flex-1 p-4 overflow-y-auto">
          {renderActiveTab()}
        </div>

        {/* Floating Fixed Footer Bottom Nav */}
        <BottomNavigation
          activeTab={activeTab}
          setActiveTab={(tab) => handleNavigation(tab)}
        />
      </div>
    </div>
  );
}
