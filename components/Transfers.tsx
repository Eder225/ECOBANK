import React, { useState } from 'react';
import { Send, CheckCircle2, ChevronRight, ChevronLeft, Building, User, CreditCard, FileText, Wallet, Check, X } from 'lucide-react';
import { Account, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface TransfersProps {
  accounts: Account[];
  lang: Language;
  addNotification: (message: string) => void;
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

const Transfers: React.FC<TransfersProps> = ({ accounts, lang, addNotification }) => {
  const t = TRANSLATIONS[lang];
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  // Defaulting to a date in 2026 for the transfer summary
  const [timestamp] = useState(new Date('2026-01-12T14:30:00'));
  
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
    setSuccess(true);
    addNotification("Votre virement n'a pas été effectué, veuillez contacter votre banque");
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

  // Helper to validate current step
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

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 w-full">
        {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 ${
                    step >= s ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' : 'bg-slate-100 text-slate-400'
                }`}>
                    {s}
                </div>
                {s < 3 && (
                    <div className={`w-8 md:w-16 h-1 bg-slate-100 mx-1 md:mx-2 rounded-full overflow-hidden`}>
                        <div className={`h-full bg-teal-600 transition-all duration-500 ${step > s ? 'w-full' : 'w-0'}`}></div>
                    </div>
                )}
            </div>
        ))}
    </div>
  );

  const formatDate = (date: Date) => {
      return date.toLocaleDateString(lang === Language.FR ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title (Only show when not success) */}
      {!success && (
        <div className="mb-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {step === 1 && t.step1Title}
                {step === 2 && t.step2Title}
                {step === 3 && t.step3Title}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm mt-1 px-4">
                {step === 1 && t.selectAccountDesc}
                {step === 2 && t.recipient}
                {step === 3 && t.summary}
            </p>
        </div>
      )}

      {success ? (
        <div className="fixed inset-0 z-50 bg-slate-200/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] md:min-h-[600px] animate-in fade-in zoom-in duration-300 ring-1 ring-slate-900/5 relative max-h-[90vh] md:max-h-none">
                
                {/* Close Button Mobile - Absolute top right */}
                <button onClick={handleReset} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full md:hidden z-20 text-slate-500 hover:bg-slate-200 transition-colors">
                    <X size={20} />
                </button>

                {/* Left Panel: Success Message */}
                <div className="flex-1 p-6 md:p-16 flex flex-col items-center justify-center text-center bg-white relative overflow-y-auto">
                    <div className="mb-6 md:mb-10 relative mt-4 md:mt-0">
                        <div className="w-20 h-20 md:w-28 md:h-28 bg-teal-50 rounded-full flex items-center justify-center relative z-10">
                            <div className="w-14 h-14 md:w-20 md:h-20 bg-teal-600 rounded-full flex items-center justify-center shadow-xl shadow-teal-200">
                                <Check size={32} className="md:w-12 md:h-12 text-white" strokeWidth={3} />
                            </div>
                        </div>
                        {/* Decorative glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-teal-400/20 blur-3xl rounded-full -z-0"></div>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-4">{t.transferSuccess}</h2>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-sm mb-8 md:mb-12">
                        {t.transferSentDesc}
                    </p>
                    
                    <div className="w-full max-w-xs space-y-3 md:space-y-4 mt-auto">
                        <button 
                            onClick={handleReset}
                            className="w-full bg-teal-700 text-white font-bold py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-100 transform hover:scale-[1.02]"
                        >
                            {t.gotIt}
                        </button>
                        <button 
                            onClick={handleReset}
                            className="w-full bg-slate-50 text-slate-600 font-bold py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-slate-100 transition-colors"
                        >
                            {t.makeAnother}
                        </button>
                    </div>
                </div>

                {/* Right Panel: Summary */}
                <div className="w-full md:w-[450px] bg-slate-50 p-6 md:p-12 flex flex-col border-l border-slate-100 overflow-y-auto hidden md:flex">
                    <div className="flex justify-between items-start mb-10">
                        <h3 className="text-xl font-bold text-slate-900">{t.transferSummary}</h3>
                        <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-2 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-8 flex-1">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.recipient}</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">{data.beneficiaryFirstName} {data.beneficiaryName}</p>
                                    <p className="text-sm text-slate-500">{data.bankName}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.transferReason}</p>
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <p className="text-slate-700 font-medium">{data.reason}</p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-200 border-dashed">
                                <span className="text-slate-500 font-medium">{t.dateLabel}</span>
                                <span className="font-bold text-slate-900">{formatDate(timestamp)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-200 border-dashed">
                                <span className="text-slate-500 font-medium">{t.accountLabel}</span>
                                <span className="font-bold text-slate-900 truncate max-w-[150px]">{getSelectedAccount()?.type}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-200 border-dashed">
                                <span className="text-slate-500 font-medium">{t.iban}</span>
                                <span className="font-mono text-slate-900 text-sm bg-slate-200/50 px-2 py-1 rounded">{data.iban}</span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Totals */}
                    <div className="mt-10 pt-8 border-t border-slate-200 space-y-4">
                        <div className="flex justify-between items-center text-slate-600">
                            <span className="font-medium">{t.amount}</span>
                            <span className="font-bold">{formatCurrency(parseFloat(data.amount))}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span className="font-medium">{t.fees}</span>
                            <span className="font-bold">{formatCurrency(0)}</span>
                        </div>
                        
                        <div className="pt-4 flex justify-between items-center">
                            <span className="text-lg font-bold text-teal-700">{t.totalDebited}</span>
                            <span className="text-3xl font-bold text-teal-700 tracking-tight">{formatCurrency(parseFloat(data.amount))}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-5 md:p-8 border border-slate-100 shadow-sm min-h-[400px] flex flex-col max-w-2xl mx-auto">
            
            {renderStepIndicator()}

            <div className="flex-1">
                {/* STEP 1: Select Account */}
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {accounts.map(acc => (
                            <div 
                                key={acc.id}
                                onClick={() => updateData('accountId', acc.id)}
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                                    data.accountId === acc.id 
                                    ? 'border-teal-500 bg-teal-50' 
                                    : 'border-slate-100 hover:border-slate-200 bg-white'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                    data.accountId === acc.id ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    <Wallet size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 truncate">{acc.type}</p>
                                    <p className="text-sm text-slate-500 font-mono truncate">{acc.accountNumber}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-slate-900">{formatCurrency(acc.balance)}</p>
                                    <p className="text-xs text-slate-400">{acc.currency}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                    data.accountId === acc.id ? 'border-teal-500 bg-teal-500' : 'border-slate-300'
                                }`}>
                                    {data.accountId === acc.id && <CheckCircle2 size={16} className="text-white" />}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* STEP 2: Beneficiary Details */}
                {step === 2 && (
                    <div className="space-y-4 md:space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">{t.beneficiaryName}</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={data.beneficiaryName}
                                        onChange={(e) => updateData('beneficiaryName', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">{t.beneficiaryFirstName}</label>
                                <input
                                    type="text"
                                    value={data.beneficiaryFirstName}
                                    onChange={(e) => updateData('beneficiaryFirstName', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                    placeholder="John"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">{t.iban}</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={data.iban}
                                    onChange={(e) => updateData('iban', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-mono uppercase"
                                    placeholder="FR76 ...."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">{t.bankName}</label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={data.bankName}
                                    onChange={(e) => updateData('bankName', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                    placeholder="Ecobank Paris"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Summary & Amount */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Summary Card */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                            <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-3">
                                <span className="text-slate-500">{t.from}</span>
                                <span className="font-semibold text-slate-900">{getSelectedAccount()?.type}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">{t.to}</span>
                                <div className="text-right">
                                    <p className="font-semibold text-slate-900">{data.beneficiaryFirstName} {data.beneficiaryName}</p>
                                    <p className="text-xs text-slate-500 font-mono">{data.iban}</p>
                                    <p className="text-xs text-slate-500">{data.bankName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">{t.amount}</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-bold text-lg">F</span>
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) => updateData('amount', e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-2xl font-bold text-slate-900"
                                        placeholder="0"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">{t.transferReason}</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                                    <textarea
                                        value={data.reason}
                                        onChange={(e) => updateData('reason', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none h-24"
                                        placeholder="Rent payment..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="pt-6 md:pt-8 mt-4 border-t border-slate-50 flex gap-3 md:gap-4">
                {step > 1 && (
                    <button 
                        onClick={handleBack}
                        className="flex-1 py-3 px-4 md:px-6 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                        <ChevronLeft size={20} />
                        {t.back}
                    </button>
                )}
                
                {step < 3 ? (
                    <button 
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="flex-1 py-3 px-4 md:px-6 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                        {t.next}
                        <ChevronRight size={20} />
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmit}
                        disabled={!canProceed()}
                        className="flex-1 py-3 px-4 md:px-6 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                        {t.confirmTransfer}
                        <Send size={20} />
                    </button>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;