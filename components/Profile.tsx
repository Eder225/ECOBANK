import React, { useRef } from 'react';
import { User as UserType, Account, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Mail, Phone, MapPin, Copy, Camera } from 'lucide-react';

interface ProfileProps {
  user: UserType;
  accounts: Account[];
  lang: Language;
  onUpdateAvatar: (url: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, accounts, lang, onUpdateAvatar }) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-6">
        <div className="h-32 bg-gradient-to-r from-teal-600 to-slate-800"></div>
        <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-slate-200" 
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24} />
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>
                <button 
                  onClick={triggerFileInput}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  {lang === Language.FR ? 'Modifier Photo' : 'Edit Photo'}
                </button>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-slate-500">Premium Customer since 2024</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-lg">Personal Information</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-600">
                    <Mail size={20} className="text-teal-600" />
                    <span className="flex-1">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                    <Phone size={20} className="text-teal-600" />
                    <span className="flex-1">+33 6 12 34 56 78</span>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                    <MapPin size={20} className="text-teal-600" />
                    <span className="flex-1">Paris, France</span>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-lg">Account Details</h3>
            <div className="space-y-4">
                {accounts.map(acc => (
                    <div key={acc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">{acc.type}</p>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-slate-700">{acc.accountNumber}</span>
                            <button className="text-teal-600 hover:text-teal-700">
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;