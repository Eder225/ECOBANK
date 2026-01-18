import React, { useState } from 'react';
import { Copy, Eye, EyeOff, Snowflake, Plus } from 'lucide-react';
import { Card, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CardsProps {
  cards: Card[];
  lang: Language;
}

const Cards: React.FC<CardsProps> = ({ cards: initialCards, lang }) => {
  const t = TRANSLATIONS[lang];
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});

  const toggleVisibility = (id: string) => {
    setVisibleCards(prev => ({
        ...prev,
        [id]: !prev[id]
    }));
  };

  const toggleFreeze = (id: string) => {
    setCards(prevCards => prevCards.map(card => {
        if (card.id === id) {
            return {
                ...card,
                status: card.status === 'active' ? 'frozen' : 'active'
            };
        }
        return card;
    }));
  };

  // For the settings panel, we'll focus on the first card for this demo
  const primaryCard = cards[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{t.myCards}</h2>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            <Plus size={16} />
            <span>{lang === Language.FR ? 'Nouvelle Carte' : 'Add New Card'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className={`relative rounded-2xl p-6 text-white h-56 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
            card.status === 'frozen' ? 'bg-slate-500 grayscale' : 'bg-gradient-to-br from-teal-600 to-teal-900 shadow-xl shadow-teal-900/20'
          }`}>
            <div className="flex justify-between items-start z-10">
              <span className="font-mono opacity-80">{card.type}</span>
              <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleVisibility(card.id)} 
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {visibleCards[card.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <div className={`px-2 py-1 rounded text-xs font-bold transition-colors duration-300 ${card.status === 'active' ? 'bg-white/20' : 'bg-slate-700 text-white'}`}>
                    {card.status === 'active' ? t.active : t.frozen}
                  </div>
              </div>
            </div>

            <div className="z-10 text-center mt-4">
                <p className="font-mono text-xl tracking-widest drop-shadow-md transition-all duration-300">
                    {visibleCards[card.id] ? card.number : `•••• •••• •••• ${card.number.slice(-4)}`}
                </p>
            </div>

            <div className="flex justify-between items-end z-10 mt-auto">
              <div>
                <p className="text-[10px] opacity-70 uppercase mb-0.5">Card Holder</p>
                <p className="font-medium tracking-wide text-sm truncate max-w-[180px]">{card.holder}</p>
              </div>
              <div>
                <p className="text-[10px] opacity-70 uppercase text-right mb-0.5">Expires</p>
                <p className="font-medium tracking-wide text-sm">{card.expiry}</p>
              </div>
            </div>
            
            {/* Overlay for frozen state */}
            {card.status === 'frozen' && (
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] pointer-events-none z-0"></div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">{lang === Language.FR ? 'Paramètres de la carte' : 'Card Settings'}</h3>
            <div className="space-y-3">
                {/* Freeze Toggle */}
                <div 
                    onClick={() => toggleFreeze(primaryCard.id)}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${primaryCard.status === 'frozen' ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                            <Snowflake size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-slate-800">{t.freeze}</p>
                            <p className="text-xs text-slate-500">{lang === Language.FR ? 'Désactiver temporairement votre carte' : 'Temporarily disable your card'}</p>
                        </div>
                    </div>
                    {/* Toggle Switch */}
                    <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${primaryCard.status === 'frozen' ? 'bg-teal-600' : 'bg-slate-200'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-300 ${primaryCard.status === 'frozen' ? 'left-6' : 'left-1'}`}></div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                            <Eye size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-slate-800">{lang === Language.FR ? 'Voir le code PIN' : 'Show PIN'}</p>
                            <p className="text-xs text-slate-500">{lang === Language.FR ? 'Afficher votre code à 4 chiffres' : "View your card's 4-digit PIN"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;