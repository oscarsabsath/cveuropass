import React, { useState } from 'react';
import { Key, Sparkles, Check, ExternalLink, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey, clearStoredApiKey } from '../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    if (!apiKey.trim()) {
      clearStoredApiKey();
      onKeySaved('');
      setTestResult({ success: true, message: 'Clave eliminada. Se usará el motor inteligente offline.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Test Gemini API with a light prompt
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Responde sólo: OK' }] }],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Código de error HTTP: ${res.status}`);
      }

      saveStoredApiKey(apiKey.trim());
      onKeySaved(apiKey.trim());
      setTestResult({
        success: true,
        message: '¡Clave de Google Gemini validada y guardada correctamente!',
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Error al conectar con Gemini: ${error.message || 'Verifica la clave API'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = () => {
    clearStoredApiKey();
    setApiKey('');
    onKeySaved('');
    setTestResult({ success: true, message: 'Modo offline activado.' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0e417a] to-[#1e70bf] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Asistente IA Google Gemini</h3>
              <p className="text-xs text-blue-100">Redacción profesional para Europass</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Puedes conectar tu propia clave API gratuita de <strong>Google Gemini</strong> para redactar tu perfil, viñetas de experiencia y sugerencias de competencias en tiempo real.
          </p>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#0e417a]" />
              Tu Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] focus:ring-2 focus:ring-blue-100 outline-hidden font-mono"
            />
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-tight">{testResult.message}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex items-center gap-1 text-slate-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Privacidad y Seguridad
            </div>
            <p>
              Tu API Key se almacena de forma 100% privada en la memoria local de tu celular o navegador (`localStorage`).
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0e417a] hover:underline font-semibold mt-1"
            >
              ¿No tienes una? Consíguela gratis en Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          {apiKey ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-xl transition"
            >
              Limpiar clave
            </button>
          ) : (
            <span className="text-[11px] text-slate-400">Modo offline disponible</span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-600 font-medium px-4 py-2 rounded-xl hover:bg-slate-200 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isTesting}
              onClick={handleTestAndSave}
              className="text-xs font-semibold bg-[#0e417a] hover:bg-[#092e57] text-white px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-60"
            >
              {isTesting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Guardar y Activar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
