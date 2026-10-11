import React from 'react';
import { Sparkles, Briefcase, FileText, CheckCircle2, Wand2 } from 'lucide-react';

interface StepProfileProps {
  targetJobTitle: string;
  summary: string;
  onJobTitleChange: (title: string) => void;
  onSummaryChange: (summary: string) => void;
  onOpenAiAssistant: () => void;
}

export const StepProfile: React.FC<StepProfileProps> = ({
  targetJobTitle,
  summary,
  onJobTitleChange,
  onSummaryChange,
  onOpenAiAssistant,
}) => {
  return (
    <div className="space-y-5 animate-fadeIn text-left">
      <div>
        <h2 className="text-lg font-bold text-slate-800">2. Objetivo y Perfil Profesional con IA</h2>
        <p className="text-xs text-slate-500">
          La sección de perfil es lo primero que leen los reclutadores europeos. Debe sintetizar tu valor en 3 a 5 líneas.
        </p>
      </div>

      {/* Target Job Title */}
      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-[#0e417a]" />
          Puesto o Empleo Deseado (Título del CV) *
        </label>
        <input
          type="text"
          placeholder="Ej. Desarrollador Full Stack / Responsable de Logística / Enfermero Colegiado"
          value={targetJobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white font-medium"
        />
        <span className="text-[11px] text-slate-400 mt-1 block">
          Aparece en el encabezado principal de tu CV Europass.
        </span>
      </div>

      {/* AI Assistant Banner / Button */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0e417a] to-[#1e70bf] rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Asistente Inteligente
            </span>
          </div>
          <h4 className="font-bold text-sm sm:text-base">¿No sabes cómo redactar tu perfil?</h4>
          <p className="text-xs text-blue-100 max-w-md">
            Deja que la IA de Gemini elabore 3 opciones profesionales siguiendo las directrices oficiales europeas (concisas, ATS-friendly y orientadas a logros).
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAiAssistant}
          className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Wand2 className="w-4 h-4 text-slate-900" />
          Redactar con IA
        </button>
      </div>

      {/* Professional Summary Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#0e417a]" />
            Perfil Profesional / Resumen Biográfico
          </label>
          <span className="text-[11px] text-slate-400">
            {summary.length} caracteres ({summary.split(/\s+/).filter(Boolean).length} palabras)
          </span>
        </div>

        <textarea
          rows={5}
          placeholder="Escribe tu perfil profesional o haz clic en 'Redactar con IA' para que el asistente lo elabore automáticamente..."
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white leading-relaxed"
        />
      </div>

      {/* European Standards Tips Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 space-y-2">
        <div className="font-semibold text-[#0e417a] flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          Estándares actuales de redacción en Europa:
        </div>
        <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
          <li>
            <strong>Longitud óptima:</strong> 40 a 70 palabras (3 a 5 líneas).
          </li>
          <li>
            <strong>Evita clichés:</strong> Omite frases trilladas como "persona puntual" o "proactiva con ganas de trabajar".
          </li>
          <li>
            <strong>Enfócate en el impacto:</strong> Destaca tu especialidad, años de experiencia y qué problemas resuelves.
          </li>
          <li>
            <strong>Tercera persona o estilo ejecutivo:</strong> En Europass se prefiere una redacción directa sin abusar del pronombre "yo".
          </li>
        </ul>
      </div>
    </div>
  );
};
