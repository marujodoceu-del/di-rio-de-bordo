import { DailyJournalEntry, UserProfileData, CommitmentTask, DayProgressStatus } from '../types';

const ENTRIES_STORAGE_KEY = 'metodo_atomico_entries_v1';
const PROFILE_STORAGE_KEY = 'metodo_atomico_profile_v1';
const POSITION_STORAGE_KEY = 'metodo_atomico_last_position_v1';

export const DEFAULT_USER_PROFILE: UserProfileData = {
  name: '',
  title: 'MÉTODO ATÔMICO — DIÁRIO DE BORDO',
  email: '',
  profession: 'Desenvolvimento Pessoal',
  interests: 'Física, hábitos diários, autoconhecimento e disciplina',
  startDate: new Date().toISOString().split('T')[0],
  currentDay: 1,
  dailyReminderTime: '21:30',
  soundEnabled: true,
  ttsEnabled: true,
  unlocked100DaysJourney: false,
  activeJourneyMode: '21days',
  currentPhase: 1,
};

export function getNextDayDateString(baseDateStr?: string): string {
  try {
    const base = baseDateStr ? new Date(baseDateStr + 'T12:00:00') : new Date();
    base.setDate(base.getDate() + 1);
    return base.toISOString().split('T')[0];
  } catch {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    return now.toISOString().split('T')[0];
  }
}

export function computeDayProgressStatus(entry: DailyJournalEntry | undefined): DayProgressStatus {
  if (!entry) return 'nao_iniciado';
  if (entry.completed) return 'concluido';
  const hasAnswers = Boolean(
    (entry.worthLivingAnswer && entry.worthLivingAnswer.trim().length > 0) ||
    (entry.doDifferentAnswer && entry.doDifferentAnswer.trim().length > 0) ||
    (entry.worldBetterIdea && entry.worldBetterIdea.trim().length > 0) ||
    (entry.innerVoiceConclusion && entry.innerVoiceConclusion.trim().length > 0) ||
    (entry.commitments && entry.commitments.some((c) => c.text && c.text.trim().length > 0)) ||
    (entry.gratitudes && entry.gratitudes.some((g) => g && g.trim().length > 0)) ||
    (entry.lastActiveStepIndex !== undefined && entry.lastActiveStepIndex > 0)
  );
  return hasAnswers ? 'em_andamento' : 'nao_iniciado';
}

export function createEmptyEntry(dayNumber: number): DailyJournalEntry {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const nextDateStr = getNextDayDateString(dateStr);

  const defaultCommitments: CommitmentTask[] = Array.from({ length: 6 }, (_, i) => ({
    id: `task_${dayNumber}_${i + 1}`,
    text: '',
    completed: false,
    status: 'pendente',
    plannedDate: nextDateStr,
    originDayNumber: dayNumber,
    targetDayNumber: dayNumber + 1,
    completedAt: undefined,
  }));

  return {
    id: `entry_day_${dayNumber}`,
    dayNumber,
    date: dateStr,
    updatedAt: new Date().toISOString(),
    completed: false,
    status: 'nao_iniciado',
    worthLivingAnswer: '',
    worldBetterIdea: dayNumber === 1 ? '' : undefined,
    doDifferentAnswer: '',
    commitments: defaultCommitments,
    commitmentScore: 8,
    commitmentReason: '',
    gratitudes: ['', '', ''],
    forgivenessConfirmed: false,
    innerVoiceConclusion: '',
    directCommitments: [],
    audioNotes: {},
  };
}

export const storageService = {
  getEntries(): Record<number, DailyJournalEntry> {
    try {
      const raw = localStorage.getItem(ENTRIES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Limpar seed de demonstração antigo se o usuário nunca escreveu nele
        if (
          parsed[1] &&
          parsed[1].worthLivingAnswer ===
            'Hoje dei o primeiro passo para reorganizar minha rotina e silenciar o ruído externo.'
        ) {
          delete parsed[1];
          localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (err) {
      console.error('Erro ao ler entradas do localStorage:', err);
    }
    // Novo usuário inicia vazio
    return {};
  },

  getEntryForDay(dayNumber: number): DailyJournalEntry {
    const entries = this.getEntries();
    if (entries[dayNumber]) {
      return entries[dayNumber];
    }
    const newEntry = createEmptyEntry(dayNumber);
    return newEntry;
  },

  saveEntry(entry: DailyJournalEntry): void {
    try {
      const entries = this.getEntries();
      entry.updatedAt = new Date().toISOString();
      
      // Atualiza o estado da entrada preservando se já foi concluída
      entry.status = computeDayProgressStatus(entry);

      entries[entry.dayNumber] = entry;
      localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
      window.dispatchEvent(new CustomEvent('metodo_atomico_update'));
    } catch (err) {
      console.error('Erro ao salvar entrada:', err);
    }
  },

  /**
   * Retorna todos os compromissos que devem ser executados no dayNumber selecionado:
   * - Compromissos planejados no Diário do dia anterior (dayNumber - 1);
   * - Mais quaisquer compromissos diretos adicionados na tela 'Meu Dia' para este dia.
   */
  getCommitmentsForDay(dayNumber: number): CommitmentTask[] {
    const entries = this.getEntries();
    const result: CommitmentTask[] = [];

    // 1. Herdados do Diário da noite anterior
    if (dayNumber > 1 && entries[dayNumber - 1]) {
      const prevEntry = entries[dayNumber - 1];
      if (prevEntry.commitments) {
        prevEntry.commitments.forEach((c) => {
          if (c.text && c.text.trim()) {
            result.push({
              ...c,
              originDayNumber: c.originDayNumber || dayNumber - 1,
              targetDayNumber: c.targetDayNumber || dayNumber,
              status: c.completed ? 'concluido' : 'pendente',
            });
          }
        });
      }
    }

    // 2. Compromissos diretos adicionados para o dia de hoje
    if (entries[dayNumber]?.directCommitments) {
      entries[dayNumber].directCommitments?.forEach((c) => {
        if (c.text && c.text.trim()) {
          result.push({
            ...c,
            originDayNumber: c.originDayNumber || dayNumber,
            targetDayNumber: c.targetDayNumber || dayNumber,
            status: c.completed ? 'concluido' : 'pendente',
          });
        }
      });
    }

    // 3. Se for Dia 1 e houver compromissos preenchidos no próprio dia 1, inclui para não perder dados
    if (dayNumber === 1 && entries[1]?.commitments) {
      entries[1].commitments.forEach((c) => {
        if (c.text && c.text.trim()) {
          // Evita duplicatas se já adicionado
          if (!result.some((existing) => existing.id === c.id)) {
            result.push({
              ...c,
              originDayNumber: 1,
              targetDayNumber: 1,
              status: c.completed ? 'concluido' : 'pendente',
            });
          }
        }
      });
    }

    return result;
  },

  /**
   * Alterna a conclusão de um compromisso e salva imediatamente no armazenamento local com data/hora.
   */
  toggleCommitment(dayNumber: number, taskId: string): DailyJournalEntry | null {
    const entries = this.getEntries();
    let modifiedEntry: DailyJournalEntry | null = null;
    const nowIso = new Date().toISOString();

    // 1. Procura no Diário da noite anterior (dia de origem natural)
    if (dayNumber > 1 && entries[dayNumber - 1]) {
      const prevEntry = entries[dayNumber - 1];
      const task = prevEntry.commitments?.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'concluido' : 'pendente';
        task.completedAt = task.completed ? nowIso : undefined;
        this.saveEntry(prevEntry);
        modifiedEntry = prevEntry;
      }
    }

    // 2. Procura em directCommitments do dia atual
    if (!modifiedEntry && entries[dayNumber]?.directCommitments) {
      const currentEntry = entries[dayNumber];
      const task = currentEntry.directCommitments?.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'concluido' : 'pendente';
        task.completedAt = task.completed ? nowIso : undefined;
        this.saveEntry(currentEntry);
        modifiedEntry = currentEntry;
      }
    }

    // 3. Procura nos compromissos do próprio dia atual
    if (!modifiedEntry && entries[dayNumber]?.commitments) {
      const currentEntry = entries[dayNumber];
      const task = currentEntry.commitments?.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'concluido' : 'pendente';
        task.completedAt = task.completed ? nowIso : undefined;
        this.saveEntry(currentEntry);
        modifiedEntry = currentEntry;
      }
    }

    return modifiedEntry;
  },

  /**
   * Adiciona um compromisso rápido diretamente para o dia atual em "Meu Dia".
   */
  addCommitmentToDay(dayNumber: number, text: string): DailyJournalEntry {
    const entry = this.getEntryForDay(dayNumber);
    if (!entry.directCommitments) {
      entry.directCommitments = [];
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const newCommitment: CommitmentTask = {
      id: `comm_direct_${dayNumber}_${Date.now()}`,
      text: text.trim(),
      completed: false,
      status: 'pendente',
      originDayNumber: dayNumber,
      targetDayNumber: dayNumber,
      plannedDate: todayStr,
    };
    entry.directCommitments.push(newCommitment);
    this.saveEntry(entry);
    return entry;
  },

  toggleDayTask(dayNumber: number, taskId: string): DailyJournalEntry {
    this.toggleCommitment(dayNumber, taskId);
    return this.getEntryForDay(dayNumber);
  },

  addTaskToDay(dayNumber: number, text: string): DailyJournalEntry {
    return this.addCommitmentToDay(dayNumber, text);
  },

  getUserProfile(): UserProfileData {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.name === 'Viajante Cósmico') {
          parsed.name = '';
        }
        return { ...DEFAULT_USER_PROFILE, ...parsed };
      }
    } catch (err) {
      console.error('Erro ao ler perfil:', err);
    }
    return DEFAULT_USER_PROFILE;
  },

  saveUserProfile(profile: UserProfileData): void {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      window.dispatchEvent(new CustomEvent('metodo_atomico_update'));
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
    }
  },

  getLastActivePosition(): { day: number; stepIndex: number } {
    const profile = this.getUserProfile();
    const maxDay = profile.unlocked100DaysJourney ? 100 : 21;
    try {
      const raw = localStorage.getItem(POSITION_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.day === 'number' && typeof parsed.stepIndex === 'number') {
          return {
            day: Math.min(Math.max(parsed.day, 1), maxDay),
            stepIndex: Math.max(parsed.stepIndex, 0),
          };
        }
      }
    } catch {
      // ignore
    }
    return { day: Math.min(Math.max(profile.currentDay || 1, 1), maxDay), stepIndex: 0 };
  },

  saveLastActivePosition(day: number, stepIndex: number): void {
    const profile = this.getUserProfile();
    const maxDay = profile.unlocked100DaysJourney ? 100 : 21;
    try {
      const clampedDay = Math.min(Math.max(day, 1), maxDay);
      const payload = { day: clampedDay, stepIndex: Math.max(stepIndex, 0) };
      localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem('metodo_atomico_current_day', clampedDay.toString());
      
      // Também persiste o índice na própria entrada para histórico
      const entries = this.getEntries();
      if (entries[clampedDay]) {
        entries[clampedDay].lastActiveStepIndex = stepIndex;
        localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
      }
    } catch {
      // ignore
    }
  },

  completeDay(dayNumber: number): DailyJournalEntry {
    const entry = this.getEntryForDay(dayNumber);
    entry.completed = true;
    entry.status = 'concluido';
    entry.completedAt = new Date().toISOString();
    entry.updatedAt = new Date().toISOString();
    this.saveEntry(entry);

    const profile = this.getUserProfile();
    if (dayNumber === 21 && !profile.day21CompletedAt) {
      profile.day21CompletedAt = new Date().toISOString();
    }

    const maxDay = profile.unlocked100DaysJourney ? 100 : 21;
    const nextDay = Math.min(dayNumber + 1, maxDay);
    profile.currentDay = nextDay;

    // Atualiza fase atual
    if (nextDay <= 21) profile.currentPhase = 1;
    else if (nextDay <= 50) profile.currentPhase = 2;
    else if (nextDay <= 75) profile.currentPhase = 3;
    else profile.currentPhase = 4;

    this.saveUserProfile(profile);
    this.saveLastActivePosition(nextDay, 0);
    window.dispatchEvent(new CustomEvent('metodo_atomico_update'));
    return entry;
  },

  /**
   * Registra permanentemente a conquista dos 21 Dias,
   * desbloqueia a Jornada de 100 Dias e inicia a Fase 2 (Dia 22).
   */
  unlock100DaysJourney(): UserProfileData {
    const profile = this.getUserProfile();
    const nowIso = new Date().toISOString();
    
    profile.unlocked100DaysJourney = true;
    profile.day21CompletedAt = profile.day21CompletedAt || nowIso;
    profile.journey100StartedAt = nowIso;
    profile.activeJourneyMode = '100days';
    profile.currentDay = 22;
    profile.currentPhase = 2;

    this.saveUserProfile(profile);
    this.saveLastActivePosition(22, 0);

    // Garante que o dia 22 tenha sua entrada criada caso não exista
    const entries = this.getEntries();
    if (!entries[22]) {
      entries[22] = createEmptyEntry(22);
      localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
    }

    window.dispatchEvent(new CustomEvent('metodo_atomico_update'));
    return profile;
  },

  resetJourney(): void {
    try {
      localStorage.removeItem(ENTRIES_STORAGE_KEY);
      localStorage.setItem('metodo_atomico_current_day', '1');
      const profile = this.getUserProfile();
      profile.currentDay = 1;
      profile.unlocked100DaysJourney = false;
      delete profile.day21CompletedAt;
      delete profile.journey100StartedAt;
      profile.activeJourneyMode = '21days';
      profile.currentPhase = 1;
      this.saveUserProfile(profile);
      this.saveLastActivePosition(1, 0);

      localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify({}));
      window.dispatchEvent(new CustomEvent('metodo_atomico_update'));
    } catch (err) {
      console.error('Erro ao reiniciar jornada:', err);
    }
  },

  getAllEntries(): Record<number, DailyJournalEntry> {
    return this.getEntries();
  },

  exportFullBackupJson(): string {
    const entries = this.getEntries();
    const profile = this.getUserProfile();
    const position = this.getLastActivePosition();
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      position,
      entries,
    };
    return JSON.stringify(payload, null, 2);
  },

  importFullBackupJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.entries) {
        localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(parsed.entries));
      }
      if (parsed.profile) {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(parsed.profile));
      }
      if (parsed.position && typeof parsed.position.day === 'number') {
        this.saveLastActivePosition(parsed.position.day, parsed.position.stepIndex || 0);
      }
      window.dispatchEvent(new CustomEvent('metodo_atomico_update'));
      return true;
    } catch (err) {
      console.error('Erro ao importar backup JSON:', err);
      return false;
    }
  },

  getNextDayDateString(_dayNumber?: number): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  },

  getJourneyStats(): {
    completedDays: number;
    inProgressDays: number;
    notStartedDays: number;
    futureDays: number;
    totalDays: number;
    daysRemaining: number;
    streak: number;
    totalTasks: number;
    completedTasks: number;
    percentJourney: number;
    is100DaysUnlocked: boolean;
    phase21Completed: boolean;
    activePhase: number;
  } {
    const entries = this.getEntries();
    const profile = this.getUserProfile();
    const is100DaysUnlocked = !!profile.unlocked100DaysJourney;
    const maxDayToCheck = is100DaysUnlocked ? 100 : 21;
    let completedDays = 0;
    let inProgressDays = 0;
    let totalTasks = 0;
    let completedTasks = 0;

    for (let d = 1; d <= maxDayToCheck; d++) {
      const entry = entries[d];
      const status = computeDayProgressStatus(entry);
      if (status === 'concluido') {
        completedDays++;
      } else if (status === 'em_andamento') {
        inProgressDays++;
      }

      const dayTasks = this.getCommitmentsForDay(d);
      dayTasks.forEach((c) => {
        totalTasks++;
        if (c.completed) completedTasks++;
      });
    }

    // Sequência de dias consecutivos completados a partir do Dia 1
    let streak = 0;
    for (let d = 1; d <= maxDayToCheck; d++) {
      if (entries[d] && entries[d].completed) {
        streak++;
      } else {
        break;
      }
    }
    if (streak === 0 && completedDays > 0) {
      streak = completedDays;
    }

    const totalDays = is100DaysUnlocked ? 100 : 21;
    const notStartedDays = Math.max(0, totalDays - completedDays - inProgressDays);
    const daysRemaining = Math.max(0, 21 - completedDays);
    const percentJourney = Math.round((completedDays / totalDays) * 100);
    const phase21Completed = !!(entries[21] && entries[21].completed);
    const activePhase = profile.currentPhase || 1;

    return {
      completedDays,
      inProgressDays,
      notStartedDays,
      futureDays: notStartedDays,
      totalDays,
      daysRemaining,
      streak,
      totalTasks,
      completedTasks,
      percentJourney,
      is100DaysUnlocked,
      phase21Completed,
      activePhase,
    };
  },
};
