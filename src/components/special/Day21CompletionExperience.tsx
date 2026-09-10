import React, { useEffect, useState, useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Flame,
  Orbit,
  ArrowRight,
  CheckCircle2,
  Volume2,
  VolumeX,
  FastForward,
} from 'lucide-react';
import { JOURNEY_100_PHASES } from '../../types';

interface Day21CompletionExperienceProps {
  userName?: string;
  soundEnabled?: boolean;
  onStartExpansion: () => void;
  onStayOnDay21: () => void;
}

export const Day21CompletionExperience: React.FC<Day21CompletionExperienceProps> = ({
  userName = '',
  soundEnabled = true,
  onStartExpansion,
  onStayOnDay21,
}) => {
  // Estágios da experiência:
  // 0: Desaceleração & Átomo Inicial (0 - 3.2s)
  // 1: Expansão do Átomo em Nebulosa Cósmica (3.2s - 7.5s)
  // 2: Mensagem Conceitual de Conquista (7.5s - 11.5s)
  // 3: Desbloqueio da Jornada de 100 Dias & 4 Fases (11.5s+)
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [soundMuted, setSoundMuted] = useState(!soundEnabled);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Áudio Cósmico Sutil (Harmônicos 108Hz / 432Hz / 528Hz)
  useEffect(() => {
    if (soundMuted) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(108, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(216, ctx.currentTime + 5);
      osc.frequency.exponentialRampToValueAtTime(432, ctx.currentTime + 10);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2.5);
      gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      return () => {
        try {
          gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
          setTimeout(() => {
            osc.stop();
            ctx.close();
          }, 600);
        } catch {
          // ignore
        }
      };
    } catch {
      // AudioContext not allowed or disabled
    }
  }, [soundMuted]);

  // Timers automáticos para avanço ritualístico suave
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 3200);
    const t2 = setTimeout(() => setStage(2), 7500);
    const t3 = setTimeout(() => setStage(3), 11500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Canvas de Partículas e Expansão
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Partículas cósmicas
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    const colors = ['#F5C563', '#FDE68A', '#38BDF8', '#818CF8', '#FFFFFF'];

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 1.8;
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 100,
        maxLife: 120 + Math.random() * 100,
      });
    }

    let atomScale = 1;
    let atomPulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Desenho do Átomo Central
      atomPulse += 0.03;
      const isExpanding = stage >= 1;
      const targetScale = stage === 0 ? 1 + Math.sin(atomPulse) * 0.08 : stage === 1 ? 2.4 : 1.8;
      atomScale += (targetScale - atomScale) * 0.04;

      const baseRadius = 45 * atomScale;

      // Brilho do Núcleo
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.1,
        centerX,
        centerY,
        baseRadius * 2.5
      );
      grad.addColorStop(0, 'rgba(245, 197, 99, 0.9)');
      grad.addColorStop(0.3, 'rgba(245, 197, 99, 0.4)');
      grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.15)');
      grad.addColorStop(1, 'rgba(3, 7, 18, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Órbitas Elípticas do Átomo
      const orbitAngles = [0, Math.PI / 3, (2 * Math.PI) / 3];
      orbitAngles.forEach((angleOffset, idx) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angleOffset + atomPulse * (idx % 2 === 0 ? 0.3 : -0.3));

        ctx.beginPath();
        const rx = baseRadius * 1.8;
        const ry = baseRadius * 0.65;
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isExpanding
          ? `rgba(245, 197, 99, ${0.3 + idx * 0.15})`
          : 'rgba(245, 197, 99, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Elétron / Fóton orbitando
        const electronTime = atomPulse * 1.4 + idx * 2;
        const ex = Math.cos(electronTime) * rx;
        const ey = Math.sin(electronTime) * ry;

        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#F5C563';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      // Partículas em expansão (ativadas na transição para o estágio 1+)
      if (stage >= 1) {
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life++;

          if (p.life > p.maxLife || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            p.x = centerX + (Math.random() - 0.5) * 40;
            p.y = centerY + (Math.random() - 0.5) * 40;
            p.life = 0;
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.2 + Math.random() * 2.5;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
          }

          const currentAlpha = p.alpha * (1 - p.life / p.maxLife);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, currentAlpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [stage]);

  const firstName = userName.trim() ? userName.trim().split(' ')[0] : 'Praticante';

  return (
    <div
      id="day21-transcendence-experience"
      className="fixed inset-0 z-[100] bg-[#030610] text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-y-auto select-none"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 80% at 50% 20%, rgba(245, 197, 99, 0.08), transparent 70%), radial-gradient(ellipse 60% 60% at 50% 80%, rgba(56, 189, 248, 0.06), transparent 70%)',
      }}
    >
      {/* Background Canvas para Átomo Cósmico e Expansão */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
      />

      {/* Barra de utilitários superior */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F5C563] animate-ping" />
          <span className="text-[11px] font-mono tracking-widest text-[#F5C563] uppercase font-bold">
            Transcendência do Dia 21
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-400 hover:text-white transition"
            title={soundMuted ? 'Ativar harmônicos' : 'Silenciar'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#F5C563]" />}
          </button>

          {stage < 3 && (
            <button
              onClick={() => setStage(3)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-mono text-slate-400 hover:text-white transition"
            >
              <FastForward className="w-3.5 h-3.5" /> Avançar
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo Central Variável de Acordo com os Estágios */}
      <div className="relative z-10 w-full max-w-3xl my-auto py-8 flex flex-col items-center text-center">
        {/* ESTÁGIO 0: DESACELERAÇÃO */}
        {stage === 0 && (
          <div className="space-y-4 max-w-md mx-auto animate-in fade-in duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C563]/10 border border-[#F5C563]/30 text-[#F5C563] text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Massa Crítica Atingida</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider font-serif"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Desacelerando...
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              Você completou a 7ª ordem do 21º dia.
              <br />
              Silencie o ruído exterior e sinta a integração de cada micro-hábito atômico.
            </p>
          </div>
        )}

        {/* ESTÁGIO 1: EXPANSÃO DO ÁTOMO */}
        {stage === 1 && (
          <div className="space-y-4 max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono tracking-widest uppercase">
              <Orbit className="w-3.5 h-3.5 animate-spin" />
              <span>Rompendo a Gravidade Inicial</span>
            </div>
            <h2
              className="text-2xl sm:text-4xl font-bold text-white tracking-widest uppercase font-serif"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              O Micro se Torna Infinito
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              O átomo primordial não está confinado ao repouso. A energia acumulada em 21 noites
              de disciplina agora rompe a órbita anterior e se expande.
            </p>
          </div>
        )}

        {/* ESTÁGIO 2: MENSAGEM CONCEITUAL DE CONQUISTA */}
        {stage === 2 && (
          <div className="space-y-6 max-w-xl mx-auto animate-in fade-in zoom-in-90 duration-1000">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#F5C563]/20 to-sky-500/20 border border-[#F5C563]/40 flex items-center justify-center text-[#F5C563] shadow-lg shadow-[#F5C563]/10">
              <CheckCircle2 className="w-7 h-7 text-[#F5C563]" />
            </div>

            <div className="space-y-4">
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#F5C563] font-semibold">
                Consagração dos 21 Dias • {firstName}
              </span>

              {/* MENSAGEM CONCEITUAL CENTRAL */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#070A12]/90 border border-white/[0.1] shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#F5C563]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                <blockquote
                  className="text-xl sm:text-2xl md:text-3xl font-serif text-white leading-relaxed font-bold tracking-wide"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  “Você não terminou uma jornada.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C563] via-amber-200 to-sky-300">
                    Você construiu a capacidade de continuar.
                  </span>”
                </blockquote>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-light">
              A constância que você gerou não é um ponto de chegada. É o seu novo ponto de partida.
            </p>
          </div>
        )}

        {/* ESTÁGIO 3: DESBLOQUEIO DA JORNADA DE 100 DIAS & 4 FASES */}
        {stage === 3 && (
          <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 w-full">
            {/* Tag de Desbloqueio */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F5C563]/20 via-sky-500/20 to-emerald-500/20 border border-[#F5C563]/50 text-white text-xs font-mono tracking-widest uppercase font-bold shadow-lg shadow-[#F5C563]/10">
              <Sparkles className="w-3.5 h-3.5 text-[#F5C563]" />
              <span>PRIMEIRA GRANDE JORNADA CONCLUÍDA</span>
            </div>

            {/* Título Principal de Desbloqueio */}
            <div className="space-y-2">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-sky-300 uppercase tracking-wider font-serif"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                JORNADA DE 100 DIAS DESBLOQUEADA
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Você conquistou a consistência atômica. Seu diário agora se expande para as 4
                grandes estações da transformação humana:
              </p>
            </div>

            {/* Grade Estrutural das 4 Fases */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
              {JOURNEY_100_PHASES.map((p) => {
                const isCompleted = p.phase === 1;
                const isCurrentNext = p.phase === 2;

                return (
                  <div
                    key={p.phase}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition relative backdrop-blur-md ${
                      isCompleted
                        ? 'bg-amber-950/20 border-[#F5C563]/40'
                        : isCurrentNext
                        ? 'bg-sky-950/30 border-sky-400/50 shadow-lg shadow-sky-500/10'
                        : 'bg-[#070A12]/80 border-white/[0.08] opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs"
                          style={{
                            backgroundColor: p.badgeBg,
                            color: p.themeColor,
                            border: `1px solid ${p.badgeBorder}`,
                          }}
                        >
                          {p.phase === 1 && <CheckCircle2 className="w-4 h-4 text-[#F5C563]" />}
                          {p.phase === 2 && <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />}
                          {p.phase === 3 && <Flame className="w-4 h-4 text-[#818CF8]" />}
                          {p.phase === 4 && <Orbit className="w-4 h-4 text-[#10B981]" />}
                        </div>
                        <div>
                          <span
                            className="text-[10px] font-mono font-bold uppercase tracking-wider block"
                            style={{ color: p.themeColor }}
                          >
                            {p.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Dias {p.dayStart} a {p.dayEnd} ({p.totalDays} dias)
                          </span>
                        </div>
                      </div>

                      {isCompleted ? (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                          Concluído ✓
                        </span>
                      ) : isCurrentNext ? (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/40 uppercase animate-pulse">
                          Próxima Fase
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-500 uppercase">
                          Bloqueada
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug">
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Ações de Desbloqueio e Expansão */}
            <div className="pt-4 space-y-3">
              <button
                id="btn-start-expansion-100"
                onClick={onStartExpansion}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F5C563] via-amber-400 to-[#F5C563] text-slate-950 font-bold text-sm sm:text-base tracking-wider uppercase font-serif shadow-xl shadow-[#F5C563]/25 hover:shadow-[#F5C563]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mx-auto group"
              >
                <span>COMEÇAR MINHA EXPANSÃO</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div>
                <button
                  onClick={onStayOnDay21}
                  className="text-xs font-mono text-slate-400 hover:text-white transition underline underline-offset-4"
                >
                  Permanecer no resumo do Dia 21
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé ritualístico com passos */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-center gap-2 pb-2">
        {[0, 1, 2, 3].map((stepIdx) => (
          <button
            key={stepIdx}
            onClick={() => setStage(stepIdx as 0 | 1 | 2 | 3)}
            className={`h-1.5 rounded-full transition-all ${
              stage === stepIdx
                ? 'w-8 bg-[#F5C563]'
                : stage > stepIdx
                ? 'w-3 bg-white/40'
                : 'w-2 bg-white/10'
            }`}
            title={`Passo ${stepIdx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
