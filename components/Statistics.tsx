import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, PieChart as PieChartIcon } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface StatisticsProps {
  lang: Language;
}

const Statistics: React.FC<StatisticsProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === Language.FR ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock data for graphs - New account profile starting 2026
  const monthlyData = [
    { name: 'Dec', income: 0, expense: 0 },
    { name: 'Jan', income: 195000000, expense: 0 },
    { name: 'Feb', income: 0, expense: 0 },
    { name: 'Mar', income: 0, expense: 0 },
    { name: 'Apr', income: 0, expense: 0 },
    { name: 'May', income: 0, expense: 0 },
  ];

  // Placeholder data for categories since we have no expenses yet
  const categoryData = [
    { name: t.others, value: 100, color: '#cbd5e1' }, 
  ];

  return (
    <div className="space-y-6 pb-10">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">{t.statistics}</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                    <TrendingUp size={24} />
                </div>
                <span className="text-slate-500 font-medium">{t.monthlyIncome}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(195000000)}</h3>
            <span className="text-xs text-green-600 bg-green-50 w-fit px-2 py-1 rounded mt-2">+100% vs last month</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <TrendingDown size={24} />
                </div>
                <span className="text-slate-500 font-medium">{t.monthlyExpenses}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(0)}</h3>
            <span className="text-xs text-slate-400 bg-slate-50 w-fit px-2 py-1 rounded mt-2">No expenses yet</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Wallet size={24} />
                </div>
                <span className="text-slate-500 font-medium">{t.netSavings}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(195000000)}</h3>
            <span className="text-xs text-slate-400 mt-2">100% of income</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Income vs Expense Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-900">{t.incomeVsExpense}</h3>
            </div>
            <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} barGap={8}>
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
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                            cursor={{fill: '#f8fafc'}}
                            formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend wrapperStyle={{paddingTop: '20px'}} />
                        <Bar dataKey="income" name={t.incomeLabel} fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="expense" name={t.monthlyExpenses} fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Categories Pie Chart - Empty State for now */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <PieChartIcon size={32} className="text-slate-300"/>
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-2">{t.spendingCategories}</h3>
            <p className="text-slate-400 text-sm">{t.noTransactionsDesc}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;