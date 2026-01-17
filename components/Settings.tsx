import React, { useState } from 'react';
import { Bell, Lock, Globe, Shield, ToggleLeft, ToggleRight, User, Key, Save } from 'lucide-react';
import { Language, User as UserType } from '../types';
import { TRANSLATIONS } from '../constants';

interface SettingsProps {
  user: UserType;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, lang, setLang }) => {
  const t = TRANSLATIONS[lang];
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`transition-colors ${active ? 'text-teal-600' : 'text-slate-300'}`}>
        {active ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">{t.settings}</h2>

      {/* Account Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-6">
        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-50" />
        <div>
            <h3 className="font-bold text-lg text-slate-900">{user.name}</h3>
            <p className="text-slate-500 text-sm">{user.email}</p>
            <button className="text-teal-600 text-sm font-semibold mt-2 hover:underline">Edit Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* General Preferences */}
        <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Globe size={20} className="text-slate-400" />
                {t.generalSettings}
            </h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-slate-800">Language</p>
                        <p className="text-xs text-slate-500">App display language</p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setLang(Language.EN)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${lang === Language.EN ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            English
                        </button>
                        <button 
                            onClick={() => setLang(Language.FR)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${lang === Language.FR ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            Français
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Notifications */}
        <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Bell size={20} className="text-slate-400" />
                {t.notifications}
            </h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-slate-800">{t.emailNotif}</p>
                        <p className="text-xs text-slate-500">Receive weekly summaries</p>
                    </div>
                    <Toggle active={emailNotif} onClick={() => setEmailNotif(!emailNotif)} />
                </div>
                <div className="p-5 flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-slate-800">{t.pushNotif}</p>
                        <p className="text-xs text-slate-500">Transaction alerts</p>
                    </div>
                    <Toggle active={pushNotif} onClick={() => setPushNotif(!pushNotif)} />
                </div>
            </div>
        </div>

        {/* Security */}
        <div className="md:col-span-2 space-y-6">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Shield size={20} className="text-slate-400" />
                {t.securitySettings}
            </h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            <Key size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{t.changePassword}</p>
                            <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                        </div>
                    </div>
                    <button className="text-sm font-semibold text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-white transition-colors">Update</button>
                </div>
                <div className="p-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            <Lock size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{t.enable2FA}</p>
                            <p className="text-xs text-slate-500">Secure your account</p>
                        </div>
                    </div>
                    <Toggle active={twoFactor} onClick={() => setTwoFactor(!twoFactor)} />
                </div>
            </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-teal-200 hover:bg-teal-700 transition-colors">
              <Save size={18} />
              {t.saveChanges}
          </button>
      </div>
    </div>
  );
};

export default Settings;