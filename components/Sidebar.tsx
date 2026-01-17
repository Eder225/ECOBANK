import React from 'react';
import { LayoutDashboard, Wallet, ArrowRightLeft, BarChart2, DollarSign, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Tab, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  lang: Language;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, lang, onLogout }) => {
  const t = TRANSLATIONS[lang];

  return (
    <aside className="h-full w-full bg-[#004b6b] border-r border-[#00364d] flex flex-col transition-colors">
      <div className="p-8 pb-4">
        <div className="flex items-center justify-start">
            <img 
                src="https://i.imgur.com/eAwClBc.png" 
                alt="Ecobank" 
                className="h-16 md:h-20 w-auto object-contain brightness-0 invert"
            />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 pb-6 overflow-y-auto no-scrollbar">
        <div className="space-y-6">
            <nav className="space-y-1 mt-4">
            <button
                onClick={() => setActiveTab(Tab.DASHBOARD)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                activeTab === Tab.DASHBOARD
                    ? 'bg-[#00364d] text-white shadow-lg shadow-[#00364d]/50'
                    : 'text-teal-100 hover:text-white hover:bg-[#00364d]/50'
                }`}
            >
                <LayoutDashboard size={20} />
                <span>{t.dashboard}</span>
            </button>
            <button 
                onClick={() => setActiveTab(Tab.WALLET)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                activeTab === Tab.WALLET
                    ? 'bg-[#00364d] text-white shadow-lg shadow-[#00364d]/50'
                    : 'text-teal-100 hover:text-white hover:bg-[#00364d]/50'
                }`}
            >
                <Wallet size={20} />
                <span>{t.wallet}</span>
            </button>
            <button 
                onClick={() => setActiveTab(Tab.TRANSFERS)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    activeTab === Tab.TRANSFERS
                    ? 'bg-[#00364d] text-white shadow-lg shadow-[#00364d]/50'
                    : 'text-teal-100 hover:text-white hover:bg-[#00364d]/50'
                }`}
            >
                <ArrowRightLeft size={20} />
                <span>{t.payments}</span>
            </button>
            <button 
                onClick={() => setActiveTab(Tab.STATISTICS)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    activeTab === Tab.STATISTICS
                    ? 'bg-[#00364d] text-white shadow-lg shadow-[#00364d]/50'
                    : 'text-teal-100 hover:text-white hover:bg-[#00364d]/50'
                }`}
            >
                <BarChart2 size={20} />
                <span>{t.statistics}</span>
            </button>
            <button 
                onClick={() => setActiveTab(Tab.CASHBACK)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    activeTab === Tab.CASHBACK
                    ? 'bg-[#00364d] text-white shadow-lg shadow-[#00364d]/50'
                    : 'text-teal-100 hover:text-white hover:bg-[#00364d]/50'
                }`}
            >
                <DollarSign size={20} />
                <span>{t.cashback}</span>
            </button>
            </nav>

            <div className="pt-4 border-t border-[#00364d]">
                <p className="px-4 text-xs font-semibold text-teal-200/70 uppercase tracking-wider mb-2">Settings</p>
                <nav className="space-y-1">
                    <button 
                        onClick={() => setActiveTab(Tab.SUPPORT)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                            activeTab === Tab.SUPPORT
                            ? 'bg-[#00364d] text-white shadow-lg shadow-[#00364d]/50'
                            : 'text-teal-100 hover:text-white hover:bg-[#00364d]/50'
                        }`}
                    >
                        <HelpCircle size={20} />
                        <span>{t.support}</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab(Tab.SETTINGS)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                            activeTab === Tab.SETTINGS
                            ? 'bg-[#00364d] text-white shadow-lg shadow-[#00364d]/50'
                            : 'text-teal-100 hover:text-white hover:bg-[#00364d]/50'
                        }`}
                    >
                        <Settings size={20} />
                        <span>{t.settings}</span>
                    </button>
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-teal-100 hover:text-white hover:bg-[#00364d]/50 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        <span>{t.logout}</span>
                    </button>
                </nav>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;