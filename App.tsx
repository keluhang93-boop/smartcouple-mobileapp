import React, { useState, useEffect } from 'react';
import { ViewType, UserSettings, Expense, CalendarEvent, SavingGoal, GroceryItem, Debt } from './types';
import HomeView from './views/HomeView';
import SpendingView from './views/SpendingView';
import PlanningView from './views/PlanningView';
import UnionView from './views/UnionView';
import SmartShareView from './views/SmartShareView';
import ProfileView from './views/ProfileView';
import BottomNav from './components/BottomNav';
import { THEME_COLORS, DEFAULT_EVENT_CATEGORIES, DEFAULT_CATEGORY_COLORS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('smart_settings');
    if (saved) return JSON.parse(saved);
    
    // Default reset date is the last Monday
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const lastMonday = new Date(d.setDate(diff)).toISOString().split('T')[0];

    return { 
      p1Name: 'Jean', 
      p2Name: 'Monique', 
      theme: 'classic',
      p1Income: 2500,
      p2Income: 2200,
      targetBudget: 1500,
      currency: '€',
      email: 'jean@university.fr',
      partnerLinked: true,
      eventCategories: DEFAULT_EVENT_CATEGORIES,
      categoryColors: DEFAULT_CATEGORY_COLORS,
      groceryLists: ['Général'],
      planningDisplayMode: 'daily',
      p1Points: 45,
      p2Points: 30,
      achievedRewards: [],
      choreHistory: [],
      lastResetDate: lastMonday,
      enableDebts: true,
      enableSmartPartage: false, // Locked by default as requested
      showDebtWarning: true,
      notifyPartnerExpense: true,
      notifyTaskDue: true,
      chores: [
        { id: 'c1', title: 'Sortir les poubelles', points: 10 },
        { id: 'c2', title: 'Faire la vaisselle', points: 15 },
        { id: 'c3', title: 'Nettoyer les toilettes', points: 50 },
        { id: 'c4', title: 'Passer l\'aspirateur', points: 25 },
        { id: 'c5', title: 'Faire les courses', points: 40 },
        { id: 'c6', title: 'Ménage complet', points: 80 }
      ],
      rewards: [
        { id: 'r1', title: 'Choisir le film Netflix', threshold: 50 },
        { id: 'r2', title: 'Choisir le restaurant ce weekend', threshold: 100 },
        { id: 'r3', title: 'Lieu des prochaines vacances', threshold: 1000 }
      ]
    };
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('smart_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 'e1', name: 'Loyer', jean: 400, monique: 400, settled: true, category: 'Foyer' },
      { id: 'e2', name: 'Courses Bio', jean: 85, monique: 0, settled: false, category: 'Alimentation' }
    ];
  });

  const [savings, setSavings] = useState<SavingGoal[]>(() => {
    const saved = localStorage.getItem('smart_savings');
    return saved ? JSON.parse(saved) : [
      { id: 's1', name: 'Voyage Japon', target: 3000, current: 1200 }
    ];
  });

  const [groceries, setGroceries] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('smart_groceries');
    return saved ? JSON.parse(saved) : [
      { id: 'g1', name: 'Lait d\'avoine', price: 2.5, quantity: 2, unit: 'L', bought: false, shared: true, listName: 'Général' }
    ];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('smart_debts');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('smart_events');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('smart_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('smart_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('smart_savings', JSON.stringify(savings)); }, [savings]);
  useEffect(() => { localStorage.setItem('smart_groceries', JSON.stringify(groceries)); }, [groceries]);
  useEffect(() => { localStorage.setItem('smart_debts', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('smart_events', JSON.stringify(events)); }, [events]);

  const themeColors = THEME_COLORS[settings.theme] || THEME_COLORS.classic;

  const renderContent = () => {
    switch (activeView) {
      case 'home': return <HomeView settings={settings} expenses={expenses} events={events} onNavigate={setActiveView} setSettings={setSettings} />;
      case 'spending': return <SpendingView expenses={expenses} setExpenses={setExpenses} savings={savings} setSavings={setSavings} groceries={groceries} setGroceries={setGroceries} debts={debts} setDebts={setDebts} settings={settings} setSettings={setSettings} />;
      case 'planning': return <PlanningView events={events} setEvents={setEvents} settings={settings} />;
      case 'union': return <UnionView settings={settings} />;
      case 'share': return <SmartShareView settings={settings} setSettings={setSettings} />;
      case 'profile': return <ProfileView settings={settings} setSettings={setSettings} />;
      default: return <HomeView settings={settings} expenses={expenses} events={events} onNavigate={setActiveView} setSettings={setSettings} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-gray-50 overflow-x-hidden">
      <style>{`
        :root {
          --primary-color: ${themeColors.primary};
          --secondary-color: ${themeColors.secondary};
        }
      `}</style>
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-center z-[2000] shadow-sm">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-serif font-bold tracking-[0.2em] text-[var(--secondary-color)] uppercase">
            SMART COUPLE
          </span>
          <img src="https://cdnai.iconscout.com/ai-image/premium/thumb/ai-heart-lightbulb-3d-icon-png-download-jpg-13221459.png" alt="Logo" className="w-4 h-4 mt-0.5" />
        </div>
      </header>
      <main className="mt-16 flex-1 flex flex-col w-full max-w-lg mx-auto overflow-y-auto no-scrollbar">
        {renderContent()}
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} settings={settings} />
    </div>
  );
};

export default App;