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
import { Tab, Language, Notification, Transaction, User } from './types';
import { CheckCircle2, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
}

// Helper to load from localStorage or fallback to default
const loadState = <T,>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const App: React.FC = () => {
  // --- Persistent States ---
  
  // 1. Auth Status
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => loadState('ecobank_isLoggedIn', false));

  // 2. User Data (Avatar, Name changes)
  const [currentUser, setCurrentUser] = useState<User>(() => loadState('ecobank_user', CURRENT_USER));

  // 3. Language Preference
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ecobank_lang');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Strict validation: must be 'FR' or 'EN'
        if (parsed === Language.FR || parsed === Language.EN) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse language preference:', e);
    }
    return Language.FR;
  });

  // 4. Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('ecobank_notifications');
    if (saved) {
        try {
            // Need to convert string dates back to Date objects
            const parsed = JSON.parse(saved);
            return parsed.map((n: any) => ({ ...n, date: new Date(n.date) }));
        } catch(e) {
            return [];
        }
    }
    return [];
  });

  // 5. Transactions History
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('ecobank_transactions', RECENT_TRANSACTIONS));

  // --- Ephemeral States (Reset on reload) ---
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- Effects to Save Data on Change ---

  useEffect(() => {
    localStorage.setItem('ecobank_isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('ecobank_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ecobank_lang', JSON.stringify(lang));
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('ecobank_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ecobank_transactions', JSON.stringify(transactions));
  }, [transactions]);


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab(Tab.DASHBOARD);
    // We do NOT clear localStorage here so data persists for next login
  };

  const updateUserAvatar = (newAvatarUrl: string) => {
    setCurrentUser(prev => ({ ...prev, avatar: newAvatarUrl }));
  };

  const addNotification = (message: string) => {
    // 1. Add to persistent notifications list (Bell icon)
    const newNotif: Notification = {
      id: Date.now().toString(),
      message,
      date: new Date(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // 2. Trigger a temporary Toast Popup
    const toastId = Date.now();
    setToasts(prev => [...prev, { id: toastId, message }]);

    // Auto remove toast after 4 seconds
    setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 4000);
  };

  const removeToast = (id: number) => {
      setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard 
                  user={currentUser} 
                  accounts={ACCOUNTS} 
                  transactions={transactions} 
                  lang={lang} 
                  setActiveTab={setActiveTab}
                  addNotification={addNotification}
               />;
      case Tab.WALLET:
        return <Wallet 
                  accounts={ACCOUNTS} 
                  lang={lang} 
                  addNotification={addNotification}
               />;
      case Tab.TRANSFERS:
        return <Transfers accounts={ACCOUNTS} lang={lang} addNotification={addNotification} addTransaction={addTransaction} />;
      case Tab.CARDS:
        return <Cards 
                  lang={lang} 
                  addNotification={addNotification}
               />;
      case Tab.PROFILE:
        return <Profile user={currentUser} accounts={ACCOUNTS} lang={lang} onUpdateAvatar={updateUserAvatar} />;
      case Tab.STATISTICS:
        return <Statistics lang={lang} />;
      case Tab.CASHBACK:
        return <Cashback 
                  lang={lang} 
                  addNotification={addNotification}
               />;
      case Tab.SUPPORT:
        return <Support lang={lang} />;
      case Tab.SETTINGS:
        return <Settings 
                  user={currentUser} 
                  lang={lang} 
                  setLang={setLang} 
                  addNotification={addNotification}
               />;
      default:
        return <Dashboard 
                  user={currentUser} 
                  accounts={ACCOUNTS} 
                  transactions={transactions} 
                  lang={lang} 
                  setActiveTab={setActiveTab}
                  addNotification={addNotification}
               />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Desktop Sidebar - Fixed width, full height */}
      <div className="hidden md:block w-64 shrink-0 h-full bg-[#004b6b]">
        <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            lang={lang} 
            onLogout={handleLogout}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header 
            user={currentUser} 
            lang={lang} 
            setLang={setLang} 
            toggleSidebar={toggleSidebar}
            notifications={notifications}
            markNotificationsAsRead={markNotificationsAsRead}
        />
        
        {/* Toast Container */}
        <div className="fixed top-20 right-4 z-[60] flex flex-col gap-3 pointer-events-none max-w-[90vw] md:max-w-md w-full">
            {toasts.map(toast => (
                <div 
                    key={toast.id} 
                    className="bg-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 pointer-events-auto animate-in slide-in-from-right-10 fade-in duration-300 border-l-4 border-teal-500"
                >
                    <div className="mt-0.5 text-teal-400 shrink-0">
                        <CheckCircle2 size={18} />
                    </div>
                    <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>
                    <button 
                        onClick={() => removeToast(toast.id)}
                        className="text-slate-400 hover:text-white transition-colors shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             {renderContent()}
          </div>
        </main>

        <BottomNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          lang={lang} 
        />
      </div>
    </div>
  );
};

export default App;