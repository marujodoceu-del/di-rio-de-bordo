import React from 'react';
import { AppTab } from '../../types';
import {
  Home,
  BookOpen,
  CheckSquare,
  Compass,
  History,
  Printer,
  User,
} from 'lucide-react';

interface BottomTabBarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'inicio', label: 'Início', icon: <Home className="w-5 h-5" /> },
    { id: 'diario', label: 'Diário', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'dia', label: 'Meu Dia', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'jornada', label: 'Jornada', icon: <Compass className="w-5 h-5" /> },
    { id: 'historico', label: 'Histórico', icon: <History className="w-5 h-5" /> },
    { id: 'imprimir', label: 'Imprimir', icon: <Printer className="w-5 h-5" /> },
    { id: 'perfil', label: 'Perfil', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#05070B]/95 backdrop-blur-xl border-t border-white/[0.08] px-1 py-1.5 flex items-center justify-around shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-200 text-[10px] font-medium min-w-[44px] ${
              isActive
                ? 'text-[#F5C563] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg transition-all duration-200 ${isActive ? 'bg-[#F5C563]/15 text-[#F5C563]' : ''}`}>
              {tab.icon}
            </div>
            <span className="truncate max-w-[52px] mt-0.5 font-sans tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
