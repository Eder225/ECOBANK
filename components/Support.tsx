import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, LifeBuoy } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SupportProps {
  lang: Language;
}

const Support: React.FC<SupportProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { question: t.faq1, answer: t.faq1Desc },
    { question: t.faq2, answer: t.faq2Desc },
    { question: t.faq3, answer: t.faq3Desc },
    { question: t.faq4, answer: t.faq4Desc },
    { question: t.faq5, answer: t.faq5Desc },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">{t.supportCenter}</h2>
        <p className="text-slate-500 max-w-xl mx-auto">{t.howCanWeHelp}</p>
        
        <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder={t.search} 
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-sm transition-shadow hover:shadow-md"
            />
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <LifeBuoy size={24} className="text-teal-600" />
            {t.faq}
        </h3>
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
                    <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                        <span className="pr-4">{faq.question}</span>
                        <div className={`p-1 rounded-full bg-slate-100 text-slate-500 transition-colors ${openFaq === index ? 'bg-teal-100 text-teal-700' : ''}`}>
                             {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </button>
                    <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="px-5 pb-6 pt-0 text-slate-600 text-sm leading-7 border-t border-slate-50">
                            <div className="pt-4">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      {/* Helper text since we removed contact buttons */}
      <div className="text-center mt-12 text-slate-400 text-sm">
        <p>{lang === Language.FR ? "Vous ne trouvez pas ce que vous cherchez ?" : "Can't find what you're looking for?"}</p>
        <p className="mt-1">
             {lang === Language.FR ? "Rendez-vous dans votre agence Ecobank la plus proche." : "Please visit your nearest Ecobank branch."}
        </p>
      </div>
    </div>
  );
};

export default Support;