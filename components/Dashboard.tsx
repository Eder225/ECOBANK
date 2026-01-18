import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownLeft, Wallet, ChevronRight, MoreHorizontal, PlusCircle, CreditCard, Target, Eye, EyeOff, Snowflake, XCircle } from 'lucide-react';
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
  const [showCardMenu, setShowCardMenu] = useState(false);
  
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
          month: 'short',
          year: 'numeric'
      });
  };

  const toggleFreeze = () => {
    setUserCard(prev => ({ ...prev, status: prev.status === 'active' ? 'frozen' : 'active' }));
    setShowCardMenu(false);
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 md:mb-8">{t.welcome} {user.name.split(' ')[0]}!</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 font-medium text-sm md:text-base">{t.monthlyExpenses}</span>
                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">0%</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6">{formatCurrency(0)}</h3>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 shrink-0"><ArrowUpRight size={18} /></div>
                    <p className="text-xs text-slate-500 max-w-[150px] leading-tight hidden xs:block">{t.expenseDesc}</p>
                </div>
                <button className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">{t.viewMore}</button>
            </div>
        </div>

        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 font-medium text-sm md:text-base">{t.monthlyIncome}</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">+100%</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6">{formatCurrency(195000000)}</h3>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0"><ArrowDownLeft size={18} /></div>
                    <p className="text-xs text-slate-500 max-w-[150px] leading-tight hidden xs:block">{t.incomeDesc}</p>
                </div>
                <button className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">{t.viewMore}</button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg md:text-xl text-slate-900">{t.statistics}</h3>
                <div className="flex items-center gap-2 hidden sm:flex"><span className="w-3 h-3 rounded-full bg-violet-400"></span><span className="text-sm text-slate-500">{t.incomeLabel}</span></div>
            </div>
            <div className="h-[200px] md:h-[250px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} formatter={(v: number) => [formatCurrency(v), t.incomeLabel]} />
                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-6 relative">
                <h3 className="font-bold text-lg md:text-xl text-slate-900">{t.cards}</h3>
                <div className="relative">
                    <button onClick={() => setShowCardMenu(!showCardMenu)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"><MoreHorizontal /></button>
                    {showCardMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowCardMenu(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden">
                                <button onClick={toggleFreeze} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700 font-medium">
                                    <Snowflake size={16} className={userCard.status === 'active' ? "text-blue-500" : "text-slate-400"} />
                                    {userCard.status === 'active' ? t.freeze : (lang === Language.FR ? 'Débloquer' : 'Unfreeze')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            <div className={`relative w-full aspect-[1.586/1] rounded-2xl p-5 md:p-9 text-white flex flex-col justify-between shadow-2xl overflow-hidden transition-all duration-300 ${userCard.status === 'frozen' ? 'bg-slate-500 grayscale' : 'shadow-teal-900/20'}`} style={{ backgroundColor: userCard.status === 'frozen' ? undefined : '#00A88F' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 pointer-events-none"></div>
                <div className="flex justify-between items-start z-10">
                    <div className="w-11 h-8 md:w-14 md:h-11 bg-gradient-to-tr from-[#d4af37] via-[#f9e58e] to-[#d4af37] rounded-lg border border-[#b8860b]/30"></div>
                    <div className="flex flex-col items-end gap-1 md:gap-2">
                         <button onClick={(e) => { e.stopPropagation(); setShowCardDetails(!showCardDetails); }} className="text-white/70 hover:text-white p-1">{showCardDetails ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                         <span className="font-bold text-2xl md:text-4xl italic">VISA</span>
                    </div>
                </div>
                <div className="z-10 flex items-center justify-center mt-2">
                     <p className="font-mono text-lg sm:text-2xl md:text-3xl tracking-widest flex items-center gap-2 sm:gap-4 md:gap-6 w-full justify-center">
                        {showCardDetails ? (
                            <>{cleanNumber.slice(0,4)} {cleanNumber.slice(4,8)} {cleanNumber.slice(8,12)} {cleanNumber.slice(12,16)}</>
                        ) : (
                            <>•••• •••• •••• {cleanNumber.slice(-4)}</>
                        )}
                     </p>
                </div>
                <div className="z-10 flex justify-between items-end">
                    <div><p className="text-[9px] uppercase opacity-75 mb-1 font-semibold">Card Holder</p><p className="font-mono text-xs sm:text-sm uppercase tracking-widest">{userCard.holder}</p></div>
                    <div><p className="text-[9px] uppercase opacity-75 mb-1 font-semibold text-right">Expires</p><p className="font-mono text-xs sm:text-sm tracking-widest">{userCard.expiry}</p></div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-6">{t.cashback}</h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Wallet className="text-slate-300" size={32} /></div><p className="text-slate-900 font-semibold mb-1">{t.noCashback}</p></div>
        </div>

        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg md:text-xl text-slate-900">{t.transactions}</h3><MoreHorizontal className="text-slate-400 cursor-pointer" /></div>
            <div className="space-y-4 md:space-y-5">
                {transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center p-2 shrink-0 ${tx.status === 'failed' ? 'bg-red-50' : 'bg-slate-100'}`}>
                                {tx.status === 'failed' ? <XCircle className="text-red-500 w-full h-full" /> : <img src={tx.logo} alt={tx.recipient} className="w-full h-full object-contain" />}
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${tx.status === 'failed' ? 'text-red-500' : 'text-slate-900'}`}>{tx.recipient} {tx.status === 'failed' && <span className="text-[10px] font-medium bg-red-100 px-1.5 py-0.5 rounded ml-1 uppercase">{lang === Language.FR ? 'Échoué' : 'Failed'}</span>}</p>
                                <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                            </div>
                        </div>
                        <p className={`font-bold text-sm whitespace-nowrap ${tx.status === 'failed' ? 'text-red-500 line-through decoration-red-300' : tx.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg md:text-xl text-slate-900">{t.goals}</h3><MoreHorizontal className="text-slate-400 cursor-pointer" /></div>
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Target className="text-slate-300" size={32} /></div><p className="text-slate-900 font-semibold mb-1">{t.noGoals}</p><button className="flex items-center gap-2 text-violet-600 font-semibold text-sm hover:bg-violet-50 px-4 py-2 rounded-lg mt-4"><PlusCircle size={18} />{t.addGoal}</button></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;