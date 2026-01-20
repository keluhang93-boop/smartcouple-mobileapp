import React, { useState, useEffect } from 'react';
import { Expense, UserSettings, SpendingSubTab, SavingGoal, GroceryItem, Debt } from '../types';
import { Plus, Trash2, PieChart, Landmark, ShoppingCart, TrendingDown, Handshake, X, Info, Heart, AlertCircle, ChevronRight, Check, Tag, List, Minus, RefreshCw, Maximize } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface SpendingViewProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  savings: SavingGoal[];
  setSavings: React.Dispatch<React.SetStateAction<SavingGoal[]>>;
  groceries: GroceryItem[];
  setGroceries: React.Dispatch<React.SetStateAction<GroceryItem[]>>;
  debts: Debt[];
  setDebts: React.Dispatch<React.SetStateAction<Debt[]>>;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

const SpendingView: React.FC<SpendingViewProps> = ({ 
  expenses, setExpenses, savings, setSavings, groceries, setGroceries, debts, setDebts, settings, setSettings 
}) => {
  const [isReady, setIsReady] = useState(false);

// Reset "ready" state when the tab changes to 'analyse'
useEffect(() => {
  if (activeSubTab === 'analyse') {
    setIsReady(false);
    const timer = setTimeout(() => setIsReady(true), 150); // 150ms delay
    return () => clearTimeout(timer);
  }
}, [activeSubTab]);
  
  const [activeSubTab, setActiveSubTab] = useState<SpendingSubTab>('dépenses');
  const [activeGroceryList, setActiveGroceryList] = useState(settings.groceryLists[0] || 'Général');
  const [isAdding, setIsAdding] = useState(false);
  
  // States for Adding Items
  const [newItemName, setNewItemName] = useState('');
  const [newPrice, setNewPrice] = useState(0);
  const [newQuantity, setNewQuantity] = useState(1);
  const [newUnit, setNewUnit] = useState('u');
  const [expenseCategory, setExpenseCategory] = useState('Foyer');
  const [debtAmount, setDebtAmount] = useState(0);
  const [debtPerson, setDebtPerson] = useState<'p1' | 'p2'>('p1');

  // Saving Modal State
  const [savingModal, setSavingModal] = useState<{ id: string, type: 'plus' | 'minus', value: string } | null>(null);

  const totalJean = expenses.reduce((sum, e) => sum + e.jean, 0);
  const totalMonique = expenses.reduce((sum, e) => sum + e.monique, 0);

  const currentGroceries = groceries.filter(g => g.listName === activeGroceryList);
  const listTotal = currentGroceries.reduce((sum, g) => sum + (g.price * g.quantity), 0);

  const handleAdjustSaving = (id: string, type: 'reset' | 'minus' | 'plus' | 'max') => {
    const s = savings.find(x => x.id === id);
    if (!s) return;

    if (type === 'reset') {
      setSavings(savings.map(x => x.id === id ? { ...x, current: 0 } : x));
    } else if (type === 'max') {
      setSavings(savings.map(x => x.id === id ? { ...x, current: s.target } : x));
    } else {
      // Triggering the custom modal for input
      setSavingModal({ id, type, value: '' });
    }
  };

  const confirmSavingAdjustment = () => {
    if (!savingModal) return;
    const { id, type, value } = savingModal;
    const s = savings.find(x => x.id === id);
    if (!s) return;

    const amount = parseFloat(value || '0');
    if (isNaN(amount) || amount < 0) {
      setSavingModal(null);
      return;
    }

    let newValue = type === 'plus' ? s.current + amount : s.current - amount;
    newValue = Math.max(0, Math.min(s.target, newValue));
    
    setSavings(savings.map(x => x.id === id ? { ...x, current: newValue } : x));
    setSavingModal(null);
  };

  const handleAddItem = () => {
    if (!newItemName && activeSubTab !== 'dettes') return;
    if (activeSubTab === 'dépenses') {
      setExpenses([...expenses, { id: Date.now().toString(), name: newItemName, jean: 0, monique: 0, settled: false, category: expenseCategory }]);
    } else if (activeSubTab === 'économies') {
      setSavings([...savings, { id: Date.now().toString(), name: newItemName, target: 1000, current: 0 }]);
    } else if (activeSubTab === 'courses') {
      setGroceries([...groceries, { 
        id: Date.now().toString(), 
        name: newItemName, 
        price: newPrice, 
        quantity: newQuantity, 
        unit: newUnit, 
        bought: false, 
        shared: true, 
        listName: activeGroceryList 
      }]);
    } else if (activeSubTab === 'dettes' && debtAmount > 0) {
        const from = debtPerson === 'p1' ? settings.p1Name : settings.p2Name;
        const to = debtPerson === 'p1' ? settings.p2Name : settings.p1Name;
        setDebts([...debts, { id: Date.now().toString(), from, to, amount: debtAmount, reason: newItemName || 'Partage' }]);
    }
    resetForm();
    setIsAdding(false);
  };

  const resetForm = () => {
    setNewItemName('');
    setNewPrice(0);
    setNewQuantity(1);
    setNewUnit('u');
    setDebtAmount(0);
  };

  const renderContent = () => {
    switch (activeSubTab) {
      case 'dépenses':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50 overflow-hidden border border-gray-100">
              {expenses.length > 0 ? expenses.map(e => (
                <div key={e.id} className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                       <span className="font-bold text-slate-800">{e.name}</span>
                       <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{e.category}</span>
                    </div>
                    <button onClick={() => setExpenses(expenses.filter(x => x.id !== e.id))} className="text-red-200 p-1"><Trash2 size={14}/></button>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">{settings.p1Name}</label>
                      <input type="number" className="w-full bg-gray-50 p-2 rounded-lg text-sm font-bold text-[var(--primary-color)] outline-none" value={e.jean} onChange={(ev) => setExpenses(expenses.map(x => x.id === e.id ? {...x, jean: parseFloat(ev.target.value) || 0} : x))}/>
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">{settings.p2Name}</label>
                      <input type="number" className="w-full bg-gray-50 p-2 rounded-lg text-sm font-bold text-[var(--secondary-color)] outline-none" value={e.monique} onChange={(ev) => setExpenses(expenses.map(x => x.id === e.id ? {...x, monique: parseFloat(ev.target.value) || 0} : x))}/>
                    </div>
                  </div>
                </div>
              )) : <p className="p-10 text-center text-gray-300 text-xs italic">Aucune dépense</p>}
            </div>
          </div>
        );
      case 'économies':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            {savings.map(s => (
              <div key={s.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800">{s.name}</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Cible: {s.target}{settings.currency}</p>
                  </div>
                  <button onClick={() => setSavings(savings.filter(x => x.id !== s.id))} className="text-red-100"><Trash2 size={16}/></button>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
                   <div className="h-full bg-[var(--secondary-color)] transition-all duration-500" style={{ width: `${Math.min(100, (s.current/s.target)*100)}%` }}></div>
                </div>
                <div className="flex flex-col gap-3">
                   <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-bold text-slate-600">Total : {s.current.toFixed(0)}{settings.currency} / {s.target}{settings.currency}</span>
                      <span className="text-[10px] font-bold text-gray-300">{Math.round((s.current/s.target)*100)}%</span>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => handleAdjustSaving(s.id, 'reset')} className="flex-1 py-3 bg-gray-50 text-gray-400 rounded-xl flex flex-col items-center gap-1">
                        <RefreshCw size={14}/><span className="text-[8px] font-bold uppercase">Reset</span>
                      </button>
                      <button onClick={() => handleAdjustSaving(s.id, 'minus')} className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-xl flex flex-col items-center gap-1">
                        <Minus size={14}/><span className="text-[8px] font-bold uppercase">Moins</span>
                      </button>
                      <button onClick={() => handleAdjustSaving(s.id, 'plus')} className="flex-1 py-3 bg-slate-900 text-white rounded-xl flex flex-col items-center gap-1 shadow-md">
                        <Plus size={14}/><span className="text-[8px] font-bold uppercase">Plus</span>
                      </button>
                      <button onClick={() => handleAdjustSaving(s.id, 'max')} className="flex-1 py-3 bg-slate-100 text-[var(--primary-color)] rounded-xl flex flex-col items-center gap-1">
                        <Maximize size={14}/><span className="text-[8px] font-bold uppercase">Max</span>
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {settings.groceryLists.map(list => (
                <button key={list} onClick={() => setActiveGroceryList(list)} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeGroceryList === list ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'}`}>{list}</button>
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 divide-y divide-gray-50">
              {currentGroceries.length > 0 ? currentGroceries.map(g => (
                <div key={g.id} className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <button onClick={() => setGroceries(groceries.map(x => x.id === g.id ? {...x, bought: !x.bought} : x))} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${g.bought ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 text-transparent'}`}><Check size={12}/></button>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${g.bought ? 'text-gray-300 line-through' : 'text-slate-700'}`}>{g.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{g.quantity} {g.unit} × {g.price}{settings.currency} = <span className="text-[var(--primary-color)]">{(g.quantity * g.price).toFixed(2)}{settings.currency}</span></span>
                      </div>
                   </div>
                   <button onClick={() => setGroceries(groceries.filter(x => x.id !== g.id))} className="text-red-100"><X size={16}/></button>
                </div>
              )) : <p className="p-10 text-center text-gray-300 text-xs italic">Liste vide</p>}
            </div>
            <div className="p-5 bg-slate-900 rounded-2xl text-white flex justify-between items-center">
               <span className="text-xs font-bold uppercase tracking-widest opacity-60">Total {activeGroceryList}</span>
               <span className="text-xl font-serif font-bold text-[var(--secondary-color)]">{listTotal.toFixed(2)} {settings.currency}</span>
            </div>
          </div>
        );
      case 'dettes':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="p-3 bg-[var(--secondary-color)]/10 rounded-full mb-4">
                <Handshake size={24} className="text-[var(--secondary-color)]" />
              </div>
              <h3 className="font-bold text-slate-800">Dettes & Équilibres</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Transparence totale</p>
              
              <div className="w-full mt-6 space-y-3">
                {debts.length > 0 ? debts.map(d => (
                  <div key={d.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <div className="text-left">
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">{d.from} doit à {d.to}</span>
                      <span className="text-sm font-bold text-slate-700">{d.reason}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[var(--primary-color)]">{d.amount} {settings.currency}</span>
                      <button onClick={() => setDebts(debts.filter(x => x.id !== d.id))} className="text-red-200"><X size={14} /></button>
                    </div>
                  </div>
                )) : (
                  <p className="py-6 text-center text-gray-300 text-xs italic">Tout est en équilibre !</p>
                )}
              </div>
            </div>
          </div>
        );
     case 'analyse':
        const pieData = [
          { name: settings.p1Name, value: totalJean, color: 'var(--primary-color)' }, 
          { name: settings.p2Name, value: totalMonique, color: 'var(--secondary-color)' }
        ];
        const barData = [
           { name: 'Foyer', jean: expenses.filter(e => e.category === 'Foyer').reduce((s,x)=>s+x.jean,0), monique: expenses.filter(e => e.category === 'Foyer').reduce((s,x)=>s+x.monique,0) },
           { name: 'Loisirs', jean: expenses.filter(e => e.category === 'Loisirs').reduce((s,x)=>s+x.jean,0), monique: expenses.filter(e => e.category === 'Loisirs').reduce((s,x)=>s+x.monique,0) },
           { name: 'Courses', jean: expenses.filter(e => e.category === 'Courses').reduce((s,x)=>s+x.jean,0), monique: expenses.filter(e => e.category === 'Courses').reduce((s,x)=>s+x.monique,0) },
           { name: 'Transport', jean: expenses.filter(e => e.category === 'Transport').reduce((s,x)=>s+x.jean,0), monique: expenses.filter(e => e.category === 'Transport').reduce((s,x)=>s+x.monique,0) },
        ].filter(d => d.jean > 0 || d.monique > 0);

        return (
          <div className="space-y-6 pb-10">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col justify-center">
               <h3 className="text-center font-bold text-slate-800 mb-4 text-[10px] uppercase tracking-widest text-gray-400">Répartition Globale</h3>
               <div style={{ width: '100%', height: 250 }}>
                 {isReady && (
                   <ResponsiveContainer width="100%" height="100%">
                     <RePieChart>
                       <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                         {pieData.map((e, i) => <Cell key={`cell-${i}`} fill={e.color} />)}
                       </Pie>
                       <Tooltip />
                       <Legend verticalAlign="bottom" />
                     </RePieChart>
                   </ResponsiveContainer>
                 )}
               </div>
             </div>

             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col justify-center">
               <h3 className="text-center font-bold text-slate-800 mb-4 text-[10px] uppercase tracking-widest text-gray-400">Par Catégorie</h3>
               <div style={{ width: '100%', height: 250 }}>
                 {isReady && (
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={barData} margin={{top:5, right:10, left: -20, bottom:5}}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                       <XAxis dataKey="name" tick={{fontSize:10}} axisLine={false} tickLine={false} />
                       <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false} />
                       <Tooltip cursor={{fill: '#f8fafc'}} />
                       <Legend />
                       <Bar dataKey="jean" name={settings.p1Name} fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={20} />
                       <Bar dataKey="monique" name={settings.p2Name} fill="var(--secondary-color)" radius={[4, 4, 0, 0]} barSize={20} />
                     </BarChart>
                   </ResponsiveContainer>
                 )}
               </div>
             </div>
          </div>
        );
        
  const subTabs = [
    { id: 'dépenses', label: 'Dépenses', icon: <Landmark size={14} /> },
    { id: 'économies', label: 'Épargne', icon: <TrendingDown size={14} className="rotate-180" /> },
    { id: 'courses', label: 'Courses', icon: <ShoppingCart size={14} /> },
    { id: 'dettes', label: 'Dettes', icon: <Handshake size={14} /> },
    { id: 'analyse', label: 'Analyse', icon: <PieChart size={14} /> },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-144px)] animate-in slide-in-from-right duration-500">
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-[100] py-4 px-4 border-b border-gray-100 shadow-sm">
        <div className="flex p-1 bg-gray-100 rounded-xl w-full">
          {subTabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveSubTab(tab.id as SpendingSubTab)} 
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-2.5 rounded-lg transition-all ${activeSubTab === tab.id ? 'bg-white text-slate-800 shadow-sm font-bold' : 'text-gray-400'}`}
            >
              {tab.icon}
              <span className="text-[7px] font-bold uppercase tracking-tight mt-1 truncate w-full px-1 text-center">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 py-6 flex-1 pb-32">{renderContent()}</div>
      
      {activeSubTab !== 'analyse' && (
        <button onClick={() => { resetForm(); setIsAdding(true); }} className="fixed bottom-32 right-6 w-14 h-14 bg-slate-900 text-[var(--secondary-color)] rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-[1600]">
          <Plus size={28} />
        </button>
      )}

      {/* Manual Input Modal for Savings - High Z-index ensured */}
      {savingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[5000] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-xs rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-4">
                {savingModal.type === 'plus' ? 'Ajouter à l\'épargne' : 'Retirer de l\'épargne'}
              </h4>
              <input 
                autoFocus
                type="number" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xl font-bold text-center outline-none focus:ring-2 ring-[var(--secondary-color)]/20"
                value={savingModal.value}
                onChange={e => setSavingModal({ ...savingModal, value: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && confirmSavingAdjustment()}
              />
              <div className="flex gap-3 mt-6">
                 <button onClick={() => setSavingModal(null)} className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-xl font-bold text-xs uppercase">Annuler</button>
                 <button onClick={confirmSavingAdjustment} className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase">Valider</button>
              </div>
           </div>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2500] flex items-end">
          <div className="bg-white w-full p-8 rounded-t-[3rem] animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto pb-40">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Ajouter : {activeSubTab}</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-50 rounded-full"><X size={16}/></button>
             </div>
             
             {activeSubTab === 'dépenses' && (
               <div className="mb-4 space-y-2">
                 <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['Foyer', 'Loisirs', 'Courses', 'Transport', 'Autres'].map(cat => (
                      <button key={cat} onClick={() => setExpenseCategory(cat)} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border ${expenseCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>{cat}</button>
                    ))}
                 </div>
               </div>
             )}

             {activeSubTab === 'courses' ? (
                <div className="space-y-4 mb-6">
                   <div>
                      <label className="text-[10px] font-bold text-gray-300 uppercase px-1">Produit</label>
                      <input className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none border border-gray-100" placeholder="Ex: Avocat" value={newItemName} onChange={e => setNewItemName(e.target.value)} />
                   </div>
                   <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-300 uppercase px-1">Prix</label>
                        <input type="number" className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none border border-gray-100" value={newPrice || ''} onChange={e => setNewPrice(parseFloat(e.target.value) || 0)} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-300 uppercase px-1">Unité</label>
                        <input className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none border border-gray-100" placeholder="Ex: kg" value={newUnit} onChange={e => setNewUnit(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-300 uppercase px-1">Qté</label>
                        <input type="number" className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none border border-gray-100" value={newQuantity} onChange={e => setNewQuantity(parseInt(e.target.value) || 1)} />
                      </div>
                   </div>
                </div>
             ) : (
                <div className="space-y-4 mb-6">
                   {activeSubTab === 'dettes' && (
                      <div className="flex gap-2">
                        <button onClick={() => setDebtPerson('p1')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase ${debtPerson === 'p1' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-400'}`}>{settings.p1Name}</button>
                        <button onClick={() => setDebtPerson('p2')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase ${debtPerson === 'p2' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-400'}`}>{settings.p2Name}</button>
                      </div>
                   )}
                   <input autoFocus className="w-full bg-gray-50 p-5 rounded-2xl font-bold outline-none border border-gray-100" placeholder="Intitulé..." value={newItemName} onChange={e => setNewItemName(e.target.value)} />
                   {activeSubTab === 'dettes' && (
                     <input type="number" className="w-full bg-gray-50 p-5 rounded-2xl font-bold outline-none border border-gray-100" placeholder="Montant..." value={debtAmount || ''} onChange={e => setDebtAmount(parseFloat(e.target.value) || 0)} />
                   )}
                </div>
             )}

             <button onClick={handleAddItem} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase text-xs tracking-widest shadow-xl">Confirmer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingView;
