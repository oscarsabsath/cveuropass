import React, { useState } from 'react';
import type { LanguageSkill, CEFRLevel } from '../../types/cv';
import { Languages, Plus, Trash2, HelpCircle } from 'lucide-react';

interface StepLanguagesProps {
  languages: LanguageSkill[];
  onChange: (languages: LanguageSkill[]) => void;
}

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const StepLanguages: React.FC<StepLanguagesProps> = ({ languages, onChange }) => {
  const [motherTongueInput, setMotherTongueInput] = useState(
    languages.find((l) => l.isMotherTongue)?.name || 'Español'
  );

  const updateMotherTongue = (name: string) => {
    setMotherTongueInput(name);
    const existing = languages.find((l) => l.isMotherTongue);
    if (existing) {
      onChange(
        languages.map((l) => (l.isMotherTongue ? { ...l, name } : l))
      );
    } else {
      onChange([
        {
          id: 'lang-mother',
          name,
          isMotherTongue: true,
          listening: 'C2',
          reading: 'C2',
          spokenInteraction: 'C2',
          spokenProduction: 'C2',
          writing: 'C2',
        },
        ...languages,
      ]);
    }
  };

  const addForeignLanguage = () => {
    const newLang: LanguageSkill = {
      id: `lang-${Date.now()}`,
      name: 'Inglés',
      isMotherTongue: false,
      listening: 'B2',
      reading: 'B2',
      spokenInteraction: 'B1',
      spokenProduction: 'B1',
      writing: 'B1',
    };
    onChange([...languages, newLang]);
  };

  const removeLanguage = (id: string) => {
    onChange(languages.filter((l) => l.id !== id));
  };

  const updateLanguageSkill = (id: string, updates: Partial<LanguageSkill>) => {
    onChange(languages.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const setGlobalLevel = (id: string, level: CEFRLevel) => {
    updateLanguageSkill(id, {
      listening: level,
      reading: level,
      spokenInteraction: level,
      spokenProduction: level,
      writing: level,
    });
  };

  const foreignLanguages = languages.filter((l) => !l.isMotherTongue);

  return (
    <div className="space-y-5 animate-fadeIn text-left">
      <div>
        <h2 className="text-lg font-bold text-slate-800">6. Competencias Lingüísticas (MCER)</h2>
        <p className="text-xs text-slate-500">
          Evaluación según el Marco Común Europeo de Referencia para las lenguas (CEFR / MCER).
        </p>
      </div>

      {/* Mother tongue */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2">
        <label className="text-xs font-semibold text-slate-700 block flex items-center gap-1.5">
          <Languages className="w-4 h-4 text-[#0e417a]" />
          Lengua Materna *
        </label>
        <input
          type="text"
          placeholder="Ej. Español, Catalán, etc."
          value={motherTongueInput}
          onChange={(e) => updateMotherTongue(e.target.value)}
          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
        />
        <span className="text-[11px] text-slate-400">
          La lengua materna tiene dominio nativo completo (C2).
        </span>
      </div>

      {/* Foreign languages */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#0e417a] uppercase tracking-wider">
            Otros Idiomas
          </label>
          <button
            type="button"
            onClick={addForeignLanguage}
            className="text-xs font-semibold bg-[#0e417a] text-white px-3 py-1.5 rounded-xl hover:bg-[#092e57] transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Añadir Idioma
          </button>
        </div>

        {foreignLanguages.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            No has añadido otros idiomas. Pulsa en "+ Añadir Idioma" si dominas inglés, francés, alemán, etc.
          </div>
        ) : (
          foreignLanguages.map((lang) => (
            <div
              key={lang.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Nombre del idioma (ej. Inglés, Alemán...)"
                  value={lang.name}
                  onChange={(e) => updateLanguageSkill(lang.id, { name: e.target.value })}
                  className="font-bold text-sm text-[#0e417a] border-b border-slate-300 focus:border-[#0e417a] outline-hidden px-1 py-0.5"
                />

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span className="hidden sm:inline">Nivel rápido:</span>
                    <select
                      onChange={(e) => setGlobalLevel(lang.id, e.target.value as CEFRLevel)}
                      defaultValue=""
                      className="text-xs font-medium border border-slate-300 rounded-lg px-2 py-1 bg-slate-50"
                    >
                      <option value="" disabled>
                        Asignar a todos
                      </option>
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLanguage(lang.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CEFR 5 skills grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Autoevaluación de destrezas según el MCER:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {/* Comprensión Auditiva */}
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-left">
                    <span className="text-[10px] font-bold text-slate-600 block mb-1">
                      Comp. Auditiva
                    </span>
                    <select
                      value={lang.listening}
                      onChange={(e) => updateLanguageSkill(lang.id, { listening: e.target.value as CEFRLevel })}
                      className="w-full text-xs font-bold text-[#0e417a] bg-white border border-slate-300 rounded-lg p-1"
                    >
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lectura */}
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-left">
                    <span className="text-[10px] font-bold text-slate-600 block mb-1">
                      Lectura
                    </span>
                    <select
                      value={lang.reading}
                      onChange={(e) => updateLanguageSkill(lang.id, { reading: e.target.value as CEFRLevel })}
                      className="w-full text-xs font-bold text-[#0e417a] bg-white border border-slate-300 rounded-lg p-1"
                    >
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Interacción oral */}
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-left">
                    <span className="text-[10px] font-bold text-slate-600 block mb-1">
                      Interacción Oral
                    </span>
                    <select
                      value={lang.spokenInteraction}
                      onChange={(e) => updateLanguageSkill(lang.id, { spokenInteraction: e.target.value as CEFRLevel })}
                      className="w-full text-xs font-bold text-[#0e417a] bg-white border border-slate-300 rounded-lg p-1"
                    >
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Expresión oral */}
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-left">
                    <span className="text-[10px] font-bold text-slate-600 block mb-1">
                      Expresión Oral
                    </span>
                    <select
                      value={lang.spokenProduction}
                      onChange={(e) => updateLanguageSkill(lang.id, { spokenProduction: e.target.value as CEFRLevel })}
                      className="w-full text-xs font-bold text-[#0e417a] bg-white border border-slate-300 rounded-lg p-1"
                    >
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Expresión escrita */}
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-left col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-slate-600 block mb-1">
                      Expresión Escrita
                    </span>
                    <select
                      value={lang.writing}
                      onChange={(e) => updateLanguageSkill(lang.id, { writing: e.target.value as CEFRLevel })}
                      className="w-full text-xs font-bold text-[#0e417a] bg-white border border-slate-300 rounded-lg p-1"
                    >
                      {CEFR_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* CEFR Guide info */}
        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-[11px] text-slate-600 space-y-1">
          <div className="font-semibold text-[#0e417a] flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            Guía de niveles MCER (Marco Europeo):
          </div>
          <p>• <strong>A1 / A2:</strong> Usuario básico (comprende expresiones cotidianas y frases sencillas).</p>
          <p>• <strong>B1 / B2:</strong> Usuario independiente (conversación fluida y redacción técnica común).</p>
          <p>• <strong>C1 / C2:</strong> Usuario competente / bilingüe (uso flexible y eficaz para fines profesionales).</p>
        </div>
      </div>
    </div>
  );
};
