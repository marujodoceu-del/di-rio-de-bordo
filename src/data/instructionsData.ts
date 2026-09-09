export interface InstructionStep {
  number: string;
  title: string;
  timeframe: string;
  scientificContext: string;
  howTo: string[];
  tips: string;
}

export const INSTRUCTIONS_DATA: InstructionStep[] = [
  {
    number: "01",
    title: "O Ritual Noturno sob as Estrelas",
    timeframe: "15 a 20 min antes de dormir",
    scientificContext: "Desligar telas desacelera as ondas cerebrais de Beta para Alfa/Teta, ancorando os aprendizados e prioridades no subconsciente durante o sono.",
    howTo: [
      "Ambiente & Foco: Reserve um momento de silêncio e recolhimento, mantendo o celular distante.",
      "Perguntas 1 e 2: Celebre o que valeu a pena e extraia aprendizados construtivos, sem remorso ou culpa.",
      "6 Ações de Amanhã: Defina ações práticas observáveis e atribua sua nota de comprometimento (0 a 10).",
      "Gratidão Real: Escreva 3 motivos sinceros de gratidão para harmonizar o sistema nervoso."
    ],
    tips: "Seja direto e sincero: este caderno é o seu observatório astronômico pessoal."
  },
  {
    number: "02",
    title: "A Meditação do Perdão & Desconexão",
    timeframe: "Antes de apagar a luz",
    scientificContext: "Liberar cobranças e mágoas reduz os picos noturnos de cortisol, preparando o corpo para o sono restaurador e profundo.",
    howTo: [
      "Auto-perdão & Tolerância: Leia com reverência, escrevendo seu nome na linha indicada.",
      "Desconexão Emocional: Libere mentalmente pessoas e conflitos; perdoar é um ato de soberania e paz.",
      "Conclusão do Dia: Anote seu principal aprendizado e encerre na certeza de missão cumprida."
    ],
    tips: "Após ler a frase final ('Durma em paz'), feche o diário e entregue-se ao descanso."
  },
  {
    number: "03",
    title: "A Execução Prática no Dia Seguinte",
    timeframe: "Manhã e tarde",
    scientificContext: "Acordar sabendo exatamente o que fazer elimina a fadiga decisória e economiza até 70% de energia mental ao longo da jornada.",
    howTo: [
      "Revisão Matinal: Ao despertar, consulte as 6 ações traçadas na noite anterior.",
      "Foco de Maior Impacto: Execute a tarefa mais desafiadora logo nas primeiras horas do dia.",
      "Ciclo Contínuo: O dia é o campo da ação; a noite é o refúgio da reflexão e da correção de rota."
    ],
    tips: "Se houver imprevistos, replaneje com serenidade e sem cobranças destrutivas."
  }
];
