import React, { useState, useEffect } from 'react';
import { DailyJournalEntry, AppTab } from '../../types';
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
  Orbit,
  Calendar,
  Award,
  Clock,
  Target,
  FileEdit,
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
  const [entry, setEntry] = useState<DailyJournalEntry>(() =>
    storageService.getEntryForDay(currentDay)
  );
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  useEffect(() => {
    setEntry(storageService.getEntryForDay(selectedDay));
  }, [selectedDay]);

  // Atualizar quando houver evento de storage
  useEffect(() => {
    const handleUpdate = () => {
      setEntry(storageService.getEntryForDay(selectedDay));
    };
    window.addEventListener('metodo_atomico_update', handleUpdate);
    return () => window.removeEventListener('metodo_atomico_update', handleUpdate);
  }, [selectedDay]);

  const handleToggleTask = (taskId: string) => {
    const updated = storageService.toggleDayTask(selectedDay, taskId);
    setEntry({ ...updated });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const updated = storageService.addTaskToDay(selectedDay, newTaskText.trim());
    setEntry({ ...updated });
    setNewTaskText('');
    setIsAddingTask(false);
  };

  const quote = COSMIC_DAY_QUOTES[selectedDay - 1] || COSMIC_DAY_QUOTES[0];
  const activeTasks = entry.commitments.filter((t) => t.text.trim().length > 0);
  const completedTasks = activeTasks.filter((t) => t.completed).length;
  const totalTasks = activeTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
                As ações compromissadas ontem à noite no Diário de Bordo para construir um dia atômico hoje.
              </p>
            </div>

            {/* Day Selector */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <select
                value={selectedDay}
                onChange={(e) => {
                  const d = Number(e.target.value);
                  setSelectedDay(d);
                  onSelectDay(d);
                }}
                className="bg-[#070A11] border border-[#F5C563]/50 text-[#F5C563] font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#F5C563] font-mono"
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
              <span className="text-xs text-slate-400 font-medium">Progresso das Ações</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {completedTasks} / {totalTasks || 6}
                </span>
                <span className="text-xs font-mono text-[#F5C563] font-bold">({progressPercent}%)</span>
              </div>
              <div className="mt-3">
                <CosmicProgress value={progressPercent} showPercentage={false} size="sm" />
              </div>
            </div>

            <div className="bg-[#070A11] border border-white/[0.06] p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Confiança Declarada</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-[#F5C563]">
                  {entry.commitmentScore} <span className="text-xs text-slate-400">/ 10</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-2">
                {entry.commitmentReason || 'Calibrado no ritual noturno'}
              </p>
            </div>

            <div className="bg-[#070A11] border border-white/[0.06] p-4 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Princípio Cósmico</span>
              <div className="text-xs font-serif italic text-slate-200 mt-1 line-clamp-2">
                &ldquo;{quote.concept}&rdquo;
              </div>
              <span className="text-[10px] text-[#F5C563] font-mono mt-2">
                — {quote.author}
              </span>
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
                Lista de Ações do Dia {selectedDay}
              </h2>
              <p className="text-xs text-slate-400">
                Clique em cada ação à medida que for realizando ao longo do dia.
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
                onClick={() => onNavigate('diario')}
                iconLeft={<FileEdit className="w-3.5 h-3.5 text-[#F5C563]" />}
              >
                Editar no Diário
              </CosmicButton>
            </div>
          </div>

        {/* Modal / Form para Adicionar Ação Complementar */}
        {isAddingTask && (
          <form
            onSubmit={handleAddTask}
            className="p-4 rounded-2xl bg-slate-950 border border-amber-400/40 space-y-3 animate-fadeIn"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Nova Ação Complementar:</span>
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="text-slate-500 hover:text-slate-300 text-xs"
              >
                Cancelar
              </button>
            </div>
            <input
              type="text"
              autoFocus
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Digite a ação a ser realizada hoje..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
            />
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold shadow hover:bg-amber-300"
              >
                Salvar Ação
              </button>
            </div>
          </form>
        )}

        {/* Tasks List */}
        {activeTasks.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 p-6">
            <CheckSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300 uppercase font-serif">
              Nenhuma ação compromissada para este dia ainda
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Abra o Diário de Bordo do Dia {selectedDay} para responder às perguntas noturnas e definir suas 6 ações.
            </p>
            <button
              onClick={() => onNavigate('diario')}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Definir Ações no Diário</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTasks.map((task, idx) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`group cursor-pointer flex items-center justify-between p-4 rounded-2xl border transition-all select-none ${
                  task.completed
                    ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                    : 'bg-slate-950/90 hover:bg-slate-950 border-slate-700/80 hover:border-amber-400/50 text-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition ${
                      task.completed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'border border-slate-600 group-hover:border-amber-400 text-transparent'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="font-mono text-xs font-bold text-amber-400/80 shrink-0">
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
                </div>

                <span
                  className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full shrink-0 ml-3 ${
                    task.completed
                      ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {task.completed ? 'Concluída' : 'Pendente'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Motivation Card when 100% completed */}
        {progressPercent === 100 && totalTasks > 0 && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-300">
                  Parabéns! Todas as ações do Dia {selectedDay} foram concluídas!
                </h4>
                <p className="text-xs text-emerald-200/80">
                  Você cumpriu 100% dos seus compromissos atômicos. Esta noite no Diário será um momento de profunda celebração.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('diario')}
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
            onClick={() => onNavigate('diario')}
            className="flex items-center gap-1.5 text-[#F5C563] font-bold hover:underline"
          >
            <span>Ir para o Diário Noturno</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        </div>
      </CosmicCard>
    </div>
  );
};
