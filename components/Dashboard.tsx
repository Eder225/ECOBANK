import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownLeft, Wallet, ChevronRight, MoreHorizontal, PlusCircle, CreditCard, Target, Eye, EyeOff } from 'lucide-react';
import { Account, Transaction, Language, User } from '../types';
import { TRANSLATIONS, CARDS } from '../constants';

interface DashboardProps {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  lang: Language;
}

// Adjusted chart data for new timeline (Start of 2026)
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
  const userCard = CARDS[0];
  const [showCardDetails, setShowCardDetails] = useState(false);
  
  // Remove any spaces from the source number to ensure slicing works correctly
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

  return (
    <div className="space-y-4 md:space-y-6 pb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 md:mb-8">{t.welcome} {user.name.split(' ')[0]}!</h2>

      {/* Row 1: Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Expenses */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 font-medium text-sm md:text-base">{t.monthlyExpenses}</span>
                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">0%</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6">{formatCurrency(0)}</h3>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 shrink-0">
                        <ArrowUpRight size={18} />
                    </div>
                    <p className="text-xs text-slate-500 max-w-[150px] leading-tight hidden xs:block">
                        {t.expenseDesc}
                    </p>
                </div>
                <button className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    {t.viewMore}
                </button>
            </div>
        </div>

        {/* Income */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 font-medium text-sm md:text-base">{t.monthlyIncome}</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">+100%</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6">{formatCurrency(195000000)}</h3>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white shrink-0">
                        <ArrowDownLeft size={18} />
                    </div>
                    <p className="text-xs text-slate-500 max-w-[150px] leading-tight hidden xs:block">
                        {t.incomeDesc}
                    </p>
                </div>
                <button className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    {t.viewMore}
                </button>
            </div>
        </div>
      </div>

      {/* Row 2: Chart & Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Statistics Chart (1/2 width) */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg md:text-xl text-slate-900">{t.statistics}</h3>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-2 hidden sm:flex">
                        <span className="w-3 h-3 rounded-full bg-violet-400"></span>
                        <span className="text-sm text-slate-500">{t.incomeLabel}</span>
                    </div>
                    <select className="bg-slate-50 border-none text-xs md:text-sm font-semibold text-slate-600 rounded-lg px-2 py-1 md:px-3 outline-none cursor-pointer">
                        <option>{t.timeRange}</option>
                    </select>
                </div>
            </div>
            
            <div className="h-[200px] md:h-[250px] w-full min-w-0">
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

        {/* Card Visualization (1/2 width) */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg md:text-xl text-slate-900">{t.cards}</h3>
                <MoreHorizontal className="text-slate-400 cursor-pointer" />
            </div>
            
            {/* Credit Card Component - Updated Logic & Sizes */}
            <div className="relative w-full aspect-[1.586/1] rounded-2xl p-7 md:p-9 text-white flex flex-col justify-between shadow-2xl shadow-teal-900/20 overflow-hidden transition-transform hover:scale-[1.01] duration-300 group" 
                 style={{ backgroundColor: '#00A88F' }}>
                
                {/* Background Texture/Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute -top-[50%] -right-[50%] w-[100%] h-[100%] bg-white/5 blur-[50px] rounded-full pointer-events-none"></div>
                
                {/* Top Row: Chip & Visa & Eye Toggle */}
                <div className="flex justify-between items-start z-10">
                    {/* Chip - Larger */}
                    <div className="w-14 h-11 bg-gradient-to-tr from-[#d4af37] via-[#f9e58e] to-[#d4af37] rounded-lg relative overflow-hidden shadow-sm border border-[#b8860b]/30">
                         {/* Simple chip pattern */}
                         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20"></div>
                         <div className="absolute top-0 left-1/2 h-full w-[1px] bg-black/20"></div>
                         <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] border border-black/10 rounded-sm"></div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                         {/* Integrated Show/Hide Toggle */}
                         <button 
                            onClick={(e) => { e.stopPropagation(); setShowCardDetails(!showCardDetails); }}
                            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                         >
                             {showCardDetails ? <EyeOff size={24} /> : <Eye size={24} />}
                         </button>
                         {/* Visa Logo - Larger */}
                         <span className="font-bold text-4xl italic tracking-tighter drop-shadow-sm">VISA</span>
                    </div>
                </div>

                {/* Middle: Number - Larger */}
                <div className="z-10 flex items-center justify-center mt-4 mb-2">
                     <p className="font-mono text-2xl md:text-3xl lg:text-4xl tracking-widest drop-shadow-md flex items-center gap-4 md:gap-6 font-medium text-shadow w-full justify-center">
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

                {/* Bottom Row: Holder & Expiry - Larger */}
                <div className="z-10 flex justify-between items-end">
                    <div>
                        <p className="text-[10px] md:text-xs uppercase opacity-75 tracking-[0.2em] mb-1 font-semibold text-shadow-sm">Card Holder</p>
                        <p className="font-mono text-sm md:text-lg uppercase tracking-widest font-medium text-shadow-sm truncate max-w-[180px] md:max-w-[250px]">{userCard.holder}</p>
                    </div>
                    <div>
                         <p className="text-[10px] md:text-xs uppercase opacity-75 tracking-[0.2em] mb-1 font-semibold text-right text-shadow-sm">Expires</p>
                         <p className="font-mono text-sm md:text-lg tracking-widest font-medium text-right text-shadow-sm">{userCard.expiry}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Row 3: Cashback, Transactions, Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Cashback */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-6">{t.cashback}</h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Wallet className="text-slate-300" size={32} />
                     </div>
                     <p className="text-slate-900 font-semibold mb-1">{t.noCashback}</p>
                     <p className="text-slate-400 text-xs px-6">{t.noCashbackDesc}</p>
            </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg md:text-xl text-slate-900">{t.transactions}</h3>
                <MoreHorizontal className="text-slate-400 cursor-pointer" />
            </div>

            {transactions.length > 0 ? (
                <div className="space-y-4 md:space-y-5">
                    {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center p-2 shrink-0">
                                    <img src={tx.logo} alt={tx.recipient} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{tx.recipient}</p>
                                    <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                                </div>
                            </div>
                            <p className={`font-bold text-sm whitespace-nowrap ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                                {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <CreditCard className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-900 font-semibold mb-1">{t.noTransactions}</p>
                    <p className="text-slate-400 text-xs px-6">{t.noTransactionsDesc}</p>
                </div>
            )}
        </div>

        {/* Goals */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg md:text-xl text-slate-900">{t.goals}</h3>
                <MoreHorizontal className="text-slate-400 cursor-pointer" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Target className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-900 font-semibold mb-1">{t.noGoals}</p>
                <p className="text-slate-400 text-xs px-6 mb-6">{t.noGoalsDesc}</p>
                
                <button className="flex items-center gap-2 text-violet-600 font-semibold text-sm hover:bg-violet-50 px-4 py-2 rounded-lg transition-colors">
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