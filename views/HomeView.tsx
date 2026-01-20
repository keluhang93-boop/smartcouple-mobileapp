
import React from 'react';
import { UserSettings, Expense, CalendarEvent, ViewType } from '../types';
import { ArrowRight, Wallet, Calendar, Heart, TrendingUp, Sparkles, Trophy, Clock, X, Gift } from 'lucide-react';

interface HomeViewProps {
  settings: UserSettings;
  expenses: Expense[];
  events: CalendarEvent[];
  onNavigate: (view: ViewType) => void;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

const HomeView: React.FC<HomeViewProps> = ({ settings, expenses, events, onNavigate, setSettings }) => {
  const totalJean = expenses.reduce((sum, e) => sum + e.jean, 0);
  const totalMonique = expenses.reduce((sum, e) => sum + e.monique, 0);

  const now = new Date();
  
  // Calculate days until Sunday (end of week)
  const today = new Date();
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + (7 - today.getDay()) % 7);
  if (today.getDay() === 0) nextSunday.setDate(today.getDate() + 7);
  const diffTime = Math.abs(nextSunday.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
    const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
    return dateA.getTime() - dateB.getTime();
  });

  const nextEvent = sortedEvents.find(e => {
    const eventDate = new Date(`${e.date}T${e.time || '00:00'}`);
    return eventDate >= now;
  });

  const totalPoints = settings.p1Points + settings.p2Points;
  const p1Ratio = totalPoints > 0 ? (settings.p1Points / totalPoints) * 100 : 50;

  const dismissNotification = (id: string) => {
    setSettings(prev => ({
      ...prev,
      achievedRewards: prev.achievedRewards.filter(r => r.id !== id)
    }));
  };

  return (
    <div className="p-5 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <section className="mb-2 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-serif text-[var(--primary-color)]">
            Bonjour, <span className="gold-shine font-bold">{settings.p1Name}</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Tableau de bord SMART</p>
        </div>
        {settings.profileImage && (
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
            <img src={settings.profileImage} className="w-full h-full object-cover" alt="User" />
          </div>
        )}
      </section>

      {/* Notifications for Achieved Rewards - Only show if module enabled */}
      {settings.enableSmartPartage && settings.achievedRewards.length > 0 && (
        <div className="space-y-3">
          {settings.achievedRewards.slice(0, 2).map((achievement) => (
            <div key={achievement.id} className="bg-gradient-to-r from-[var(--secondary-color)] to-yellow-500 p-4 rounded-2xl shadow-lg animate-in zoom-in duration-300 relative">
              <button 
                onClick={() => dismissNotification(achievement.id)}
                className="absolute top-2 right-2 p-1 bg-black/10 rounded-full text-white"
              >
                <X size={12} />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Gift size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Récompense obtenue !</p>
                  <p className="text-sm font-bold text-white">
                    {achievement.winnerName} a gagné : {achievement.rewardTitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Love Points Fancy Summary - Only show if module enabled */}
      {settings.enableSmartPartage && (
        <section 
          onClick={() => onNavigate('share')}
          className="bg-white p-7 rounded-[2.5rem] shadow-xl border border-gray-50 active:scale-95 transition-all overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[var(--secondary-color)]/10 rounded-lg">
                  <Sparkles className="text-[var(--secondary-color)]" size={16} />
                </div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Love Score Hebdo</h3>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg">
                <Clock size={10} className="text-gray-400" />
                <span className="text-[8px] font-bold text-gray-500 uppercase">{diffDays}j restants</span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4 mb-4">
              <div className="text-center">
                <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">{settings.p1Name}</p>
                <p className="text-3xl font-serif font-bold text-[var(--primary-color)]">{settings.p1Points}</p>
              </div>
              <div className="flex-1 px-4 pb-2">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[var(--primary-color)] transition-all duration-1000" style={{ width: `${p1Ratio}%` }}></div>
                  <div className="h-full bg-[var(--secondary-color)] transition-all duration-1000" style={{ width: `${100 - p1Ratio}%` }}></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">{settings.p2Name}</p>
                <p className="text-3xl font-serif font-bold text-[var(--secondary-color)]">{settings.p2Points}</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                  <Trophy size={10} className="text-yellow-500" />
                  {settings.p1Points > settings.p2Points ? settings.p1Name : settings.p2Name} est en tête !
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => onNavigate('spending')}
          className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 active:scale-95 transition-transform flex flex-col justify-between h-40"
        >
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-[var(--primary-color)]/5 rounded-xl text-[var(--primary-color)]">
              <Wallet size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Smart Dépenses</p>
            <p className="text-xl font-bold text-slate-800">{(totalJean + totalMonique).toFixed(0)} €</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('planning')}
          className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 active:scale-95 transition-transform flex flex-col justify-between h-40"
        >
          <div className="p-2.5 bg-[var(--secondary-color)]/10 w-fit rounded-xl text-[var(--secondary-color)]">
            <Calendar size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Smart Planning</p>
            {nextEvent ? (
              <p className="text-sm font-bold text-slate-800 truncate">
                {nextEvent.title} <span className="text-[10px] font-normal text-gray-400 block">{new Date(nextEvent.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
              </p>
            ) : (
              <p className="text-xs text-gray-300 italic">Libre</p>
            )}
          </div>
        </div>
      </div>

      <div 
        onClick={() => onNavigate('union')}
        className="bg-[var(--primary-color)] p-7 rounded-[3rem] shadow-xl relative overflow-hidden active:scale-95 transition-transform border-b-4 border-black/20"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-white/10 rounded-xl">
               <Heart className="text-[var(--secondary-color)]" size={20} />
             </div>
             <h2 className="text-white text-lg font-serif">Smart Union</h2>
          </div>
          <p className="text-white/80 text-sm leading-relaxed italic pr-4">
            "Le bonheur d'un couple commence par la qualité de sa communication."
          </p>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <section className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Répartition Actuelle</h3>
          <ArrowRight size={14} className="text-gray-300" />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-50">
             <span className="text-sm font-medium text-slate-600">Contribution {settings.p1Name}</span>
             <span className="text-sm font-bold text-[var(--primary-color)]">{totalJean.toFixed(0)} €</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-sm font-medium text-slate-600">Contribution {settings.p2Name}</span>
             <span className="text-sm font-bold text-[var(--secondary-color)]">{totalMonique.toFixed(0)} €</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
