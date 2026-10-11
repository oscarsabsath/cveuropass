import React, { useState } from 'react';
import type { WorkExperience } from '../../types/cv';
import { Briefcase, Plus, Trash2, Sparkles, Building2, Calendar, MapPin, RefreshCw } from 'lucide-react';
import { enhanceJobDescription } from '../../services/aiService';

interface StepExperienceProps {
  workExperience: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

export const StepExperience: React.FC<StepExperienceProps> = ({ workExperience, onChange }) => {
  const [loadingAiId, setLoadingAiId] = useState<string | null>(null);

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      position: '',
      company: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    };
    onChange([...workExperience, newExp]);
  };

  const removeExperience = (id: string) => {
    onChange(workExperience.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, updates: Partial<WorkExperience>) => {
    onChange(
      workExperience.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  const handleEnhanceWithAi = async (exp: WorkExperience) => {
    if (!exp.description.trim()) {
      alert('Escribe primero unas breves notas o funciones para que la IA pueda pulirlas.');
      return;
    }
    setLoadingAiId(exp.id);
    try {
      const improved = await enhanceJobDescription(exp.position, exp.company, exp.description);
      updateExperience(exp.id, { description: improved });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAiId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn text-left">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800">3. Experiencia Laboral</h2>
          <p className="text-xs text-slate-500">
            Enumera tus empleos en orden cronológico inverso (el más reciente primero).
          </p>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="text-xs font-semibold bg-[#0e417a] hover:bg-[#092e57] text-white px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Añadir Puesto
        </button>
      </div>

      {workExperience.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0e417a] flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Sin experiencia registrada</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Si estás comenzando tu carrera o no tienes experiencia previa, puedes omitir este paso o agregar voluntariados y prácticas.
          </p>
          <button
            type="button"
            onClick={addExperience}
            className="text-xs font-semibold bg-[#0e417a] text-white px-4 py-2 rounded-xl"
          >
            Añadir mi primera experiencia
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {workExperience.map((exp, index) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3 relative group"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-[#0e417a] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0e417a] flex items-center justify-center text-[10px]">
                    {index + 1}
                  </span>
                  {exp.position || 'Nuevo puesto laboral'}
                </span>

                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition"
                  title="Eliminar experiencia"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Position and Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Cargo o Puesto *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Coordinador de Proyecto"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#0e417a]" />
                    Empresa / Empleador *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Santander, Telefónica, Freelance"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* City and Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0e417a]" />
                    Ciudad
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Barcelona"
                    value={exp.city}
                    onChange={(e) => updateExperience(exp.id, { city: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. España"
                    value={exp.country}
                    onChange={(e) => updateExperience(exp.id, { country: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0e417a]" />
                    Fecha Inicio (Mes/Año)
                  </label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Fecha Fin (Mes/Año)
                  </label>
                  <input
                    type="month"
                    disabled={exp.isCurrent}
                    value={exp.endDate === 'present' ? '' : exp.endDate}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white disabled:bg-slate-100 disabled:opacity-50"
                  />
                </div>

                <div className="pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={exp.isCurrent}
                      onChange={(e) =>
                        updateExperience(exp.id, {
                          isCurrent: e.target.checked,
                          endDate: e.target.checked ? 'present' : '',
                        })
                      }
                      className="rounded border-slate-300 text-[#0e417a] focus:ring-[#0e417a]"
                    />
                    Puesto actual
                  </label>
                </div>
              </div>

              {/* Description & AI Enhance Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Actividades y Responsabilidades Principales
                  </label>

                  <button
                    type="button"
                    disabled={loadingAiId === exp.id}
                    onClick={() => handleEnhanceWithAi(exp)}
                    className="text-[11px] font-semibold text-[#0e417a] hover:text-blue-900 bg-blue-50 hover:bg-blue-100/70 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                  >
                    {loadingAiId === exp.id ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Optimizando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Pulir con IA (Fórmula STAR)
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  rows={3}
                  placeholder="• Describe tus funciones principales, proyectos y logros..."
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white leading-relaxed font-sans"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
