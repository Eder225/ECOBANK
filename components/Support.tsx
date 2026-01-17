import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, ChevronDown, ChevronUp, Search, LifeBuoy } from 'lucide-react';
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
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">{t.supportCenter}</h2>
        <p className="text-slate-500">{t.howCanWeHelp}</p>
        
        <div className="mt-6 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder={t.search} 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-sm"
            />
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center group cursor-pointer">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Phone size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{t.callUs}</h3>
            <p className="text-slate-500 text-sm mb-4">+228 22 21 31 68</p>
            <span className="text-teal-600 text-sm font-semibold">{t.callUs}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center group cursor-pointer">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Mail size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{t.emailUs}</h3>
            <p className="text-slate-500 text-sm mb-4">support@ecobank.com</p>
            <span className="text-blue-600 text-sm font-semibold">{t.emailUs}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center group cursor-pointer">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <MessageCircle size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Live Chat</h3>
            <p className="text-slate-500 text-sm mb-4">Available 24/7</p>
            <span className="text-purple-600 text-sm font-semibold">Start Chat</span>
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
                <div key={index} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                        <span>{faq.question}</span>
                        {openFaq === index ? <ChevronUp size={20} className="text-teal-600" /> : <ChevronDown size={20} className="text-slate-400" />}
                    </button>
                    {openFaq === index && (
                        <div className="px-5 pb-5 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-50">
                            <div className="pt-4">
                                {faq.answer}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Support;