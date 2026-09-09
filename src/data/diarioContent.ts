export interface DayContentConfig {
  dayNumber: number;
  hasSpecialIdeaQuestion?: boolean; // Dia 1 tem 1.1
}

export const DAYS_ARRAY: DayContentConfig[] = Array.from({ length: 21 }, (_, i) => ({
  dayNumber: i + 1,
  hasSpecialIdeaQuestion: i === 0 // true for day 1 only
}));

export const EXACT_MEDITATION_TEXT = {
  item1: "1. Por todas as coisas que eu mesmo me feri, me magoei, me prejudiquei, consciente ou inconscientemente, sabendo o que estava fazendo, ou sem saber, eu me perdoo e me liberto. Eu me aceito do jeito que eu sou. Eu sou",
  item2: "2. Por todas as pessoas que nesse mundo me magoaram, me ofenderam, me prejudicaram de forma consciente ou inconsciente, direta ou indiretamente, eu perdoo cada uma dessas pessoas. Eu me desconecto delas neste momento. Eu me perdoo. Eu me liberto. Eu me aceito do jeito que sou. Eu sou",
  item3: "3. Por todas as pessoas nesse mundo que eu prejudiquei, magoei, ofendi, por pensamentos ou palavras, gestos ou emoções, consciente ou inconscientemente, eu peço perdão ao Universo. Eu peço perdão a cada uma dessas pessoas. Eu me desconecto delas. Eu me aceito do jeito que eu sou. Eu sou",
  section5: "5. Conclusão / Aprendizados - Ouça sua Voz Interior",
  question5_1: "5.1. Quais foram os aprendizados que você teve ao fazer o seu diário de bordo no dia de hoje? O que você conclui do dia de hoje?",
  closingBullet1: "• Agora tudo está em seu lugar. Potencializamos os fatos bons e maravilhosos do dia. Permitimo-nos dar a eles um novo significado e transformá-los em aprendizados. Declaramos, planejamos, agimos e agradecemos. Resta uma profunda paz interior, estado de relaxamento maior.",
  closingBullet2: "• Esse é quinto e último passo do processo de Coaching, recapitulação e desconexão. Ao acalmar sua mente, baixar sua frequência para alfa e ouvir o seu coração, você pode refletir profundamente sobre os quatro passos anteriores, sobre a completude da abundância e prosperidade, mais do que isso, pode aprender com a própria história, com os próprios atos, acertos e desacertos ressignificados. Permita-se estar confortável e pronto para uma noite de sono restauradora! Relaxamento, Meditação, Autotranse... BOA NOITE... DURMA EM PAZ!"
};
