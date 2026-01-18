import React, { useState, useEffect } from 'react';
import { Send, ChevronRight, ChevronLeft, Wallet, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Account, Language, Transaction } from '../types';
import { TRANSLATIONS } from '../constants';

interface TransfersProps {
  accounts: Account[];
  lang: Language;
  addNotification: (message: string) => void;
  addTransaction: (tx: Transaction) => void;
}

interface TransferData {
  accountId: string;
  beneficiaryName: string;
  beneficiaryFirstName: string;
  iban: string;
  bankName: string;
  amount: string;
  reason: string;
}

const Transfers: React.FC<TransfersProps> = ({ accounts, lang, addNotification, addTransaction }) => {
  const t = TRANSLATIONS[lang];
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [fees, setFees] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const [data, setData] = useState<TransferData>({
    accountId: accounts.length > 0 ? accounts[0].id : '',
    beneficiaryName: '',
    beneficiaryFirstName: '',
    iban: '',
    bankName: '',
    amount: '',
    reason: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add failed transaction to history
    const failedTx: Transaction = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString(),
        recipient: `${data.beneficiaryFirstName} ${data.beneficiaryName}`,
        amount: parseFloat(data.amount),
        currency: 'XOF',
        type: 'debit',
        category: 'Virement',
        status: 'failed',
        logo: 'https://i.imgur.com/eAwClBc.png'
    };
    addTransaction(failedTx);

    // Show failure UI
    setSuccess(true);
    
    // Exact requested notification message
    const msg = lang === Language.FR 
        ? "Échec de virement. Veuillez contacter votre banquier." 
        : "Transfer failed. Please contact your banker.";
    addNotification(msg);
  };

  const handleReset = () => {
    setSuccess(false);
    setStep(1);
    setData({
      accountId: accounts.length > 0 ? accounts[0].id : '',
      beneficiaryName: '',
      beneficiaryFirstName: '',
      iban: '',
      bankName: '',
      amount: '',
      reason: ''
    });
  };

  const updateData = (key: keyof TransferData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const getSelectedAccount = () => accounts.find(a => a.id === data.accountId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === Language.FR ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {!success && (
        <div className="mb-6 flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-900">
                {step === 1 && t.step1Title}
                {step === 2 && t.step2Title}
                {step === 3 && t.step3Title}
            </h2>
            <span className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                Step {step}/3
            </span>
        </div>
      )}

      {success ? (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white rounded-[2rem] p-8 text-center shadow-sm border border-slate-100">
                <div className="mb-6 mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <XCircle size={48} className="text-red-500" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {lang === Language.FR ? 'Échec du Virement' : 'Transfer Failed'}
                </h2>
                
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-8 font-medium border border-red-100">
                    {lang === Language.FR 
                        ? "Échec de virement. Veuillez contacter votre banquier." 
                        : "Transfer failed. Please contact your banker."}
                </div>

                <div className="space-y-4 mb-8 text-left bg-slate-50 p-4 rounded-2xl">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Bénéficiaire</span>
                        <span className="font-bold">{data.beneficiaryFirstName} {data.beneficiaryName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Montant</span>
                        <span className="font-bold text-red-500 line-through">{formatCurrency(parseFloat(data.amount))}</span>
                    </div>
                </div>
                
                <button 
                    onClick={handleReset}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                    {t.back}
                </button>
            </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col">
            <div className="flex-1">
                {step === 1 && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        {accounts.map(acc => (
                            <div key={acc.id} onClick={() => updateData('accountId', acc.id)} className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${data.accountId === acc.id ? 'border-teal-500 bg-teal-50' : 'border-slate-50 bg-white hover:border-slate-200'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${data.accountId === acc.id ? 'bg-teal-100 text-teal-700' : 'bg-slate-50 text-slate-400'}`}><Wallet size={24} /></div>
                                <div className="flex-1"><p className="font-bold text-sm">{acc.type}</p><p className="text-[10px] text-slate-500 font-mono">{acc.accountNumber}</p></div>
                                <div className="text-right"><p className="font-bold text-sm">{formatCurrency(acc.balance)}</p></div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Nom & Prénom</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Nom" value={data.beneficiaryName} onChange={(e) => updateData('beneficiaryName', e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
                                <input type="text" placeholder="Prénom" value={data.beneficiaryFirstName} onChange={(e) => updateData('beneficiaryFirstName', e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" />
                            </div>
                        </div>
                        <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">IBAN / RIB</label>
                            <input type="text" value={data.iban} onChange={(e) => updateData('iban', e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-mono text-sm" placeholder="FR76 ..." />
                        </div>
                        <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Banque</label>
                            <input type="text" value={data.bankName} onChange={(e) => updateData('bankName', e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Nom de la banque" />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">De</span>
                                <span className="font-bold">{getSelectedAccount()?.type}</span>
                            </div>
                            <div className="flex justify-between items-start text-sm">
                                <span className="text-slate-500">Vers</span>
                                <div className="text-right">
                                    <p className="font-bold">{data.beneficiaryFirstName} {data.beneficiaryName}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{data.iban}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">{t.amount}</label>
                                <div className="relative">
                                    <input type="number" value={data.amount} onChange={(e) => updateData('amount', e.target.value)} className="w-full p-6 bg-slate-50 border-none rounded-2xl text-3xl font-bold focus:ring-2 focus:ring-teal-500 outline-none" placeholder="0" />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">XOF</span>
                                </div>
                            </div>
                            <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase ml-1">Motif</label>
                                <input type="text" value={data.reason} onChange={(e) => updateData('reason', e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Ex: Cadeau, Loyer..." />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-8 flex gap-4">
                {step > 1 && (
                    <button onClick={handleBack} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        <ChevronLeft size={20} />
                    </button>
                )}
                {step < 3 ? (
                    <button 
                        onClick={handleNext} 
                        disabled={step === 2 && (!data.beneficiaryName || !data.iban)}
                        className="flex-[3] py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {t.next}<ChevronRight size={20} />
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmit} 
                        disabled={!data.amount || parseFloat(data.amount) <= 0}
                        className="flex-[3] py-4 bg-teal-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg disabled:opacity-50"
                    >
                        {t.confirmTransfer}<Send size={20} />
                    </button>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;