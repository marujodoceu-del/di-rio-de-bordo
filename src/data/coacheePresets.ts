import { CoacheeProfessionPreset, AccentColorPalette, CoverArtStyle } from '../types';

export interface ProfessionPresetInfo {
  id: CoacheeProfessionPreset;
  title: string;
  category: string;
  emoji: string;
  suggestedPalette: AccentColorPalette;
  suggestedCover: CoverArtStyle;
  interestsPlaceholder: string;
  defaultInterests: string;
  defaultMetaphor: string;
}

export const COACHEE_PRESETS: Record<CoacheeProfessionPreset, ProfessionPresetInfo> = {
  padeiro: {
    id: 'padeiro',
    title: 'Padeiro / Panificação & Gastronomia',
    category: 'Ofício & Alimento',
    emoji: '🥖',
    suggestedPalette: 'bakery-gold',
    suggestedCover: 'coachee-archetype',
    interestsPlaceholder: 'Fermentação natural, panificação rústica, café artesanal, madrugadas silenciosas...',
    defaultInterests: 'Panificação artesanal, fermentação lenta (levain), aromas do trigo e amor por alimentar pessoas',
    defaultMetaphor: 'Assim como o pão nobre precisa do tempo sagrado de fermentação e do calor exato do forno para crescer e nutrir, a sua vida floresce quando você respeita o processo diário e alimenta seus hábitos com constância.',
  },
  'medico-saude': {
    id: 'medico-saude',
    title: 'Medicina, Saúde & Terapia',
    category: 'Cuidado & Vida',
    emoji: '🩺',
    suggestedPalette: 'emerald-vitality',
    suggestedCover: 'metodo-atomico',
    interestsPlaceholder: 'Neurociência, fisiologia, cuidado humano, bem-estar, biohacking...',
    defaultInterests: 'Saúde preventiva, conexão mente-corpo, equilíbrio biológico e serviço à vida',
    defaultMetaphor: 'A verdadeira cura e regeneração começam na escala microscópica das células. Do átomo às grandes decisões, seu corpo é um templo cósmico em permanente renovação.',
  },
  'engenheiro-tech': {
    id: 'engenheiro-tech',
    title: 'Engenharia, Tecnologia & Dados',
    category: 'Exatas & Inovação',
    emoji: '💻',
    suggestedPalette: 'sapphire-depth',
    suggestedCover: 'metodo-atomico',
    interestsPlaceholder: 'Arquitetura de sistemas, algoritmos, automação, lógica estruturada...',
    defaultInterests: 'Tecnologia de ponta, modelagem de processos, otimização e solução de problemas complexos',
    defaultMetaphor: 'Qualquer sistema sofisticado é composto por instruções atômicas e código limpo. O seu cérebro é a infraestrutura viva mais avançada do universo: calibre seus inputs.',
  },
  'professor-educador': {
    id: 'professor-educador',
    title: 'Educação, Filosofia & Docência',
    category: 'Conhecimento',
    emoji: '📚',
    suggestedPalette: 'cosmic-amber',
    suggestedCover: 'metodo-atomico',
    interestsPlaceholder: 'Didática, literatura, filosofia clássica, desenvolvimento juvenil...',
    defaultInterests: 'Leitura reflexiva, compartilhamento de sabedoria e despertar de mentes',
    defaultMetaphor: 'Semear o conhecimento é alinhar estrelas na mente do outro. Antes de guiar uma sala de aula ou um pupilo, o mestre governa e pacifica seu próprio mundo interior.',
  },
  'empresario-lider': {
    id: 'empresario-lider',
    title: 'Empresário, Líder & Vendas',
    category: 'Negócios & Gestão',
    emoji: '📈',
    suggestedPalette: 'cosmic-amber',
    suggestedCover: 'metodo-atomico',
    interestsPlaceholder: 'Empreendedorismo, negociação, estratégia de mercado, liderança...',
    defaultInterests: 'Construção de valor real, gestão de alta performance e visão de futuro',
    defaultMetaphor: 'Antes de governar mercados, contratos e equipes, a vitória mais lucrativa e decisiva é o domínio sereno da sua própria energia e disciplina diária.',
  },
  'atleta-esporte': {
    id: 'atleta-esporte',
    title: 'Atleta, Treinador & Esporte',
    category: 'Performance Física',
    emoji: '🏃',
    suggestedPalette: 'ruby-drive',
    suggestedCover: 'metodo-atomico',
    interestsPlaceholder: 'Treino resistido, corrida, nutrição esportiva, ritmo cardíaco...',
    defaultInterests: 'Superação de limites, disciplina atlética, ritmo respiratório e saúde cardiovascular',
    defaultMetaphor: 'O recorde não é batido no dia da prova, mas na consistência silenciosa de cada amanhecer quando ninguém está aplaudindo. Seu corpo obedece à clareza da sua mente.',
  },
  'artista-criativo': {
    id: 'artista-criativo',
    title: 'Artista, Designer & Criativo',
    category: 'Arte & Expressão',
    emoji: '🎨',
    suggestedPalette: 'sapphire-depth',
    suggestedCover: 'metodo-atomico',
    interestsPlaceholder: 'Artes visuais, música, arquitetura sensorial, composição...',
    defaultInterests: 'Criação estética, harmonia das cores, narrativa humana e liberdade expressiva',
    defaultMetaphor: 'A imaginação criadora é a força cósmica primordial em movimento. Dê contorno ao infinito através da disciplina dos seus rituais.',
  },
  personalizado: {
    id: 'personalizado',
    title: 'Perfil Livre / Customizado',
    category: 'Personalizado',
    emoji: '✨',
    suggestedPalette: 'cosmic-amber',
    suggestedCover: 'metodo-atomico',
    interestsPlaceholder: 'Descreva livremente as paixões e universo do seu coachee...',
    defaultInterests: 'Busca constante por propósito, harmonia interior e realização',
    defaultMetaphor: 'A jornada mais transformadora do universo é aquela que conduz o ser humano de volta à sua essência primordial e ao seu mais alto potencial.',
  },
};

export interface PaletteInfo {
  id: AccentColorPalette;
  name: string;
  description: string;
  badgeBg: string;
  textColor: string;
  accentHex: string;
  borderClass: string;
  glowClass: string;
}

export const PALETTE_DEFINITIONS: Record<AccentColorPalette, PaletteInfo> = {
  'cosmic-amber': {
    id: 'cosmic-amber',
    name: 'Âmbar Cósmico (Padrão)',
    description: 'Tons de ouro estelar, nebulosa e sabedoria cósmica',
    badgeBg: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
    textColor: 'text-amber-300',
    accentHex: '#f59e0b',
    borderClass: 'border-amber-400/40',
    glowClass: 'shadow-amber-500/20',
  },
  'bakery-gold': {
    id: 'bakery-gold',
    name: 'Trigo & Forno (Padeiro / Artesanal)',
    description: 'Dourado de crosta de pão, calor de forno a lenha e cevada',
    badgeBg: 'bg-amber-600/15 text-amber-200 border-amber-600/40',
    textColor: 'text-amber-400',
    accentHex: '#d97706',
    borderClass: 'border-amber-600/50',
    glowClass: 'shadow-amber-600/25',
  },
  'emerald-vitality': {
    id: 'emerald-vitality',
    name: 'Esmeralda Vital (Saúde & Vida)',
    description: 'Verde da clorofila, renovação celular e harmonia biológica',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    textColor: 'text-emerald-300',
    accentHex: '#10b981',
    borderClass: 'border-emerald-500/40',
    glowClass: 'shadow-emerald-500/20',
  },
  'sapphire-depth': {
    id: 'sapphire-depth',
    name: 'Safira Noturno (Mente & Foco)',
    description: 'Azul profundo de céu estrelado, foco cognitivo e clareza',
    badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
    textColor: 'text-sky-300',
    accentHex: '#0ea5e9',
    borderClass: 'border-sky-500/40',
    glowClass: 'shadow-sky-500/20',
  },
  'ruby-drive': {
    id: 'ruby-drive',
    name: 'Rubi & Energia (Disciplina & Ação)',
    description: 'Vermelho rubi de pulso sanguíneo, determinação e vigor',
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    textColor: 'text-rose-300',
    accentHex: '#f43f5e',
    borderClass: 'border-rose-500/40',
    glowClass: 'shadow-rose-500/20',
  },
  'classic-monochrome': {
    id: 'classic-monochrome',
    name: 'Preto & Branco (Gráfica Clássica)',
    description: 'Tons puros de nanquim e papel para impressão econômica',
    badgeBg: 'bg-neutral-200 text-neutral-800 border-neutral-400',
    textColor: 'text-neutral-900',
    accentHex: '#171717',
    borderClass: 'border-neutral-400',
    glowClass: 'shadow-neutral-500/10',
  },
};
