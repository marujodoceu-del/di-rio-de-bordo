import { JournalQuestion, getPhaseForDay } from '../types';
import { COSMIC_DAY_QUOTES } from './cosmicQuotes';
import { EXACT_MEDITATION_TEXT } from './diarioContent';

/**
 * Constrói e retorna a lista ordenada de perguntas e telas para o dia especificado,
 * respeitando rigorosamente a sequência de 7 ordens do fluxo diário:
 * 
 * 1. ABERTURA DO DIA
 * 2. MOMENTO DE REFLEXÃO
 * 3. PERGUNTAS DO DIÁRIO
 * 4. PERGUNTAS ESPECIAIS DE AUTOPERDÃO E PERDÃO
 * 5. REFLEXÃO FINAL
 * 6. PLANEJAMENTO DO DIA SEGUINTE
 * 7. CONCLUSÃO DO DIA
 */
export function getQuestionsForDay(dayNumber: number, userName?: string): JournalQuestion[] {
  const quoteIndex = (Math.max(dayNumber, 1) - 1) % COSMIC_DAY_QUOTES.length;
  const quote = COSMIC_DAY_QUOTES[quoteIndex] || COSMIC_DAY_QUOTES[0];
  const safeName = userName && userName.trim() ? userName.trim() : 'praticante';
  const phase = getPhaseForDay(dayNumber);

  const questions: JournalQuestion[] = [
    // ----------------------------------------------------
    // ETAPA 1: ABERTURA DO DIA
    // ----------------------------------------------------
    {
      id: `q_abertura_d${dayNumber}`,
      stepNumber: 1,
      stepTitle: '1. ABERTURA DO DIA',
      categoria: 'abertura',
      dia: dayNumber,
      texto: `Dia ${dayNumber}: ${quote.concept}`,
      descricao: `"${quote.quote}" — ${quote.author}`,
      tipoResposta: 'info_screen',
      narracaoTexto: `Passo um. Abertura do Dia ${dayNumber}. Conceito do dia: ${quote.concept}. Citação de ${quote.author}: ${quote.quote}. Respire com serenidade e prepare-se para seu diário noturno.`,
      configuracaoVisual: {
        accentColor: '#F5C563',
        badgeLabel: 'ABERTURA DO DIA',
        iconName: 'Sun',
        layoutVariant: 'ritual',
      },
    },

    // ----------------------------------------------------
    // ETAPA 2: MOMENTO DE REFLEXÃO
    // ----------------------------------------------------
    {
      id: `q_reflexao_d${dayNumber}`,
      stepNumber: 2,
      stepTitle: '2. MOMENTO DE REFLEXÃO',
      categoria: 'momento_reflexao',
      dia: dayNumber,
      texto: 'Quietude & Contemplação Noturna',
      descricao: quote.nightReflection,
      tipoResposta: 'info_screen',
      narracaoTexto: `Passo dois. Momento de reflexão e respiração. ${quote.nightReflection}`,
      configuracaoVisual: {
        accentColor: '#818CF8',
        badgeLabel: 'MOMENTO DE REFLEXÃO',
        iconName: 'Moon',
        layoutVariant: 'centered',
      },
    },

    // ----------------------------------------------------
    // ETAPA 3: PERGUNTAS DO DIÁRIO (uma por vez)
    // ----------------------------------------------------
    {
      id: 'q_worth_living',
      stepNumber: 3,
      stepTitle: '3. PERGUNTAS DO DIÁRIO',
      categoria: 'diario',
      texto: '1. Por que valeu a pena viver o dia de hoje?',
      descricao: 'Conecte-se com pequenos acontecimentos, presenças, sensações ou vitórias que deram significado ao seu dia.',
      tipoResposta: 'textarea',
      narracaoTexto: 'Passo três. Perguntas do diário. Pergunta um: Por que valeu a pena viver o dia de hoje? Silencie o ruído mental e liste as razões sinceras que deram valor às suas horas.',
      configuracaoVisual: {
        accentColor: '#F5C563',
        badgeLabel: 'REFLETIR',
        iconName: 'Feather',
        placeholder: 'Exemplo: Consegui manter a calma diante de imprevistos, desfrutei de um almoço tranquilo e avancei com disciplina no meu projeto...',
        minRows: 5,
      },
    },

    // Pergunta exclusiva do Dia 1
    ...(dayNumber === 1
      ? [
          {
            id: 'q_world_better_idea',
            stepNumber: 3,
            stepTitle: '3. PERGUNTAS DO DIÁRIO (ESPECIAL DIA 1)',
            categoria: 'diario' as const,
            dia: 1,
            texto: '1.1. Que ideia você pode ter hoje para contribuir para um mundo melhor?',
            descricao: 'Como você pode colocar essa contribuição em prática no tempo presente?',
            tipoResposta: 'textarea' as const,
            narracaoTexto: 'Pergunta especial do primeiro dia: Que ideia você pode ter hoje para contribuir para a construção de um mundo melhor de se viver no tempo presente? Como você pode colocar isso em prática?',
            configuracaoVisual: {
              accentColor: '#38BDF8',
              badgeLabel: 'IDEIA & PROPÓSITO',
              iconName: 'Sparkles',
              placeholder: 'Descreva a ideia e de que forma prática você pretende implementá-la a partir de agora...',
              minRows: 5,
            },
          },
        ]
      : []),

    {
      id: 'q_do_different',
      stepNumber: 3,
      stepTitle: '3. PERGUNTAS DO DIÁRIO',
      categoria: 'diario',
      texto: '2. Se pudesse voltar no tempo e modificar algo hoje, o que faria diferente?',
      descricao: 'Olhe para suas atitudes com olhar de cientista: sem autocrítica destrutiva, apenas aprendizado atômico.',
      tipoResposta: 'textarea',
      narracaoTexto: 'Pergunta dois do diário. Se você pudesse voltar no tempo e tivesse o poder de modificar algum acontecimento no dia de hoje, o que você faria de diferente?',
      configuracaoVisual: {
        accentColor: '#818CF8',
        badgeLabel: 'PERCEBER & APRENDER',
        iconName: 'Orbit',
        placeholder: 'Exemplo: Teria respirado antes de responder a uma provocação, evitado distrações nas primeiras horas da manhã e descansado melhor...',
        minRows: 5,
      },
    },

    {
      id: 'q_gratitudes',
      stepNumber: 3,
      stepTitle: '3. PERGUNTAS DO DIÁRIO',
      categoria: 'diario',
      texto: '4. GRATIDÃO: Três bênçãos e acontecimentos do dia',
      descricao: 'Agradeça três acontecimentos, emoções, sentimentos ou conquistas de hoje.',
      tipoResposta: 'gratitude_triad',
      narracaoTexto: 'Pergunta de gratidão. Agradeça três bênçãos, acontecimentos, emoções ou conquistas do dia de hoje.',
      configuracaoVisual: {
        accentColor: '#F5C563',
        badgeLabel: 'AGIR & AGRADECER',
        iconName: 'Sparkles',
      },
    },

    // ----------------------------------------------------
    // ETAPA 4: PERGUNTAS ESPECIAIS DE AUTOPERDÃO E PERDÃO
    // ----------------------------------------------------
    {
      id: 'q_forgiveness',
      stepNumber: 4,
      stepTitle: '4. PERGUNTAS ESPECIAIS DE AUTOPERDÃO E PERDÃO',
      categoria: 'autoperdao',
      texto: 'Meditação do Perdão & Declaração "Eu Sou"',
      descricao: 'Acalme a mente, desconecte-se das tensões e mágoas do dia e declare sua liberação antes de dormir.',
      tipoResposta: 'forgiveness_recitation',
      narracaoTexto: `Passo quatro. Perguntas especiais de autoperdão e perdão. Recite com o coração calmo: Por todas as coisas que eu mesmo me feri, eu me perdoo e me liberto. Eu sou ${safeName}. Por todas as pessoas que me magoaram, eu as perdoo e me desconecto delas. Eu sou ${safeName}. Por todas as pessoas que magoei, peço perdão ao Universo. Eu me desconecto e me aceito. Eu sou ${safeName}.`,
      configuracaoVisual: {
        accentColor: '#38BDF8',
        badgeLabel: 'REVISAR & LIBERTAR',
        iconName: 'Feather',
        layoutVariant: 'ritual',
      },
    },

    // ----------------------------------------------------
    // ETAPA 5: REFLEXÃO FINAL
    // ----------------------------------------------------
    {
      id: 'q_inner_voice',
      stepNumber: 5,
      stepTitle: '5. REFLEXÃO FINAL',
      categoria: 'reflexao_final',
      texto: EXACT_MEDITATION_TEXT.question5_1,
      descricao: 'Ouça sua Voz Interior. Sintetize em uma ou duas reflexões a essência da sua evolução hoje.',
      tipoResposta: 'textarea',
      narracaoTexto: `Passo cinco. Reflexão final. ${EXACT_MEDITATION_TEXT.question5_1}`,
      configuracaoVisual: {
        accentColor: '#F5C563',
        badgeLabel: 'EVOLUIR & VOZ INTERIOR',
        iconName: 'Sparkles',
        placeholder: 'Exemplo: Concluo que a disciplina é uma forma de autocuidado. Pequenos hábitos consistentes sustentam a paz interior...',
        minRows: 5,
      },
    },

    // ----------------------------------------------------
    // ETAPA 6: PLANEJAMENTO DO DIA SEGUINTE
    // ----------------------------------------------------
    {
      id: 'q_commitments',
      stepNumber: 6,
      stepTitle: '6. PLANEJAMENTO DO DIA SEGUINTE',
      categoria: 'planejamento',
      texto: '3. Seis ações que você se compromete a realizar amanhã',
      descricao: 'Defina suas 6 prioridades de amanhã para acordar com clareza atômica de rumo.',
      tipoResposta: 'commitments_list',
      narracaoTexto: 'Passo seis. Planejamento do dia seguinte. Quais são as seis ações que você se compromete a realizar amanhã? Defina suas prioridades claras.',
      configuracaoVisual: {
        accentColor: '#10B981',
        badgeLabel: 'DECIDIR & PLANEJAR',
        iconName: 'CheckSquare',
      },
    },
    {
      id: 'q_commitment_score',
      stepNumber: 6,
      stepTitle: '6. PLANEJAMENTO DO DIA SEGUINTE',
      categoria: 'planejamento',
      texto: '3.1. O quanto você acredita que estas ações contribuirão para um dia produtivo amanhã? Justifique.',
      descricao: 'Escolha uma nota na escala de 0 a 10 e registre sua justificativa consciente.',
      tipoResposta: 'scale_and_reason',
      narracaoTexto: 'O quanto você acredita que estas ações contribuirão para um dia produtivo amanhã? Avalie de zero a dez e justifique.',
      configuracaoVisual: {
        accentColor: '#F5C563',
        badgeLabel: 'JUSTIFICATIVA',
        iconName: 'Orbit',
        placeholder: 'Justifique: o quanto você acredita que estas ações contribuirão para um dia produtivo amanhã...',
      },
    },

    // ----------------------------------------------------
    // ETAPA 7: CONCLUSÃO DO DIA
    // ----------------------------------------------------
    {
      id: `q_conclusao_d${dayNumber}`,
      stepNumber: 7,
      stepTitle: '7. CONCLUSÃO DO DIA',
      categoria: 'conclusao',
      dia: dayNumber,
      texto: `Conclusão e Consagração do Dia ${dayNumber}`,
      descricao: 'Potencializamos os fatos bons do dia, ressignificamos aprendizados, declaramos nossas 6 ações e celebramos a constância atômica.',
      tipoResposta: 'info_screen',
      narracaoTexto: `Passo sete. Conclusão do Dia. ${EXACT_MEDITATION_TEXT.closingBullet1} ${EXACT_MEDITATION_TEXT.closingBullet2}`,
      configuracaoVisual: {
        accentColor: '#10B981',
        badgeLabel: 'CONCLUSÃO DO DIA',
        iconName: 'CheckCircle2',
        layoutVariant: 'ritual',
      },
    },
  ];

  return questions;
}
