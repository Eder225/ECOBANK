import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownLeft, Wallet, MoreHorizontal, Eye, EyeOff, Snowflake, XCircle, PlusCircle, Target } from 'lucide-react';
import { Account, Transaction, Language, User, Tab } from '../types';
import { TRANSLATIONS, CARDS } from '../constants';

interface DashboardProps {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  lang: Language;
  setActiveTab: (tab: Tab) => void;
  addNotification: (msg: string) => void;
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

const Dashboard: React.FC<DashboardProps> = ({ user, accounts, transactions, lang, setActiveTab, addNotification }) => {
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
    const newStatus = userCard.status === 'active' ? 'frozen' : 'active';
    setUserCard(prev => ({ ...prev, status: newStatus }));
    setShowCardMenu(false);
    
    const msg = lang === Language.FR 
        ? `Votre carte a été ${newStatus === 'frozen' ? 'bloquée' : 'débloquée'} avec succès.`
        : `Your card has been ${newStatus === 'frozen' ? 'frozen' : 'unfrozen'} successfully.`;
    addNotification(msg);
  };

  const handleAddGoal = () => {
      const msg = lang === Language.FR 
        ? "Création d'objectif : Fonctionnalité disponible prochainement."
        : "Create Goal: Feature coming soon.";
      addNotification(msg);
  };

  return (
    <div className="space-y-6 pb-10 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          {t.welcome},<br className="md:hidden"/><span className="text-teal-600"> {user.name.split(' ')[0]}</span>
        </h2>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm md:hidden">
            <MoreHorizontal size={20} className="text-slate-400" />
        </div>
      </div>

      {/* Stats row - Adaptive: Compact on mobile, Rich cards on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
        {/* Expenses */}
        <div className="bg-white rounded-[1.5rem] md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 md:mb-2">
                <span className="text-slate-400 md:text-slate-500 text-[10px] md:text-base font-bold md:font-medium uppercase md:normal-case tracking-wider md:tracking-normal block">{t.monthlyExpenses}</span>
                <span className="hidden md:block bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">0%</span>
            </div>
            <h3 className="text-lg md:text-4xl font-bold text-slate-900 mb-2 md:mb-6">{formatCurrency(0)}</h3>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-3">
                    <div className="hidden md:flex w-8 h-8 rounded-full bg-yellow-400 items-center justify-center text-slate-900 shrink-0">
                        <ArrowUpRight size={18} />
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium md:hidden">
                         <ArrowUpRight size={12} /> 0%
                    </div>
                    <p className="hidden md:block text-xs text-slate-500 max-w-[150px] leading-tight">
                        {t.expenseDesc}
                    </p>
                </div>
                <button 
                    onClick={() => setActiveTab(Tab.STATISTICS)}
                    className="hidden md:block px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    {t.viewMore}
                </button>
            </div>
        </div>

        {/* Income */}
        <div className="bg-white rounded-[1.5rem] md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 md:mb-2">
                <span className="text-slate-400 md:text-slate-500 text-[10px] md:text-base font-bold md:font-medium uppercase md:normal-case tracking-wider md:tracking-normal block">{t.monthlyIncome}</span>
                <span className="hidden md:block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">+100%</span>
            </div>
            <h3 className="text-lg md:text-4xl font-bold text-slate-900 mb-2 md:mb-6">{formatCurrency(195000000)}</h3>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-3">
                    <div className="hidden md:flex w-8 h-8 rounded-full bg-violet-500 items-center justify-center text-white shrink-0">
                        <ArrowDownLeft size={18} />
                    </div>
                    <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold md:hidden">
                        <ArrowDownLeft size={12} /> +100%
                    </div>
                    <p className="hidden md:block text-xs text-slate-500 max-w-[150px] leading-tight">
                        {t.incomeDesc}
                    </p>
                </div>
                <button 
                    onClick={() => setActiveTab(Tab.STATISTICS)}
                    className="hidden md:block px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    {t.viewMore}
                </button>
            </div>
        </div>
      </div>

      {/* Row 2: Chart (Desktop Only) & Card (All) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Statistics Chart (Hidden on Mobile, Visible on Desktop) */}
        <div className="hidden lg:block bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xl text-slate-900">{t.statistics}</h3>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-violet-400"></span>
                        <span className="text-sm text-slate-500">{t.incomeLabel}</span>
                    </div>
                    <select className="bg-slate-50 border-none text-sm font-semibold text-slate-600 rounded-lg px-3 py-1 outline-none cursor-pointer">
                        <option>{t.timeRange}</option>
                        <option value="1">1 Month</option>
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                    </select>
                </div>
            </div>
            
            <div className="h-[250px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 11}} 
                            dy={10} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 11}} 
                            tickFormatter={(value) => `${(value/1000000).toFixed(0)}M`}
                        />
                        <Tooltip 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px 12px'}} 
                            cursor={{stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4'}}
                            formatter={(value: number) => [formatCurrency(value), t.incomeLabel]}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#8b5cf6" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                            activeDot={{r: 6, fill: "#8b5cf6", stroke: "white", strokeWidth: 3}}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Card Visualization */}
        <div className="bg-white rounded-[2rem] md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-50 md:border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="font-bold text-lg md:text-xl text-slate-900">{t.cards}</h3>
                
                {/* Mobile Toggle */}
                <button 
                    onClick={() => setShowCardDetails(!showCardDetails)}
                    className="md:hidden text-teal-600 text-xs font-bold"
                >
                    {showCardDetails ? 'Masquer' : 'Afficher'}
                </button>

                {/* Desktop Menu */}
                <div className="relative hidden md:block">
                    <button 
                        onClick={() => setShowCardMenu(!showCardMenu)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <MoreHorizontal />
                    </button>
                    {showCardMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowCardMenu(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden">
                                <button 
                                    onClick={toggleFreeze}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700 font-medium"
                                >
                                    <Snowflake size={16} className={userCard.status === 'active' ? "text-blue-500" : "text-slate-400"} />
                                    {userCard.status === 'active' ? t.freeze : (lang === Language.FR ? 'Débloquer' : 'Unfreeze')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {/* The Card Component */}
            <div className={`relative w-full aspect-[1.586/1] rounded-[2rem] p-6 md:p-9 text-white flex flex-col justify-between shadow-2xl overflow-hidden transition-all duration-300 group ${
                userCard.status === 'frozen' ? 'bg-slate-500 grayscale shadow-none' : 'shadow-teal-900/10 md:shadow-teal-900/20 hover:scale-[1.01]'
            }`} 
                 style={{ backgroundColor: userCard.status === 'frozen' ? undefined : '#00A88F' }}>
                
                {/* Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 pointer-events-none mix-blend-overlay"></div>
                
                <div className="flex justify-between items-start z-10">
                    <div className="w-10 h-7 md:w-14 md:h-11 bg-gradient-to-tr from-[#d4af37] via-[#f9e58e] to-[#d4af37] rounded-md md:rounded-lg opacity-90 border border-[#b8860b]/30"></div>
                    <div className="flex flex-col items-end gap-1 md:gap-2">
                         <button 
                            onClick={(e) => { e.stopPropagation(); setShowCardDetails(!showCardDetails); }}
                            className="hidden md:block text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                         >
                             {showCardDetails ? <EyeOff size={20} className="md:w-6 md:h-6" /> : <Eye size={20} className="md:w-6 md:h-6" />}
                         </button>
                         <span className="font-bold text-xl md:text-4xl italic tracking-tighter drop-shadow-sm">VISA</span>
                    </div>
                </div>

                <div className="z-10 text-center mt-2 md:mt-4 mb-2">
                     <p className="font-mono text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-widest drop-shadow-md flex items-center justify-between md:justify-center md:gap-6 w-full px-2 md:px-0">
                        {showCardDetails ? (
                            <>
                                <span>{cleanNumber.slice(0,4)}</span>
                                <span>{cleanNumber.slice(4,8)}</span>
                                <span>{cleanNumber.slice(8,12)}</span>
                                <span>{cleanNumber.slice(12,16)}</span>
                            </>
                        ) : (
                            <>
                                <span>••••</span> 
                                <span>••••</span>
                                <span>••••</span>
                                <span>{cleanNumber.slice(-4)}</span>
                            </>
                        )}
                     </p>
                </div>

                <div className="z-10 flex justify-between items-end">
                    <div>
                        <p className="text-[8px] md:text-xs uppercase opacity-75 tracking-[0.2em] mb-0.5 md:mb-1 font-semibold">Card Holder</p>
                        <p className="font-mono text-[10px] sm:text-xs md:text-lg uppercase tracking-widest font-medium truncate max-w-[120px] md:max-w-none">{userCard.holder}</p>
                    </div>
                    <div>
                         <p className="text-[8px] md:text-xs uppercase opacity-75 tracking-[0.2em] mb-0.5 md:mb-1 font-semibold text-right">Expires</p>
                         <p className="font-mono text-[10px] sm:text-xs md:text-lg tracking-widest font-medium text-right">{userCard.expiry}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Row 3: Cashback, Transactions, Goals (Restored Desktop Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Cashback - Desktop Only */}
        <div className="hidden lg:flex bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-col h-full">
            <h3 className="font-bold text-xl text-slate-900 mb-6">{t.cashback}</h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Wallet className="text-slate-300" size={32} />
                     </div>
                     <p className="text-slate-900 font-semibold mb-1">{t.noCashback}</p>
                     <p className="text-slate-400 text-xs px-6">{t.noCashbackDesc}</p>
            </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-[2rem] md:rounded-3xl p-6 shadow-sm border border-slate-50 md:border-slate-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-5 md:mb-6">
                <h3 className="font-bold text-lg md:text-xl text-slate-900">{t.transactions}</h3>
                <MoreHorizontal className="hidden md:block text-slate-400 cursor-pointer" />
                <button 
                    onClick={() => setActiveTab(Tab.WALLET)}
                    className="md:hidden text-[10px] font-bold text-teal-600 uppercase"
                >
                    Tout voir
                </button>
            </div>

            {transactions.length > 0 ? (
                <div className="space-y-4">
                    {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between group active:bg-slate-50 transition-colors py-1 md:py-0 rounded-xl">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className={`w-10 h-10 rounded-2xl md:rounded-full flex items-center justify-center p-2 shrink-0 ${tx.status === 'failed' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                                    {tx.status === 'failed' ? <XCircle size={20} className="w-full h-full" /> : <img src={tx.logo} alt={tx.recipient} className="w-full h-full object-contain" />}
                                </div>
                                <div>
                                    <p className={`font-bold text-sm ${tx.status === 'failed' ? 'text-red-500' : 'text-slate-900'}`}>{tx.recipient}</p>
                                    <p className="text-[10px] md:text-xs text-slate-400 font-medium md:font-normal">
                                        {formatDate(tx.date)} <span className="md:hidden">• {tx.category}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-sm whitespace-nowrap ${tx.status === 'failed' ? 'text-red-400 line-through decoration-red-200' : tx.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                </p>
                                {tx.status === 'failed' && (
                                    <span className="md:hidden text-[8px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md uppercase">Échoué</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                    <p className="text-slate-900 font-semibold mb-1">{t.noTransactions}</p>
                </div>
            )}
        </div>

        {/* Goals - Desktop Only */}
        <div className="hidden lg:flex bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-900">{t.goals}</h3>
                <MoreHorizontal className="text-slate-400 cursor-pointer" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Target className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-900 font-semibold mb-1">{t.noGoals}</p>
                <p className="text-slate-400 text-xs px-6 mb-6">{t.noGoalsDesc}</p>
                
                <button 
                    onClick={handleAddGoal}
                    className="flex items-center gap-2 text-violet-600 font-semibold text-sm hover:bg-violet-50 px-4 py-2 rounded-lg transition-colors"
                >
                    <PlusCircle size={18} />
                    {t.addGoal}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;