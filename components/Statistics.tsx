import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, PieChart as PieChartIcon } from 'lucide-react';
import { Language, Account, Transaction } from '../types';
import { TRANSLATIONS } from '../constants';

interface StatisticsProps {
  lang: Language;
  accounts: Account[];
  transactions: Transaction[];
}

const Statistics: React.FC<StatisticsProps> = ({ lang, accounts, transactions }) => {
  const t = TRANSLATIONS[lang];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === Language.FR ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const translateMonth = (monthKey: string) => {
      const key = monthKey.toLowerCase();
      return t[key] || monthKey;
  };

  const monthlyExpenses = transactions
    .filter(tx => tx.type === 'debit' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyIncome = transactions
    .filter(tx => tx.type === 'credit' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netSavings = monthlyIncome - monthlyExpenses;

  // Mock data for graphs starting 2026
  const monthlyData = [
    { name: 'Dec', income: 0, expense: 0 },
    { name: 'Jan', income: 195000000, expense: monthlyExpenses },
    { name: 'Feb', income: 0, expense: 0 },
    { name: 'Mar', income: 0, expense: 0 },
  ];

  return (
    <div className="space-y-6 pb-10">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">{t.statistics}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><TrendingUp size={24} /></div>
                <span className="text-slate-500 font-medium">{t.monthlyIncome}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(monthlyIncome)}</h3>
            <span className="text-xs text-green-600 bg-green-50 w-fit px-2 py-1 rounded mt-2">+100% {t.vsLastMonth}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><TrendingDown size={24} /></div>
                <span className="text-slate-500 font-medium">{t.monthlyExpenses}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(monthlyExpenses)}</h3>
            <span className="text-xs text-slate-400 bg-slate-50 w-fit px-2 py-1 rounded mt-2">{t.expenseDesc}</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Wallet size={24} /></div>
                <span className="text-slate-500 font-medium">{t.netSavings}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(netSavings)}</h3>
            <span className="text-xs text-slate-400 mt-2">100% {t.ofIncome}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-900">{t.incomeVsExpense}</h3>
            </div>
            <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} tickFormatter={(value) => translateMonth(value)} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `${(value/1000000).toFixed(0)}M`} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}} cursor={{fill: '#f8fafc'}} formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => translateMonth(label as string)} />
                        <Legend wrapperStyle={{paddingTop: '20px'}} />
                        <Bar dataKey="income" name={t.incomeLabel} fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="expense" name={t.monthlyExpenses} fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;