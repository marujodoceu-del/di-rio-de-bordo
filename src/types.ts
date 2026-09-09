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
