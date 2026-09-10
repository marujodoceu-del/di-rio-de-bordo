import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  DailyJournalEntry,
  UserProfileData,
  CommitmentTask,
  JournalQuestion,
  DAILY_FLOW_STEPS,
  getPhaseForDay,
  JOURNEY_100_PHASES,
} from '../../types';
import { storageService } from '../../services/storageService';
import { getQuestionsForDay } from '../../data/journalQuestions';
import { COSMIC_DAY_QUOTES } from '../../data/cosmicQuotes';
import { CosmicCard } from '../../design-system/components/CosmicCard';
import { CosmicButton } from '../../design-system/components/CosmicButton';
import { CosmicProgress } from '../../design-system/components/CosmicProgress';
import { EvolutionBadge } from '../../design-system/components/EvolutionBadge';
import { Day21CompletionExperience } from '../special/Day21CompletionExperience';
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Volume2,
  VolumeX,
  Mic,
  Moon,
  Sun,
  Feather,
  Orbit,
  ArrowRight,
  CheckSquare,
  Copy,
  Check,
  Calendar,
  RotateCcw,
  Flame,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface DailyJournalViewProps {
  initialDay: number;
  profile: UserProfileData;
  onNavigateDay?: (day: number) => void;
  onNavigateTab?: (tab: string) => void;
}

export const DailyJournalView: React.FC<DailyJournalViewProps> = ({
  initialDay,
  profile,
  onNavigateDay,
  onNavigateTab,
}) => {
  // Dia selecionado (1 a 21)
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const savedPos = storageService.getLastActivePosition();
    return initialDay || savedPos.day || 1;
  });

  // Entrada do dia atual carregada do storage
  const [entry, setEntry] = useState<DailyJournalEntry>(() =>
    storageService.getEntryForDay(selectedDay)
  );

  // Nome do usuário para a declaração "Eu Sou"
  const [userName, setUserName] = useState<string>(() => {
    if (profile.name && profile.name !== 'Viajante Cósmico') {
      return profile.name;
    }
    return '';
  });

  // Lista flexível de perguntas para o dia selecionado (respeita o fluxo de 7 ordens)
  const questions: JournalQuestion[] = useMemo(
    () => getQuestionsForDay(selectedDay, userName),
    [selectedDay, userName]
  );

  // Posição da pergunta atual (apresentadas uma por vez)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    const savedPos = storageService.getLastActivePosition();
    if (savedPos.day === selectedDay && typeof savedPos.stepIndex === 'number') {
      return Math.min(savedPos.stepIndex, questions.length - 1);
    }
    if (entry.lastActiveStepIndex !== undefined) {
      return Math.min(entry.lastActiveStepIndex, questions.length - 1);
    }
    return 0;
  });

  // Estados de feedback & áudio
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('agora');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [activeListeningField, setActiveListeningField] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [showDay21Experience, setShowDay21Experience] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'inspire' | 'retenha' | 'expire'>('inspire');

  const is100Unlocked = !!profile.unlocked100DaysJourney;
  const maxAllowedDay = is100Unlocked ? 100 : 21;
  const currentPhase = getPhaseForDay(selectedDay);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincroniza nome caso mude externamente
  useEffect(() => {
    if (profile.name && profile.name !== 'Viajante Cósmico') {
      setUserName(profile.name);
    }
  }, [profile.name]);

  const handleUpdateUserName = (newName: string) => {
    setUserName(newName);
    const updatedProfile = { ...profile, name: newName };
    storageService.saveUserProfile(updatedProfile);
  };

  // Carrega entrada e restaura ponto onde o usuário parou quando o dia muda
  useEffect(() => {
    const loaded = storageService.getEntryForDay(selectedDay);
    setEntry(loaded);

    const savedPos = storageService.getLastActivePosition();
    const targetQuestions = getQuestionsForDay(selectedDay, userName);
    let targetIndex = 0;

    if (savedPos.day === selectedDay && typeof savedPos.stepIndex === 'number') {
      targetIndex = Math.min(savedPos.stepIndex, targetQuestions.length - 1);
    } else if (loaded.lastActiveStepIndex !== undefined) {
      targetIndex = Math.min(loaded.lastActiveStepIndex, targetQuestions.length - 1);
    }

    setCurrentQuestionIndex(targetIndex);
    stopNarration();
    setShowCompletionModal(false);
  }, [selectedDay, userName]);

  // Handler de auto-save com debounce
  const triggerAutoSave = useCallback(
    (updated: DailyJournalEntry) => {
      setEntry({ ...updated });
      setIsAutoSaving(true);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        storageService.saveEntry(updated);
        setIsAutoSaving(false);
        const now = new Date();
        setLastSavedTime(
          `${now.getHours().toString().padStart(2, '0')}:${now
            .getMinutes()
            .toString()
            .padStart(2, '0')}`
        );
      }, 400);
    },
    []
  );

  // Atualiza posição do usuário para que ele retorne exatamente de onde parou
  const changeQuestionIndex = (newIndex: number) => {
    stopNarration();
    const clamped = Math.max(0, Math.min(newIndex, questions.length - 1));
    setCurrentQuestionIndex(clamped);
    storageService.saveLastActivePosition(selectedDay, clamped);
  };

  // Pergunta atual
  const currentQuestion: JournalQuestion =
    questions[currentQuestionIndex] || questions[0];

  // Cálculo de progresso
  const totalQuestions = questions.length;
  const progressPercent = Math.round(
    ((currentQuestionIndex + 1) / totalQuestions) * 100
  );

  // Sub-índice da pergunta dentro da sua etapa
  const questionsInCurrentStep = questions.filter(
    (q) => q.stepNumber === currentQuestion.stepNumber
  );
  const currentSubIndex =
    questionsInCurrentStep.findIndex((q) => q.id === currentQuestion.id) + 1;

  // Ciclo de respiração suave para o Momento de Reflexão
  useEffect(() => {
    if (currentQuestion.stepNumber !== 2) return;
    const interval = setInterval(() => {
      setBreathingPhase((prev) => {
        if (prev === 'inspire') return 'retenha';
        if (prev === 'retenha') return 'expire';
        return 'inspire';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [currentQuestion.stepNumber]);

  // Narração por Voz (Text-to-Speech nativo)
  const toggleNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta sintetização de voz.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = currentQuestion.narracaoTexto || currentQuestion.texto;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopNarration = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Entrada por Voz (SpeechRecognition nativo)
  const toggleVoiceInput = (targetField: string, index?: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        'Reconhecimento de fala por voz não é suportado no seu navegador atual. Você pode digitar normalmente.'
      );
      return;
    }

    if (isListening && activeListeningField === targetField) {
      setIsListening(false);
      setActiveListeningField(null);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      setActiveListeningField(targetField);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleVoiceResult(targetField, transcript, index);
        }
        setIsListening(false);
        setActiveListeningField(null);
      };
      recognition.onerror = () => {
        setIsListening(false);
        setActiveListeningField(null);
      };
      recognition.onend = () => {
        setIsListening(false);
        setActiveListeningField(null);
      };
      recognition.start();
    } catch {
      setIsListening(false);
      setActiveListeningField(null);
    }
  };

  const handleVoiceResult = (field: string, text: string, index?: number) => {
    const updated = { ...entry };
    if (field === 'worthLiving') {
      updated.worthLivingAnswer =
        (updated.worthLivingAnswer ? updated.worthLivingAnswer + ' ' : '') + text;
    } else if (field === 'worldBetterIdea') {
      updated.worldBetterIdea =
        (updated.worldBetterIdea ? updated.worldBetterIdea + ' ' : '') + text;
    } else if (field === 'doDifferent') {
      updated.doDifferentAnswer =
        (updated.doDifferentAnswer ? updated.doDifferentAnswer + ' ' : '') + text;
    } else if (field === 'task' && typeof index === 'number') {
      updated.commitments[index].text =
        (updated.commitments[index].text ? updated.commitments[index].text + ' ' : '') + text;
    } else if (field === 'gratitude' && typeof index === 'number') {
      updated.gratitudes[index] =
        (updated.gratitudes[index] ? updated.gratitudes[index] + ' ' : '') + text;
    } else if (field === 'innerVoice') {
      updated.innerVoiceConclusion =
        (updated.innerVoiceConclusion ? updated.innerVoiceConclusion + ' ' : '') + text;
    } else if (field === 'commitmentReason') {
      updated.commitmentReason =
        (updated.commitmentReason ? updated.commitmentReason + ' ' : '') + text;
    }
    triggerAutoSave(updated);
  };

  // Concluir o Dia
  const handleCompleteDay = () => {
    stopNarration();
    const updated = storageService.completeDay(selectedDay);
    setEntry(updated);

    // Se for o Dia 21, ativa o evento de transcendência e expansão ritualística
    if (selectedDay === 21) {
      setShowDay21Experience(true);
    } else {
      setShowCompletionModal(true);
    }
  };

  // Iniciar expansão para a Jornada de 100 Dias
  const handleStartExpansion = () => {
    storageService.unlock100DaysJourney();
    setShowDay21Experience(false);
    setShowCompletionModal(false);
    setSelectedDay(22);
    onNavigateDay?.(22);
  };

  // Copiar resumo consolidado
  const handleCopySummary = () => {
    const summary = `MÉTODO ATÔMICO — DIÁRIO DE BORDO
Dia ${selectedDay} de 21 • ${entry.date}
Praticante: ${userName || 'Praticante Atômico'}

1. POR QUE VALEU A PENA VIVER O DIA DE HOJE:
${entry.worthLivingAnswer || '(Não informado)'}

${
  entry.worldBetterIdea
    ? `1.1. QUE IDEIA VOCÊ TEVE HOJE PARA CONTRIBUIR PARA UM MUNDO MELHOR:\n${entry.worldBetterIdea}\n`
    : ''
}2. O QUE FARIA DIFERENTE:
${entry.doDifferentAnswer || '(Não informado)'}

3. AS 6 AÇÕES COMPROMISSADAS PARA AMANHÃ:
${entry.commitments
  .filter((c) => c.text.trim())
  .map((c, i) => `${i + 1}. ${c.text}`)
  .join('\n')}

Nota de Impacto: ${entry.commitmentScore}/10
Justificativa: ${entry.commitmentReason || '(Não informada)'}

4. TRÊS GRATIDÕES DO DIA:
${entry.gratitudes.map((g, i) => `${i + 1}. ${g || '(Não preenchido)'}`).join('\n')}

5. MEDITAÇÃO DO PERDÃO:
${entry.forgivenessConfirmed ? 'Confirmada e realizada.' : 'Pendente de leitura.'}

6. APRENDIZADOS & VOZ INTERIOR:
${entry.innerVoiceConclusion || '(Não informado)'}

BOA NOITE... DURMA EM PAZ!`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const currentQuote =
    COSMIC_DAY_QUOTES[selectedDay - 1] || COSMIC_DAY_QUOTES[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* ---------------------------------------------------- */}
      {/* BARRA SUPERIOR: SELETOR DE DIA & METADADOS           */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#070A11]/90 border border-white/[0.08] p-3.5 sm:p-4 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: currentPhase.badgeBg,
              borderColor: currentPhase.badgeBorder,
              color: currentPhase.themeColor,
            }}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-mono uppercase tracking-widest font-bold"
                style={{ color: currentPhase.themeColor }}
              >
                {is100Unlocked ? currentPhase.title : 'Jornada de 21 Dias'}
              </span>
              <EvolutionBadge day={selectedDay} />
              {entry.completed && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Concluído
                </span>
              )}
            </div>
            <h1
              className="text-lg sm:text-xl font-bold text-white tracking-wide uppercase font-serif"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Diário do Dia {selectedDay}
            </h1>
          </div>
        </div>

        {/* Seletor do Dia */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => {
              const prev = Math.max(1, selectedDay - 1);
              setSelectedDay(prev);
              onNavigateDay?.(prev);
            }}
            disabled={selectedDay <= 1}
            className="p-2 rounded-xl bg-[#0E131F] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-[#151D30] disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Dia Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <select
            value={selectedDay}
            onChange={(e) => {
              const day = Number(e.target.value);
              setSelectedDay(day);
              onNavigateDay?.(day);
            }}
            className="bg-[#0E131F] border border-white/[0.08] text-white text-xs font-mono font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#F5C563] transition"
          >
            {Array.from({ length: maxAllowedDay }, (_, i) => i + 1).map((d) => {
              const p = getPhaseForDay(d);
              return (
                <option key={d} value={d}>
                  Dia {d} {is100Unlocked ? `• ${p.name}` : 'de 21'}
                </option>
              );
            })}
          </select>

          <button
            onClick={() => {
              const next = Math.min(maxAllowedDay, selectedDay + 1);
              setSelectedDay(next);
              onNavigateDay?.(next);
            }}
            disabled={selectedDay >= maxAllowedDay}
            className="p-2 rounded-xl bg-[#0E131F] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-[#151D30] disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Próximo Dia"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BANNER ESPECIAL DO DIA 21 — CONQUISTA & TRANSCENDÊNCIA */}
      {selectedDay === 21 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#070A11] to-sky-950/40 border border-[#F5C563]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-[#F5C563]/5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#F5C563]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-[#F5C563]/15 border border-[#F5C563]/40 flex items-center justify-center text-[#F5C563] shrink-0 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse text-[#F5C563]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5C563] font-bold">
                  {is100Unlocked ? 'PRIMEIRA GRANDE JORNADA CONCLUÍDA' : 'MARCO CRÍTICO DE TRANSFORMAÇÃO'}
                </span>
              </div>
              <h3
                className="text-sm sm:text-base font-bold text-white uppercase font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {is100Unlocked ? 'Jornada de 100 Dias Desbloqueada' : 'Conclusão dos 21 Dias'}
              </h3>
              <p className="text-[11px] text-slate-300 max-w-xl leading-snug">
                {is100Unlocked
                  ? 'Você construiu a capacidade de continuar. Reviva a experiência visual da conquista e acesse as 4 fases da expansão.'
                  : 'Ao responder a última pergunta de hoje, sua interface desacelerará e revelará a expansão cósmica.'}
              </p>
            </div>
          </div>

          <button
            id="btn-trigger-day21-ceremony"
            onClick={() => setShowDay21Experience(true)}
            className="relative z-10 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F5C563] to-amber-400 text-slate-950 font-bold text-xs font-serif uppercase tracking-wider shadow-lg shadow-[#F5C563]/20 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{is100Unlocked ? 'Rever Transcendência' : 'Experiência do Dia 21'}</span>
          </button>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* ESTEIRA DOS 7 PASSOS DIÁRIOS (HORIZONTAL STEPPER)    */}
      {/* ---------------------------------------------------- */}
      <div className="bg-[#070A11]/80 border border-white/[0.06] p-3 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px] text-slate-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Orbit className="w-3.5 h-3.5 text-[#F5C563]" />
            Fluxo Diário em 7 Ordens
          </span>
          <span className="font-mono text-[11px] text-[#F5C563]">
            Pergunta {currentQuestionIndex + 1} de {totalQuestions} ({progressPercent}%)
          </span>
        </div>

        {/* 7 Step Pills */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {DAILY_FLOW_STEPS.map((s) => {
            const isCurrentStep = currentQuestion.stepNumber === s.step;
            const isCompletedStep = currentQuestion.stepNumber > s.step;
            // Encontra a primeira pergunta da etapa para permitir navegação direta
            const firstQuestionIndex = questions.findIndex(
              (q) => q.stepNumber === s.step
            );

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  if (firstQuestionIndex !== -1) {
                    changeQuestionIndex(firstQuestionIndex);
                  }
                }}
                className={`p-1.5 sm:p-2 rounded-xl text-center transition-all duration-200 flex flex-col items-center justify-center ${
                  isCurrentStep
                    ? 'bg-[#F5C563]/20 border border-[#F5C563]/60 text-[#F5C563] shadow-sm'
                    : isCompletedStep
                    ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/15'
                    : 'bg-[#0E131F]/60 border border-white/[0.04] text-slate-500 hover:text-slate-300'
                }`}
                title={`${s.step}. ${s.name}`}
              >
                <span className="text-[9px] font-mono font-bold leading-none">
                  {s.step}
                </span>
                <span className="hidden sm:inline text-[9px] font-sans truncate mt-0.5 font-medium">
                  {s.shortName}
                </span>
              </button>
            );
          })}
        </div>

        <CosmicProgress value={progressPercent} size="sm" showPercentage={false} />
      </div>

      {/* ---------------------------------------------------- */}
      {/* CARTÃO PRINCIPAL DA PERGUNTA (UMA POR VEZ)           */}
      {/* ---------------------------------------------------- */}
      <CosmicCard variant="highlight" padding="lg" className="relative space-y-6">
        {/* Header da Pergunta: Número, Categoria & Ferramentas */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F5C563]/15 border border-[#F5C563]/30 text-[#F5C563] uppercase tracking-wider">
                Passo {currentQuestion.stepNumber} de 7 •{' '}
                {currentQuestion.configuracaoVisual?.badgeLabel ||
                  currentQuestion.stepTitle}
              </span>
              {questionsInCurrentStep.length > 1 && (
                <span className="text-[11px] font-mono text-slate-400">
                  (Pergunta {currentSubIndex} de {questionsInCurrentStep.length})
                </span>
              )}
            </div>

            <h2
              className="text-lg sm:text-xl font-bold text-white tracking-wide"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {currentQuestion.texto}
            </h2>

            {currentQuestion.descricao && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentQuestion.descricao}
              </p>
            )}
          </div>

          {/* Botões de Áudio / TTS & Auto-Save Indicator */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
            {/* Auto-save status */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mr-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{isAutoSaving ? 'Salvando...' : `Salvo às ${lastSavedTime}`}</span>
            </div>

            {/* Narração por Voz */}
            <button
              onClick={toggleNarration}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                isSpeaking
                  ? 'bg-[#F5C563] text-slate-950 border-[#F5C563] animate-pulse font-bold'
                  : 'bg-[#0E131F] hover:bg-[#151D30] text-[#F5C563] border-white/[0.08]'
              }`}
              title="Ouvir orientação por voz"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Pausar' : 'Narrar'}</span>
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CORPO DA RESPOSTA ESPECÍFICA                         */}
        {/* ---------------------------------------------------- */}
        <div className="space-y-4">
          {/* 1. TELA DE ABERTURA DO DIA (Passo 1) */}
          {currentQuestion.id.startsWith('q_abertura') && (
            <div className="space-y-4 text-center py-4 sm:py-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F5C563]/10 border border-[#F5C563]/30 flex items-center justify-center text-[#F5C563]">
                <Sun className="w-8 h-8 animate-pulse" />
              </div>

              <div className="max-w-xl mx-auto space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#F5C563]">
                  Princípio Filosófico & Científico
                </span>
                <h3
                  className="text-xl sm:text-2xl font-bold text-white font-serif"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {currentQuote.concept}
                </h3>
                <blockquote className="text-sm sm:text-base text-slate-300 italic font-serif leading-relaxed px-4 py-3 bg-[#070A11]/60 rounded-xl border border-white/[0.04]">
                  "{currentQuote.quote}"
                  <footer className="text-xs font-mono text-[#F5C563] not-italic mt-2">
                    — {currentQuote.author}
                  </footer>
                </blockquote>
              </div>

              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Silencie as distrações ao seu redor. Reserve de 10 a 15 minutos para
                revisar o dia de hoje, limpar a mente e consagrar o seu propósito.
              </p>

              <div className="pt-2">
                <CosmicButton
                  variant="primary"
                  size="md"
                  onClick={() => changeQuestionIndex(currentQuestionIndex + 1)}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Iniciar Jornada de Hoje
                </CosmicButton>
              </div>
            </div>
          )}

          {/* 2. TELA DE MOMENTO DE REFLEXÃO (Passo 2) */}
          {currentQuestion.id.startsWith('q_reflexao') && (
            <div className="space-y-6 text-center py-4 sm:py-6">
              {/* Breathing Guide Widget */}
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 ${
                    breathingPhase === 'inspire'
                      ? 'scale-110 border-[#38BDF8] bg-[#38BDF8]/10 text-[#38BDF8]'
                      : breathingPhase === 'retenha'
                      ? 'scale-105 border-[#F5C563] bg-[#F5C563]/10 text-[#F5C563]'
                      : 'scale-90 border-[#818CF8] bg-[#818CF8]/10 text-[#818CF8]'
                  }`}
                >
                  <Moon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-mono uppercase font-bold tracking-wider">
                    {breathingPhase === 'inspire'
                      ? 'Inspire'
                      : breathingPhase === 'retenha'
                      ? 'Retenha'
                      : 'Expire'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">4 seg</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono mt-3">
                  Sincronize sua respiração com o círculo
                </span>
              </div>

              <div className="max-w-xl mx-auto bg-[#070A11]/80 border border-white/[0.06] p-4 sm:p-5 rounded-2xl text-left space-y-2">
                <div className="flex items-center gap-2 text-[#818CF8] text-xs font-mono uppercase tracking-wider font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Contemplação da Noite</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {currentQuote.nightReflection}
                </p>
              </div>

              <CosmicButton
                variant="primary"
                size="md"
                onClick={() => changeQuestionIndex(currentQuestionIndex + 1)}
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Prosseguir para as Perguntas do Diário
              </CosmicButton>
            </div>
          )}

          {/* 3. PERGUNTAS DO DIÁRIO: TEXTAREA (Passo 3 & Passo 5) */}
          {currentQuestion.tipoResposta === 'textarea' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Escreva sua reflexão sincera:</span>
                <button
                  type="button"
                  onClick={() => {
                    if (currentQuestion.id === 'q_worth_living') toggleVoiceInput('worthLiving');
                    else if (currentQuestion.id === 'q_world_better_idea') toggleVoiceInput('worldBetterIdea');
                    else if (currentQuestion.id === 'q_do_different') toggleVoiceInput('doDifferent');
                    else if (currentQuestion.id === 'q_inner_voice') toggleVoiceInput('innerVoice');
                  }}
                  className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-xl border transition ${
                    isListening &&
                    ((currentQuestion.id === 'q_worth_living' && activeListeningField === 'worthLiving') ||
                      (currentQuestion.id === 'q_world_better_idea' && activeListeningField === 'worldBetterIdea') ||
                      (currentQuestion.id === 'q_do_different' && activeListeningField === 'doDifferent') ||
                      (currentQuestion.id === 'q_inner_voice' && activeListeningField === 'innerVoice'))
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                      : 'bg-[#0E131F] text-slate-300 border-white/[0.08] hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-[#F5C563]" />
                  <span>
                    {isListening && activeListeningField
                      ? 'Ouvindo...'
                      : 'Falar por Voz'}
                  </span>
                </button>
              </div>

              <textarea
                value={
                  currentQuestion.id === 'q_worth_living'
                    ? entry.worthLivingAnswer
                    : currentQuestion.id === 'q_world_better_idea'
                    ? entry.worldBetterIdea || ''
                    : currentQuestion.id === 'q_do_different'
                    ? entry.doDifferentAnswer
                    : currentQuestion.id === 'q_inner_voice'
                    ? entry.innerVoiceConclusion
                    : (entry.customAnswers?.[currentQuestion.id] as string) || ''
                }
                onChange={(e) => {
                  const updated = { ...entry };
                  if (currentQuestion.id === 'q_worth_living') {
                    updated.worthLivingAnswer = e.target.value;
                  } else if (currentQuestion.id === 'q_world_better_idea') {
                    updated.worldBetterIdea = e.target.value;
                  } else if (currentQuestion.id === 'q_do_different') {
                    updated.doDifferentAnswer = e.target.value;
                  } else if (currentQuestion.id === 'q_inner_voice') {
                    updated.innerVoiceConclusion = e.target.value;
                  } else {
                    updated.customAnswers = {
                      ...(updated.customAnswers || {}),
                      [currentQuestion.id]: e.target.value,
                    };
                  }
                  triggerAutoSave(updated);
                }}
                rows={currentQuestion.configuracaoVisual?.minRows || 5}
                placeholder={
                  currentQuestion.configuracaoVisual?.placeholder ||
                  'Digite suas reflexões com total calma e profundidade...'
                }
                className="w-full bg-[#070A11]/90 border border-white/[0.1] focus:border-[#F5C563] rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#F5C563] leading-relaxed font-sans transition"
              />
            </div>
          )}

          {/* 4. PERGUNTA DE GRATIDÃO (Passo 3) */}
          {currentQuestion.tipoResposta === 'gratitude_triad' && (
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-300 block">
                Nomeie suas 3 bênçãos e conquistas do dia:
              </span>
              <div className="space-y-3">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-[#070A11]/90 border border-white/[0.08] focus-within:border-[#F5C563] p-3 rounded-2xl transition"
                  >
                    <span className="w-7 h-7 rounded-xl bg-[#F5C563]/10 border border-[#F5C563]/30 text-[#F5C563] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={entry.gratitudes[idx] || ''}
                      onChange={(e) => {
                        const updated = { ...entry };
                        const newGratitudes: [string, string, string] = [
                          entry.gratitudes[0] || '',
                          entry.gratitudes[1] || '',
                          entry.gratitudes[2] || '',
                        ];
                        newGratitudes[idx] = e.target.value;
                        updated.gratitudes = newGratitudes;
                        triggerAutoSave(updated);
                      }}
                      placeholder={`Bênção nº ${idx + 1} (Ex: O apoio sincero de alguém, a saúde da família, um momento de paz...)`}
                      className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-600 focus:outline-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVoiceInput('gratitude', idx)}
                      className="p-1.5 text-slate-400 hover:text-[#F5C563] transition"
                      title="Ditar gratidão por voz"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PERGUNTAS ESPECIAIS DE AUTOPERDÃO E PERDÃO (Passo 4) */}
          {currentQuestion.tipoResposta === 'forgiveness_recitation' && (
            <div className="space-y-4">
              <div className="bg-[#070A11]/90 border border-[#F5C563]/25 rounded-2xl p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-serif text-justify">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3 font-sans">
                  <div className="flex items-center gap-2">
                    <Feather className="w-4 h-4 text-[#F5C563]" />
                    <span className="font-bold text-xs uppercase tracking-widest text-[#F5C563]">
                      Recitação de Liberação & Desconexão
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans italic">
                    Toque no campo destacado para sincronizar seu nome
                  </span>
                </div>

                <p>
                  1. Por todas as coisas que eu mesmo me feri, me magoei, me prejudiquei, consciente
                  ou inconscientemente, sabendo o que estava fazendo, ou sem saber, eu me perdoo e
                  me liberto. Eu me aceito do jeito que eu sou.{' '}
                  <span className="text-[#F5C563] font-sans font-bold inline-flex items-center gap-1.5">
                    Eu sou{' '}
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => handleUpdateUserName(e.target.value)}
                      placeholder="(seu nome)"
                      className="bg-[#0E131F] border-b-2 border-[#F5C563] text-[#F5C563] font-sans font-bold px-2 py-0.5 rounded text-xs sm:text-sm focus:outline-none transition min-w-[140px] max-w-[220px]"
                    />
                  </span>
                </p>

                <p>
                  2. Por todas as pessoas que nesse mundo me magoaram, me ofenderam, me
                  prejudicaram de forma consciente ou inconsciente, direta ou indiretamente, eu
                  perdoo cada uma dessas pessoas. Eu me desconecto delas neste momento. Eu me perdoo.
                  Eu me liberto. Eu me aceito do jeito que sou.{' '}
                  <span className="text-[#F5C563] font-sans font-bold inline-flex items-center gap-1.5">
                    Eu sou{' '}
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => handleUpdateUserName(e.target.value)}
                      placeholder="(seu nome)"
                      className="bg-[#0E131F] border-b-2 border-[#F5C563] text-[#F5C563] font-sans font-bold px-2 py-0.5 rounded text-xs sm:text-sm focus:outline-none transition min-w-[140px] max-w-[220px]"
                    />
                  </span>
                </p>

                <p>
                  3. Por todas as pessoas nesse mundo que eu prejudiquei, magoei, ofendi, por
                  pensamentos ou palavras, gestos ou emoções, consciente ou inconscientemente, eu
                  peço perdão ao Universo. Eu peço perdão a cada uma dessas pessoas. Eu me desconecto
                  delas. Eu me aceito do jeito que eu sou.{' '}
                  <span className="text-[#F5C563] font-sans font-bold inline-flex items-center gap-1.5">
                    Eu sou{' '}
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => handleUpdateUserName(e.target.value)}
                      placeholder="(seu nome)"
                      className="bg-[#0E131F] border-b-2 border-[#F5C563] text-[#F5C563] font-sans font-bold px-2 py-0.5 rounded text-xs sm:text-sm focus:outline-none transition min-w-[140px] max-w-[220px]"
                    />
                  </span>
                </p>
              </div>

              {/* Confirmação de Leitura e Liberação */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#070A11] border border-white/[0.08]">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-200 block">
                    Confirmação de Liberação:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Li, respirei e recitei o perdão para dormir em paz nesta noite.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...entry,
                      forgivenessConfirmed: !entry.forgivenessConfirmed,
                    };
                    triggerAutoSave(updated);
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    entry.forgivenessConfirmed
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-[#0E131F] text-slate-300 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{entry.forgivenessConfirmed ? 'Realizado ✓' : 'Marcar como Concluído'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 6. PLANEJAMENTO DO DIA SEGUINTE: 6 AÇÕES (Passo 6) */}
          {currentQuestion.tipoResposta === 'commitments_list' && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">
                As 6 ações que você se compromete a realizar amanhã:
              </span>
              <div className="space-y-2.5">
                {entry.commitments.slice(0, 6).map((task, idx) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 bg-[#070A11]/90 border border-white/[0.08] focus-within:border-[#F5C563] p-2.5 rounded-xl transition"
                  >
                    <span className="w-6 h-6 rounded-lg bg-[#F5C563]/10 border border-[#F5C563]/30 text-[#F5C563] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={task.text}
                      onChange={(e) => {
                        const updated = { ...entry };
                        updated.commitments[idx].text = e.target.value;
                        triggerAutoSave(updated);
                      }}
                      placeholder={`Ação prioritária nº ${idx + 1}...`}
                      className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-600 focus:outline-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVoiceInput('task', idx)}
                      className="p-1.5 text-slate-400 hover:text-[#F5C563] transition"
                      title="Falar esta ação"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PLANEJAMENTO: NOTA 0-10 & JUSTIFICATIVA (Passo 6) */}
          {currentQuestion.tipoResposta === 'scale_and_reason' && (
            <div className="space-y-5 bg-[#070A11]/60 border border-white/[0.06] p-4 sm:p-5 rounded-2xl">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-200">
                    Escala de impacto esperado (0 a 10):
                  </label>
                  <div className="flex items-center gap-1 flex-wrap">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          const updated = { ...entry, commitmentScore: val };
                          triggerAutoSave(updated);
                        }}
                        className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center ${
                          entry.commitmentScore === val
                            ? 'bg-[#F5C563] text-slate-950 shadow-md scale-105'
                            : 'bg-[#0E131F] border border-white/[0.08] text-slate-400 hover:border-[#F5C563]/50 hover:text-white'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Justifique sua nota:</span>
                  <button
                    type="button"
                    onClick={() => toggleVoiceInput('commitmentReason')}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-[#F5C563]"
                  >
                    <Mic className="w-3 h-3 text-[#F5C563]" />
                    <span>Ditar justificativa</span>
                  </button>
                </div>
                <textarea
                  value={entry.commitmentReason}
                  onChange={(e) => {
                    const updated = { ...entry, commitmentReason: e.target.value };
                    triggerAutoSave(updated);
                  }}
                  rows={3}
                  placeholder="Justifique: o quanto você acredita que estas ações contribuirão para um dia produtivo amanhã..."
                  className="w-full bg-[#0E131F] border border-white/[0.08] focus:border-[#F5C563] rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none font-sans"
                />
              </div>
            </div>
          )}

          {/* 8. CONCLUSÃO DO DIA: SÍNTESE & CONSAGRAÇÃO (Passo 7) */}
          {currentQuestion.id.startsWith('q_conclusao') && (
            <div className="space-y-6">
              {/* Consolidated Summary Preview */}
              <div className="bg-[#070A11]/80 border border-white/[0.08] p-4 sm:p-5 rounded-2xl space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#F5C563] font-bold">
                    Resumo Consolidado do Dia {selectedDay}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0E131F] hover:bg-[#151D30] border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white transition"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Diário</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2 text-slate-300 font-sans">
                  <div>
                    <span className="text-slate-500 font-mono text-[11px] block">
                      POR QUE VALEU A PENA:
                    </span>
                    <p className="italic text-slate-200">
                      {entry.worthLivingAnswer || 'Ainda não respondido.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-mono text-[11px] block">
                      AS 6 AÇÕES DE AMANHÃ:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-200">
                      {entry.commitments
                        .filter((c) => c.text.trim())
                        .map((c, i) => (
                          <li key={i}>{c.text}</li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-slate-500 font-mono text-[11px] block">
                      GRATIDÕES REGISTRADAS:
                    </span>
                    <p className="text-slate-200">
                      {entry.gratitudes.filter(Boolean).join(' • ') || 'Nenhuma gratidão registrada.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ritual Closing Note */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F5C563]/10 via-[#070A11] to-[#F5C563]/10 border border-[#F5C563]/30 text-center space-y-2">
                <span
                  className="text-sm sm:text-base font-bold tracking-widest text-[#F5C563] font-serif uppercase block"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  BOA NOITE... DURMA EM PAZ!
                </span>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  Potencializamos os fatos bons e maravilhosos do dia. Permitimo-nos dar a eles um
                  novo significado e transformá-los em aprendizados. Declaramos, planejamos,
                  agimos e agradecemos.
                </p>
              </div>

              {/* Big Action: Concluir o Dia */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <CosmicButton
                  variant="primary"
                  size="lg"
                  onClick={handleCompleteDay}
                  iconLeft={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                >
                  {entry.completed
                    ? `Dia ${selectedDay} Já Concluído (Atualizar)`
                    : `Concluir o Dia ${selectedDay} e Avançar`}
                </CosmicButton>
              </div>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* CONTROLES DE NAVEGAÇÃO ENTRE PERGUNTAS (PASSOS)     */}
        {/* ---------------------------------------------------- */}
        <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
          <CosmicButton
            variant="outline"
            size="sm"
            onClick={() => changeQuestionIndex(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            iconLeft={<ChevronLeft className="w-4 h-4" />}
          >
            Pergunta Anterior
          </CosmicButton>

          <div className="flex items-center gap-2">
            {currentQuestionIndex < totalQuestions - 1 ? (
              <CosmicButton
                variant="primary"
                size="md"
                onClick={() => changeQuestionIndex(currentQuestionIndex + 1)}
                iconRight={<ChevronRight className="w-4 h-4" />}
              >
                Próxima Pergunta
              </CosmicButton>
            ) : (
              <CosmicButton
                variant="primary"
                size="md"
                onClick={handleCompleteDay}
                iconLeft={<CheckCircle2 className="w-4 h-4" />}
              >
                Concluir Dia {selectedDay}
              </CosmicButton>
            )}
          </div>
        </div>
      </CosmicCard>

      {/* ---------------------------------------------------- */}
      {/* MODAL / DIALOG DE CELEBRAÇÃO DO DIA CONCLUÍDO        */}
      {/* ---------------------------------------------------- */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#070A11] border border-[#F5C563]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#F5C563] font-bold">
                Jornada Inicial de 21 Dias
              </span>
              <h3
                className="text-xl sm:text-2xl font-bold text-white font-serif uppercase"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Dia {selectedDay} Concluído!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Você concluiu todas as 7 ordens do seu diário noturno com constância e
                clareza atômica.
              </p>
            </div>

            {/* Streak card */}
            <div className="p-3.5 rounded-2xl bg-[#0E131F] border border-white/[0.08] flex items-center justify-around">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block font-mono">Constância</span>
                <span className="text-lg font-bold text-[#F5C563] font-mono flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4" /> {selectedDay} {selectedDay === 1 ? 'dia' : 'dias'}
                </span>
              </div>
              <div className="w-px h-8 bg-white/[0.08]" />
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block font-mono">Fase Atual</span>
                <span className="text-xs font-bold text-white font-mono">
                  <EvolutionBadge day={selectedDay} />
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2 pt-2">
              {selectedDay < maxAllowedDay ? (
                <CosmicButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    const next = selectedDay + 1;
                    setSelectedDay(next);
                    onNavigateDay?.(next);
                    setShowCompletionModal(false);
                  }}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Ir para o Dia {selectedDay + 1}
                </CosmicButton>
              ) : (
                <CosmicButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setShowCompletionModal(false);
                    onNavigateTab?.('jornada');
                  }}
                >
                  Ver Jornada Completa Finalizada!
                </CosmicButton>
              )}

              <CosmicButton
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => setShowCompletionModal(false)}
              >
                Permanecer no Dia {selectedDay}
              </CosmicButton>
            </div>
          </div>
        </div>
      )}

      {/* EXPERIÊNCIA ESPECIAL DE CONCLUSÃO DO DIA 21 — TRANSCENDÊNCIA */}
      {showDay21Experience && (
        <Day21CompletionExperience
          userName={userName}
          soundEnabled={profile.soundEnabled}
          onStartExpansion={handleStartExpansion}
          onStayOnDay21={() => setShowDay21Experience(false)}
        />
      )}
    </div>
  );
};
