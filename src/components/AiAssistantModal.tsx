import React, { useState } from 'react';
import { Sparkles, X, Check, RefreshCw, Wand2, Lightbulb, Bot } from 'lucide-react';
import type { ProfileDraftOption } from '../services/aiService';
import { generateEuropassProfiles, getStoredApiKey } from '../services/aiService';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetJobTitle: string;
  currentSummary?: string;
  onSelectSummary: (summary: string) => void;
  onOpenApiKeyModal: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  targetJobTitle,
  onSelectSummary,
  onOpenApiKeyModal,
}) => {
  const [jobTitle, setJobTitle] = useState(targetJobTitle || '');
  const [yearsExp, setYearsExp] = useState('3-5');
  const [strengths, setStrengths] = useState('');
  const [achievements, setAchievements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<ProfileDraftOption[] | null>(null);
  const hasApiKey = Boolean(getStoredApiKey());

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const results = await generateEuropassProfiles({
        jobTitle: jobTitle || 'Profesional multidisciplinar',
        yearsOfExperience: yearsExp,
        strengths: strengths || 'Gestión eficiente y resolución de problemas',
        keyAchievements: achievements,
      });
      setGeneratedOptions(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (text: string) => {
    onSelectSummary(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0e417a] via-[#155396] to-[#1e70bf] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-1.5">
                Asistente de Perfil con IA
                <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Europass
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                Redacción adaptada a estándares de selección europeos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-left">
          {!hasApiKey && (
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Usando motor inteligente offline. Conecta tu <strong>Gemini API Key gratuita</strong> para redacción personalizada al 100%.
                </span>
              </div>
              <button
                onClick={onOpenApiKeyModal}
                className="text-[11px] font-semibold text-[#0e417a] underline shrink-0 hover:text-blue-900"
              >
                Configurar
              </button>
            </div>
          )}

          {/* Form questionnaire */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                ¿A qué cargo o área profesional aspiras?
              </label>
              <input
                type="text"
                placeholder="Ej. Ingeniero de Software, Administrativo Bilingüe, etc."
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Años de experiencia
                </label>
                <select
                  value={yearsExp}
                  onChange={(e) => setYearsExp(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                >
                  <option value="Recién titulado / Sin experiencia previa">
                    Recién graduado / Primer empleo
                  </option>
                  <option value="1 a 2 años">Junior (1 - 2 años)</option>
                  <option value="3 a 5 años">Intermedio (3 - 5 años)</option>
                  <option value="más de 5 años">Senior (5 - 8 años)</option>
                  <option value="más de 10 años">Experto / Lead (+10 años)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Tus 2 o 3 fortalezas clave
                </label>
                <input
                  type="text"
                  placeholder="Ej. React, trabajo en equipo, Scrum"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Logro destacado o valor que aportas (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Reduje tiempos de entrega, lideré proyectos internacionales..."
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
              />
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleGenerate}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm bg-[#0e417a] hover:bg-[#092e57] text-white transition flex items-center justify-center gap-2 shadow-md shadow-blue-900/10 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  Redactando propuestas con IA...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-amber-300" />
                  Generar 3 perfiles de alto impacto
                </>
              )}
            </button>
          </div>

          {/* Results section */}
          {generatedOptions && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Propuestas generadas:
                </span>
                <span className="text-[11px] text-slate-500">Toca para seleccionar</span>
              </div>

              {generatedOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#0e417a] hover:shadow-md transition-all group flex flex-col justify-between gap-3 text-left"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#0e417a]">{opt.title}</span>
                      <span className="text-[10px] bg-blue-50 text-[#0e417a] px-2 py-0.5 rounded-md font-medium">
                        {opt.focus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{opt.text}"
                    </p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleApply(opt.text)}
                      className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Usar en mi CV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <span>Estándar oficial Europass (3 a 5 líneas de alto valor)</span>
          <button
            onClick={onClose}
            className="font-medium text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
