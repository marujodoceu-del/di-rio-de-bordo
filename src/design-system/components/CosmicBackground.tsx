import React from 'react';
import { getEvolutionStageForDay } from '../tokens';

interface CosmicBackgroundProps {
  currentDay?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * CosmicBackground
 * Fornece a atmosfera cósmica profunda, imersiva e sutil:
 * - Fundo escuro profundo (#04060A)
 * - Vinheta de profundidade esférica
 * - Efeitos luminosos suaves baseados no estágio de evolução do dia
 * - Zero ruído, zero poluição visual, zero neon agressivo
 */
export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  currentDay = 1,
  children,
  className = '',
}) => {
  const stage = getEvolutionStageForDay(currentDay);

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden text-slate-100 flex flex-col selection:bg-[#F5C563] selection:text-[#04060A] ${className}`}
      style={{ backgroundColor: '#05070B' }}
    >
      {/* Camada 1: Vinheta Esférica Suave e Profunda */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(14, 19, 31, 0.85) 0%, rgba(5, 7, 11, 0.98) 100%)`,
        }}
      />

      {/* Camada 2: Emissão Espectral Sutil do Estágio Cósmico (expande conforme o dia avança) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-25 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle 600px at 85% 15%, ${stage.glowColor} 0%, transparent 70%), radial-gradient(circle 500px at 15% 85%, rgba(129, 140, 248, 0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Camada 3: Geometria de Grade Científica Quântica Ultra-sutil (opacidade de 2.5%) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Conteúdo da Aplicação */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};
