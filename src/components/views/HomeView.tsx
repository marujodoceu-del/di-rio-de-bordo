import React from 'react';
import { AppTab, DailyJournalEntry, UserProfileData } from '../../types';
import { storageService } from '../../services/storageService';
import { ATOMIC_METHOD_CYCLE } from '../../data/atomicMethodCycle';
import { COSMIC_DAY_QUOTES } from '../../data/cosmicQuotes';
import {
  CosmicCard,
  CosmicButton,
  CosmicProgress,
  CosmicEvolutionVisualizer,
  EvolutionBadge,
  getEvolutionStageForDay,
  EVOLUTION_STAGES,
} from '../../design-system';
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  Compass,
  Printer,
  ArrowRight,
  Calendar,
  Flame,
  Orbit,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: AppTab) => void;
  currentDay: number;
  stats: {
    completedDays: number;
    totalDays: number;
    streak: number;
    totalTasks: number;
    completedTasks: number;
    percentJourney: number;
  };
  todayEntry: DailyJournalEntry;
  profile: UserProfileData;
  onSelectDay: (day: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  currentDay,
  stats,
  todayEntry,
  profile,
  onSelectDay,
}) => {
  const quote = COSMIC_DAY_QUOTES[currentDay - 1] || COSMIC_DAY_QUOTES[0];
  const todayTasks = storageService.getCommitmentsForDay(currentDay);
  const activeTasks = todayTasks.filter((t) => t.text && t.text.trim().length > 0);
  const completedTasks = activeTasks.filter((t) => t.completed).length;
  const totalDefined = activeTasks.length;
  const currentStage = getEvolutionStageForDay(currentDay);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner com Identidade Visual Do Átomo ao Infinito */}
      <CosmicCard variant="accent" padding="lg" className="border-white/[0.10]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Concept Eyebrow & Evolution Stage */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5C563]/10 border border-[#F5C563]/30 text-[#F5C563] text-[11px] font-mono font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MÉTODO ATÔMICO • DO ÁTOMO AO INFINITO</span>
              </span>
              <EvolutionBadge day={currentDay} />
            </div>

            {/* Title with Cinzel Gravitas */}
            <h1
              className="text-2xl sm:text-4xl font-bold tracking-wide text-white uppercase font-serif"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Olá, <span className="text-[#F5C563]">{profile.name || 'Praticante'}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Bem-vindo ao seu centro de evolução. Uma jornada de 21 dias para transformar intenções em realidade atômica, alinhando rigor científico com introspecção profunda.
            </p>

            {/* Metáfora Visual da Evolução: Linha de Expansão */}
            <div className="pt-2 pb-1 border-t border-b border-white/[0.06] py-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                <span className="text-[#F5C563] uppercase tracking-wider font-semibold">
                  Escala de Expansão Cósmica
                </span>
                <span>Fase Atual: {currentStage.name}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {EVOLUTION_STAGES.map((stg) => {
                  const isCurrent = stg.id === currentStage.id;
                  const isPassed = currentDay > stg.dayRange[1];
                  return (
                    <div
                      key={stg.id}
                      className={`p-1.5 sm:p-2 rounded-xl text-center transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[#F5C563]/15 border border-[#F5C563]/40 text-[#F5C563]'
                          : isPassed
                          ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300'
                          : 'bg-[#070A11] border border-white/[0.04] text-slate-500'
                      }`}
                    >
                      <span className="block text-[9px] font-mono tracking-tighter truncate font-bold uppercase">
                        {stg.name.split(' ')[0]}
                      </span>
                      <span className="block text-[8px] font-mono text-slate-400 mt-0.5">
                        D{stg.dayRange[0]}–{stg.dayRange[1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <CosmicButton
                variant="primary"
                size="md"
                onClick={() => onNavigate('diario')}
                iconLeft={<BookOpen className="w-4 h-4" />}
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Responder Diário do Dia {currentDay}
              </CosmicButton>

              <CosmicButton
                variant="secondary"
                size="md"
                onClick={() => onNavigate('dia')}
                iconLeft={<CheckSquare className="w-4 h-4 text-[#F5C563]" />}
              >
                Ver Ações de Hoje ({completedTasks}/{totalDefined || 6})
              </CosmicButton>
            </div>
          </div>

          {/* Quick Metrics Capsule & Evolution Visualizer */}
          <div className="flex flex-col gap-3 w-full lg:w-80 shrink-0">
            {/* Visualizer Widget */}
            <CosmicCard variant="default" padding="sm" className="bg-[#070A11]/90">
              <div className="flex items-center justify-between">
                <CosmicEvolutionVisualizer day={currentDay} size="md" />
              </div>
            </CosmicCard>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
              <CosmicCard variant="default" padding="sm" className="bg-[#080B12]">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#F5C563]" />
                    Progresso da Jornada
                  </span>
                  <span className="font-mono text-[#F5C563] font-bold">{stats.percentJourney}%</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {stats.completedDays} <span className="text-xs text-slate-500 font-normal font-sans">/ 21 dias</span>
                </div>
                <div className="mt-2">
                  <CosmicProgress value={stats.percentJourney} showPercentage={false} size="sm" />
                </div>
              </CosmicCard>

              <CosmicCard variant="default" padding="sm" className="bg-[#080B12]">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Flame className="w-3.5 h-3.5 text-[#F5C563]" />
                    Sequência Ativa
                  </span>
                  <span className="text-[#F5C563] text-xs">🔥</span>
                </div>
                <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                  <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                    {stats.streak}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-400 font-sans leading-tight">
                    {stats.streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Constância diária preservada</p>
              </CosmicCard>

              <CosmicCard variant="default" padding="sm" className="col-span-2 sm:col-span-1 bg-[#080B12]">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Ações Cumpridas
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{stats.completedTasks}</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {stats.completedTasks} <span className="text-xs text-slate-500 font-normal font-sans">de {stats.totalTasks}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Compromissos realizados</p>
              </CosmicCard>
            </div>
          </div>
        </div>
      </CosmicCard>

      {/* Concept Architecture: O Ciclo Método Atômico */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/[0.08] pb-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5C563] flex items-center gap-1.5">
              <Orbit className="w-3.5 h-3.5" />
              O Conceito Central do Método
            </span>
            <h2
              className="text-xl sm:text-2xl font-bold text-white tracking-wide uppercase font-serif"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Ciclo Diário de Transformação
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Cada noite e cada manhã são guiadas pela sequência atômica de seis passos progressivos.
          </p>
        </div>

        {/* Cycle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {ATOMIC_METHOD_CYCLE.map((step, idx) => (
            <CosmicCard
              key={step.id}
              variant="interactive"
              padding="sm"
              className="flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-[#141B2D] text-[#F5C563] group-hover:bg-[#F5C563] group-hover:text-[#05070B] transition-colors duration-200">
                    PASSO 0{step.stepNumber}
                  </span>
                  {idx < ATOMIC_METHOD_CYCLE.length - 1 && (
                    <span className="text-slate-600 text-xs hidden lg:inline">→</span>
                  )}
                </div>
                <h3
                  className="font-bold text-sm text-white tracking-wider font-serif uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {step.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                <span className="text-[10px] text-[#F5C563]/80 font-mono block truncate">
                  {step.questionTitle}
                </span>
              </div>
            </CosmicCard>
          ))}
        </div>
      </section>

      {/* Cosmic Inspiration & Today's Highlight */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Day Card */}
        <CosmicCard variant="accent" padding="md" className="lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Orbit className="w-5 h-5 text-[#F5C563]" />
                <span
                  className="font-bold text-base text-[#F5C563] font-serif tracking-wider uppercase"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Dia {currentDay} • {quote.concept}
                </span>
              </div>
              <EvolutionBadge day={currentDay} variant="status" isCompleted={todayEntry.completed} />
            </div>

            <blockquote className="space-y-2 pt-1">
              <p className="text-base sm:text-lg italic text-slate-200 font-serif leading-relaxed font-cormorant">
                &ldquo;{quote.quote}&rdquo;
              </p>
              <footer className="text-xs text-[#F5C563] font-mono">
                — {quote.author}
              </footer>
            </blockquote>

            <div className="p-4 rounded-xl bg-[#060910] border border-white/[0.06] text-xs text-slate-300 space-y-1.5">
              <span className="text-[#F5C563] font-bold uppercase tracking-wider text-[10px] block font-mono">
                ✦ Reflexão Noturna do Método
              </span>
              <p className="leading-relaxed text-slate-300 font-sans">
                {quote.nightReflection}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F5C563]" />
              Horário recomendado para o diário: {profile.dailyReminderTime || '21:30'}
            </span>
            <CosmicButton
              variant="outline"
              size="sm"
              onClick={() => onNavigate('diario')}
              iconRight={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {todayEntry.completed ? 'Revisar Respostas' : 'Iniciar Reflexão Guiada'}
            </CosmicButton>
          </div>
        </CosmicCard>

        {/* Quick Hub for Other Modules */}
        <div className="space-y-4 flex flex-col">
          {/* Printable Book Feature Card */}
          <CosmicCard
            variant="interactive"
            padding="md"
            onClick={() => onNavigate('imprimir')}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F5C563]/10 border border-[#F5C563]/30 flex items-center justify-center text-[#F5C563]">
                <Printer className="w-5 h-5" />
              </div>
              <h3
                className="font-bold text-base text-white tracking-wide font-serif uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Personalizar Diário para Imprimir
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acesse o gerador do livro de 45 páginas em A5 para encadernação, escolha artes cósmicas e exporte em alta resolução.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#F5C563]">
              <span>Abrir Sistema de Impressão</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </CosmicCard>

          {/* Journey View Card */}
          <CosmicCard
            variant="interactive"
            padding="md"
            onClick={() => onNavigate('jornada')}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3
                className="font-bold text-base text-white tracking-wide font-serif uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Mapa dos 21 Dias
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visualize os marcos da sua jornada, veja dias concluídos e planeje os próximos saltos de consciência.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-400">
              <span>Explorar Minha Jornada</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </CosmicCard>
        </div>
      </section>
    </div>
  );
};
