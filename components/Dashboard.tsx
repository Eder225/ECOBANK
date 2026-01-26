import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownLeft, Wallet, MoreHorizontal, Eye, EyeOff, Snowflake, XCircle, PlusCircle, Target, X, Filter, Download, Archive, Settings, AlertTriangle } from 'lucide-react';
import { Account, Transaction, Language, User, Tab, Goal } from '../types';
import { TRANSLATIONS, CARDS, GOALS } from '../constants';

interface DashboardProps {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  lang: Language;
  setActiveTab: (tab: Tab) => void;
  addNotification: (msg: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, accounts, transactions, lang, setActiveTab, addNotification }) => {
  const t = TRANSLATIONS[lang];
  
  const [goals, setGoals] = useState<Goal[]>(() => {
      const saved = localStorage.getItem('ecobank_goals');
      return saved ? JSON.parse(saved) : GOALS;
  });

  const [userCard, setUserCard] = useState(() => {
      const saved = localStorage.getItem('ecobank_cards');
      const cards = saved ? JSON.parse(saved) : CARDS;
      return cards[0];
  });

  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showCardMenu, setShowCardMenu] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [activeMenu, setActiveMenu] = useState<'transactions' | 'goals' | null>(null);

  // Calcul dynamique PERMANENT des statistiques
  const monthlyExpenses = transactions
    .filter(tx => tx.type === 'debit' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyIncome = transactions
    .filter(tx => tx.type === 'credit' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calcul du pourcentage de dépenses par rapport aux revenus
  const expensePercentage = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;

  // Données du graphique basées sur l'évolution réelle
  const currentBalance = accounts[0]?.balance || 0;
  const chartData = [
    { name: 'Dec', value: 0 },
    { name: 'Jan', value: 195000000 }, // Dépôt initial
    { name: 'Feb', value: currentBalance }, // Après retrait
    { name: 'Mar', value: currentBalance },
    { name: 'Apr', value: currentBalance },
    { name: 'May', value: currentBalance }, 
    { name: 'Jun', value: currentBalance }, 
  ];

  useEffect(() => {
      localStorage.setItem('ecobank_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
      const handleStorageChange = () => {
          const saved = localStorage.getItem('ecobank_cards');
          if (saved) {
             const cards = JSON.parse(saved);
             if (cards.length > 0) setUserCard(cards[0]);
          }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const cleanNumber = userCard.number.replace(/\s/g, '');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === Language.FR ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString(lang === Language.FR ? 'fr-FR' : 'en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
      });
  };

  const translateMonth = (monthKey: string) => {
      const key = monthKey.toLowerCase();
      return t[key] || monthKey;
  };

  const toggleFreeze = () => {
    const newStatus = userCard.status === 'active' ? 'frozen' : 'active';
    const updatedCard = { ...userCard, status: newStatus };
    setUserCard(updatedCard);
    setShowCardMenu(false);
    const saved = localStorage.getItem('ecobank_cards');
    const allCards = saved ? JSON.parse(saved) : CARDS;
    const updatedAllCards = allCards.map((c: any) => c.id === updatedCard.id ? updatedCard : c);
    localStorage.setItem('ecobank_cards', JSON.stringify(updatedAllCards));
    const msg = lang === Language.FR 
        ? `Votre carte a été ${newStatus === 'frozen' ? 'bloquée' : 'débloquée'} avec succès.`
        : `Your card has been ${newStatus === 'frozen' ? 'frozen' : 'unfrozen'} successfully.`;
    addNotification(msg);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newGoalName || !newGoalAmount) return;
      const goal: Goal = {
          id: `g-${Date.now()}`,
          name: newGoalName,
          targetAmount: parseFloat(newGoalAmount),
          currentAmount: 0,
          currency: 'XOF',
          icon: 'Target'
      };
      setGoals(prev => [...prev, goal]);
      setIsGoalModalOpen(false);
      setNewGoalName('');
      setNewGoalAmount('');
      addNotification(lang === Language.FR ? 'Objectif créé avec succès !' : 'Goal created successfully!');
  };

  const toggleMenu = (menu: 'transactions' | 'goals') => {
      setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className="space-y-6 pb-10 max-w-full relative" onClick={() => setActiveMenu(null)}>
      {isGoalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900">{t.createGoal}</h3>
                      <button onClick={() => setIsGoalModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleCreateGoal} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.goalName}</label>
                          <input type="text" value={newGoalName} onChange={(e) => setNewGoalName(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500" placeholder={lang === Language.FR ? "Ex: Vacances, Voiture..." : "Ex: Holiday, Car..."} />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.targetAmount} (XOF)</label>
                          <input type="number" value={newGoalAmount} onChange={(e) => setNewGoalAmount(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-teal-500" placeholder="0" />
                      </div>
                      <div className="flex gap-3 pt-4">
                          <button type="button" onClick={() => setIsGoalModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl">{t.cancel}</button>
                          <button type="submit" disabled={!newGoalName || !newGoalAmount} className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl">{t.create}</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          {t.welcome},<br className="md:hidden"/><span className="text-teal-600"> {user.name.split(' ')[0]}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
        {/* Carte des Dépenses - Mise à jour permanente */}
        <div className="bg-white rounded-[1.5rem] md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-50 group hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 md:mb-2">
                <span className="text-slate-400 md:text-slate-500 text-[10px] md:text-base font-bold md:font-medium uppercase tracking-wider block">{t.monthlyExpenses}</span>
                <span className={`hidden md:block text-xs font-bold px-2 py-1 rounded-full ${expensePercentage > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                    {expensePercentage.toFixed(3)}%
                </span>
            </div>
            <h3 className="text-lg md:text-4xl font-bold text-slate-900 mb-2 md:mb-6">{formatCurrency(monthlyExpenses)}</h3>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-3">
                    <div className="hidden md:flex w-8 h-8 rounded-full bg-yellow-400 items-center justify-center text-slate-900 shrink-0"><ArrowUpRight size={18} /></div>
                    <p className="hidden md:block text-xs text-slate-500 max-w-[150px] leading-tight">{t.expenseDesc}</p>
                    <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold md:hidden">
                        <ArrowUpRight size={12} /> {expensePercentage.toFixed(3)}%
                    </div>
                </div>
                <button onClick={() => setActiveTab(Tab.STATISTICS)} className="hidden md:block px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">{t.viewMore}</button>
            </div>
        </div>

        {/* Carte des Revenus */}
        <div className="bg-white rounded-[1.5rem] md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-50 group hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 md:mb-2">
                <span className="text-slate-400 md:text-slate-500 text-[10px] md:text-base font-bold md:font-medium uppercase tracking-wider block">{t.monthlyIncome}</span>
                <span className="hidden md:block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">+100%</span>
            </div>
            <h3 className="text-lg md:text-4xl font-bold text-slate-900 mb-2 md:mb-6">{formatCurrency(monthlyIncome)}</h3>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-3">
                    <div className="hidden md:flex w-8 h-8 rounded-full bg-violet-500 items-center justify-center text-white shrink-0"><ArrowDownLeft size={18} /></div>
                    <p className="hidden md:block text-xs text-slate-500 max-w-[150px] leading-tight">{t.incomeDesc}</p>
                    <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold md:hidden">
                        <ArrowDownLeft size={12} /> +100%
                    </div>
                </div>
                <button onClick={() => setActiveTab(Tab.STATISTICS)} className="hidden md:block px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">{t.viewMore}</button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="hidden lg:block bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-900">{t.statistics}</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-violet-400"></span><span className="text-sm text-slate-500">{t.incomeLabel}</span></div>
                    <select className="bg-slate-50 border-none text-sm font-semibold text-slate-600 rounded-lg px-3 py-1 outline-none cursor-pointer"><option>{t.timeRange}</option></select>
                </div>
            </div>
            <div className="h-[250px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs><linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} tickFormatter={(value) => translateMonth(value)} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} tickFormatter={(value) => `${(value/1000000).toFixed(0)}M`} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px 12px'}} cursor={{stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4'}} formatter={(value: number) => [formatCurrency(value), t.incomeLabel]} labelFormatter={(label) => translateMonth(label as string)} />
                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" activeDot={{r: 6, fill: "#8b5cf6", stroke: "white", strokeWidth: 3}} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white rounded-[2rem] md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-50 md:border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="font-bold text-lg md:text-xl text-slate-900">{t.cards}</h3>
                <button onClick={() => setShowCardDetails(!showCardDetails)} className="md:hidden text-teal-600 text-xs font-bold">{showCardDetails ? t.hideCardDetails : t.showCardDetails}</button>
            </div>
            <div className={`relative w-full aspect-[1.586/1] rounded-[2rem] p-6 md:p-9 text-white flex flex-col justify-between shadow-2xl overflow-hidden transition-all duration-300 group ${userCard.status === 'frozen' ? 'bg-slate-500 grayscale' : 'shadow-teal-900/10 md:shadow-teal-900/20 hover:scale-[1.01]'}`} style={{ backgroundColor: userCard.status === 'frozen' ? undefined : '#00A88F' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 pointer-events-none mix-blend-overlay"></div>
                <div className="flex justify-between items-start z-10">
                    <div className="w-10 h-7 md:w-14 md:h-11 bg-gradient-to-tr from-[#d4af37] via-[#f9e58e] to-[#d4af37] rounded-md md:rounded-lg opacity-90"></div>
                    <span className="font-bold text-xl md:text-4xl italic tracking-tighter drop-shadow-sm">VISA</span>
                </div>
                <div className="z-10 text-center mt-2 md:mt-4 mb-2">
                     <p className="font-mono text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-widest drop-shadow-md flex items-center justify-between md:justify-center md:gap-6 w-full px-2">
                        {showCardDetails ? cleanNumber.match(/.{1,4}/g)?.join(' ') : `•••• •••• •••• ${cleanNumber.slice(-4)}`}
                     </p>
                </div>
                <div className="z-10 flex justify-between items-end">
                    <p className="font-mono text-xs sm:text-sm md:text-lg uppercase tracking-wider font-bold truncate max-w-[160px] md:max-w-[320px] block">{userCard.holder}</p>
                    <div className="shrink-0 text-right">
                         <p className="text-[8px] md:text-xs uppercase opacity-75 mb-0.5 tracking-wider">{t.expires}</p>
                         <p className="font-mono text-[10px] md:text-lg tracking-widest font-medium">{userCard.expiry}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="hidden lg:flex bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-col h-full"><h3 className="font-bold text-xl text-slate-900 mb-6">{t.cashback}</h3><div className="flex-1 flex flex-col items-center justify-center text-center py-4"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Wallet className="text-slate-300" size={32} /></div><p className="text-slate-900 font-semibold mb-1">{t.noCashback}</p><p className="text-slate-400 text-xs px-6">{t.noCashbackDesc}</p></div></div>

        <div className="bg-white rounded-[2rem] md:rounded-3xl p-6 shadow-sm border border-slate-50 flex flex-col h-full">
            <div className="flex justify-between items-center mb-5 md:mb-6"><h3 className="font-bold text-lg md:text-xl text-slate-900">{t.transactions}</h3><button onClick={() => setActiveTab(Tab.WALLET)} className="md:hidden text-[10px] font-bold text-teal-600 uppercase">{t.viewMore}</button></div>
            <div className="space-y-4">
                {transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between py-1 md:py-0 group">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center p-2 bg-slate-100 text-slate-500`}><img src={tx.logo} alt={tx.recipient} className="w-full h-full object-contain" /></div>
                            <div>
                                <p className="font-bold text-sm text-slate-900">{tx.recipient}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{formatDate(tx.date)}</p>
                            </div>
                        </div>
                        <p className={`font-bold text-sm whitespace-nowrap ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        <div className="hidden lg:flex bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-col h-full">
            <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-xl text-slate-900">{t.goals}</h3><MoreHorizontal className="text-slate-400" /></div>
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Target className="text-slate-300" size={32} /></div><p className="text-slate-900 font-semibold mb-1">{t.noGoals}</p><p className="text-slate-400 text-xs px-6 mb-6">{t.noGoalsDesc}</p><button onClick={() => setIsGoalModalOpen(true)} className="flex items-center gap-2 text-violet-600 font-semibold text-sm hover:bg-violet-50 px-4 py-2 rounded-lg transition-colors"><PlusCircle size={18} /> {t.addGoal}</button></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;