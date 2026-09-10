export type ThemeMode = 'vibrant' | 'monochrome';

export type ViewMode = 'all' | 'single' | 'spread';

export type CoverArtStyle =
  | 'metodo-atomico' // Capa Padrão Maru Coach - Método Atômico (anexada pelo usuário)
  | 'coachee-archetype' // Capa temática do arquétipo/profissão do coachee (ex: Padeiro)
  | 'cosmic-vibrant' // Capa Cósmica Profunda clássica
  | 'celestial-bw' // Capa P&B Gravura Científica
  | 'custom-upload'; // Arte personalizada enviada pelo usuário

export type CoacheeProfessionPreset =
  | 'padeiro' // Padeiro / Panificação & Alimentos
  | 'medico-saude' // Medicina & Saúde
  | 'engenheiro-tech' // Engenharia & Tecnologia
  | 'professor-educador' // Educação & Filosofia
  | 'empresario-lider' // Negócios & Liderança
  | 'atleta-esporte' // Atleta & Performance Física
  | 'artista-criativo' // Arte & Design
  | 'personalizado'; // Customizado livremente

export type AccentColorPalette =
  | 'cosmic-amber' // Âmbar Cósmico (Padrão Maru Coach)
  | 'bakery-gold' // Trigo & Forno / Padeiro Artesanal
  | 'emerald-vitality' // Esmeralda Vital / Saúde & Natureza
  | 'sapphire-depth' // Safira Noturno / Foco & Mente
  | 'ruby-drive' // Rubi & Força / Disciplina & Energia
  | 'classic-monochrome'; // Preto & Branco Gráfica

export interface CoachProfile {
  name: string;
  title: string;
  credentials: string;
  coacheeName: string;
  startDate: string;
  endDate: string;
  customDedication: string;
  includeSpiralMargin: boolean;
  paperSize: 'A5' | 'A4';
  
  // Customização de Coachee & Estilos Adicionais
  coacheeProfession?: string;
  coacheeProfessionPreset?: CoacheeProfessionPreset;
  coacheeInterests?: string;
  coacheeMetaphor?: string;
  accentPalette?: AccentColorPalette;
  coverArtStyle?: CoverArtStyle;
  customCoverDataUrl?: string;
}

export interface CosmicDayQuote {
  day: number;
  concept: string; // e.g., "Inércia e Movimento", "Poeira de Estrelas", "Gravidade dos Hábitos"
  quote: string;
  author: string;
  nightReflection: string;
}

export type AppTab =
  | 'inicio'
  | 'diario'
  | 'dia'
  | 'jornada'
  | 'historico'
  | 'imprimir'
  | 'perfil';

export type CommitmentStatus = 'pendente' | 'concluido';

export interface CommitmentTask {
  id: string;
  text: string;
  completed: boolean;
  status?: CommitmentStatus;
  plannedDate?: string; // Data planejada (ex: YYYY-MM-DD do dia seguinte)
  originDayNumber?: number; // Dia de origem do Diário (ex: Dia 1 planejou para o Dia 2)
  targetDayNumber?: number; // Dia alvo em que a ação deve ser executada
  completedAt?: string; // Data/hora da conclusão (ISO string)
}

// ==========================================
// ESTRUTURA FLEXÍVEL DE PERGUNTAS & FLUXO DIÁRIO
// ==========================================

export type QuestionResponseType =
  | 'text'
  | 'textarea'
  | 'commitments_list'
  | 'scale_and_reason'
  | 'gratitude_triad'
  | 'forgiveness_recitation'
  | 'info_screen';

export type QuestionCategory =
  | 'abertura'
  | 'momento_reflexao'
  | 'diario'
  | 'autoperdao'
  | 'reflexao_final'
  | 'planejamento'
  | 'conclusao';

export interface QuestionVisualConfig {
  accentColor?: string; // e.g. '#F5C563'
  badgeLabel?: string; // e.g. 'REFLETIR', 'DECIDIR'
  iconName?: string; // e.g. 'Sun', 'Moon', 'Feather', 'Sparkles'
  layoutVariant?: 'default' | 'card' | 'centered' | 'ritual';
  placeholder?: string;
  minRows?: number;
}

export interface JournalQuestion {
  id: string;
  texto: string;
  descricao?: string;
  tipoResposta: QuestionResponseType;
  categoria: QuestionCategory;
  stepNumber: number; // 1 a 7 do fluxo diário
  stepTitle: string; // Título da etapa (ex: "1. ABERTURA DO DIA")
  dia?: number; // Se definido, específico deste dia (ex: dia 1 pergunta 1.1)
  audioUrl?: string; // áudio opcional
  narracaoTexto?: string; // narração opcional para TTS
  configuracaoVisual?: QuestionVisualConfig; // configuração visual especial
}

export interface DailyFlowStepInfo {
  step: number;
  id: QuestionCategory;
  name: string;
  shortName: string;
  description: string;
}

export const DAILY_FLOW_STEPS: DailyFlowStepInfo[] = [
  { step: 1, id: 'abertura', name: 'Abertura do Dia', shortName: 'Abertura', description: 'Conceito cósmico e citação do dia' },
  { step: 2, id: 'momento_reflexao', name: 'Momento de Reflexão', shortName: 'Reflexão', description: 'Respiração profunda e contemplação noturna' },
  { step: 3, id: 'diario', name: 'Perguntas do Diário', shortName: 'Diário', description: 'Significado, aprendizado atômico e gratidões' },
  { step: 4, id: 'autoperdao', name: 'Autoperdão e Perdão', shortName: 'Autoperdão', description: 'Liberação mental e conexão Eu Sou' },
  { step: 5, id: 'reflexao_final', name: 'Reflexão Final', shortName: 'Voz Interior', description: 'Síntese de aprendizados do dia' },
  { step: 6, id: 'planejamento', name: 'Planejamento do Dia Seguinte', shortName: 'Planejamento', description: '6 ações prioritárias e justificativa' },
  { step: 7, id: 'conclusao', name: 'Conclusão do Dia', shortName: 'Conclusão', description: 'Celebração e consagração do dia' },
];

export type DayProgressStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface DailyJournalEntry {
  id: string;
  dayNumber: number;
  date: string; // YYYY-MM-DD
  updatedAt: string;
  completed: boolean;
  status?: DayProgressStatus; // Estado do dia: não iniciado, em andamento, concluído
  completedAt?: string; // Data e hora da conclusão registrada
  lastActiveStepIndex?: number; // Ponto exato onde o usuário parou
  directCommitments?: CommitmentTask[]; // Compromissos adicionados diretamente para este dia
  
  // Etapa 1: REFLETIR
  worthLivingAnswer: string;
  worldBetterIdea?: string; // Exclusivo dia 1

  // Etapa 2: PERCEBER
  doDifferentAnswer: string;

  // Etapa 3: DECIDIR
  commitments: CommitmentTask[];
  commitmentScore: number; // 0-10
  commitmentReason: string;

  // Etapa 4: AGIR & GRATIDÃO
  gratitudes: [string, string, string];

  // Etapa 5: REVISAR
  forgivenessConfirmed: boolean;

  // Etapa 6: EVOLUIR
  innerVoiceConclusion: string;

  // Respostas personalizadas para expansão flexível
  customAnswers?: Record<string, string | number | boolean | string[]>;

  // Notas de áudio (estrutura preparada para áudio e narração)
  audioNotes?: Record<string, string>;
}

export interface UserProfileData {
  name: string;
  title: string;
  email?: string;
  profession: string;
  interests: string;
  startDate: string;
  currentDay: number;
  dailyReminderTime: string;
  soundEnabled: boolean;
  ttsEnabled: boolean;
  // Expansão 100 Dias & Conquistas
  unlocked100DaysJourney?: boolean;
  day21CompletedAt?: string;
  journey100StartedAt?: string;
  activeJourneyMode?: '21days' | '100days';
  currentPhase?: 1 | 2 | 3 | 4;
}

// ==========================================
// ARQUITETURA DA JORNADA DE 100 DIAS (4 FASES)
// ==========================================

export interface JourneyPhaseInfo {
  phase: 1 | 2 | 3 | 4;
  id: 'despertar' | 'consolidacao' | 'transformacao' | 'expansao';
  title: string;
  name: string;
  subtitle: string;
  dayStart: number;
  dayEnd: number;
  totalDays: number;
  description: string;
  themeColor: string; // Ex: '#F5C563'
  badgeBg: string;
  badgeBorder: string;
  iconName: 'Sparkles' | 'ShieldCheck' | 'Flame' | 'Orbit';
}

export const JOURNEY_100_PHASES: JourneyPhaseInfo[] = [
  {
    phase: 1,
    id: 'despertar',
    title: 'FASE 1 — DESPERTAR',
    name: 'Despertar',
    subtitle: 'Massa Crítica & Constância Inicial',
    dayStart: 1,
    dayEnd: 21,
    totalDays: 21,
    description: 'Construção da constância noturna, ressignificação diária e fixação dos alicerces atômicos.',
    themeColor: '#F5C563',
    badgeBg: 'rgba(245, 197, 99, 0.15)',
    badgeBorder: 'rgba(245, 197, 99, 0.4)',
    iconName: 'Sparkles',
  },
  {
    phase: 2,
    id: 'consolidacao',
    title: 'FASE 2 — CONSOLIDAÇÃO',
    name: 'Consolidação',
    subtitle: 'Enraizamento dos Hábitos & Blindagem',
    dayStart: 22,
    dayEnd: 50,
    totalDays: 29,
    description: 'Enraizamento profundo dos hábitos, refinamento da disciplina e blindagem contra recaídas.',
    themeColor: '#38BDF8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    badgeBorder: 'rgba(56, 189, 248, 0.4)',
    iconName: 'ShieldCheck',
  },
  {
    phase: 3,
    id: 'transformacao',
    title: 'FASE 3 — TRANSFORMAÇÃO',
    name: 'Transformação',
    subtitle: 'Metamorfose & Maestria Pessoal',
    dayStart: 51,
    dayEnd: 75,
    totalDays: 25,
    description: 'Metamorfose da identidade, superação de limites e alinhamento visceral com a maestria.',
    themeColor: '#818CF8',
    badgeBg: 'rgba(129, 140, 248, 0.15)',
    badgeBorder: 'rgba(129, 140, 248, 0.4)',
    iconName: 'Flame',
  },
  {
    phase: 4,
    id: 'expansao',
    title: 'FASE 4 — EXPANSÃO',
    name: 'Expansão',
    subtitle: 'Autonomia Inabalável & Impacto',
    dayStart: 76,
    dayEnd: 100,
    totalDays: 25,
    description: 'Irradiação do propósito, autonomia inabalável e impacto transformador no mundo.',
    themeColor: '#10B981',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeBorder: 'rgba(16, 185, 129, 0.4)',
    iconName: 'Orbit',
  },
];

export function getPhaseForDay(dayNumber: number): JourneyPhaseInfo {
  if (dayNumber <= 21) return JOURNEY_100_PHASES[0];
  if (dayNumber <= 50) return JOURNEY_100_PHASES[1];
  if (dayNumber <= 75) return JOURNEY_100_PHASES[2];
  return JOURNEY_100_PHASES[3];
}

