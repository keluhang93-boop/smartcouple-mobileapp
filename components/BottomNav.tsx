import React from 'react';
import { Home, Wallet, Calendar, Heart, User, CheckSquare } from 'lucide-react';
import { ViewType, UserSettings } from '../types';

interface BottomNavProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  settings: UserSettings;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView, settings }) => {
  const tabs: { id: ViewType; icon: React.ReactNode; label: string; subLabel: string; visible?: boolean }[] = [
    { id: 'home', icon: <Home size={18} />, label: 'Smart', subLabel: 'Accueil', visible: true },
    { id: 'spending', icon: <Wallet size={18} />, label: 'Smart', subLabel: 'Dépenses', visible: true },
    { id: 'planning', icon: <Calendar size={18} />, label: 'Smart', subLabel: 'Planning', visible: true },
    { id: 'union', icon: <Heart size={18} />, label: 'Smart', subLabel: 'Union', visible: true },
    { id: 'share', icon: <CheckSquare size={18} />, label: 'Smart', subLabel: 'Partage', visible: settings.enableSmartPartage },
    { id: 'profile', icon: <User size={18} />, label: '', subLabel: 'Moi', visible: true },
  ];

  const visibleTabs = tabs.filter(tab => tab.visible !== false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-stretch h-24 px-2 pb-6 z-[1500] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {visibleTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveView(tab.id)}
          className={`flex-1 flex flex-col items-center justify-center transition-all duration-300 ${
            activeView === tab.id ? 'text-[var(--primary-color)]' : 'text-gray-300'
          }`}
        >
          <div className={`mb-1.5 transition-all p-2 rounded-xl ${activeView === tab.id ? 'bg-[var(--primary-color)]/10 scale-110' : ''}`}>
            {tab.icon}
          </div>
          <div className="flex flex-col items-center leading-tight">
            {tab.label && (
              <span className="text-[7px] font-bold uppercase tracking-[0.15em] opacity-40">
                {tab.label}
              </span>
            )}
            <span className={`text-[8px] font-bold uppercase tracking-tighter transition-colors ${activeView === tab.id ? 'opacity-100' : 'opacity-60'}`}>
              {tab.subLabel}
            </span>
          </div>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;