import React from 'react';
import { Sparkles, RotateCcw, Key, Check } from 'lucide-react';
import { getStoredApiKey } from '../services/aiService';

interface HeaderProps {
  currentStep: number;
  totalSteps?: number;
  stepTitles: string[];
  onStepClick: (step: number) => void;
  onLoadExample: () => void;
  onReset: () => void;
  onOpenApiKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  stepTitles,
  onStepClick,
  onLoadExample,
  onReset,
  onOpenApiKeyModal,
}) => {
  const hasApiKey = Boolean(getStoredApiKey());

  return (
    <header className="no-print bg-[#0e417a] text-white shadow-md sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#003399] border-2 border-amber-300 flex items-center justify-center shadow-inner">
            <span className="text-amber-300 text-[10px] font-black">★EU★</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight lowercase">europass</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-sm tracking-widest uppercase">
                IA
              </span>
            </div>
            <p className="text-[10px] text-blue-200 hidden sm:block">
              Creador de Hoja de Vida y CV Estándar Europeo A4
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className={`text-xs px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 font-semibold ${
              hasApiKey
                ? 'bg-emerald-600/90 hover:bg-emerald-600 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Configurar clave de Gemini"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasApiKey ? 'IA Gemini Activa' : 'Configurar IA'}
            </span>
          </button>

          <button
            type="button"
            onClick={onLoadExample}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-xl transition font-medium flex items-center gap-1"
            title="Cargar currículum de muestra"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Ejemplo</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="text-xs bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-xl transition"
            title="Limpiar datos"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Steps Horizontal Scroller / Indicator */}
      <div className="bg-[#092e57] px-4 py-2 border-t border-blue-900/40 overflow-x-auto scrollbar-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between sm:justify-center gap-1 sm:gap-3 min-w-max">
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;

            return (
              <button
                key={stepNum}
                onClick={() => onStepClick(stepNum)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-900 font-extrabold shadow-xs'
                    : isCompleted
                    ? 'text-blue-200 hover:text-white font-medium'
                    : 'text-blue-400/60 hover:text-blue-200 font-normal'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive
                      ? 'bg-slate-900 text-amber-400 font-bold'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-blue-950 text-blue-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5" /> : stepNum}
                </span>
                <span className="text-[11px] whitespace-nowrap">{title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
