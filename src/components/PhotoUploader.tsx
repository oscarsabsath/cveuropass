import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';

interface PhotoUploaderProps {
  photoUrl: string;
  onPhotoChange: (url: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photoUrl, onPhotoChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    // Process & compress on mobile to avoid memory bloat
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Standard passport / Europass resolution ~ 400x520 px
        const MAX_WIDTH = 480;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          onPhotoChange(compressedDataUrl);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-[#0e417a]" />
          Fotografía para el CV Europass
        </label>
        <span className="text-xs text-slate-400">Recomendado formato 35x45mm</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Photo Display / Upload Area */}
        <div className="relative group shrink-0">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`w-32 h-40 rounded-xl overflow-hidden border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center p-2 ${
              photoUrl
                ? 'border-[#0e417a] shadow-md bg-slate-50'
                : 'border-dashed border-slate-300 hover:border-[#0e417a] bg-slate-50 hover:bg-blue-50/50'
            }`}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Foto de perfil Europass"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center mb-2">
                  <ImageIcon className="w-5 h-5 text-slate-500" />
                </div>
                <span className="text-xs font-medium text-slate-600">Subir foto</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Toca aquí</span>
              </div>
            )}
          </div>

          {photoUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPhotoChange('');
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition"
              title="Eliminar foto"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Info & Standards Card */}
        <div className="flex-1 text-left space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium bg-[#0e417a] hover:bg-[#092e57] text-white px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              {photoUrl ? 'Cambiar fotografía' : 'Seleccionar del celular o cámara'}
            </button>
          </div>

          <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-[#0e417a] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Estándar Europass oficial:
            </div>
            <p className="text-slate-600 leading-tight">
              • Fondo blanco o gris claro uniforme, sin sombras.
            </p>
            <p className="text-slate-600 leading-tight">
              • Rostro frontal, mirada a la cámara con expresión profesional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
