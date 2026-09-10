/**
 * MÉTODO ATÔMICO — DESIGN SYSTEM TOKENS
 * "DO ÁTOMO AO INFINITO"
 *
 * Conceito: Profundidade, Introspecção, Descoberta, Expansão, Transformação, Ciência, Universo, Consciência.
 * Referências: Átomo → Partículas → Energia → Estrelas → Constelações → Galáxias → Universo → Infinito.
 */

export interface EvolutionStage {
  id: 'atomo' | 'particulas' | 'constelacoes' | 'galaxias' | 'infinito';
  name: string;
  subtitle: string;
  dayRange: [number, number];
  concept: string;
  description: string;
  expansionFactor: number; // 0.1 to 1.0 (intensidade visual de expansão)
  glowColor: string;
  badgeBorder: string;
}

export const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    id: 'atomo',
    name: 'Átomo',
    subtitle: 'O Núcleo & Ponto de Origem',
    dayRange: [1, 4],
    concept: 'CONCENTRAÇÃO & INTROSPECÇÃO',
    description: 'No centro do ser reside o ponto infinitesimal de partida. Todo o infinito começa com a precisão de um único átomo.',
    expansionFactor: 0.2,
    glowColor: 'rgba(245, 197, 99, 0.25)',
    badgeBorder: 'border-amber-400/30',
  },
  {
    id: 'particulas',
    name: 'Partículas & Energia',
    subtitle: 'O Despertar da Vibração',
    dayRange: [5, 8],
    concept: 'MOVIMENTO & ENERGIA QUÂNTICA',
    description: 'A quietude cede espaço ao movimento sináptico. As partículas elementares alinham intenção e disciplina cotidiana.',
    expansionFactor: 0.4,
    glowColor: 'rgba(56, 189, 248, 0.20)',
    badgeBorder: 'border-sky-400/30',
  },
  {
    id: 'constelacoes',
    name: 'Constelações',
    subtitle: 'A Geometria dos Padrões',
    dayRange: [9, 13],
    concept: 'CONEXÕES & DISCIPLINA ALINHADA',
    description: 'Pontos isolados unem-se em trajetórias luminosas. Hábitos e ações formam uma arquitetura ordenada de coerência.',
    expansionFactor: 0.6,
    glowColor: 'rgba(129, 140, 248, 0.25)',
    badgeBorder: 'border-indigo-400/30',
  },
  {
    id: 'galaxias',
    name: 'Galáxias',
    subtitle: 'A Expansão Gravitacional',
    dayRange: [14, 18],
    concept: 'FLUXO, IMPACTO & GRAVIDADE',
    description: 'A força da consistência gera seu próprio campo gravitacional. O desenvolvimento torna-se autossustentado e expansivo.',
    expansionFactor: 0.8,
    glowColor: 'rgba(216, 180, 254, 0.25)',
    badgeBorder: 'border-purple-400/30',
  },
  {
    id: 'infinito',
    name: 'O Infinito',
    subtitle: 'A Consciência Universal',
    dayRange: [19, 21],
    concept: 'PLENITUDE & TRANSCENDÊNCIA',
    description: 'A jornada de 21 dias atinge o horizonte cósmico. Do átomo ao infinito, o propósito funde-se à totalidade.',
    expansionFactor: 1.0,
    glowColor: 'rgba(245, 197, 99, 0.40)',
    badgeBorder: 'border-amber-300/50',
  },
];

export function getEvolutionStageForDay(day: number): EvolutionStage {
  const clampedDay = Math.min(Math.max(day, 1), 21);
  return (
    EVOLUTION_STAGES.find(
      (stage) => clampedDay >= stage.dayRange[0] && clampedDay <= stage.dayRange[1]
    ) || EVOLUTION_STAGES[0]
  );
}

export const COSMIC_DESIGN_TOKENS = {
  // Paleta de Fundos e Superfícies
  colors: {
    // Abismo / Escuro Profundo (Zero cinza genérico, tons neutros com 3-4% de matiz cósmico)
    void: {
      deepest: '#04060A', // Fundo principal da viewport
      base: '#080B12',    // Superfície base da aplicação
      surface: '#0E131F', // Superfície de cards principais
      elevated: '#141A29', // Cards com destaque ou modais
      hairline: 'rgba(255, 255, 255, 0.07)', // Bordas ultrafinas elegantes
      hairlineActive: 'rgba(245, 197, 99, 0.28)', // Bordas com foco sutil
    },
    // Ouro Estelar & Âmbar Cálido (sem neon, luz de estrela quente e discreta)
    starlight: {
      gold: '#F5C563',
      warm: '#FCE2A6',
      dim: '#C69940',
      glow: 'rgba(245, 197, 99, 0.15)',
    },
    // Acentos Quânticos e Espectrais (Discretos e com baixa saturação)
    spectral: {
      quantumSky: '#38BDF8',
      cosmicIndigo: '#818CF8',
      nebulaViolet: '#C084FC',
      stellarEmerald: '#34D399',
    },
    // Estados Funcionais
    status: {
      success: {
        bg: 'rgba(16, 185, 129, 0.08)',
        border: 'rgba(16, 185, 129, 0.25)',
        text: '#34D399',
      },
      active: {
        bg: 'rgba(245, 197, 99, 0.10)',
        border: 'rgba(245, 197, 99, 0.35)',
        text: '#F5C563',
      },
      locked: {
        bg: 'rgba(15, 23, 42, 0.40)',
        border: 'rgba(255, 255, 255, 0.04)',
        text: '#64748B',
      },
    },
  },

  // Tipografia
  typography: {
    display: "'Cinzel', serif",
    reflection: "'Cormorant Garamond', serif",
    body: "'Plus Jakarta Sans', sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },

  // Regras de Raios Matemáticos (Inner = Outer - Padding)
  radii: {
    cardOuter: '1.25rem', // 20px
    cardInner: '0.75rem', // 12px
    button: '0.75rem',    // 12px
    badge: '9999px',      // Pill
  },
} as const;
