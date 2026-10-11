import React from 'react';
import type { EducationItem } from '../../types/cv';
import { GraduationCap, Plus, Trash2, Building, Calendar, MapPin, Award } from 'lucide-react';

interface StepEducationProps {
  education: EducationItem[];
  onChange: (items: EducationItem[]) => void;
}

export const StepEducation: React.FC<StepEducationProps> = ({ education, onChange }) => {
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      eqfLevel: 'Nivel 6 EQF (Grado Universitario)',
      description: '',
    };
    onChange([...education, newItem]);
  };

  const removeEducation = (id: string) => {
    onChange(education.filter((item) => item.id !== id));
  };

  const updateEducation = (id: string, updates: Partial<EducationItem>) => {
    onChange(
      education.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  return (
    <div className="space-y-5 animate-fadeIn text-left">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800">4. Educación y Formación</h2>
          <p className="text-xs text-slate-500">
            Títulos universitarios, formación profesional, bachillerato y cursos certificados.
          </p>
        </div>

        <button
          type="button"
          onClick={addEducation}
          className="text-xs font-semibold bg-[#0e417a] hover:bg-[#092e57] text-white px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Añadir Titulación
        </button>
      </div>

      {education.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0e417a] flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Sin formación registrada</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Añade tus estudios para que los empleadores conozcan tus cualificaciones en el marco europeo.
          </p>
          <button
            type="button"
            onClick={addEducation}
            className="text-xs font-semibold bg-[#0e417a] text-white px-4 py-2 rounded-xl"
          >
            Añadir estudios
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-[#0e417a] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0e417a] flex items-center justify-center text-[10px]">
                    {index + 1}
                  </span>
                  {item.degree || 'Nueva titulación'}
                </span>

                <button
                  type="button"
                  onClick={() => removeEducation(item.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Degree and Institution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Título o Cualificación obtenida *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Grado en Administración y Dirección de Empresas"
                    value={item.degree}
                    onChange={(e) => updateEducation(item.id, { degree: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#0e417a]" />
                    Centro de Estudios o Universidad *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Universidad Complutense de Madrid"
                    value={item.institution}
                    onChange={(e) => updateEducation(item.id, { institution: e.target.value })}
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
                    placeholder="Ej. Madrid"
                    value={item.city}
                    onChange={(e) => updateEducation(item.id, { city: e.target.value })}
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
                    value={item.country}
                    onChange={(e) => updateEducation(item.id, { country: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* Dates & EQF Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0e417a]" />
                    Fecha Inicio
                  </label>
                  <input
                    type="month"
                    value={item.startDate}
                    onChange={(e) => updateEducation(item.id, { startDate: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="month"
                    disabled={item.isCurrent}
                    value={item.endDate === 'present' ? '' : item.endDate}
                    onChange={(e) => updateEducation(item.id, { endDate: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white disabled:bg-slate-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#0e417a]" />
                    Nivel EQF (MEC)
                  </label>
                  <select
                    value={item.eqfLevel || ''}
                    onChange={(e) => updateEducation(item.id, { eqfLevel: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                  >
                    <option value="Nivel 4 EQF (Bachillerato / FP Grado Medio)">Nivel 4 EQF (Bachillerato / FP Medio)</option>
                    <option value="Nivel 5 EQF (FP Grado Superior / Técnico)">Nivel 5 EQF (FP Superior / Técnico)</option>
                    <option value="Nivel 6 EQF (Grado Universitario / Diplomatura)">Nivel 6 EQF (Grado Universitario)</option>
                    <option value="Nivel 7 EQF (Máster Universitario)">Nivel 7 EQF (Máster Universitario)</option>
                    <option value="Nivel 8 EQF (Doctorado)">Nivel 8 EQF (Doctorado)</option>
                    <option value="Certificado Profesional">Certificado Profesional</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mención, especialidad o materias clave (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Especialización en Finanzas Corporativas / Matrícula de Honor en Proyecto Fin de Grado"
                  value={item.description || ''}
                  onChange={(e) => updateEducation(item.id, { description: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
