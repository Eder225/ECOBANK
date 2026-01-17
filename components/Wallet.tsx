import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet as WalletIcon, Plus, ArrowUpRight, TrendingUp, CreditCard, PieChart } from 'lucide-react';
import { Account, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface WalletProps {
  accounts: Account[];
  lang: Language;
}

// Adjusted wallet history for timeline starting 2026
const mockWalletData = [
  { name: 'Dec', value: 0 },
  { name: 'Jan', value: 195000000 },
  { name: 'Feb', value: 195000000 },
  { name: 'Mar', value: 195000000 },
  { name: 'Apr', value: 195000000 },
  { name: 'May', value: 195000000 }, 
];

const Wallet: React.FC<WalletProps> = ({ accounts, lang }) => {
  const t = TRANSLATIONS[lang];
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === Language.FR ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-slate-900">{t.wallet}</h2>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2">
            <Plus size={16} />
            {t.addMoney}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Assets Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
                <WalletIcon size={120} className="text-teal-900" />
            </div>
            
            <div className="z-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                        <WalletIcon size={20} />
                    </div>
                    <span className="font-semibold text-slate-500">{t.totalAssets}</span>
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mt-4">{formatCurrency(totalBalance)}</h3>
            </div>
            
            <div className="z-10 flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full">
                <TrendingUp size={16} />
                <span>+100% this month</span>
            </div>
        </div>

        {/* Monthly Limit Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-48">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                            <PieChart size={20} />
                        </div>
                        <span className="font-semibold text-slate-500">{t.spendingLimit}</span>
                    </div>
                    <span className="text-slate-400 font-mono">{formatCurrency(0)} / {formatCurrency(2000000)}</span>
                </div>
                
                <div className="space-y-2 mt-6">
                    <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-900">0%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 w-0 rounded-full"></div>
                    </div>
                </div>
            </div>
            
            <p className="text-xs text-slate-400 mt-4">
                You haven't spent anything this month. Great job saving!
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Evolution Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-900">{t.assetEvolution}</h3>
                <select className="bg-slate-50 border-none text-sm font-semibold text-slate-600 rounded-lg px-3 py-1 outline-none cursor-pointer">
                    <option>6 months</option>
                </select>
            </div>
            
            <div className="h-[250px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockWalletData}>
                        <defs>
                            <linearGradient id="colorWallet" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12}} 
                            dy={10} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 12}} 
                            tickFormatter={(value) => `${(value/1000000).toFixed(0)}M`}
                        />
                        <Tooltip 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px 12px'}} 
                            cursor={{stroke: '#0d9488', strokeWidth: 1, strokeDasharray: '4 4'}}
                            formatter={(value: number) => [formatCurrency(value), 'Balance']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#0d9488" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#colorWallet)" 
                            activeDot={{r: 6, fill: "#0d9488", stroke: "white", strokeWidth: 3}}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Account List */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-900">{t.myAccounts}</h3>
            </div>

            <div className="space-y-4">
                {accounts.map(acc => (
                    <div key={acc.id} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-white rounded-lg text-slate-900 shadow-sm">
                                <CreditCard size={18} />
                            </div>
                            <ArrowUpRight size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium mb-1">{acc.type}</p>
                            <p className="text-lg font-bold text-slate-900">{formatCurrency(acc.balance)}</p>
                        </div>
                    </div>
                ))}
                
                {/* Mock Savings Account */}
                <div className="p-4 rounded-2xl bg-teal-50 hover:bg-teal-100 transition-colors border border-teal-100 group cursor-pointer border-dashed">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-white rounded-lg text-teal-600 shadow-sm">
                            <Plus size={18} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-teal-600 font-medium mb-1">Open Savings</p>
                        <p className="text-lg font-bold text-teal-800">Start saving</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;