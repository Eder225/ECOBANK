import React, { useState } from 'react';
import { DollarSign, Clock, ExternalLink, History, Check } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS, CASHBACK_DATA } from '../constants';

interface CashbackProps {
  lang: Language;
  addNotification: (msg: string) => void;
}

const Cashback: React.FC<CashbackProps> = ({ lang, addNotification }) => {
  const t = TRANSLATIONS[lang];
  const [activatedOffers, setActivatedOffers] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === Language.FR ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleActivation = (id: string, name: string) => {
    if (activatedOffers.includes(id)) return;
    
    setActivatedOffers([...activatedOffers, id]);
    addNotification(lang === Language.FR 
        ? `Offre ${name} activée avec succès !` 
        : `Offer ${name} activated successfully!`);
  };

  // Values reset to 0 for new account
  const totalEarned = 0;
  const pendingEarned = 0;

  return (
    <div className="space-y-6 pb-10">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">{t.cashback}</h2>

      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-3xl p-8 text-white shadow-lg shadow-teal-900/20 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2 opacity-90">
                    <DollarSign size={20} />
                    <span className="font-medium tracking-wide text-sm uppercase">{t.totalEarned}</span>
                </div>
                <h3 className="text-5xl font-bold mb-6">{formatCurrency(totalEarned)}</h3>
                <p className="text-teal-100 text-sm max-w-xs leading-relaxed">
                    {lang === Language.FR ? "Continuez à utiliser votre carte Ecobank chez nos partenaires pour cumuler plus de gains." : "Keep using your Ecobank card at our partners to accumulate more earnings."}
                </p>
            </div>
            {/* Background decoration */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-slate-500 text-sm font-medium">{t.pending}</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(pendingEarned)}</p>
                </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: pendingEarned > 0 ? '66%' : '0%' }}
                ></div>
            </div>
            <p className="text-xs text-slate-400 mt-3">
                {pendingEarned > 0 
                    ? (lang === Language.FR ? "Sera crédité le 1er du mois prochain" : "Will be credited on the 1st of next month")
                    : t.noPending
                }
            </p>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">{t.availableOffers}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CASHBACK_DATA.map((offer) => {
                const isActivated = activatedOffers.includes(offer.id);
                return (
                <div key={offer.id} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow group flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-xl p-2 flex items-center justify-center border border-slate-100">
                            <img src={offer.logo} alt={offer.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-lg text-sm">
                            {offer.rate}%
                        </span>
                    </div>
                    
                    <h4 className="font-bold text-slate-900 text-lg mb-1">{offer.name}</h4>
                    <p className="text-slate-400 text-xs mb-4 uppercase tracking-wide font-semibold">{offer.category}</p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-50 flex gap-2">
                        <button 
                            onClick={() => toggleActivation(offer.id, offer.name)}
                            disabled={isActivated}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                                isActivated 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                        >
                            {isActivated ? (
                                <><Check size={16} /> {lang === Language.FR ? 'Activé' : 'Activated'}</>
                            ) : (
                                t.activate
                            )}
                        </button>
                        <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-colors">
                            <ExternalLink size={18} />
                        </button>
                    </div>
                </div>
            )})}
        </div>
      </div>

      {/* Empty History Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6">{t.cashbackHistory}</h3>
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="text-slate-300" size={32} />
            </div>
            <h4 className="text-slate-900 font-semibold mb-1">{t.noHistory}</h4>
            <p className="text-slate-400 text-sm">{t.startEarning}</p>
        </div>
      </div>
    </div>
  );
};

export default Cashback;