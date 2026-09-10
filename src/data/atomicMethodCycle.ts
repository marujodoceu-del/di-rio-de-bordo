export interface MethodStep {
  id: string;
  stepNumber: number;
  name: string;
  shortDescription: string;
  questionTitle: string;
  questionSubtitle: string;
  cosmicPrinciple: string;
}

export const ATOMIC_METHOD_CYCLE: MethodStep[] = [
  {
    id: 'refletir',
    stepNumber: 1,
    name: 'REFLETIR',
    shortDescription: 'Avalie o valor e o significado das experiências vividas no dia.',
    questionTitle: '1. Por que valeu a pena viver o dia de hoje?',
    questionSubtitle: 'Conecte-se com momentos autênticos, vitórias silenciosas e o dom de existir.',
    cosmicPrinciple: 'Assim como as estrelas emitem luz na escuridão, cada dia carrega instantes de valor que merecem ser reconhecidos.',
  },
  {
    id: 'perceber',
    stepNumber: 2,
    name: 'PERCEBER',
    shortDescription: 'Ganhe consciência sobre escolhas e atitudes que podem ser aprimoradas.',
    questionTitle: '2. Se você pudesse voltar no tempo e modificar algo hoje, o que faria de diferente?',
    questionSubtitle: 'Sem culpa, apenas com clareza e autorresponsabilidade para aprender.',
    cosmicPrinciple: 'O tempo cósmico flui em uma só direção, mas a consciência humana tem o poder de ressignificar o passado através do aprendizado.',
  },
  {
    id: 'decidir',
    stepNumber: 3,
    name: 'DECIDIR',
    shortDescription: 'Selecione e comprometa-se com as 6 ações prioritárias para amanhã.',
    questionTitle: '3. Seis ações que você se compromete a realizar amanhã',
    questionSubtitle: 'Defina suas ações e calibre sua confiança na escala de 0 a 10 com argumentos sólidos.',
    cosmicPrinciple: 'A inércia é quebrada pelo poder da decisão intencional. Decisões claras criam a órbita do seu próximo dia.',
  },
  {
    id: 'agir',
    stepNumber: 4,
    name: 'AGIR & AGRADECER',
    shortDescription: 'Reconheça e honre suas bênçãos diárias com gratidão profunda.',
    questionTitle: '4. GRATIDÃO: Três acontecimentos ou conquistas do dia',
    questionSubtitle: 'Nomeie suas bênçãos diárias e sinta a abundância que já existe em sua trajetória.',
    cosmicPrinciple: 'A gratidão expande nossa capacidade de perceber o bem e atrai harmonia como a gravidade atrai matéria.',
  },
  {
    id: 'revisar',
    stepNumber: 5,
    name: 'REVISAR & PERDOAR',
    shortDescription: 'Desconecte-se de pesos emocionais através da Meditação do Perdão.',
    questionTitle: '5. Meditação do Perdão & Declaração "Eu Sou"',
    questionSubtitle: 'Autoperdão, perdão aos outros, reconciliação com o Universo e afirmação de identidade.',
    cosmicPrinciple: 'Liberte a carga do dia para que sua mente descanse em frequência serena e sono restaurador.',
  },
  {
    id: 'evoluir',
    stepNumber: 6,
    name: 'EVOLUIR',
    shortDescription: 'Sintetize a grande lição do dia e escute sua voz interior.',
    questionTitle: '6. Aprendizados & Conclusão do Dia',
    questionSubtitle: 'O que você conclui do dia de hoje? Ouça sua voz interior antes de dormir.',
    cosmicPrinciple: 'Evolução não é um salto repentino, mas a soma atômica de pequenas percepções diárias acumuladas com constância.',
  },
];
