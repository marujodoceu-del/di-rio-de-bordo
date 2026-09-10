import React, { useState } from 'react';
import { DailyJournalEntry, AppTab, JOURNEY_100_PHASES, getPhaseForDay } from '../../types';
import { COSMIC_DAY_QUOTES } from '../../data/cosmicQuotes';
import { storageService } from '../../services/storageService';
import {
  CosmicCard,
  CosmicProgress,
  EvolutionBadge,
} from '../../design-system';
import {
  Compass,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Orbit,
  Calendar,
  Award,
  BookOpen,
  CheckSquare,
  Circle,
  Clock,
  Flame,
  Zap,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface JourneyViewProps {
  currentDay: number;
  entries: Record<number, DailyJournalEntry>;
  onNavigate: (tab: AppTab) => void;
  onSelectDay: (day: number) => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  currentDay,
  entries,
  onNavigate,
  onSelectDay,
}) => {
  const profile = storageService.getUserProfile();
  const stats = storageService.getJourneyStats();
  const is100Unlocked = !!profile.unlocked100DaysJourney;
  const currentPhase = getPhaseForDay(currentDay);

  // Fase selecionada na navegação (1 a 4)
  const [selectedPhaseNumber, setSelectedPhaseNumber] = useState<number>(() => {
    return is100Unlocked ? currentPhase.phase : 1;
  });

  const [futureDayNotice, setFutureDayNotice] = useState<number | null>(null);

  const handleOpenDay = (day: number) => {
    // Se o dia estiver além dos 21 e os 100 dias não estiverem desbloqueados, avisa
    if (day > 21 && !is100Unlocked) {
      return;
    }
    // Dias futuros não devem permitir edição antecipada se ainda não foram vividos
    if (day > currentDay && !entries[day]?.completed) {
      setFutureDayNotice(day);
      setTimeout(() => setFutureDayNotice(null), 3500);
      return;
    }
    onSelectDay(day);
    onNavigate('diario');
  };

  const getDayStatus = (day: number): 'completed' | 'current' | 'in_progress' | 'future' | 'locked' => {
    if (day > 21 && !is100Unlocked) return 'locked';
    const entry = entries[day];
    if (entry && entry.completed) return 'completed';
    if (day === currentDay) return 'current';
    if (day < currentDay) return 'in_progress';
    return 'future';
  };

  const activePhase = JOURNEY_100_PHASES.find((p) => p.phase === selectedPhaseNumber) || JOURNEY_100_PHASES[0];

  // Cálculo de progresso da fase ativa
  const phaseDays = Array.from(
    { length: activePhase.dayEnd - activePhase.dayStart + 1 },
    (_, i) => activePhase.dayStart + i
  );
  const phaseCompletedCount = phaseDays.filter((d) => entries[d]?.completed).length;
  const phasePercent = Math.round((phaseCompletedCount / phaseDays.length) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn pb-24">
      {/* Header Banner */}
      <CosmicCard variant="accent" padding="lg">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C563]/10 border border-[#F5C563]/30 text-[#F5C563] text-xs font-mono font-medium">
                <Compass className="w-3.5 h-3.5" />
                <span>
                  {is100Unlocked
                    ? 'JORNADA DE 100 DIAS • A GRANDE EXPANSÃO'
                    : 'JORNADA INICIAL • DO ÁTOMO AO INFINITO'}
                </span>
              </div>

              <h1
                className="text-2xl sm:text-4xl font-bold text-white tracking-wide uppercase font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {is100Unlocked ? 'A Grande Jornada de 100 Dias' : 'Minha Trilha de 21 Dias'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {is100Unlocked
                  ? 'Você concluiu o Despertar inicial e agora navega pelas 4 fases da expansão cósmica. Cada dia consolida sua identidade inabalável.'
                  : 'Acompanhe seu avanço diário. Complete a trilha inicial de 21 dias para desbloquear a grande expansão de 100 dias.'}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full lg:w-[460px]">
              <div className="bg-[#070A11] border border-white/[0.06] p-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-medium uppercase font-mono">Dia Atual</span>
                <div className="text-xl font-bold text-[#F5C563] font-mono mt-0.5">
                  Dia {currentDay}
                </div>
                <span className="text-[10px] text-slate-500 font-sans">Em curso</span>
              </div>

              <div className="bg-[#070A11] border border-white/[0.06] p-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-medium uppercase font-mono">Concluídos</span>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                  {stats.completedDays}{' '}
                  <span className="text-xs text-slate-500 font-normal">
                    / {is100Unlocked ? '100' : '21'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-sans">Dias finalizados</span>
              </div>

              <div className="bg-[#070A11] border border-white/[0.06] p-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-medium uppercase font-mono">Faltam</span>
                <div className="text-xl font-bold text-amber-300 font-mono mt-0.5">
                  {stats.daysRemaining}{' '}
                  <span className="text-xs text-slate-500 font-normal">dias</span>
                </div>
                <span className="text-[10px] text-slate-500 font-sans">Para os 21 dias</span>
              </div>

              <div className="bg-[#070A11] border border-white/[0.06] p-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-medium uppercase font-mono">Progresso</span>
                <div className="text-xl font-bold text-[#F5C563] font-mono mt-0.5">
                  {stats.percentJourney}%
                </div>
                <span className="text-[10px] text-slate-500 font-sans">Da trilha inicial</span>
              </div>

              <div className="bg-[#070A11] border border-white/[0.06] p-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-medium uppercase font-mono">Em Andamento</span>
                <div className="text-xl font-bold text-sky-400 font-mono mt-0.5">
                  {stats.inProgressDays}
                </div>
                <span className="text-[10px] text-slate-500 font-sans">Dias ativos</span>
              </div>

              <div className="bg-[#070A11] border border-white/[0.06] p-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 font-medium uppercase font-mono">Dias Futuros</span>
                <div className="text-xl font-bold text-slate-400 font-mono mt-0.5">
                  {stats.futureDays}
                </div>
                <span className="text-[10px] text-slate-500 font-sans">Aguardando</span>
              </div>
            </div>
          </div>

          {/* Big Progress Bar com Exemplo solicitado */}
          <div className="pt-2">
            <CosmicProgress
              value={stats.percentJourney}
              label={
                is100Unlocked
                  ? `JORNADA DE 100 DIAS: ${stats.completedDays} / 100 DIAS (Faltam ${Math.max(0, 100 - stats.completedDays)} dias) • ${stats.percentJourney}% concluído`
                  : `JORNADA INICIAL: ${stats.completedDays} / 21 DIAS (Faltam ${stats.daysRemaining} dias) • ${stats.percentJourney}% concluído`
              }
              size="md"
            />
          </div>
        </div>
      </CosmicCard>

      {/* Aviso de Dia Futuro caso tente clicar */}
      {futureDayNotice && (
        <div className="p-4 rounded-2xl bg-[#0E131F] border border-amber-400/40 text-xs text-amber-200 flex items-center justify-between gap-3 animate-fadeIn shadow-lg">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#F5C563] shrink-0" />
            <span>
              O <strong>Dia {futureDayNotice}</strong> é um dia futuro da jornada. No Método Atômico, cada dia deve ser vivido e refletido em seu momento presente. Conclua o <strong>Dia {currentDay}</strong> primeiro para avançar com consistência.
            </span>
          </div>
          <button
            onClick={() => setFutureDayNotice(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-1"
          >
            Entendido
          </button>
        </div>
      )}

      {/* CALL-TO-ACTION ESPECIAL SE DIA 21 CONCLUÍDO E AINDA NÃO DESBLOQUEADO */}
      {!is100Unlocked && entries[21]?.completed && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#070A11] to-sky-950/40 border-2 border-[#F5C563] shadow-2xl shadow-[#F5C563]/10 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5C563]/20 border border-[#F5C563]/40 flex items-center justify-center text-[#F5C563] shrink-0 shadow-lg">
              <Sparkles className="w-6 h-6 animate-spin text-[#F5C563]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5C563] font-bold">
                PRIMEIRA GRANDE JORNADA ATINGIDA!
              </span>
              <h3
                className="text-base sm:text-lg font-bold text-white uppercase font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Sua Expansão de 100 Dias Está Pronta
              </h3>
              <p className="text-xs text-slate-300">
                Você concluiu o Dia 21! Abra o diário para vivenciar a Cerimônia de Transcendência e desbloquear os 100 dias.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onSelectDay(21);
              onNavigate('diario');
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#F5C563] to-amber-400 text-slate-950 font-bold text-xs uppercase font-serif tracking-wider shadow-lg hover:scale-105 transition shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Iniciar Transcendência</span>
          </button>
        </div>
      )}

      {/* NAVEGAÇÃO ENTRE AS 4 FASES DA ARQUITETURA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide flex items-center gap-2 font-serif"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <Layers className="w-5 h-5 text-[#F5C563]" />
            Arquitetura em 4 Fases
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {is100Unlocked ? '4 Fases Desbloqueadas' : 'Fase 1 Ativa • Fases 2–4 Bloqueadas'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {JOURNEY_100_PHASES.map((phase) => {
            const isPhaseUnlocked = phase.phase === 1 || is100Unlocked;
            const isSelected = selectedPhaseNumber === phase.phase;
            const isCurrent = currentPhase.phase === phase.phase && isPhaseUnlocked;
            const pDays = Array.from(
              { length: phase.dayEnd - phase.dayStart + 1 },
              (_, i) => phase.dayStart + i
            );
            const pCompleted = pDays.filter((d) => entries[d]?.completed).length;
            const pTotal = pDays.length;

            return (
              <div
                key={phase.id}
                onClick={() => setSelectedPhaseNumber(phase.phase)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0E131F] shadow-lg ring-1'
                    : 'bg-[#070A11]/90 hover:bg-[#0C101A] border-white/[0.06]'
                }`}
                style={{
                  borderColor: isSelected ? phase.themeColor : undefined,
                  boxShadow: isSelected ? `0 0 20px ${phase.themeColor}25` : undefined,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border"
                      style={{
                        backgroundColor: phase.badgeBg,
                        borderColor: phase.badgeBorder,
                        color: phase.themeColor,
                      }}
                    >
                      FASE 0{phase.phase}
                    </span>

                    {!isPhaseUnlocked ? (
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-600" /> Bloqueada
                      </span>
                    ) : pCompleted === pTotal ? (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100%
                      </span>
                    ) : isCurrent ? (
                      <span
                        className="text-[10px] font-mono font-bold flex items-center gap-1"
                        style={{ color: phase.themeColor }}
                      >
                        <Sparkles className="w-3 h-3" /> Em Curso
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">
                        {pCompleted}/{pTotal}
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-sm font-bold text-white uppercase font-serif mt-1"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {phase.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Dias {phase.dayStart} a {phase.dayEnd}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {phase.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">
                    {pCompleted}/{pTotal} dias
                  </span>
                  <div className="w-16 bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((pCompleted / pTotal) * 100)}%`,
                        backgroundColor: phase.themeColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO DA FASE SELECIONADA */}
      <div className="space-y-6">
        {/* Banner descritivo da Fase Selecionada */}
        <div
          className="p-5 rounded-2xl border bg-[#070A11] space-y-3"
          style={{ borderColor: activePhase.badgeBorder }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: activePhase.badgeBg,
                    borderColor: activePhase.badgeBorder,
                    color: activePhase.themeColor,
                  }}
                >
                  FASE 0{activePhase.phase} • DIAS {activePhase.dayStart} A {activePhase.dayEnd}
                </span>
                {selectedPhaseNumber > 1 && !is100Unlocked && (
                  <span className="text-[10px] font-mono text-amber-400/80 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Requer Concluir o Dia 21
                  </span>
                )}
              </div>
              <h2
                className="text-xl sm:text-2xl font-bold text-white uppercase font-serif mt-1"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {activePhase.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                {activePhase.description}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 font-mono block">Progresso da Fase</span>
              <span
                className="text-2xl font-bold font-mono"
                style={{ color: activePhase.themeColor }}
              >
                {phaseCompletedCount}{' '}
                <span className="text-xs text-slate-500 font-normal">/ {phaseDays.length} dias</span>
              </span>
              <div className="w-32 bg-white/[0.08] h-2 rounded-full overflow-hidden mt-1 ml-auto">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${phasePercent}%`,
                    backgroundColor: activePhase.themeColor,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grade de Dias da Fase Selecionada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {phaseDays.map((dayNum) => {
            const entry = entries[dayNum];
            const status = getDayStatus(dayNum);
            const quote = COSMIC_DAY_QUOTES[dayNum - 1] || COSMIC_DAY_QUOTES[0];
            const tasksCompletedCount = entry?.commitments?.filter((t) => t.completed).length || 0;
            const totalTasksCount = entry?.commitments?.filter((t) => t.text.trim()).length || 0;

            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';
            const isInProgress = status === 'in_progress';
            const isFuture = status === 'future';
            const isLocked = status === 'locked';

            return (
              <div
                key={dayNum}
                onClick={() => handleOpenDay(dayNum)}
                className={`group relative rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between select-none ${
                  isLocked
                    ? 'bg-[#070A11]/40 border border-white/[0.04] opacity-40 cursor-not-allowed'
                    : isCompleted
                    ? 'bg-[#070A11] hover:bg-[#0C101A] border border-emerald-500/40 shadow-sm cursor-pointer hover:border-emerald-400'
                    : isCurrent
                    ? 'bg-[#0E131F] border-2 border-[#F5C563] shadow-[0_0_20px_rgba(245,197,99,0.18)] cursor-pointer'
                    : isInProgress
                    ? 'bg-[#0A0E18] hover:bg-[#0E1422] border border-sky-500/40 cursor-pointer'
                    : 'bg-[#070A11]/60 hover:bg-[#0C101A] border border-white/[0.04] text-slate-500 cursor-pointer'
                }`}
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isLocked
                            ? 'bg-slate-800 text-slate-500'
                            : isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isCurrent
                            ? 'bg-[#F5C563] text-[#05070B] font-bold'
                            : isInProgress
                            ? 'bg-sky-500/20 text-sky-300'
                            : 'bg-white/[0.04] text-slate-400'
                        }`}
                      >
                        DIA {dayNum}
                      </span>
                      {dayNum <= 21 && <EvolutionBadge day={dayNum} />}
                    </div>

                    {isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Sparkles className="w-4 h-4 text-[#F5C563] animate-pulse shrink-0" />
                    ) : isInProgress ? (
                      <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </div>

                  <h3
                    className={`font-serif text-xs font-bold line-clamp-2 leading-snug uppercase ${
                      isLocked
                        ? 'text-slate-600'
                        : isCompleted
                        ? 'text-emerald-200'
                        : isCurrent
                        ? 'text-[#F5C563]'
                        : isInProgress
                        ? 'text-sky-200'
                        : 'text-slate-400'
                    }`}
                  >
                    {quote.concept}
                  </h3>
                </div>

                {/* Card Bottom Meta */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono flex items-center justify-between">
                  {isLocked ? (
                    <span className="text-slate-600">Bloqueado</span>
                  ) : isCompleted ? (
                    <span className="text-emerald-400 font-bold">
                      ✓ Concluído • Revisar
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[#F5C563] font-bold">Em curso hoje</span>
                  ) : isInProgress ? (
                    <span className="text-sky-400 font-bold">Em andamento</span>
                  ) : (
                    <span className="text-slate-500">Dia Futuro</span>
                  )}

                  {!isLocked && (
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-[#F5C563] group-hover:translate-x-0.5 transition" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
