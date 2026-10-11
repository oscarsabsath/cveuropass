import React, { useState } from 'react';
import type { AdditionalInfo } from '../../types/cv';
import { Car, Award, FolderGit2, X } from 'lucide-react';

interface StepAdditionalProps {
  additionalInfo: AdditionalInfo;
  onChange: (info: AdditionalInfo) => void;
}

const COMMON_LICENSES = ['AM', 'A1', 'A2', 'A', 'B', 'B+E', 'C1', 'C', 'D1', 'D'];

export const StepAdditional: React.FC<StepAdditionalProps> = ({ additionalInfo, onChange }) => {
  const [certInput, setCertInput] = useState('');
  const [projectInput, setProjectInput] = useState('');

  const toggleLicense = (lic: string) => {
    const exists = additionalInfo.drivingLicenses.includes(lic);
    const updated = exists
      ? additionalInfo.drivingLicenses.filter((l) => l !== lic)
      : [...additionalInfo.drivingLicenses, lic];
    onChange({ ...additionalInfo, drivingLicenses: updated });
  };

  const addCertification = () => {
    if (!certInput.trim()) return;
    onChange({
      ...additionalInfo,
      certifications: [...additionalInfo.certifications, certInput.trim()],
    });
    setCertInput('');
  };

  const removeCertification = (index: number) => {
    onChange({
      ...additionalInfo,
      certifications: additionalInfo.certifications.filter((_, i) => i !== index),
    });
  };

  const addProject = () => {
    if (!projectInput.trim()) return;
    onChange({
      ...additionalInfo,
      projects: [...additionalInfo.projects, projectInput.trim()],
    });
    setProjectInput('');
  };

  const removeProject = (index: number) => {
    onChange({
      ...additionalInfo,
      projects: additionalInfo.projects.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div>
        <h2 className="text-lg font-bold text-slate-800">7. Información Adicional y Permisos</h2>
        <p className="text-xs text-slate-500">
          Datos complementarios que suelen solicitarse en ofertas de empleo europeas.
        </p>
      </div>

      {/* Driving licenses */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <label className="text-xs font-bold text-[#0e417a] uppercase tracking-wider block flex items-center gap-1.5">
          <Car className="w-4 h-4" />
          Permiso de Conducir (Licencias Unión Europea)
        </label>
        <p className="text-[11px] text-slate-500">
          Selecciona las categorías que posees:
        </p>

        <div className="flex flex-wrap gap-2">
          {COMMON_LICENSES.map((lic) => {
            const isSelected = additionalInfo.drivingLicenses.includes(lic);
            return (
              <button
                key={lic}
                type="button"
                onClick={() => toggleLicense(lic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  isSelected
                    ? 'bg-[#0e417a] text-white border-[#0e417a] shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                Categoría {lic}
              </button>
            );
          })}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <label className="text-xs font-bold text-[#0e417a] uppercase tracking-wider block flex items-center gap-1.5">
          <Award className="w-4 h-4" />
          Certificaciones y Licencias Profesionales
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ej. Certificado PMP, TOEFL iBT 110, Scrum Master..."
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCertification();
              }
            }}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
          <button
            type="button"
            onClick={addCertification}
            className="bg-[#0e417a] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#092e57] transition"
          >
            Añadir
          </button>
        </div>

        <div className="space-y-1.5 pt-1">
          {additionalInfo.certifications.map((cert, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
            >
              <span>{cert}</span>
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="text-slate-400 hover:text-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <label className="text-xs font-bold text-[#0e417a] uppercase tracking-wider block flex items-center gap-1.5">
          <FolderGit2 className="w-4 h-4" />
          Proyectos o Publicaciones
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ej. Publicación en revista técnica, app comunitaria, voluntariado..."
            value={projectInput}
            onChange={(e) => setProjectInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addProject();
              }
            }}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
          <button
            type="button"
            onClick={addProject}
            className="bg-[#0e417a] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#092e57] transition"
          >
            Añadir
          </button>
        </div>

        <div className="space-y-1.5 pt-1">
          {additionalInfo.projects.map((proj, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
            >
              <span>{proj}</span>
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-slate-400 hover:text-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
