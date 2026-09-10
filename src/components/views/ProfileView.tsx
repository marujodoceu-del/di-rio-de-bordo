import React, { useState } from 'react';
import { UserProfileData } from '../../types';
import { storageService } from '../../services/storageService';
import {
  CosmicCard,
  CosmicButton,
} from '../../design-system';
import {
  User,
  Save,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Award,
  Shield,
  Volume2,
} from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfileData;
  onSaveProfile: (profile: UserProfileData) => void;
  onResetJourney: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onResetJourney,
}) => {
  const [formData, setFormData] = useState<UserProfileData>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const stats = storageService.getJourneyStats();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const data = storageService.exportFullBackupJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Metodo_Atomico_Diario_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        const success = storageService.importFullBackupJson(text);
        if (success) {
          alert('Dados restaurados com sucesso! A página será atualizada.');
          window.location.reload();
        } else {
          alert('Erro ao importar backup: formato de arquivo inválido.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn pb-24">
      {/* Header Banner */}
      <CosmicCard variant="accent" padding="lg">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F5C563]/15 border border-[#F5C563]/30 text-[#F5C563] uppercase tracking-widest flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  CONFIGURAÇÕES PESSOAIS
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-white tracking-wide uppercase font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Perfil do Praticante
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Personalize sua identidade na jornada. Seu nome é utilizado na Meditação do Perdão (&ldquo;Eu Sou {formData.name || '(escreva seu nome)'}&rdquo;) e nos relatórios.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E5B553] to-[#F5C563] flex items-center justify-center text-[#05070B] font-serif font-bold text-xl shadow-lg">
                {formData.name ? formData.name.charAt(0).toUpperCase() : '✦'}
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-[#070A11] border border-white/[0.06] p-3.5 rounded-2xl">
              <span className="text-[11px] text-slate-400">Dias Concluídos</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {stats.completedDays} / {stats.totalDays}
              </div>
            </div>

            <div className="bg-[#070A11] border border-white/[0.06] p-3.5 rounded-2xl">
              <span className="text-[11px] text-slate-400">Progresso</span>
              <div className="text-xl font-bold font-mono text-[#F5C563] mt-0.5">
                {stats.percentJourney}%
              </div>
            </div>

            <div className="bg-[#070A11] border border-white/[0.06] p-3.5 rounded-2xl">
              <span className="text-[11px] text-slate-400">Sequência</span>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {stats.streak} dias 🔥
              </div>
            </div>

            <div className="bg-[#070A11] border border-white/[0.06] p-3.5 rounded-2xl">
              <span className="text-[11px] text-slate-400">Ações Realizadas</span>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {stats.completedTasks}
              </div>
            </div>
          </div>
        </div>
      </CosmicCard>

      {/* Conquistas Cósmicas e Status da Jornada */}
      <CosmicCard variant="accent" padding="lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F5C563]" />
              <h2
                className="text-lg font-bold text-white tracking-wide uppercase font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Conquistas & Registros Cósmicos
              </h2>
            </div>
            <span className="text-xs font-mono text-[#F5C563] uppercase">
              {profile.unlocked100DaysJourney ? '100 Dias Desbloqueados' : 'Jornada Inicial de 21 Dias'}
            </span>
          </div>

          {profile.unlocked100DaysJourney ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#070A11] to-sky-950/40 border border-[#F5C563]/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E5B553] to-[#F5C563] flex items-center justify-center text-[#05070B] shadow-lg shadow-[#F5C563]/20 shrink-0">
                    <Sparkles className="w-6 h-6 text-[#05070B]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#F5C563] uppercase tracking-widest font-bold block">
                      CONQUISTA SUPREMA REGISTRADA
                    </span>
                    <h3
                      className="text-base sm:text-lg font-bold text-white uppercase font-serif"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Transcendência dos 21 Dias • Alquimista Atômico
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">Data da Conquista</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {profile.day21CompletedAt
                      ? new Date(profile.day21CompletedAt).toLocaleDateString('pt-BR')
                      : 'Registrada'}
                  </span>
                </div>
              </div>

              <blockquote className="border-l-2 border-[#F5C563] pl-3 py-1 text-xs sm:text-sm text-slate-200 italic font-serif">
                &ldquo;Você não terminou uma jornada. Você construiu a capacidade de continuar.&rdquo;
              </blockquote>

              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300">
                  Fase 0{profile.currentPhase || 2} Ativa
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  Expansão de 100 Dias Habilitada
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#070A11] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/[0.08] flex items-center justify-center text-slate-400 shrink-0">
                  <Award className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white uppercase font-serif">
                    Jornada Inaugural em Andamento
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Conclua os 21 dias para desbloquear o Grande Horizonte de 100 Dias. Faltam{' '}
                    {Math.max(0, 21 - stats.completedDays)} dias para a Transcendência.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#F5C563] font-bold shrink-0">
                {stats.completedDays} / 21 Dias
              </span>
            </div>
          )}
        </div>
      </CosmicCard>

      {/* Profile Form */}
      <CosmicCard variant="default" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
            <h2
              className="text-lg font-bold text-white tracking-wide uppercase font-serif"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Dados do Usuário
            </h2>
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                Alterações salvas com sucesso!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Nome do Praticante (obrigatório):
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo ou como prefere ser chamado"
                className="w-full bg-[#070A11] border border-white/[0.10] focus:border-[#F5C563]/60 focus:ring-1 focus:ring-[#F5C563]/30 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">
                Utilizado na oração &ldquo;Eu sou {formData.name || '(escreva seu nome)'}&rdquo;
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                E-mail de Contato:
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-[#070A11] border border-white/[0.10] focus:border-[#F5C563]/60 focus:ring-1 focus:ring-[#F5C563]/30 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Profissão ou Arquétipo da Jornada:
              </label>
              <input
                type="text"
                value={formData.profession || ''}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                placeholder="Ex: Empreendedor, Estudante, Padeiro Artesanal..."
                className="w-full bg-[#070A11] border border-white/[0.10] focus:border-[#F5C563]/60 focus:ring-1 focus:ring-[#F5C563]/30 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Horário Preferido para o Diário Noturno:
              </label>
              <input
                type="time"
                value={formData.dailyReminderTime || '21:30'}
                onChange={(e) => setFormData({ ...formData, dailyReminderTime: e.target.value })}
                className="w-full bg-[#070A11] border border-white/[0.10] focus:border-[#F5C563]/60 focus:ring-1 focus:ring-[#F5C563]/30 rounded-xl p-3 text-sm text-slate-100 focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Propósito Central / Frase de Poder da sua Jornada:
              </label>
              <input
                type="text"
                value={formData.primaryGoal || ''}
                onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                placeholder="Ex: Conquistar consistência em meus hábitos atômicos e serenidade mental."
                className="w-full bg-[#070A11] border border-white/[0.10] focus:border-[#F5C563]/60 focus:ring-1 focus:ring-[#F5C563]/30 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/[0.08]">
            <CosmicButton
              type="submit"
              variant="primary"
              size="md"
              iconLeft={<Save className="w-4 h-4" />}
            >
              Salvar Dados do Perfil
            </CosmicButton>
          </div>
        </form>
      </CosmicCard>

      {/* Data Management & Backup */}
      <CosmicCard variant="default" padding="lg">
        <div className="space-y-6">
          <div className="border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#F5C563]" />
              <h2
                className="text-lg font-bold text-white tracking-wide uppercase font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Armazenamento & Segurança dos Seus Dados
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Seus dados estão 100% seguros e gravados localmente no seu dispositivo. Você pode exportar uma cópia de segurança a qualquer momento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <CosmicButton
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportBackup}
              iconLeft={<Download className="w-4 h-4 text-[#F5C563]" />}
            >
              Exportar Backup Completo (JSON)
            </CosmicButton>

            <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E131F] hover:bg-[#141B2D] text-slate-200 border border-white/[0.08] text-xs font-medium cursor-pointer transition">
              <Upload className="w-4 h-4 text-[#F5C563]" />
              <span>Importar Backup (JSON)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Deseja realmente reiniciar o progresso da jornada para o Dia 1? Todas as respostas e tarefas serão resetadas.'
                  )
                ) {
                  onResetJourney();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800/40 text-xs font-medium transition ml-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reiniciar Jornada de 21 Dias</span>
            </button>
          </div>
        </div>
      </CosmicCard>
    </div>
  );
};
