import React from 'react';
import { AppTab } from '../../types';
import { EvolutionBadge } from '../../design-system';
import {
  Sparkles,
  Home,
  BookOpen,
  CheckSquare,
  Compass,
  History,
  Printer,
  User,
  Orbit,
} from 'lucide-react';

interface AppHeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  currentDay: number;
  completedDays: number;
  totalDays?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentTab,
  onSelectTab,
  currentDay,
  completedDays,
  totalDays = 21,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'inicio', label: 'Início', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'diario', label: 'Meu Diário', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'dia', label: 'Meu Dia', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { id: 'jornada', label: 'Minha Jornada', icon: <Compass className="w-3.5 h-3.5" />, badge: `${completedDays}/${totalDays}` },
    { id: 'historico', label: 'Meu Histórico', icon: <History className="w-3.5 h-3.5" /> },
    {
      id: 'imprimir',
      label: 'Personalizar Diário para Imprimir',
      icon: <Printer className="w-3.5 h-3.5" />,
      badge: 'PDF',
    },
    { id: 'perfil', label: 'Perfil', icon: <User className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-[#05070B]/90 backdrop-blur-xl border-b border-white/[0.07] text-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Concept Title */}
          <div
            onClick={() => onSelectTab('inicio')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E2A73E] via-[#F8D485] to-[#F5C563] flex items-center justify-center text-[#05070B] shadow-[0_0_16px_rgba(245,197,99,0.25)] group-hover:scale-105 transition-transform duration-300">
              <Orbit className="w-5 h-5 text-[#05070B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-sm sm:text-base tracking-widest text-white uppercase font-serif"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  MÉTODO ATÔMICO
                </span>
              </div>
              <p className="text-[10px] text-[#F5C563]/90 tracking-widest font-mono uppercase">
                DO ÁTOMO AO INFINITO
              </p>
            </div>
          </div>

          {/* Evolution Scale Indicator (Desktop & Tablet) */}
          <div className="hidden lg:flex items-center">
            <EvolutionBadge day={currentDay} />
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              const isPrint = tab.id === 'imprimir';
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? isPrint
                        ? 'bg-gradient-to-r from-[#F5C563] to-[#E2A73E] text-[#05070B] font-bold shadow-[0_2px_12px_rgba(245,197,99,0.25)]'
                        : 'bg-[#111726] text-[#F5C563] border border-[#F5C563]/30 shadow-sm'
                      : isPrint
                      ? 'bg-[#F5C563]/10 text-[#F5C563] hover:bg-[#F5C563]/20 border border-[#F5C563]/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isActive && isPrint
                          ? 'bg-[#05070B] text-[#F5C563]'
                          : 'bg-[#080B12] text-slate-300 border border-white/[0.08]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Medium Screen Tabs (Scrollable) */}
          <nav className="hidden md:flex xl:hidden items-center gap-1 overflow-x-auto py-1">
            {tabs.slice(0, 5).map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#111726] text-[#F5C563] border border-[#F5C563]/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => onSelectTab('imprimir')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                currentTab === 'imprimir'
                  ? 'bg-[#F5C563] text-[#05070B]'
                  : 'bg-[#F5C563]/15 text-[#F5C563] border border-[#F5C563]/30'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={() => onSelectTab('perfil')}
              className={`p-2 rounded-xl text-xs font-medium transition ${
                currentTab === 'perfil'
                  ? 'bg-[#111726] text-[#F5C563]'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Perfil"
            >
              <User className="w-4 h-4" />
            </button>
          </nav>

          {/* Quick Action Button for Direct Entry */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('diario')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F5C563] via-[#F8D485] to-[#E2A73E] text-[#05070B] font-bold text-xs shadow-[0_2px_12px_rgba(245,197,99,0.2)] hover:brightness-105 active:scale-95 transition-all duration-200"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#05070B]" />
              <span className="hidden sm:inline">Preencher</span> Diário
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
