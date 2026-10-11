import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface BottomNavProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onDownloadPdf?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="no-print sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Back Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstStep}
          className={`flex items-center gap-1 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition ${
            isFirstStep
              ? 'opacity-0 pointer-events-none'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Atrás
        </button>

        {/* Indicator */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Paso {currentStep} de {totalSteps}
          </span>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i + 1 === currentStep
                    ? 'w-5 bg-[#0e417a]'
                    : i + 1 < currentStep
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Next or Finish Button */}
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-md bg-[#0e417a] hover:bg-[#092e57] text-white active:scale-95"
        >
          {isLastStep ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Finalizado
            </>
          ) : (
            <>
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
