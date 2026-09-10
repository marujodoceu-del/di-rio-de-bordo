import React, { useState } from 'react';
import { DailyJournalEntry, AppTab } from '../../types';
import { COSMIC_DAY_QUOTES } from '../../data/cosmicQuotes';
import {
  CosmicCard,
  CosmicButton,
  EvolutionBadge,
  getEvolutionStageForDay,
} from '../../design-system';
import {
  History,
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  Feather,
  Orbit,
  ArrowRight,
} from 'lucide-react';

interface HistoryViewProps {
  entries: Record<number, DailyJournalEntry>;
  onNavigate: (tab: AppTab) => void;
  onSelectDay: (day: number) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  entries,
  onNavigate,
  onSelectDay,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [copiedDay, setCopiedDay] = useState<number | null>(null);

  const registeredDays = (Object.values(entries) as DailyJournalEntry[]).filter(
    (e: DailyJournalEntry) =>
      e.completed ||
      Boolean(e.worthLivingAnswer?.trim()) ||
      Boolean(e.innerVoiceConclusion?.trim()) ||
      e.commitments.some((c) => c.text.trim())
  );

  const filteredDays = registeredDays.filter((entry) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      entry.worthLivingAnswer?.toLowerCase().includes(term) ||
      entry.doDifferentAnswer?.toLowerCase().includes(term) ||
      entry.innerVoiceConclusion?.toLowerCase().includes(term) ||
      entry.gratitudes?.some((g) => g.toLowerCase().includes(term)) ||
      entry.commitments?.some((c) => c.text.toLowerCase().includes(term)) ||
      `dia ${entry.dayNumber}`.includes(term)
    );
  });

  const handleCopySummary = (entry: DailyJournalEntry) => {
    const summary = `MÉTODO ATÔMICO — DIÁRIO DE BORDO (DIA ${entry.dayNumber})
Data: ${entry.date}

1. POR QUE VALEU A PENA:
${entry.worthLivingAnswer || 'Não preenchido'}

2. O QUE FARIA DE DIFERENTE:
${entry.doDifferentAnswer || 'Não preenchido'}

3. SEIS AÇÕES COMPROMISSADAS:
${entry.commitments
  .filter((c) => c.text.trim())
  .map((c, i) => `${i + 1}. [${c.completed ? 'X' : ' '}] ${c.text}`)
  .join('\n')}

4. GRATIDÃO & BÊNÇÃOS:
${entry.gratitudes.filter((g) => g.trim()).map((g, i) => `${i + 1}. ${g}`).join('\n')}

5. APRENDIZADOS & VOZ INTERIOR:
${entry.innerVoiceConclusion || 'Não preenchido'}
`;

    navigator.clipboard.writeText(summary);
    setCopiedDay(entry.dayNumber);
    setTimeout(() => setCopiedDay(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn pb-24">
      {/* Top Header */}
      <CosmicCard variant="accent" padding="lg">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F5C563]/15 border border-[#F5C563]/30 text-[#F5C563] uppercase tracking-widest flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  MEMÓRIA & EVOLUÇÃO
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-white tracking-wide uppercase font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Meu Histórico de Diários
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Revise suas reflexões, aprendizados e compromissos registrados ao longo da jornada.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar em respostas..."
                className="w-full bg-[#070A11] border border-white/[0.10] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#F5C563]/60 focus:ring-1 focus:ring-[#F5C563]/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>{registeredDays.length} diários com registros encontrados</span>
            {searchTerm && <span>• Filtrando por &ldquo;{searchTerm}&rdquo;</span>}
          </div>
        </div>
      </CosmicCard>

      {/* Days List Accordion */}
      {filteredDays.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300 font-serif uppercase">
            Nenhum registro encontrado
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchTerm
              ? 'Tente buscar com outros termos.'
              : 'Você ainda não preencheu nenhuma pergunta. Comece preenchendo o Diário do Dia 1.'}
          </p>
          <button
            onClick={() => {
              onSelectDay(1);
              onNavigate('diario');
            }}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition"
          >
            <span>Abrir Meu Diário</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDays.map((entry) => {
            const isExpanded = expandedDay === entry.dayNumber;
            const quote = COSMIC_DAY_QUOTES[entry.dayNumber - 1] || COSMIC_DAY_QUOTES[0];
            const completedTasks = entry.commitments.filter((t) => t.completed).length;
            const totalTasks = entry.commitments.filter((t) => t.text.trim()).length;

            return (
              <div
                key={entry.dayNumber}
                className="bg-[#070A11] border border-white/[0.08] rounded-3xl overflow-hidden shadow-md transition duration-200"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedDay(isExpanded ? null : entry.dayNumber)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#0C101A] select-none transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-xl bg-[#F5C563]/10 border border-[#F5C563]/30 text-[#F5C563] shrink-0">
                      DIA {entry.dayNumber}
                    </span>
                    <EvolutionBadge day={entry.dayNumber} />
                    <div>
                      <h3 className="font-bold text-sm text-white font-serif uppercase tracking-wider">
                        {quote.concept}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Data: {entry.date} • {totalTasks > 0 ? `${completedTasks}/${totalTasks} ações realizadas` : 'Reflexões salvas'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <CosmicButton
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDay(entry.dayNumber);
                        onNavigate('diario');
                      }}
                    >
                      Editar Diário
                    </CosmicButton>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopySummary(entry);
                      }}
                      className="p-2 rounded-xl bg-[#0E131F] hover:bg-[#141B2D] text-slate-300 hover:text-white border border-white/[0.08] transition"
                      title="Copiar texto consolidado"
                    >
                      {copiedDay === entry.dayNumber ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <div className="p-1 rounded-lg bg-[#0E131F] text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t border-slate-800 bg-slate-950/60 space-y-6 animate-fadeIn">
                    {/* 1. Por que valeu a pena */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wide font-mono">
                        1. Por que valeu a pena viver o dia de hoje?
                      </span>
                      <p className="text-sm text-slate-200 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
                        {entry.worthLivingAnswer || <em className="text-slate-600">Sem resposta registrada.</em>}
                      </p>
                    </div>

                    {/* 1.1 Ideia Dia 1 */}
                    {entry.dayNumber === 1 && entry.worldBetterIdea && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wide font-mono">
                          1.1. Ideia para contribuir para um mundo melhor:
                        </span>
                        <p className="text-sm text-slate-200 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
                          {entry.worldBetterIdea}
                        </p>
                      </div>
                    )}

                    {/* 2. O que faria diferente */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wide font-mono">
                        2. Se pudesse voltar no tempo, o que faria diferente?
                      </span>
                      <p className="text-sm text-slate-200 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
                        {entry.doDifferentAnswer || <em className="text-slate-600">Sem resposta registrada.</em>}
                      </p>
                    </div>

                    {/* 3. Seis Ações */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wide font-mono">
                          3. Seis ações compromissadas:
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Nota de confiança: {entry.commitmentScore}/10
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {entry.commitments
                          .filter((t) => t.text.trim())
                          .map((task, idx) => (
                            <div
                              key={task.id}
                              className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                                task.completed
                                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-300'
                              }`}
                            >
                              <span className="font-mono font-bold text-amber-400">0{idx + 1}.</span>
                              <span className={task.completed ? 'line-through opacity-80' : ''}>
                                {task.text}
                              </span>
                              {task.completed && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
                              )}
                            </div>
                          ))}
                      </div>
                      {entry.commitmentReason && (
                        <p className="text-xs text-slate-400 italic pt-1">
                          Justificativa (3.1): &ldquo;{entry.commitmentReason}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* 4. Gratidões */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wide font-mono">
                        4. Três bênçãos e acontecimentos de gratidão:
                      </span>
                      <div className="space-y-1.5">
                        {entry.gratitudes
                          .filter((g) => g.trim())
                          .map((gratitude, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                            >
                              <span className="font-mono font-bold text-amber-400">0{idx + 1}.</span>
                              <span>{gratitude}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* 5. Aprendizados e Conclusão */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wide font-mono">
                        5. Conclusão & Aprendizados (Voz Interior):
                      </span>
                      <p className="text-sm text-slate-200 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
                        {entry.innerVoiceConclusion || <em className="text-slate-600">Sem resposta registrada.</em>}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
