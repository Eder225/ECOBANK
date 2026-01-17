import React, { useState } from 'react';
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
import { CURRENT_USER, ACCOUNTS, RECENT_TRANSACTIONS, CARDS } from './constants';
import { Tab, Language, Notification } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [lang, setLang] = useState<Language>(Language.FR);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab(Tab.DASHBOARD);
  };

  const addNotification = (message: string) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      message,
      date: new Date(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard user={CURRENT_USER} accounts={ACCOUNTS} transactions={RECENT_TRANSACTIONS} lang={lang} />;
      case Tab.WALLET:
        return <Wallet accounts={ACCOUNTS} lang={lang} />;
      case Tab.TRANSFERS:
        return <Transfers accounts={ACCOUNTS} lang={lang} addNotification={addNotification} />;
      case Tab.CARDS:
        return <Cards cards={CARDS} lang={lang} />;
      case Tab.PROFILE:
        return <Profile user={CURRENT_USER} accounts={ACCOUNTS} lang={lang} />;
      case Tab.STATISTICS:
        return <Statistics lang={lang} />;
      case Tab.CASHBACK:
        return <Cashback lang={lang} />;
      case Tab.SUPPORT:
        return <Support lang={lang} />;
      case Tab.SETTINGS:
        return <Settings user={CURRENT_USER} lang={lang} setLang={setLang} />;
      default:
        return <Dashboard user={CURRENT_USER} accounts={ACCOUNTS} transactions={RECENT_TRANSACTIONS} lang={lang} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar Wrapper for Toggle */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(t) => { setActiveTab(t); setSidebarOpen(false); }} 
            lang={lang} 
            onLogout={handleLogout}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Header 
            user={CURRENT_USER} 
            lang={lang} 
            setLang={setLang} 
            toggleSidebar={toggleSidebar}
            notifications={notifications}
            markNotificationsAsRead={markNotificationsAsRead}
        />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;