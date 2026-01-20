
import React, { useState, useEffect } from 'react';
import { UserSettings, Chore, Reward, AchievedReward, ChoreHistoryEntry } from '../types';
import { Trophy, CheckCircle2, Circle, Star, Settings as SettingsIcon, Plus, Trash2, Gift, User, Heart, Sparkles, X, RefreshCw, Check, History, Clock } from 'lucide-react';

interface SmartShareViewProps {
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

const SmartShareView: React.FC<SmartShareViewProps> = ({ settings, setSettings }) => {
  const [activeTab, setActiveTab] = useState<'tâches' | 'récompenses' | 'reglages' | 'historique'>('tâches');
  const [currentUser, setCurrentUser] = useState<'p1' | 'p2'>('p1');
  const [newChoreTitle, setNewChoreTitle] = useState('');
  const [newChorePoints, setNewChorePoints] = useState(10);
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardThreshold, setNewRewardThreshold] = useState(50);
  const [animatingPoints, setAnimatingPoints] = useState<{points: number, x: number, y: number} | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const completeChore = (chore: Chore, e: React.MouseEvent) => {
    // Check if user already did THIS chore today
    const alreadyDoneToday = settings.choreHistory.some(
      h => h.choreId === chore.id && h.userName === (currentUser === 'p1' ? settings.p1Name : settings.p2Name) && h.date.startsWith(todayStr)
    );

    if (alreadyDoneToday) return;

    const pointsKey = currentUser === 'p1' ? 'p1Points' : 'p2Points';
    const userName = currentUser === 'p1' ? settings.p1Name : settings.p2Name;

    // Point animation positioning
    setAnimatingPoints({
      points: chore.points,
      x: e.clientX,
      y: e.clientY
    });

    setTimeout(() => setAnimatingPoints(null), 1000);

    const historyEntry: ChoreHistoryEntry = {
      id: Date.now().toString(),
      choreId: chore.id,
      choreTitle: chore.title,
      userName: userName,
      points: chore.points,
      date: new Date().toISOString()
    };

    setSettings(prev => ({
      ...prev,
      [pointsKey]: prev[pointsKey] + chore.points,
      choreHistory: [historyEntry, ...prev.choreHistory]
    }));
  };

  const claimReward = (reward: Reward) => {
    const pointsKey = currentUser === 'p1' ? 'p1Points' : 'p2Points';
    const userName = currentUser === 'p1' ? settings.p1Name : settings.p2Name;

    if (settings[pointsKey] >= reward.threshold) {
      const newAchievement: AchievedReward = {
        id: Date.now().toString(),
        rewardTitle: reward.title,
        winnerName: userName,
        date: new Date().toISOString()
      };

      setSettings(prev => ({
        ...prev,
        [pointsKey]: prev[pointsKey] - reward.threshold,
        achievedRewards: [newAchievement, ...prev.achievedRewards]
      }));
    }
  };

  const addChore = () => {
    if (!newChoreTitle) return;
    const newChore: Chore = { id: Date.now().toString(), title: newChoreTitle, points: newChorePoints };
    setSettings(prev => ({ ...prev, chores: [...prev.chores, newChore] }));
    setNewChoreTitle('');
  };

  const removeChore = (id: string) => {
    setSettings(prev => ({ ...prev, chores: prev.chores.filter(c => c.id !== id) }));
  };

  const addReward = () => {
    if (!newRewardTitle) return;
    const newReward: Reward = { id: Date.now().toString(), title: newRewardTitle, threshold: newRewardThreshold };
    setSettings(prev => ({ ...prev, rewards: [...prev.rewards, newReward] }));
    setNewRewardTitle('');
  };

  const removeReward = (id: string) => {
    setSettings(prev => ({ ...prev, rewards: prev.rewards.filter(r => r.id !== id) }));
  };

  const resetPoints = () => {
    if (confirm("Voulez-vous vraiment remettre les scores à zéro pour une nouvelle semaine ?")) {
      const d = new Date();
      setSettings(prev => ({ 
        ...prev, 
        p1Points: 0, 
        p2Points: 0, 
        lastResetDate: d.toISOString().split('T')[0],
        achievedRewards: [],
        choreHistory: []
      }));
    }
  };

  const isChoreDoneToday = (choreId: string) => {
    const userName = currentUser === 'p1' ? settings.p1Name : settings.p2Name;
    return settings.choreHistory.some(
      h => h.choreId === choreId && h.userName === userName && h.date.startsWith(todayStr)
    );
  };

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right duration-500 pb-24">
      {/* Points Animation Overlay */}
      {animatingPoints && (
        <div 
          className="fixed z-[9999] pointer-events-none text-2xl font-bold text-green-500 animate-out fade-out slide-out-to-top-20 duration-1000"
          style={{ left: animatingPoints.x - 20, top: animatingPoints.y - 40 }}
        >
          +{animatingPoints.points} Love Pts!
        </div>
      )}

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-[var(--primary-color)]">Smart Partage</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Harmonie & Motivation</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab(activeTab === 'historique' ? 'tâches' : 'historique')}
            className={`p-3 rounded-2xl border transition-all shadow-sm active:scale-95 ${activeTab === 'historique' ? 'bg-slate-900 text-white' : 'bg-white text-gray-400 border-gray-100'}`}
          >
            <History size={20} />
          </button>
          <button 
            onClick={() => setActiveTab(activeTab === 'reglages' ? 'tâches' : 'reglages')}
            className={`p-3 rounded-2xl border transition-all shadow-sm active:scale-95 ${activeTab === 'reglages' ? 'bg-slate-900 text-white' : 'bg-white text-gray-400 border-gray-100'}`}
          >
            {activeTab === 'reglages' ? <X size={20} /> : <SettingsIcon size={20} />}
          </button>
        </div>
      </header>

      {/* Fancy Scoreboard */}
      <section className="bg-[var(--primary-color)] p-8 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden border-b-8 border-black/20">
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-[var(--secondary-color)]/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex justify-between items-center gap-2">
          <div 
            onClick={() => setCurrentUser('p1')}
            className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-[2.5rem] transition-all cursor-pointer border-2 ${currentUser === 'p1' ? 'border-[var(--secondary-color)] bg-white/10 shadow-inner' : 'border-transparent opacity-60'}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">{settings.p1Name}</span>
            <span className="text-4xl font-serif font-bold text-[var(--secondary-color)]">{settings.p1Points}</span>
            <div className="w-8 h-1 bg-white/10 rounded-full"></div>
          </div>

          <div className="flex flex-col items-center">
             <Sparkles className="text-[var(--secondary-color)] animate-pulse" size={20} />
             <div className="h-12 w-px bg-white/10 my-2"></div>
             <Trophy className="text-white/20" size={16} />
          </div>

          <div 
            onClick={() => setCurrentUser('p2')}
            className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-[2.5rem] transition-all cursor-pointer border-2 ${currentUser === 'p2' ? 'border-[var(--secondary-color)] bg-white/10 shadow-inner' : 'border-transparent opacity-60'}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">{settings.p2Name}</span>
            <span className="text-4xl font-serif font-bold text-[var(--secondary-color)]">{settings.p2Points}</span>
            <div className="w-8 h-1 bg-white/10 rounded-full"></div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="px-4 py-2 bg-black/20 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 border border-white/5">
            <User size={12} className="text-[var(--secondary-color)]" />
            Compte de : <span className="text-[var(--secondary-color)]">{currentUser === 'p1' ? settings.p1Name : settings.p2Name}</span>
          </div>
        </div>
      </section>

      {/* Tab Switcher Fancy */}
      {(activeTab === 'tâches' || activeTab === 'récompenses') && (
        <div className="flex p-1.5 bg-gray-100 rounded-[2rem] shadow-inner">
          <button 
            onClick={() => setActiveTab('tâches')}
            className={`flex-1 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'tâches' ? 'bg-white text-slate-800 shadow-md scale-[1.02]' : 'text-gray-400'}`}
          >
            Tâches
          </button>
          <button 
            onClick={() => setActiveTab('récompenses')}
            className={`flex-1 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'récompenses' ? 'bg-white text-slate-800 shadow-md scale-[1.02]' : 'text-gray-400'}`}
          >
            Récompenses
          </button>
        </div>
      )}

      {activeTab === 'tâches' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Missions Love</h2>
            <div className="flex items-center gap-1">
               <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">1x / jour par personne</span>
               <Star size={10} className="text-[var(--secondary-color)]" />
            </div>
          </div>
          <div className="grid gap-4">
            {settings.chores.map(chore => {
              const done = isChoreDoneToday(chore.id);
              return (
                <button 
                  key={chore.id}
                  disabled={done}
                  onClick={(e) => completeChore(chore, e)}
                  className={`bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition-all ${done ? 'opacity-50 grayscale bg-gray-50' : 'active:bg-[var(--secondary-color)]/5'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-gray-100 transition-all ${done ? 'bg-green-50 text-green-500 border-green-200' : 'bg-slate-50 text-slate-300 group-hover:bg-green-50 group-hover:text-green-500'}`}>
                      {done ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Missions</span>
                      <span className={`text-base font-bold ${done ? 'text-gray-400' : 'text-slate-700'}`}>{chore.title}</span>
                      {done && <span className="text-[7px] font-bold text-green-500 uppercase block mt-0.5">Fait aujourd'hui</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <div className={`px-4 py-2 rounded-2xl border ${done ? 'bg-gray-100 border-gray-200' : 'bg-[var(--primary-color)]/5 border-[var(--primary-color)]/10'}`}>
                      <span className={`text-xs font-bold ${done ? 'text-gray-300' : 'text-[var(--primary-color)]'}`}>+{chore.points}</span>
                    </div>
                    <span className="text-[7px] font-bold text-gray-300 uppercase mt-1 tracking-tighter">Pts</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'récompenses' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Privilèges Couple</h2>
            <Gift size={14} className="text-[var(--secondary-color)]" />
          </div>
          <div className="grid gap-5">
            {settings.rewards.map(reward => {
              const currentPoints = currentUser === 'p1' ? settings.p1Points : settings.p2Points;
              const isLocked = currentPoints < reward.threshold;
              const progress = Math.min(100, (currentPoints / reward.threshold) * 100);

              return (
                <div key={reward.id} className={`bg-white p-7 rounded-[3rem] shadow-sm border-2 transition-all ${isLocked ? 'border-gray-50 opacity-80' : 'border-[var(--secondary-color)]/20 shadow-xl'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 pr-4">
                      <h3 className={`text-xl font-serif font-bold ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{reward.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                         <div className="px-3 py-1 bg-slate-50 rounded-full border border-gray-100">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{reward.threshold} Pts</span>
                         </div>
                         {!isLocked && (
                            <button 
                              onClick={() => claimReward(reward)}
                              className="px-3 py-1 bg-green-500 text-white rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                            >
                              <Check size={10}/> Réclamer
                            </button>
                         )}
                      </div>
                    </div>
                    <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all ${isLocked ? 'bg-gray-50 text-gray-200 shadow-inner' : 'bg-[var(--secondary-color)]/10 text-[var(--secondary-color)] shadow-lg active:scale-110'}`}>
                       <Gift size={28} />
                    </div>
                  </div>
                  <div className="relative pt-2">
                    <div className="flex justify-between text-[8px] font-bold text-gray-300 uppercase mb-2 px-1">
                       <span>Points : {currentPoints} / {reward.threshold}</span>
                       <span>{Math.floor(progress)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                      <div className={`h-full transition-all duration-1000 ${isLocked ? 'bg-slate-200' : 'bg-gradient-to-r from-[var(--secondary-color)] to-[var(--primary-color)]'}`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'historique' && (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
           <div className="flex items-center gap-3 px-2">
              <History className="text-[var(--secondary-color)]" size={20} />
              <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Journal d'Activité (Love History)</h2>
           </div>
           
           <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
             {settings.choreHistory.length > 0 ? (
               settings.choreHistory.map(entry => (
                 <div key={entry.id} className="p-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-[var(--secondary-color)] font-serif text-lg">
                          {entry.userName.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-800">{entry.choreTitle}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                             <span className="text-[8px] font-bold text-[var(--primary-color)] uppercase tracking-widest">{entry.userName}</span>
                             <span className="text-[10px] text-gray-300">•</span>
                             <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                                {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à {new Date(entry.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-extrabold text-green-500">+{entry.points}</span>
                    </div>
                 </div>
               ))
             ) : (
               <div className="p-20 text-center">
                  <Clock className="mx-auto text-gray-100 mb-4" size={48} />
                  <p className="text-xs text-gray-300 italic font-medium uppercase tracking-widest">Historique vide</p>
               </div>
             )}
           </div>
           
           <button 
            onClick={() => setActiveTab('tâches')}
            className="w-full py-5 bg-gray-50 text-gray-400 rounded-2xl text-[9px] font-bold uppercase tracking-widest border border-gray-100"
           >
             Retour aux tâches
           </button>
        </div>
      )}

      {activeTab === 'reglages' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <section className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest px-2 border-l-4 border-[var(--secondary-color)]">Configuration des Tâches</h2>
            <div className="space-y-3">
              {settings.chores.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">{c.title}</span>
                    <span className="text-[9px] font-bold text-[var(--primary-color)] uppercase tracking-widest">{c.points} Love Points</span>
                  </div>
                  <button onClick={() => removeChore(c.id)} className="p-3 text-red-200 active:text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <label className="text-[9px] font-bold text-gray-300 uppercase tracking-widest px-1">Nouvelle Mission</label>
              <input 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-[var(--secondary-color)]/20" 
                placeholder="Intitulé de la tâche..."
                value={newChoreTitle}
                onChange={e => setNewChoreTitle(e.target.value)}
              />
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" 
                    value={newChorePoints}
                    onChange={e => setNewChorePoints(parseInt(e.target.value) || 0)}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-300 uppercase">Points</span>
                </div>
                <button 
                  onClick={addChore}
                  className="bg-slate-900 text-[var(--secondary-color)] p-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest px-2 border-l-4 border-[var(--primary-color)]">Configuration des Récompenses</h2>
            <div className="space-y-3">
              {settings.rewards.map(r => (
                <div key={r.id} className="flex items-center justify-between bg-gray-50 p-5 rounded-[1.5rem] border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700">{r.title}</span>
                    <span className="text-[9px] font-bold text-[var(--secondary-color)] uppercase tracking-widest">Seuil : {r.threshold} Pts</span>
                  </div>
                  <button onClick={() => removeReward(r.id)} className="p-3 text-red-200 active:text-red-500"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <label className="text-[9px] font-bold text-gray-300 uppercase tracking-widest px-1">Nouveau Privilège</label>
              <input 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-[var(--primary-color)]/10" 
                placeholder="Ex: Soirée resto au choix..."
                value={newRewardTitle}
                onChange={e => setNewRewardTitle(e.target.value)}
              />
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input 
                    type="number"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none" 
                    value={newRewardThreshold}
                    onChange={e => setNewRewardThreshold(parseInt(e.target.value) || 0)}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-300 uppercase">Seuil</span>
                </div>
                <button 
                  onClick={addReward}
                  className="bg-slate-900 text-[var(--secondary-color)] p-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
          </section>

          <button 
            onClick={resetPoints}
            className="w-full bg-red-50 text-red-400 py-6 rounded-[2.5rem] text-[10px] font-bold uppercase tracking-[0.2em] border border-red-100 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-3"
          >
            <RefreshCw size={16} /> Nouvelle Semaine (Reset)
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartShareView;
