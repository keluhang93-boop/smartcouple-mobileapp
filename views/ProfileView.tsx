
import React, { useState, useRef } from 'react';
import { UserSettings } from '../types';
import { Paintbrush, Wallet, TrendingUp, Tag, Plus, Trash2, ShoppingCart, Camera, Handshake, ChevronRight, Mail, Bell, CreditCard, User, LogOut, X, Palette, Check, Calendar, Mail as MailIcon } from 'lucide-react';
import { PRESET_COLORS, THEME_COLORS } from '../constants';

interface ProfileViewProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ settings, setSettings }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newInput, setNewInput] = useState('');

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAddCategory = () => {
    const val = newInput.trim();
    if (!val) return;
    if (!settings.eventCategories.includes(val)) {
      setSettings(prev => ({
        ...prev,
        eventCategories: [...prev.eventCategories, val]
      }));
      setNewInput('');
    }
  };

  const handleAddGroceryList = () => {
    const val = newInput.trim();
    if (!val) return;
    if (!settings.groceryLists.includes(val)) {
      setSettings(prev => ({
        ...prev,
        groceryLists: [...prev.groceryLists, val]
      }));
      setNewInput('');
    }
  };

  const updateCategoryColor = (cat: string, color: string) => {
    setSettings(prev => ({
      ...prev,
      categoryColors: { ...prev.categoryColors, [cat]: color }
    }));
  };

  const SettingRow = ({ icon: Icon, label, value, onClick, color = "bg-gray-100", textColor = "text-gray-600" }: any) => (
    <div 
      onClick={onClick}
      className="flex items-center justify-between py-3.5 px-4 bg-white active:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color} ${textColor}`}>
          <Icon size={18} />
        </div>
        <span className="text-[15px] font-medium text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value !== undefined && <span className="text-[14px] text-gray-400 max-w-[120px] truncate text-right">{value}</span>}
        <ChevronRight size={14} className="text-gray-300" />
      </div>
    </div>
  );

  const ToggleRow = ({ icon: Icon, label, value, onToggle, color = "bg-gray-100", textColor = "text-gray-600" }: any) => (
    <div className="flex items-center justify-between py-3 px-4 bg-white border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color} ${textColor}`}>
          <Icon size={18} />
        </div>
        <span className="text-[15px] font-medium text-slate-700">{label}</span>
      </div>
      <button 
        onClick={onToggle}
        className={`w-11 h-6 rounded-full relative transition-colors ${value ? 'bg-green-500' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-6' : 'left-1'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="flex-1 bg-[#F2F2F7] animate-in slide-in-from-right duration-500 pb-20">
      <header className="bg-white px-6 pt-12 pb-8 flex flex-col items-center border-b border-gray-200">
        <div className="relative group mb-4" onClick={() => fileInputRef.current?.click()}>
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-sm border-[3px] border-[var(--secondary-color)]/20 flex items-center justify-center bg-gray-50">
            {settings.profileImage ? (
              <img src={settings.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-gray-300" />
            )}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
             const file = e.target.files?.[0];
             if (file) {
               const reader = new FileReader();
               reader.onloadend = () => updateSetting('profileImage', reader.result as string);
               reader.readAsDataURL(file);
             }
          }} />
        </div>
        <h1 className="text-xl font-bold text-slate-900">{settings.p1Name} & {settings.p2Name}</h1>
      </header>

      <div className="p-4 space-y-8">
        <section className="space-y-1.5">
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-4 mb-1">Compte & Identité</h2>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <SettingRow icon={User} label="Nom Partenaire 1" value={settings.p1Name} onClick={() => setEditingField('p1Name')} color="bg-blue-500" textColor="text-white" />
            <SettingRow icon={User} label="Nom Partenaire 2" value={settings.p2Name} onClick={() => setEditingField('p2Name')} color="bg-indigo-500" textColor="text-white" />
            <SettingRow icon={MailIcon} label="Email" value={settings.email} onClick={() => setEditingField('email')} color="bg-slate-700" textColor="text-white" />
          </div>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-4 mb-1">Budget & Revenus</h2>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <SettingRow icon={TrendingUp} label={`Revenu ${settings.p1Name}`} value={`${settings.p1Income}${settings.currency}`} onClick={() => setEditingField('p1Income')} color="bg-green-600" textColor="text-white" />
            <SettingRow icon={TrendingUp} label={`Revenu ${settings.p2Name}`} value={`${settings.p2Income}${settings.currency}`} onClick={() => setEditingField('p2Income')} color="bg-green-500" textColor="text-white" />
            <SettingRow icon={Wallet} label="Budget Cible Foyer" value={`${settings.targetBudget}${settings.currency}`} onClick={() => setEditingField('targetBudget')} color="bg-indigo-400" textColor="text-white" />
            <SettingRow icon={CreditCard} label="Devise" value={settings.currency} onClick={() => setEditingField('currency')} color="bg-purple-500" textColor="text-white" />
          </div>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-4 mb-1">Affichage & Planning</h2>
          <div className="rounded-xl overflow-hidden shadow-sm">
             <div className="flex items-center justify-between py-3.5 px-4 bg-white border-b border-gray-100 last:border-0">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-orange-500 text-white">
                   <Calendar size={18} />
                 </div>
                 <span className="text-[15px] font-medium text-slate-700">Mode d'affichage</span>
               </div>
               <div className="flex bg-gray-100 p-1 rounded-lg">
                 <button 
                  onClick={() => updateSetting('planningDisplayMode', 'daily')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${settings.planningDisplayMode === 'daily' ? 'bg-white shadow-sm text-slate-800' : 'text-gray-400'}`}
                 >
                   Jour
                 </button>
                 <button 
                  onClick={() => updateSetting('planningDisplayMode', 'monthly_list')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${settings.planningDisplayMode === 'monthly_list' ? 'bg-white shadow-sm text-slate-800' : 'text-gray-400'}`}
                 >
                   Mois
                 </button>
               </div>
             </div>
          </div>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-4 mb-1">Personnalisation</h2>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <SettingRow icon={Paintbrush} label="Thème Visuel" value={settings.theme} onClick={() => setEditingField('theme')} color="bg-pink-500" textColor="text-white" />
            <SettingRow icon={Tag} label="Couleurs Planning" value={`${settings.eventCategories.length} catégories`} onClick={() => { setEditingField('eventCategories'); setNewInput(''); }} color="bg-yellow-500" textColor="text-white" />
            <SettingRow icon={ShoppingCart} label="Gestion des Listes" value={`${settings.groceryLists.length} listes`} onClick={() => { setEditingField('groceryLists'); setNewInput(''); }} color="bg-teal-500" textColor="text-white" />
          </div>
        </section>

        <section className="space-y-1.5">
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-4 mb-1">Fonctionnalités</h2>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <ToggleRow icon={Handshake} label="Module de Dettes" value={settings.enableDebts} onToggle={() => updateSetting('enableDebts', !settings.enableDebts)} color="bg-slate-800" textColor="text-white" />
            <ToggleRow icon={Bell} label="Notif. Partenaire" value={settings.notifyPartnerExpense} onToggle={() => updateSetting('notifyPartnerExpense', !settings.notifyPartnerExpense)} color="bg-red-500" textColor="text-white" />
          </div>
        </section>
      </div>

      {editingField && (
        <div className="fixed inset-0 z-[3000] bg-black/60 backdrop-blur-sm flex items-end">
           <div className="bg-white w-full rounded-t-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
              <header className="flex justify-between items-center mb-6">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Modifier : {editingField}</h3>
                 <button onClick={() => { setEditingField(null); setEditingCategory(null); setNewInput(''); }} className="p-2 bg-gray-50 rounded-full"><X size={16}/></button>
              </header>

              {editingField === 'theme' && (
                <div className="grid grid-cols-1 gap-3 mb-4">
                   {Object.keys(THEME_COLORS).map((t: any) => (
                     <button 
                        key={t}
                        onClick={() => { updateSetting('theme', t); setEditingField(null); }}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${settings.theme === t ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5' : 'border-gray-100'}`}
                     >
                        <span className="font-bold capitalize">{t}</span>
                        <div className="flex gap-2">
                           <div className="w-6 h-6 rounded-full" style={{ backgroundColor: (THEME_COLORS as any)[t].primary }}></div>
                        </div>
                     </button>
                   ))}
                </div>
              )}

              {editingField === 'eventCategories' && (
                <div className="space-y-4 mb-4">
                   <div className="max-h-64 overflow-y-auto space-y-3 no-scrollbar pr-1">
                      {settings.eventCategories.map(cat => (
                        <div key={cat} className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                           <div className="flex justify-between items-center">
                              <span className="font-bold text-sm text-slate-700">{cat}</span>
                              <div className="flex gap-2">
                                <button onClick={() => setEditingCategory(editingCategory === cat ? null : cat)} className="text-gray-400 p-1"><Palette size={16}/></button>
                                <button onClick={() => setSettings(prev => ({ ...prev, eventCategories: prev.eventCategories.filter(c => c !== cat) }))} className="text-red-300 p-1"><Trash2 size={16}/></button>
                              </div>
                           </div>
                           {editingCategory === cat && (
                             <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                                {PRESET_COLORS.map(color => (
                                  <button 
                                    key={color} 
                                    onClick={() => updateCategoryColor(cat, color)}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center ${settings.categoryColors[cat] === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                                    style={{ backgroundColor: color }}
                                  >
                                    {settings.categoryColors[cat] === color && <Check size={12} className="text-white" />}
                                  </button>
                                ))}
                             </div>
                           )}
                        </div>
                      ))}
                   </div>
                   <div className="flex gap-2">
                      <input 
                        className="flex-1 bg-gray-100 p-4 rounded-xl text-sm font-bold outline-none" 
                        placeholder="Ajouter une catégorie..." 
                        value={newInput}
                        onChange={e => setNewInput(e.target.value)}
                        onKeyDown={(e: any) => e.key === 'Enter' && handleAddCategory()} 
                      />
                      <button onClick={handleAddCategory} className="bg-slate-900 text-white p-4 rounded-xl"><Plus size={18}/></button>
                   </div>
                </div>
              )}

              {editingField === 'groceryLists' && (
                <div className="space-y-4 mb-4">
                   <div className="max-h-64 overflow-y-auto space-y-2 no-scrollbar">
                      {settings.groceryLists.map(list => (
                        <div key={list} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                           <span className="font-bold text-sm">{list}</span>
                           {list !== 'Général' && (
                             <button onClick={() => setSettings(prev => ({ ...prev, groceryLists: prev.groceryLists.filter(l => l !== list) }))} className="text-red-300"><Trash2 size={16}/></button>
                           )}
                        </div>
                      ))}
                   </div>
                   <div className="flex gap-2">
                      <input 
                        className="w-full bg-gray-100 p-4 rounded-xl text-sm font-bold outline-none" 
                        placeholder="Nouvelle liste..." 
                        value={newInput}
                        onChange={e => setNewInput(e.target.value)}
                        onKeyDown={(e: any) => e.key === 'Enter' && handleAddGroceryList()} 
                      />
                      <button onClick={handleAddGroceryList} className="bg-slate-900 text-white p-4 rounded-xl"><Plus size={18}/></button>
                   </div>
                </div>
              )}

              {!['theme', 'eventCategories', 'groceryLists'].includes(editingField) && (
                <div className="mb-6">
                   <input 
                      autoFocus
                      type={['p1Income', 'p2Income', 'targetBudget'].includes(editingField) ? 'number' : 'text'}
                      className="w-full bg-gray-50 p-5 rounded-2xl font-bold outline-none border border-gray-100" 
                      value={settings[editingField as keyof UserSettings] as string}
                      onChange={(e) => updateSetting(editingField as keyof UserSettings, e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                   />
                </div>
              )}

              <button onClick={() => { setEditingField(null); setEditingCategory(null); setNewInput(''); }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase text-xs tracking-widest shadow-xl">Terminer</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
