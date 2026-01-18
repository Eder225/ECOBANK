import React, { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { User, Language, Notification } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  user: User;
  lang: Language;
  setLang: (lang: Language) => void;
  toggleSidebar: () => void;
  notifications: Notification[];
  markNotificationsAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, lang, setLang, notifications, markNotificationsAsRead }) => {
  const t = TRANSLATIONS[lang];
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    if (!showNotifications && unreadCount > 0) {
        markNotificationsAsRead();
    }
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(lang === Language.FR ? 'fr-FR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#004b6b] shadow-md border-b border-[#00364d] px-4 md:px-6 py-4 flex items-center justify-between transition-colors">
      {/* Mobile Logo Only - Menu button removed */}
      <div className="flex items-center gap-4 md:hidden">
        <img 
            src="https://i.imgur.com/eAwClBc.png" 
            alt="Ecobank" 
            className="h-8 w-auto object-contain brightness-0 invert"
        />
      </div>

      {/* Spacer for mobile to push right elements */}
      <div className="flex-1"></div>

      <div className="flex items-center justify-end gap-3 md:gap-4 relative">
        
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
            <button 
                onClick={toggleNotifications}
                className={`p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-[#00364d] text-white shadow-sm' : 'text-teal-100 hover:bg-[#00364d] hover:text-white'}`}
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[#004b6b] rounded-full"></span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 text-slate-900">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                        <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                {lang === Language.FR ? 'Aucune notification' : 'No notifications'}
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0"></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-800 leading-snug">{notif.message}</p>
                                                <p className="text-xs text-slate-400 mt-1">{formatDate(notif.date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        <button 
            onClick={() => setLang(lang === Language.FR ? Language.EN : Language.FR)}
            className="p-2 text-teal-100 hover:bg-[#00364d] hover:text-white rounded-full transition-colors font-semibold text-sm"
        >
            {lang}
        </button>
        
        <img
        src={user.avatar}
        alt={user.name}
        className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-white/20 shadow-sm transition-transform bg-slate-200"
        />
      </div>
    </header>
  );
};

export default Header;