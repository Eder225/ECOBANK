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
import BottomNav from './components/BottomNav';
import { CURRENT_USER, ACCOUNTS, RECENT_TRANSACTIONS, CARDS } from './constants';
import { Tab, Language, Notification, Transaction, User } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [lang, setLang] = useState<Language>(Language.FR);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab(Tab.DASHBOARD);
  };

  const updateUserAvatar = (newAvatarUrl: string) => {
    setCurrentUser(prev => ({ ...prev, avatar: newAvatarUrl }));
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
                  cards={CARDS} 
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