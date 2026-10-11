import React, { useState } from 'react';
import type { CVProfile } from '../types/cv';
import { Briefcase, Edit3, Check, X, Copy, RotateCcw } from 'lucide-react';

interface ProfileSelectorProps {
  profiles: CVProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onRenameProfile: (id: string, newName: string) => void;
  onCloneProfile: (fromId: string, toId: string) => void;
  onResetProfile: (id: string) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onRenameProfile,
  onCloneProfile,
  onResetProfile,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleStartRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setTempName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (tempName.trim()) {
      onRenameProfile(id, tempName.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = () => {
    setEditingId(null);
  };

  return (
    <div className="no-print bg-[#0a3564] border-b border-blue-900/60 px-3 py-2 text-white">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Label & Active Profile Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Briefcase className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
            Perfiles guardados:
          </span>
        </div>

        {/* 3 Profile Slots Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto scrollbar-none pb-0.5 sm:pb-0">
          {profiles.map((profile, index) => {
            const isActive = profile.id === activeProfileId;
            const isEditing = editingId === profile.id;

            if (isEditing) {
              return (
                <div
                  key={profile.id}
                  className="flex items-center gap-1 bg-white text-slate-900 px-2 py-1 rounded-xl shadow-sm text-xs shrink-0"
                >
                  <input
                    type="text"
                    value={tempName}
                    autoFocus
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(profile.id);
                      if (e.key === 'Escape') handleCancelRename();
                    }}
                    className="w-28 text-xs font-semibold outline-hidden border-b border-[#0e417a]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveRename(profile.id)}
                    className="text-emerald-600 hover:text-emerald-700 p-0.5"
                    title="Guardar nombre"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelRename}
                    className="text-slate-400 hover:text-red-500 p-0.5"
                    title="Cancelar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            }

            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => onSelectProfile(profile.id)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all shrink-0 border ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-blue-100 border-white/10 font-medium'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-blue-900 text-blue-200'
                  }`}
                >
                  {index + 1}
                </span>

                <span className="truncate max-w-[110px] sm:max-w-[130px]">{profile.name}</span>

                {/* Edit Icon for Active Profile */}
                {isActive && (
                  <span
                    onClick={(e) => handleStartRename(profile.id, profile.name, e)}
                    className="p-0.5 rounded-md hover:bg-amber-500/40 text-slate-900 transition ml-0.5"
                    title="Renombrar este perfil"
                  >
                    <Edit3 className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}

          {/* Action to clone from other profile */}
          <button
            type="button"
            onClick={() => setIsCloneModalOpen(true)}
            className="text-[11px] bg-white/5 hover:bg-white/15 text-blue-200 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 ml-1 font-medium border border-white/10"
            title="Copiar datos desde otro perfil"
          >
            <Copy className="w-3 h-3" />
            <span className="hidden md:inline">Copiar datos</span>
          </button>
        </div>
      </div>

      {/* Modal for cloning profile data */}
      {isCloneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs text-slate-800 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4 border border-slate-100 text-left">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0e417a] flex items-center gap-1.5">
                <Copy className="w-4 h-4" />
                Copiar datos a "{activeProfile.name}"
              </h3>
              <button
                onClick={() => setIsCloneModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              ¿Deseas duplicar los datos (foto, contacto o información) de otro perfil hacia el perfil actual?
            </p>

            <div className="space-y-2">
              {profiles
                .filter((p) => p.id !== activeProfileId)
                .map((srcProfile) => (
                  <button
                    key={srcProfile.id}
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          `¿Seguro que deseas copiar todo el contenido de "${srcProfile.name}" hacia "${activeProfile.name}"? Los datos actuales de "${activeProfile.name}" serán reemplazados.`
                        )
                      ) {
                        onCloneProfile(srcProfile.id, activeProfileId);
                        setIsCloneModalOpen(false);
                      }
                    }}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-[#0e417a] hover:bg-blue-50/50 transition flex items-center justify-between text-xs font-semibold text-slate-700"
                  >
                    <span>Copiar de: {srcProfile.name}</span>
                    <Copy className="w-3.5 h-3.5 text-[#0e417a]" />
                  </button>
                ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      `¿Vaciar los campos de "${activeProfile.name}" para empezar una hoja de vida desde cero?`
                    )
                  ) {
                    onResetProfile(activeProfileId);
                    setIsCloneModalOpen(false);
                  }
                }}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Vaciar perfil actual
              </button>

              <button
                type="button"
                onClick={() => setIsCloneModalOpen(false)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
