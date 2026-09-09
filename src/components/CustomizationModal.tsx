import React, { useState, useEffect, useRef } from 'react';
import { CoachProfile, CoacheeProfessionPreset, AccentColorPalette, CoverArtStyle } from '../types';
import {
  X,
  Sparkles,
  Check,
  User,
  Palette,
  Image as ImageIcon,
  Wheat,
  Upload,
  RotateCcw,
  SlidersHorizontal,
  Bookmark,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import {
  COACHEE_PRESETS,
  PALETTE_DEFINITIONS,
  ProfessionPresetInfo,
} from '../data/coacheePresets';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CoachProfile;
  onSave: (newProfile: CoachProfile) => void;
}

type TabType = 'mentor' | 'coachee' | 'styles';

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('coachee');
  const [formData, setFormData] = useState<CoachProfile>(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      ...profile,
      coverArtStyle: profile.coverArtStyle || 'metodo-atomico',
      accentPalette: profile.accentPalette || 'cosmic-amber',
    });
  }, [profile]);

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: CoacheeProfessionPreset) => {
    const preset = COACHEE_PRESETS[presetId];
    if (!preset) return;

    setFormData((prev) => ({
      ...prev,
      coacheeProfessionPreset: presetId,
      coacheeProfession: presetId === 'personalizado' ? prev.coacheeProfession : preset.title.split('/')[0].trim(),
      coacheeInterests: preset.defaultInterests,
      coacheeMetaphor: preset.defaultMetaphor,
      accentPalette: preset.suggestedPalette,
      // If baker preset, suggest the baker cover archetype
      coverArtStyle: presetId === 'padeiro' ? 'coachee-archetype' : prev.coverArtStyle || 'metodo-atomico',
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (under 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Por favor selecione uma imagem de até 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({
          ...prev,
          coverArtStyle: 'custom-upload',
          customCoverDataUrl: result,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/30 text-slate-100 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-amber-200 font-serif leading-tight">
                Estúdio de Personalização do Coachee & Capas
              </h3>
              <p className="text-xs text-slate-400">
                Configure os dados do mentor, profissão do coachee, metáforas, paletas e modelo de capa.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-1 text-xs shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('coachee')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'coachee'
                ? 'border-amber-400 text-amber-300 bg-slate-900 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>1. Perfil & Ofício do Coachee</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
              Novo
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('styles')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'styles'
                ? 'border-amber-400 text-amber-300 bg-slate-900 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Capa & Paleta de Cores</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mentor')}
            className={`px-3 py-2 rounded-t-lg font-medium flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
              activeTab === 'mentor'
                ? 'border-amber-400 text-amber-300 bg-slate-900 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>3. Marca do Coach & Gráfica</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto text-sm flex-1">
          {/* TAB 1: COACHEE PERSONA & PROFISSÃO */}
          {activeTab === 'coachee' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Nome do Coachee (Praticante)
                </label>
                <input
                  type="text"
                  value={formData.coacheeName}
                  onChange={(e) => setFormData({ ...formData, coacheeName: e.target.value })}
                  placeholder="Ex: João Ferreira (ou deixe em branco para escrever à mão)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <p className="text-[11px] text-slate-400">
                  O nome impresso na capa, no ritual noturno e nas 21 meditações diárias.
                </p>
              </div>

              {/* Presets de Profissão e Arquétipos */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                  <span>Arquétipo / Profissão do Coachee:</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Clique para aplicar sugestões automáticas
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.values(COACHEE_PRESETS).map((preset) => {
                    const isSelected = formData.coacheeProfessionPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`p-2 rounded-lg border text-left flex flex-col justify-between transition ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-base">{preset.emoji}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <span className="text-xs font-semibold leading-tight line-clamp-1">
                          {preset.title.split('/')[0]}
                        </span>
                        <span className="text-[9.5px] text-slate-400 line-clamp-1">
                          {preset.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detalhes Específicos do Coachee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Ofício / Especialidade
                  </label>
                  <input
                    type="text"
                    value={formData.coacheeProfession || ''}
                    onChange={(e) => setFormData({ ...formData, coacheeProfession: e.target.value })}
                    placeholder="Ex: Padeiro Artesanal & Mestre Fermentador"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Gostos & Paixões Pessoais
                  </label>
                  <input
                    type="text"
                    value={formData.coacheeInterests || ''}
                    onChange={(e) => setFormData({ ...formData, coacheeInterests: e.target.value })}
                    placeholder="Ex: Fermentação lenta, café moído na hora, silêncio da madrugada..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition text-xs"
                  />
                </div>
              </div>

              {/* Metáfora / Frase de Conexão do Método com o Universo do Coachee */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-amber-300">
                    Metáfora de Transformação para o Coachee
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.coacheeProfessionPreset) {
                        setFormData((prev) => ({
                          ...prev,
                          coacheeMetaphor: COACHEE_PRESETS[prev.coacheeProfessionPreset || 'padeiro'].defaultMetaphor,
                        }));
                      }
                    }}
                    className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restaurar metáfora padrão
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={formData.coacheeMetaphor || ''}
                  onChange={(e) => setFormData({ ...formData, coacheeMetaphor: e.target.value })}
                  placeholder="Ex: Assim como o pão precisa de fermentação silenciosa e do calor do forno para crescer e alimentar vidas, a sua mente precisa da constância dos 21 dias para forjar seu destino."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition text-xs resize-none"
                />
                <p className="text-[11px] text-slate-400">
                  Esta metáfora personalizada aparece com destaque na capa do diário e em pontos-chave da jornada.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CAPA & PALETAS DE CORES */}
          {activeTab === 'styles' && (
            <div className="space-y-5">
              {/* Estilos de Arte da Capa */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                  <span>Modelo de Arte da Capa:</span>
                  <span className="text-[10px] text-amber-400/80 font-mono">
                    Padrão: Método Atômico
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Opção 1: Método Atômico Oficial (Padrão do usuário!) */}
                  <div
                    onClick={() => setFormData({ ...formData, coverArtStyle: 'metodo-atomico' })}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      formData.coverArtStyle === 'metodo-atomico' || !formData.coverArtStyle
                        ? 'bg-amber-400/15 border-amber-400 ring-1 ring-amber-400/60'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-amber-200 flex items-center gap-1.5">
                        ⭐ Capa Oficial Maru Coach
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        Padrão
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      A arte oficial do <strong>Método Atômico</strong> (aurora cósmica na montanha, órbita atômica, DNA, galáxia e pilares de transformação).
                    </p>
                  </div>

                  {/* Opção 2: Arquétipo Temático do Coachee (ex: Padeiro) */}
                  <div
                    onClick={() => setFormData({ ...formData, coverArtStyle: 'coachee-archetype' })}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      formData.coverArtStyle === 'coachee-archetype'
                        ? 'bg-amber-400/15 border-amber-400 ring-1 ring-amber-400/60'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-amber-200 flex items-center gap-1.5">
                        <Wheat className="w-3.5 h-3.5 text-amber-400" />
                        Capa Temática do Coachee
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-600/20 text-amber-300">
                        Padeiro / Artesanal
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Arte especial com elementos do ofício do coachee (pães artesanais, trigo dourado, forno cósmico e alquimia).
                    </p>
                  </div>

                  {/* Opção 3: Cósmica Profunda Clássica */}
                  <div
                    onClick={() => setFormData({ ...formData, coverArtStyle: 'cosmic-vibrant' })}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      formData.coverArtStyle === 'cosmic-vibrant'
                        ? 'bg-amber-400/15 border-amber-400 ring-1 ring-amber-400/60'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                        🌌 Capa Cósmica Profunda
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        Clássica
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Fundo espacial estelar de alta densidade astronômica e tons de safira noturno.
                    </p>
                  </div>

                  {/* Opção 4: P&B Gravura Científica */}
                  <div
                    onClick={() => setFormData({ ...formData, coverArtStyle: 'celestial-bw' })}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      formData.coverArtStyle === 'celestial-bw'
                        ? 'bg-amber-400/15 border-amber-400 ring-1 ring-amber-400/60'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                        📜 P&B Gravura Científica
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        Gráfica Econômica
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Estilo litografia e mapa celeste renascentista para impressão em preto e branco.
                    </p>
                  </div>
                </div>

                {/* Opção 5: Upload de Arquivo Próprio */}
                <div className="pt-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-3 rounded-xl border border-dashed cursor-pointer flex items-center justify-between transition ${
                      formData.coverArtStyle === 'custom-upload'
                        ? 'bg-amber-400/10 border-amber-400 text-amber-200'
                        : 'bg-slate-950/50 border-slate-700 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-300">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">
                          {formData.customCoverDataUrl
                            ? 'Imagem Própria Carregada (Clique para trocar)'
                            : 'Fazer Upload de Outra Foto ou Arte (Opcional)'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Se você tiver uma foto do seu coachee ou outra arte de capa, selecione do seu computador.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-200 hover:text-white"
                    >
                      Procurar
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Paletas de Cores de Acento */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Paleta de Cores de Destaque:
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(PALETTE_DEFINITIONS).map((pal) => {
                    const isSelected = formData.accentPalette === pal.id;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, accentPalette: pal.id })}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${
                          isSelected
                            ? 'bg-slate-900 border-amber-400 ring-1 ring-amber-400/50 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-black/40 shrink-0 shadow-xs"
                          style={{ backgroundColor: pal.accentHex }}
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold truncate leading-tight">{pal.name.split('(')[0]}</p>
                          <p className="text-[9px] text-slate-400 truncate">{pal.description.split(',')[0]}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MARCA DO COACH & GRÁFICA */}
          {activeTab === 'mentor' && (
            <div className="space-y-4">
              {/* Coach Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">
                  Seu Nome (Coach / Mentor)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Maru Coach / Prof. Dr. Adilson"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              {/* Credentials / Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: MÉTODO ATÔMICO • Mentoria Cósmica"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Assinatura & Áreas de Atuação
                  </label>
                  <input
                    type="text"
                    value={formData.credentials}
                    onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                    placeholder="Ex: Física & Astronomia • Desenvolvimento Humano"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Data de Início</label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="Ex: 01/10/2026"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Data de Término</label>
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="Ex: 21/10/2026"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition text-xs font-mono"
                  />
                </div>
              </div>

              {/* Dedication */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Dedicatória Geral (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.customDedication}
                  onChange={(e) => setFormData({ ...formData, customDedication: e.target.value })}
                  placeholder="Ex: A mesma inteligência cósmica que rege o universo habita em você."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition text-xs resize-none"
                />
              </div>

              {/* Print/Booklet Options */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.includeSpiralMargin}
                    onChange={(e) => setFormData({ ...formData, includeSpiralMargin: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-xs text-slate-200">
                    Adicionar <strong>Margem para Encadernação (Wire-O / Espiral)</strong> (+14mm à esquerda)
                  </span>
                </label>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-300">Formato Alvo:</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paperSize: 'A5' })}
                    className={`px-3 py-1 rounded text-xs font-semibold border transition ${
                      formData.paperSize === 'A5'
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                        : 'bg-slate-950 border-slate-700 text-slate-400'
                    }`}
                  >
                    A5 (Padrão Caderno 148×210mm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paperSize: 'A4' })}
                    className={`px-3 py-1 rounded text-xs font-semibold border transition ${
                      formData.paperSize === 'A4'
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                        : 'bg-slate-950 border-slate-700 text-slate-400'
                    }`}
                  >
                    A4 (Folha Grande 210×297mm)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
            <div className="text-[11px] text-slate-400">
              {activeTab === 'coachee' && 'Passo 1 de 3 • Ajuste o perfil do seu coachee'}
              {activeTab === 'styles' && 'Passo 2 de 3 • Escolha a arte da capa e cores'}
              {activeTab === 'mentor' && 'Passo 3 de 3 • Marcas e dados de gráfica'}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition shadow-lg shadow-amber-500/20"
              >
                <Check className="w-4 h-4" />
                Aplicar ao Diário de Bordo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
