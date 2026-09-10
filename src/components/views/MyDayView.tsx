import React, { useState, useEffect, useCallback } from 'react';
import { DailyJournalEntry, AppTab, CommitmentTask } from '../../types';
import { storageService } from '../../services/storageService';
import { COSMIC_DAY_QUOTES } from '../../data/cosmicQuotes';
import {
  CosmicCard,
  CosmicButton,
  CosmicProgress,
  EvolutionBadge,
} from '../../design-system';
import {
  CheckSquare,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  FileEdit,
  Award,
  X,
  Calendar,
  Layers,
} from 'lucide-react';

interface MyDayViewProps {
  currentDay: number;
  onNavigate: (tab: AppTab) => void;
  onSelectDay: (day: number) => void;
}

export const MyDayView: React.FC<MyDayViewProps> = ({
  currentDay,
  onNavigate,
  onSelectDay,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(currentDay);
  const [tasks, setTasks] = useState<CommitmentTask[]>(() =>
    storageService.getCommitmentsForDay(currentDay)
  );
  const [entry, setEntry] = useState<DailyJournalEntry>(() =>
    storageService.getEntryForDay(currentDay)
  );
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  // Recarrega compromissos e entrada do dia selecionado
  const reloadData = useCallback(() => {
    const loadedTasks = storageService.getCommitmentsForDay(selectedDay);
    setTasks(loadedTasks);
    setEntry(storageService.getEntryForDay(selectedDay));
  }, [selectedDay]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Sincroniza em tempo real com mudanças do storage
  useEffect(() => {
    const handleStorageUpdate = () => {
      reloadData();
    };
    window.addEventListener('metodo_atomico_update', handleStorageUpdate);
    return () => window.removeEventListener('metodo_atomico_update', handleStorageUpdate);
  }, [reloadData]);

  const handleToggleTask = (taskId: string) => {
    storageService.toggleCommitment(selectedDay, taskId);
    setTasks(storageService.getCommitmentsForDay(selectedDay));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    storageService.addCommitmentToDay(selectedDay, newTaskText.trim());
    setTasks(storageService.getCommitmentsForDay(selectedDay));
    setNewTaskText('');
    setIsAddingTask(false);
  };

  const quote = COSMIC_DAY_QUOTES[selectedDay - 1] || COSMIC_DAY_QUOTES[0];
  const activeTasks = tasks.filter((t) => t.text && t.text.trim().length > 0);
  const completedTasks = activeTasks.filter((t) => t.completed).length;
  const totalTasks = activeTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Informações da noite anterior (confiança e motivo)
  const prevDayEntry = selectedDay > 1 ? storageService.getEntryForDay(selectedDay - 1) : null;
  const confidenceScore = prevDayEntry?.commitmentScore || entry.commitmentScore;
  const confidenceReason = prevDayEntry?.commitmentReason || entry.commitmentReason;

  const formatCompletedTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return `${d.getHours().toString().padStart(2, '0')}:${d
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn pb-24">
      {/* Top Header Card */}
      <CosmicCard variant="accent" padding="lg">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F5C563]/15 border border-[#F5C563]/30 text-[#F5C563] uppercase tracking-widest flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  EXECUÇÃO DIÁRIA DO MÉTODO
                </span>
                <EvolutionBadge day={selectedDay} />
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-white tracking-wide uppercase font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Meu Dia • Ações & Compromissos
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Compromissos definidos no Diário da noite anterior para transformar intenções em realidade hoje.
              </p>
            </div>

            {/* Day Selector */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs text-slate-400 font-mono">Visualizar:</span>
              <select
                value={selectedDay}
                onChange={(e) => {
                  const d = Number(e.target.value);
                  setSelectedDay(d);
                  onSelectDay(d);
                }}
                className="bg-[#070A11] border border-[#F5C563]/50 text-[#F5C563] font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F5C563] font-mono cursor-pointer"
              >
                {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Dia {d} de 21
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Metric Widget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#070A11] border border-white/[0.06] p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Progresso do Dia</span>
                <span className="font-mono text-[#F5C563] font-bold">{progressPercent}%</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {completedTasks} de {totalTasks}
                </span>
                <span className="text-xs text-slate-400 font-sans">concluídos</span>
              </div>
              <div className="mt-3">
                <CosmicProgress value={progressPercent} showPercentage={false} size="sm" />
              </div>
            </div>

            <div className="bg-[#070A11] border border-white/[0.06] p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Confiança Declarada</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-[#F5C563]">
                  {confidenceScore || 10}/10
                </span>
                <span className="text-xs text-slate-400 font-sans">
                  {confidenceScore && confidenceScore >= 8 ? 'Alta convicção' : 'Foco em execução'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 truncate">
                {confidenceReason ? `"${confidenceReason}"` : 'Compromisso inabalável'}
              </p>
            </div>

            <div className="bg-[#070A11] border border-white/[0.06] p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Conceito do Dia</span>
              <h4
                className="text-sm font-bold text-white uppercase font-serif mt-1 truncate"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {quote.concept}
              </h4>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 italic">
                &ldquo;{quote.quote}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </CosmicCard>

      {/* Action Checklist Container */}
      <CosmicCard variant="default" padding="lg">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <h2
                className="text-lg sm:text-xl font-bold text-white tracking-wide uppercase font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Meus Compromissos de Hoje • Dia {selectedDay}
              </h2>
              <p className="text-xs text-slate-400">
                {totalTasks > 0
                  ? `${completedTasks} de ${totalTasks} compromissos concluídos. Toque na caixa de seleção para registrar a realização.`
                  : 'Nenhum compromisso registrado para hoje ainda.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <CosmicButton
                variant="outline"
                size="sm"
                onClick={() => setIsAddingTask(true)}
                iconLeft={<Plus className="w-3.5 h-3.5 text-[#F5C563]" />}
              >
                Adicionar Ação
              </CosmicButton>

              <CosmicButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  // Se os compromissos de hoje vieram do diário anterior, navega para o diário anterior
                  const targetDiaryDay = selectedDay > 1 ? selectedDay - 1 : selectedDay;
                  onSelectDay(targetDiaryDay);
                  onNavigate('diario');
                }}
                iconLeft={<FileEdit className="w-3.5 h-3.5 text-[#F5C563]" />}
              >
                Editar no Diário
              </CosmicButton>
            </div>
          </div>

          {/* Form para Adicionar Ação Rápida */}
          {isAddingTask && (
            <form
              onSubmit={handleAddTask}
              className="p-4 rounded-2xl bg-[#070A11] border border-[#F5C563]/50 space-y-3 animate-fadeIn"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 text-[#F5C563]">
                  <Plus className="w-3.5 h-3.5" />
                  Nova Ação para o Dia {selectedDay}:
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="text-slate-500 hover:text-slate-300 text-xs p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                autoFocus
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Ex.: Treinar musculação, estudar 30 min..."
                className="w-full bg-[#0E131F] border border-white/[0.12] rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#F5C563]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#F5C563] text-slate-950 text-xs font-bold shadow hover:bg-amber-300 transition"
                >
                  Salvar Ação
                </button>
              </div>
            </form>
          )}

          {/* Tasks List */}
          {activeTasks.length === 0 ? (
            <div className="text-center py-12 space-y-4 bg-[#070A11]/60 rounded-2xl border border-dashed border-white/[0.08] p-6">
              <CheckSquare className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3
                  className="text-base font-bold text-slate-200 uppercase font-serif"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Nenhum compromisso registrado para o Dia {selectedDay}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Os compromissos de hoje são planejados no Diário de Bordo da noite anterior (Etapa 6: Planejamento do Dia Seguinte). Você também pode adicionar ações diretamente agora.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5C563] text-slate-950 text-xs font-bold hover:bg-amber-300 transition shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Ação Rápida</span>
                </button>

                <button
                  onClick={() => {
                    const targetDay = selectedDay > 1 ? selectedDay - 1 : selectedDay;
                    onSelectDay(targetDay);
                    onNavigate('diario');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E131F] border border-white/[0.10] text-slate-200 text-xs font-medium hover:bg-[#141B2D] transition"
                >
                  <Sparkles className="w-4 h-4 text-[#F5C563]" />
                  <span>Planejar no Diário (Dia {selectedDay > 1 ? selectedDay - 1 : selectedDay})</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task, idx) => {
                const isInherited = task.originDayNumber && task.originDayNumber !== selectedDay;
                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`group cursor-pointer flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 select-none ${
                      task.completed
                        ? 'bg-[#070A11]/60 border-emerald-500/20 text-slate-400'
                        : 'bg-[#070A11] hover:bg-[#0C101A] border-white/[0.08] hover:border-[#F5C563]/40 text-slate-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      {/* Checkbox button */}
                      <button
                        type="button"
                        aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition ${
                          task.completed
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'border border-white/[0.2] group-hover:border-[#F5C563] text-transparent'
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs font-bold text-[#F5C563] shrink-0">
                            0{idx + 1}.
                          </span>
                          <span
                            className={`text-sm leading-relaxed transition ${
                              task.completed
                                ? 'line-through text-slate-500 font-sans'
                                : 'text-slate-100 font-medium font-sans'
                            }`}
                          >
                            {task.text}
                          </span>
                        </div>

                        {/* Sub-meta: Origin & Timestamp */}
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-mono">
                          {isInherited ? (
                            <span>Definido no Diário do Dia {task.originDayNumber}</span>
                          ) : (
                            <span>Ação direta de hoje</span>
                          )}
                          {task.completed && task.completedAt && (
                            <span>• Concluído às {formatCompletedTime(task.completedAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-full shrink-0 ml-3 flex items-center gap-1.5 ${
                        task.completed
                          ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                          : 'bg-slate-800/80 text-slate-400 border border-white/[0.06]'
                      }`}
                    >
                      {task.completed ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Concluída</span>
                        </>
                      ) : (
                        <span>Pendente</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Celebration Card when 100% completed */}
          {progressPercent === 100 && totalTasks > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-300">
                    Parabéns! Todos os compromissos do Dia {selectedDay} foram concluídos!
                  </h4>
                  <p className="text-xs text-emerald-200/80">
                    Você cumpriu 100% das suas ações atômicas planejadas. Esta noite no Diário de Bordo será um momento de profunda consolidação.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectDay(selectedDay);
                  onNavigate('diario');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 hover:bg-emerald-300 transition"
              >
                Fazer Diário Noturno
              </button>
            </div>
          )}

          {/* Bottom Shortcut to Night Diary */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F5C563]" />
              Ao término do dia, responda o Diário de Bordo para consolidar os aprendizados.
            </span>
            <button
              onClick={() => {
                onSelectDay(selectedDay);
                onNavigate('diario');
              }}
              className="flex items-center gap-1.5 text-[#F5C563] font-bold hover:underline"
            >
              <span>Ir para o Diário Noturno (Dia {selectedDay})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </CosmicCard>
    </div>
  );
};
