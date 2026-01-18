import React, { useState, useEffect } from 'react';
import { Send, ChevronRight, ChevronLeft, Building, User, CreditCard, FileText, Wallet, Check, X, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
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
  const [timestamp] = useState(new Date());
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

  useEffect(() => {
    if (data.bankName) {
        const isInternal = data.bankName.toLowerCase().includes('ecobank');
        setFees(isInternal ? 0 : 500);
    }
  }, [data.bankName]);

  const handleNext = () => {
    setError(null);
    if (step === 3) {
        const amount = parseFloat(data.amount);
        const limit = 2000000;
        if (amount > limit) {
            setError(lang === Language.FR 
                ? `Le montant dépasse la limite journalière de ${formatCurrency(limit)}.` 
                : `Amount exceeds daily limit of ${formatCurrency(limit)}.`);
            return;
        }
        const selectedAccount = getSelectedAccount();
        if (selectedAccount && amount + fees > selectedAccount.balance) {
             setError(lang === Language.FR 
                ? "Solde insuffisant pour couvrir le virement et les frais." 
                : "Insufficient balance to cover transfer and fees.");
            return;
        }
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
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

    // Set failure state (UI uses 'success' boolean but we will render failure content)
    setSuccess(true);
    
    // Exact requested notification message
    addNotification(lang === Language.FR 
        ? "Échec de virement. Veuillez contacter votre banquier." 
        : "Transfer failed. Please contact your banker.");
  };

  const handleReset = () => {
    setSuccess(false);
    setStep(1);
    setFees(0);
    setError(null);
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
    if (error) setError(null);
  };

  const getSelectedAccount = () => accounts.find(a => a.id === data.accountId);

  const canProceed = () => {
    if (step === 1) return !!data.accountId;
    if (step === 2) return data.beneficiaryName && data.beneficiaryFirstName && data.iban && data.bankName;
    if (step === 3) return data.amount && parseFloat(data.amount) > 0 && data.reason;
    return false;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang === Language.FR ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
      return date.toLocaleDateString(lang === Language.FR ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {!success && (
        <div className="mb-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {step === 1 && t.step1Title}
                {step === 2 && t.step2Title}
                {step === 3 && t.step3Title}
            </h2>
        </div>
      )}

      {success ? (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 ring-1 ring-slate-900/5 relative">
                <div className="p-8 md:p-12 flex flex-col items-center text-center">
                    <div className="mb-8 relative">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                            <XCircle size={64} className="text-red-500" strokeWidth={1.5} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                            <AlertTriangle size={24} className="text-amber-500" />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        {lang === Language.FR ? 'Virement Échoué' : 'Transfer Failed'}
                    </h2>
                    
                    <div className="bg-red-50 text-red-700 px-6 py-4 rounded-2xl mb-8 font-medium border border-red-100 max-w-md">
                        {lang === Language.FR 
                            ? "Échec de virement. Veuillez contacter votre banquier." 
                            : "Transfer failed. Please contact your banker."}
                    </div>

                    <div className="w-full space-y-4 mb-8">
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-500">{t.recipient}</span>
                            <span className="font-bold text-slate-900">{data.beneficiaryFirstName} {data.beneficiaryName}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-100">
                            <span className="text-slate-500">{t.amount}</span>
                            <span className="font-bold text-red-600 line-through">{formatCurrency(parseFloat(data.amount))}</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleReset}
                        className="w-full max-w-xs bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
                    >
                        {t.back}
                    </button>
                </div>
            </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-5 md:p-8 border border-slate-100 shadow-sm min-h-[400px] flex flex-col max-w-2xl mx-auto">
            {/* Steps indicator ... */}
            <div className="flex items-center justify-center mb-8 w-full">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? 'bg-teal-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>{s}</div>
                        {s < 3 && <div className={`w-16 h-1 bg-slate-100 mx-2 rounded-full overflow-hidden`}><div className={`h-full bg-teal-600 transition-all duration-500 ${step > s ? 'w-full' : 'w-0'}`}></div></div>}
                    </div>
                ))}
            </div>

            <div className="flex-1">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        {accounts.map(acc => (
                            <div key={acc.id} onClick={() => updateData('accountId', acc.id)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${data.accountId === acc.id ? 'border-teal-500 bg-teal-50' : 'border-slate-100 bg-white'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${data.accountId === acc.id ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}><Wallet size={24} /></div>
                                <div className="flex-1"><p className="font-bold">{acc.type}</p><p className="text-sm text-slate-500">{acc.accountNumber}</p></div>
                                <div className="text-right"><p className="font-bold">{formatCurrency(acc.balance)}</p></div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><label className="text-sm font-medium">{t.beneficiaryName}</label><input type="text" value={data.beneficiaryName} onChange={(e) => updateData('beneficiaryName', e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl" /></div>
                            <div className="space-y-2"><label className="text-sm font-medium">{t.beneficiaryFirstName}</label><input type="text" value={data.beneficiaryFirstName} onChange={(e) => updateData('beneficiaryFirstName', e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl" /></div>
                        </div>
                        <div className="space-y-2"><label className="text-sm font-medium">{t.iban}</label><input type="text" value={data.iban} onChange={(e) => updateData('iban', e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl font-mono" /></div>
                        <div className="space-y-2"><label className="text-sm font-medium">{t.bankName}</label><input type="text" value={data.bankName} onChange={(e) => updateData('bankName', e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl" /></div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between border-b pb-3"><span>{t.from}</span><span className="font-semibold">{getSelectedAccount()?.type}</span></div>
                            <div className="flex justify-between"><span>{t.to}</span><span className="font-semibold text-right">{data.beneficiaryFirstName} {data.beneficiaryName}<br/><span className="text-xs text-slate-500 font-mono">{data.iban}</span></span></div>
                        </div>
                        {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle size={18} />{error}</div>}
                        <div className="space-y-4">
                            <div className="space-y-2"><label className="text-sm font-medium">{t.amount}</label><input type="number" value={data.amount} onChange={(e) => updateData('amount', e.target.value)} className="w-full p-4 border rounded-xl text-2xl font-bold" placeholder="0" /></div>
                            <div className="space-y-2"><label className="text-sm font-medium">{t.transferReason}</label><textarea value={data.reason} onChange={(e) => updateData('reason', e.target.value)} className="w-full p-3 border rounded-xl h-24" placeholder="..." /></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-6 mt-4 border-t flex gap-4">
                {step > 1 && <button onClick={handleBack} className="flex-1 py-3 border rounded-xl font-semibold hover:bg-slate-50 flex items-center justify-center gap-2"><ChevronLeft size={20} />{t.back}</button>}
                {step < 3 ? (
                    <button onClick={handleNext} disabled={!canProceed()} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">{t.next}<ChevronRight size={20} /></button>
                ) : (
                    <button onClick={handleSubmit} disabled={!canProceed() || !!error} className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">{t.confirmTransfer}<Send size={20} /></button>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;