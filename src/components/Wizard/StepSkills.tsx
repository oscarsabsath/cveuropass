import React, { useState } from 'react';
import type { DigitalSkill } from '../../types/cv';
import { X, Sparkles, RefreshCw, Users, Laptop } from 'lucide-react';
import { suggestSkillsForRole } from '../../services/aiService';

interface StepSkillsProps {
  digitalSkills: DigitalSkill[];
  softSkills: string[];
  targetJobTitle: string;
  onDigitalSkillsChange: (skills: DigitalSkill[]) => void;
  onSoftSkillsChange: (skills: string[]) => void;
}

export const StepSkills: React.FC<StepSkillsProps> = ({
  digitalSkills,
  softSkills,
  targetJobTitle,
  onDigitalSkillsChange,
  onSoftSkillsChange,
}) => {
  const [newSkillText, setNewSkillText] = useState('');
  const [newSoftText, setNewSoftText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const addDigitalSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (digitalSkills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;

    onDigitalSkillsChange([
      ...digitalSkills,
      { id: `sk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, name: trimmed },
    ]);
    setNewSkillText('');
  };

  const removeDigitalSkill = (id: string) => {
    onDigitalSkillsChange(digitalSkills.filter((s) => s.id !== id));
  };

  const addSoftSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (softSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;

    onSoftSkillsChange([...softSkills, trimmed]);
    setNewSoftText('');
  };

  const removeSoftSkill = (index: number) => {
    onSoftSkillsChange(softSkills.filter((_, i) => i !== index));
  };

  const handleAiSuggest = async () => {
    setIsSuggesting(true);
    try {
      const suggestions = await suggestSkillsForRole(targetJobTitle || 'Especialista profesional');

      // Merge unique digital skills
      const currentDigitalNames = new Set(digitalSkills.map((s) => s.name.toLowerCase()));
      const newDigitals = suggestions.digital
        .filter((name) => !currentDigitalNames.has(name.toLowerCase()))
        .map((name) => ({
          id: `sk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name,
        }));

      onDigitalSkillsChange([...digitalSkills, ...newDigitals]);

      // Merge unique soft skills
      const currentSoft = new Set(softSkills.map((s) => s.toLowerCase()));
      const newSoft = suggestions.soft.filter((name) => !currentSoft.has(name.toLowerCase()));
      onSoftSkillsChange([...softSkills, ...newSoft]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div>
        <h2 className="text-lg font-bold text-slate-800">5. Competencias Digitales y Habilidades</h2>
        <p className="text-xs text-slate-500">
          En el marco europeo DigComp, las habilidades digitales y de gestión son fundamentales para cualquier perfil.
        </p>
      </div>

      {/* AI Suggest Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0e417a] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0e417a]">
              Sugerir competencias según tu puesto con IA
            </h4>
            <p className="text-[11px] text-slate-500">
              Analiza "{targetJobTitle || 'tu perfil'}" y añade herramientas demandadas en Europa.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isSuggesting}
          onClick={handleAiSuggest}
          className="text-xs font-semibold bg-[#0e417a] hover:bg-[#092e57] text-white px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-xs disabled:opacity-60"
        >
          {isSuggesting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Sugerir con IA
            </>
          )}
        </button>
      </div>

      {/* Digital Skills (DigComp) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <label className="text-xs font-bold text-[#0e417a] uppercase tracking-wider block flex items-center gap-1.5">
          <Laptop className="w-4 h-4" />
          Competencias Digitales y Software (DigComp)
        </label>

        {/* Input to add */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Añadir programa o tecnología (ej. Excel avanzado, Python, SAP, Figma...)"
            value={newSkillText}
            onChange={(e) => setNewSkillText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addDigitalSkill(newSkillText);
              }
            }}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
          <button
            type="button"
            onClick={() => addDigitalSkill(newSkillText)}
            className="bg-[#0e417a] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#092e57] transition"
          >
            Añadir
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {digitalSkills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0e417a] border border-blue-200 text-xs px-3 py-1 rounded-full font-medium"
            >
              {skill.name}
              <button
                type="button"
                onClick={() => removeDigitalSkill(skill.id)}
                className="hover:text-red-500 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {digitalSkills.length === 0 && (
            <span className="text-xs text-slate-400 italic">
              No has añadido competencias digitales aún. Escribe arriba o pulsa "Sugerir con IA".
            </span>
          )}
        </div>
      </div>

      {/* Soft Skills */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <label className="text-xs font-bold text-[#0e417a] uppercase tracking-wider block flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          Competencias Interpersonales y de Comunicación (Soft Skills)
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Añadir cualidad (ej. Negociación, Liderazgo, Comunicación intercultural...)"
            value={newSoftText}
            onChange={(e) => setNewSoftText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSoftSkill(newSoftText);
              }
            }}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
          <button
            type="button"
            onClick={() => addSoftSkill(newSoftText)}
            className="bg-[#0e417a] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#092e57] transition"
          >
            Añadir
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {softSkills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 text-xs px-3 py-1 rounded-full font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSoftSkill(index)}
                className="hover:text-red-500 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
