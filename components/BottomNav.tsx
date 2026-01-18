import React from 'react';
import { LayoutDashboard, Wallet, ArrowRightLeft, MoreHorizontal } from 'lucide-react';
import { Tab, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  lang: Language;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center px-2 py-2 pb-safe z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <button 
        onClick={() => setActiveTab(Tab.DASHBOARD)}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${activeTab === Tab.DASHBOARD ? 'text-teal-600' : 'text-slate-400'}`}
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px] font-medium">{t.dashboard}</span>
      </button>
      <button 
        onClick={() => setActiveTab(Tab.TRANSFERS)}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${activeTab === Tab.TRANSFERS ? 'text-teal-600' : 'text-slate-400'}`}
      >
        <ArrowRightLeft size={20} />
        <span className="text-[10px] font-medium">{t.payments}</span>
      </button>
      <button 
        onClick={() => setActiveTab(Tab.WALLET)}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${activeTab === Tab.WALLET ? 'text-teal-600' : 'text-slate-400'}`}
      >
        <Wallet size={20} />
        <span className="text-[10px] font-medium">{t.wallet}</span>
      </button>
      <button 
        onClick={() => setActiveTab(Tab.PROFILE)}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${activeTab === Tab.PROFILE ? 'text-teal-600' : 'text-slate-400'}`}
      >
        <MoreHorizontal size={20} />
        <span className="text-[10px] font-medium">Menu</span>
      </button>
    </nav>
  );
};

export default BottomNav;