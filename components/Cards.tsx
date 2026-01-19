import React, { useState, useEffect } from 'react';
import { Copy, Eye, EyeOff, Snowflake, Plus, ShieldCheck } from 'lucide-react';
import { Card, Language } from '../types';
import { TRANSLATIONS, CARDS } from '../constants';

interface CardsProps {
  // Remove "cards" from props since we load it from storage/constants inside the component
  lang: Language;
  addNotification: (msg: string) => void;
}

const Cards: React.FC<CardsProps> = ({ lang, addNotification }) => {
  const t = TRANSLATIONS[lang];
  
  // Initialize state from localStorage or default constants
  const [cards, setCards] = useState<Card[]>(() => {
      const saved = localStorage.getItem('ecobank_cards');
      return saved ? JSON.parse(saved) : CARDS;
  });

  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});
  const [showPin, setShowPin] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ecobank_cards', JSON.stringify(cards));
  }, [cards]);

  const toggleVisibility = (id: string) => {
    setVisibleCards(prev => ({
        ...prev,
        [id]: !prev[id]
    }));
  };

  const toggleFreeze = (id: string) => {
    let newState = '';
    setCards(prevCards => prevCards.map(card => {
        if (card.id === id) {
            newState = card.status === 'active' ? 'frozen' : 'active';
            return {
                ...card,
                status: card.status === 'active' ? 'frozen' : 'active'
            };
        }
        return card;
    }));
    
    if(newState) {
        addNotification(lang === Language.FR 
            ? `Carte ${newState === 'frozen' ? 'bloquée' : 'débloquée'}` 
            : `Card ${newState === 'frozen' ? 'frozen' : 'unfrozen'}`);
    }
  };
  
  const handleAddCard = () => {
      addNotification(lang === Language.FR 
        ? "Votre demande de nouvelle carte a été prise en compte." 
        : "Your request for a new card has been received.");
  };

  const togglePin = () => {
      setShowPin(!showPin);
  };

  // For the settings panel, we'll focus on the first card for this demo
  const primaryCard = cards[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{t.myCards}</h2>
        <button 
            onClick={handleAddCard}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
            <Plus size={16} />
            <span>{t.addNewCard}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className={`relative rounded-2xl p-5 md:p-6 text-white w-full aspect-[1.586/1] flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
            card.status === 'frozen' ? 'bg-slate-500 grayscale' : 'bg-gradient-to-br from-teal-600 to-teal-900 shadow-xl shadow-teal-900/20'
          }`}>
            <div className="flex justify-between items-start z-10">
              <span className="font-mono opacity-80 text-sm md:text-base">{card.type}</span>
              <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleVisibility(card.id)} 
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {visibleCards[card.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <div className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-colors duration-300 ${card.status === 'active' ? 'bg-white/20' : 'bg-slate-700 text-white'}`}>
                    {card.status === 'active' ? t.active : t.frozen}
                  </div>
              </div>
            </div>

            <div className="z-10 text-center mt-2">
                <p className="font-mono text-lg md:text-xl tracking-widest drop-shadow-md transition-all duration-300">
                    {visibleCards[card.id] ? card.number : `•••• •••• •••• ${card.number.slice(-4)}`}
                </p>
            </div>

            <div className="flex justify-between items-end z-10 mt-auto">
              <div className="flex-1 mr-2">
                {/* Label removed */}
                <p className="font-medium tracking-wide text-sm md:text-lg truncate max-w-[140px] md:max-w-[200px] font-bold">{card.holder}</p>
              </div>
              <div className="shrink-0">
                <p className="text-[9px] md:text-[10px] opacity-70 uppercase text-right mb-0.5">{t.expires}</p>
                <p className="font-medium tracking-wide text-xs md:text-sm text-right">{card.expiry}</p>
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
            <h3 className="font-bold text-slate-800 mb-4">{t.cardSettings}</h3>
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
                            <p className="text-xs text-slate-500">{t.tempDisable}</p>
                        </div>
                    </div>
                    {/* Toggle Switch */}
                    <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${primaryCard.status === 'frozen' ? 'bg-teal-600' : 'bg-slate-200'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-300 ${primaryCard.status === 'frozen' ? 'left-6' : 'left-1'}`}></div>
                    </div>
                </div>

                <div 
                    onClick={togglePin}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                            {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                        <div>
                            <p className="font-medium text-slate-800">{showPin ? t.hidePin : t.showPin}</p>
                            <p className="text-xs text-slate-500">
                                {showPin ? '1234' : t.pinDesc}
                            </p>
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