import React, { useState } from 'react';
import type { CVData } from '../../types/cv';
import { EuropassPreview } from '../EuropassPreview';
import { generateAndDownloadPdf, triggerNativePrint, shareCvDocument } from '../../services/pdfService';
import { calculateEuropassScore } from '../../services/aiService';
import confetti from 'canvas-confetti';
import {
  Download,
  Printer,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Smartphone,
  FileText,
  Sparkles,
  RefreshCw,
  Award,
  Edit3,
} from 'lucide-react';

interface StepReviewAndExportProps {
  cvData: CVData;
  onNavigateToStep: (step: number) => void;
}

export const StepReviewAndExport: React.FC<StepReviewAndExportProps> = ({
  cvData,
  onNavigateToStep,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [previewMode, setPreviewMode] = useState<'a4' | 'mobile'>('a4');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const { score, tips } = calculateEuropassScore(cvData);
  const candidateFullName = `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`.trim();

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      const ok = await generateAndDownloadPdf('europass-cv-document', candidateFullName || 'Mi_Curriculum');
      if (ok) {
        setDownloadSuccess(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleShare = async () => {
    await shareCvDocument(candidateFullName);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-800">8. Revisión y Generación de PDF A4</h2>
        <p className="text-xs text-slate-500">
          Tu documento está listo según las directrices oficiales de Europass.
        </p>
      </div>

      {/* Quality & ATS Score Widget */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0e417a]" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Índice de Completitud y Estándar Europass
            </h3>
          </div>
          <span
            className={`text-sm font-extrabold px-3 py-1 rounded-full ${
              score >= 80
                ? 'bg-emerald-100 text-emerald-800'
                : score >= 50
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {score}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${
              score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>

        {tips.length > 0 && (
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Sugerencias para maximizar tu perfil:
            </span>
            <ul className="list-disc list-inside space-y-0.5">
              {tips.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Edit Sections Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1 text-[11px]">
            <Edit3 className="w-3.5 h-3.5 text-[#0e417a]" />
            Editar sección:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateToStep(1)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-700"
            >
              Datos & Foto
            </button>
            <button
              type="button"
              onClick={() => onNavigateToStep(2)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-700"
            >
              Perfil IA
            </button>
            <button
              type="button"
              onClick={() => onNavigateToStep(3)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-700"
            >
              Experiencia
            </button>
            <button
              type="button"
              onClick={() => onNavigateToStep(4)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-700"
            >
              Estudios
            </button>
            <button
              type="button"
              onClick={() => onNavigateToStep(5)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-700"
            >
              Habilidades
            </button>
          </div>
        </div>
      </div>

      {/* Export Action Card */}
      <div className="bg-gradient-to-br from-[#0e417a] via-[#092e57] to-[#041d38] rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Documento Final Oficial
            </span>
            <h3 className="text-lg sm:text-xl font-black mt-0.5">
              Descargar Currículum en PDF A4
            </h3>
            <p className="text-xs text-blue-200">
              Formato estándar europeo (210 x 297 mm) optimizado para impresión y sistemas ATS.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            disabled={isGeneratingPdf}
            onClick={handleDownloadPdf}
            className="sm:col-span-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm py-3.5 px-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-95 disabled:opacity-60"
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Renderizando documento A4...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Descargar PDF A4 Listo para Imprimir
              </>
            )}
          </button>

          <button
            type="button"
            onClick={triggerNativePrint}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 px-4 rounded-2xl border border-white/20 transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir Directo
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ¡Tu PDF ha sido generado y descargado exitosamente!
          </div>
        )}

        <div className="flex items-center justify-between pt-1 text-[11px] text-blue-200">
          <span>Dimensiones exactas: 210 x 297 mm (A4)</span>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-white underline"
          >
            <Share2 className="w-3.5 h-3.5" />
            Compartir desde el móvil
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#0e417a]" />
            <h3 className="text-sm font-bold text-slate-800">Previsualización del Documento</h3>
          </div>

          <div className="flex bg-slate-200 p-0.5 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setPreviewMode('a4')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 ${
                previewMode === 'a4'
                  ? 'bg-white text-[#0e417a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Hoja A4
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 ${
                previewMode === 'mobile'
                  ? 'bg-white text-[#0e417a] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Móvil
            </button>
          </div>
        </div>

        {/* Preview viewport container */}
        <div className="bg-slate-200/80 p-2 sm:p-6 rounded-3xl overflow-x-auto border border-slate-300 flex justify-center">
          {previewMode === 'a4' ? (
            <div className="transform origin-top scale-[0.48] sm:scale-[0.75] md:scale-[0.88] lg:scale-100 transition-transform duration-200">
              <EuropassPreview cvData={cvData} />
            </div>
          ) : (
            <div className="w-full max-w-md bg-white rounded-2xl p-4 shadow-md text-left space-y-4">
              <div className="border-b pb-3">
                <span className="text-[10px] font-bold text-[#0e417a] uppercase">Vista Compacta Móvil</span>
                <h2 className="text-lg font-bold text-slate-800">
                  {candidateFullName || 'Tu Nombre'}
                </h2>
                <p className="text-xs font-semibold text-slate-500">{cvData.targetJobTitle}</p>
              </div>

              {cvData.summary && (
                <div>
                  <h4 className="text-xs font-bold text-[#0e417a] uppercase">Perfil</h4>
                  <p className="text-xs text-slate-600 mt-1">{cvData.summary}</p>
                </div>
              )}

              {cvData.workExperience.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#0e417a] uppercase mb-1">Experiencia</h4>
                  <div className="space-y-2">
                    {cvData.workExperience.map((exp) => (
                      <div key={exp.id} className="text-xs border-l-2 border-blue-400 pl-2">
                        <div className="font-bold">{exp.position} - {exp.company}</div>
                        <div className="text-[11px] text-slate-500">{exp.startDate} a {exp.endDate}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-400 italic text-center pt-2">
                Para ver el documento oficial exactamente como se imprimirá, cambia a la pestaña "Hoja A4".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
