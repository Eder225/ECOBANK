import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Transfers from './components/Transfers';
import Cards from './components/Cards';
import Profile from './components/Profile';
import Wallet from './components/Wallet';
import Statistics from './components/Statistics';
import Cashback from './components/Cashback';
import Support from './components/Support';
import Settings from './components/Settings';
import BottomNav from './components/BottomNav';
import { CURRENT_USER, ACCOUNTS, RECENT_TRANSACTIONS } from './constants';
import { Tab, Language, Notification, Transaction, User, Account } from './types';
import { CheckCircle2, X, Loader2 } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
}

const loadState = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => loadState('ecobank_isLoggedIn', false));
  const [currentUser, setCurrentUser] = useState<User>(() => loadState('ecobank_user', CURRENT_USER));
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ecobank_lang');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed === Language.FR || parsed === Language.EN) return parsed;
      }
    } catch (e) {}
    return Language.FR;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('ecobank_notifications');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            return parsed.map((n: any) => ({ ...n, date: new Date(n.date) }));
        } catch(e) { return []; }
    }
    return [
      {
        id: 'notif-success-atm',
        message: 'Succès : Votre retrait de 32 809,42 FCFA à BANKOMAT ICA GAVLE SE a été effectué avec succès.',
        date: new Date('2026-01-25T12:24:00Z'),
        read: false
      }
    ];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('ecobank_transactions', RECENT_TRANSACTIONS));
  const [accounts, setAccounts] = useState<Account[]>(() => loadState('ecobank_accounts', ACCOUNTS));

  // Ephemeral States
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [isNavigating, setIsNavigating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Effects
  useEffect(() => { localStorage.setItem('ecobank_isLoggedIn', JSON.stringify(isLoggedIn)); }, [isLoggedIn]);
  useEffect(() => { localStorage.setItem('ecobank_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('ecobank_lang', JSON.stringify(lang)); }, [lang]);
  useEffect(() => { localStorage.setItem('ecobank_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('ecobank_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('ecobank_accounts', JSON.stringify(accounts)); }, [accounts]);

  const handleTabChange = (newTab: Tab) => {
    if (newTab === activeTab) return;
    
    setIsNavigating(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsNavigating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  const handleLogin = () => {
    setIsNavigating(true);
    setTimeout(() => {
        setIsLoggedIn(true);
        setIsNavigating(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab(Tab.DASHBOARD);
  };

  const addNotification = (message: string) => {
    const newNotif: Notification = { id: Date.now().toString(), message, date: new Date(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
    const toastId = Date.now();
    setToasts(prev => [...prev, { id: toastId, message }]);
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== toastId)); }, 4000);
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    
    // Si la transaction est réussie et est un débit, on soustrait du solde
    if (tx.status === 'completed' && tx.type === 'debit') {
      setAccounts(prev => prev.map(acc => ({
        ...acc,
        balance: acc.balance - tx.amount
      })));
    } else if (tx.status === 'completed' && tx.type === 'credit') {
      setAccounts(prev => prev.map(acc => ({
        ...acc,
        balance: acc.balance + tx.amount
      })));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard user={currentUser} accounts={accounts} transactions={transactions} lang={lang} setActiveTab={handleTabChange} addNotification={addNotification} />;
      case Tab.WALLET:
        return <Wallet accounts={accounts} lang={lang} addNotification={addNotification} />;
      case Tab.TRANSFERS:
        return <Transfers accounts={accounts} lang={lang} addNotification={addNotification} addTransaction={addTransaction} />;
      case Tab.CARDS:
        return <Cards lang={lang} addNotification={addNotification} />;
      case Tab.PROFILE:
        return <Profile user={currentUser} accounts={accounts} lang={lang} onUpdateAvatar={(url) => setCurrentUser(p => ({ ...p, avatar: url }))} />;
      case Tab.STATISTICS:
        return <Statistics lang={lang} accounts={accounts} transactions={transactions} />;
      case Tab.CASHBACK:
        return <Cashback lang={lang} addNotification={addNotification} />;
      case Tab.SUPPORT:
        return <Support lang={lang} />;
      case Tab.SETTINGS:
        return <Settings user={currentUser} lang={lang} setLang={setLang} addNotification={addNotification} />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {isNavigating && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
                <img src="https://i.imgur.com/j8IKssI.png" className="absolute inset-0 m-auto w-8 h-8 object-contain" alt="Logo" />
            </div>
            <p className="mt-4 text-teal-800 font-bold text-sm tracking-widest uppercase animate-pulse">
                {lang === Language.FR ? 'Chargement sécurisé...' : 'Securing connection...'}
            </p>
        </div>
      )}

      <div className="hidden md:block w-64 shrink-0 h-full bg-[#004b6b]">
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} lang={lang} onLogout={handleLogout} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header user={currentUser} lang={lang} setLang={setLang} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} notifications={notifications} markNotificationsAsRead={() => setNotifications(p => p.map(n => ({ ...n, read: true })))} />
        <div className="fixed top-20 right-4 z-[60] flex flex-col gap-3 pointer-events-none max-w-[90vw] md:max-w-md w-full">
            {toasts.map(toast => (
                <div key={toast.id} className="bg-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 pointer-events-auto border-l-4 border-teal-500">
                    <CheckCircle2 size={18} className="mt-0.5 text-teal-400 shrink-0" />
                    <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>
                    <button onClick={() => setToasts(p => p.filter(t => t.id !== toast.id))} className="text-slate-400 hover:text-white shrink-0"><X size={16} /></button>
                </div>
            ))}
        </div>
        <main className={`flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto scroll-smooth no-scrollbar transition-opacity duration-300 ${isNavigating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </main>
        <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} lang={lang} />
      </div>
    </div>
  );
};

export default App;