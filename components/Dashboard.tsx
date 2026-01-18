import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownLeft, Wallet, MoreHorizontal, CreditCard, Eye, EyeOff, Snowflake, XCircle } from 'lucide-react';
import { Account, Transaction, Language, User } from '../types';
import { TRANSLATIONS, CARDS } from '../constants';

interface DashboardProps {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  lang: Language;
}

const chartData = [
  { name: 'Dec', value: 0 },
  { name: 'Jan', value: 195000000 },
  { name: 'Feb', value: 195000000 },
  { name: 'Mar', value: 195000000 },
  { name: 'Apr', value: 195000000 },
  { name: 'May', value: 195000000 },
  { name: 'Jun', value: 195000000 }, 
];

const Dashboard: React.FC<DashboardProps> = ({ user, accounts, transactions, lang }) => {
  const t = TRANSLATIONS[lang];
  const [userCard, setUserCard] = useState(CARDS[0]);
  const [showCardDetails, setShowCardDetails] = useState(false);
  
  const cleanNumber = userCard.number.replace(/\s/g, '');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === Language.FR ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString(lang === Language.FR ? 'fr-FR' : 'en-GB', {
          day: 'numeric',
          month: 'short'
      });
  };

  return (
    <div className="space-y-6 pb-10 max-w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">
          {t.welcome},<br/><span className="text-teal-600">{user.name.split(' ')[0]}</span>
        </h2>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
            <MoreHorizontal size={20} className="text-slate-400" />
        </div>
      </div>

      {/* Stats row - mobile friendly */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-50">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Dépenses</span>
            <h3 className="text-lg font-bold text-slate-900">{formatCurrency(0)}</h3>
            <div className="mt-2 flex items-center gap-1 text-slate-400 text-[10px] font-medium">
                <ArrowUpRight size={12} /> 0%
            </div>
        </div>
        <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-50">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Revenus</span>
            <h3 className="text-lg font-bold text-slate-900">{formatCurrency(195000000)}</h3>
            <div className="mt-2 flex items-center gap-1 text-green-500 text-[10px] font-bold">
                <ArrowDownLeft size={12} /> +100%
            </div>
        </div>
      </div>

      {/* Card Section - Ratio Optimized */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-900">{t.cards}</h3>
            <button 
                onClick={() => setShowCardDetails(!showCardDetails)}
                className="text-teal-600 text-xs font-bold"
            >
                {showCardDetails ? 'Masquer' : 'Afficher'}
            </button>
        </div>
        <div className={`relative w-full aspect-[1.586/1] rounded-[2rem] p-6 text-white flex flex-col justify-between shadow-xl transition-all duration-300 ${userCard.status === 'frozen' ? 'bg-slate-500 grayscale' : 'shadow-teal-900/10'}`} style={{ backgroundColor: userCard.status === 'frozen' ? undefined : '#00A88F' }}>
            <div className="flex justify-between items-start">
                <div className="w-10 h-7 bg-gradient-to-tr from-[#d4af37] to-[#f9e58e] rounded-md opacity-90"></div>
                <span className="font-bold italic text-xl tracking-tighter">VISA</span>
            </div>
            <div className="text-center">
                 <p className="font-mono text-lg sm:text-2xl tracking-widest flex items-center justify-between px-2">
                    {showCardDetails ? (
                        <><span>{cleanNumber.slice(0,4)}</span><span>{cleanNumber.slice(4,8)}</span><span>{cleanNumber.slice(8,12)}</span><span>{cleanNumber.slice(12,16)}</span></>
                    ) : (
                        <><span>••••</span><span>••••</span><span>••••</span><span>{cleanNumber.slice(-4)}</span></>
                    )}
                 </p>
            </div>
            <div className="flex justify-between items-end">
                <div><p className="text-[8px] uppercase opacity-70 mb-0.5">Card Holder</p><p className="font-mono text-[10px] sm:text-xs uppercase">{userCard.holder}</p></div>
                <div><p className="text-[8px] uppercase opacity-70 mb-0.5 font-right text-right">Expires</p><p className="font-mono text-[10px] sm:text-xs text-right">{userCard.expiry}</p></div>
            </div>
        </div>
      </div>

      {/* Transactions Optimized List */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50">
        <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-slate-900">{t.transactions}</h3>
            <span className="text-[10px] font-bold text-teal-600 uppercase">Tout voir</span>
        </div>
        <div className="space-y-4">
            {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between group active:bg-slate-50 transition-colors py-1 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${tx.status === 'failed' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                            {tx.status === 'failed' ? <XCircle size={20} /> : <img src={tx.logo} alt={tx.recipient} className="w-5 h-5 object-contain" />}
                        </div>
                        <div className="min-w-0">
                            <p className={`font-bold text-sm truncate ${tx.status === 'failed' ? 'text-red-500' : 'text-slate-900'}`}>
                                {tx.recipient}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                                {formatDate(tx.date)} • {tx.category}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={`font-bold text-sm ${tx.status === 'failed' ? 'text-red-400 line-through decoration-red-200' : tx.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </p>
                        {tx.status === 'failed' && (
                            <span className="text-[8px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md uppercase">Échoué</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;