import { useState, useEffect } from 'react';
import type { CVData } from './types/cv';
import { INITIAL_CV_DATA, EMPTY_CV_DATA } from './types/cv';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StepPersonalInfo } from './components/Wizard/StepPersonalInfo';
import { StepProfile } from './components/Wizard/StepProfile';
import { StepExperience } from './components/Wizard/StepExperience';
import { StepEducation } from './components/Wizard/StepEducation';
import { StepSkills } from './components/Wizard/StepSkills';
import { StepLanguages } from './components/Wizard/StepLanguages';
import { StepAdditional } from './components/Wizard/StepAdditional';
import { StepReviewAndExport } from './components/Wizard/StepReviewAndExport';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { EuropassPreview } from './components/EuropassPreview';

const STORAGE_KEY = 'europass_cv_app_data_v1';

const STEP_TITLES = [
  'Datos y Foto',
  'Perfil IA',
  'Experiencia',
  'Educación',
  'Competencias',
  'Idiomas',
  'Adicional',
  'PDF A4',
];

export const App: React.FC = () => {
  // Load from localStorage or use initial example
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading saved CV data:', e);
    }
    return INITIAL_CV_DATA;
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    } catch (e) {
      console.warn('Error saving CV to localStorage:', e);
    }
  }, [cvData]);

  const handleNext = () => {
    if (currentStep < STEP_TITLES.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoadExample = () => {
    if (window.confirm('¿Deseas cargar el currículum de ejemplo completo para probar la app?')) {
      setCvData(INITIAL_CV_DATA);
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar todos los campos para empezar desde cero?')) {
      setCvData(EMPTY_CV_DATA);
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      {/* Header with Step Indicator */}
      <Header
        currentStep={currentStep}
        totalSteps={STEP_TITLES.length}
        stepTitles={STEP_TITLES}
        onStepClick={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLoadExample={handleLoadExample}
        onReset={handleReset}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Questionnaire Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 no-print">
        <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80 mb-6">
          {currentStep === 1 && (
            <StepPersonalInfo
              personalInfo={cvData.personalInfo}
              onChange={(personalInfo) => setCvData({ ...cvData, personalInfo })}
            />
          )}

          {currentStep === 2 && (
            <StepProfile
              targetJobTitle={cvData.targetJobTitle}
              summary={cvData.summary}
              onJobTitleChange={(targetJobTitle) => setCvData({ ...cvData, targetJobTitle })}
              onSummaryChange={(summary) => setCvData({ ...cvData, summary })}
              onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            />
          )}

          {currentStep === 3 && (
            <StepExperience
              workExperience={cvData.workExperience}
              onChange={(workExperience) => setCvData({ ...cvData, workExperience })}
            />
          )}

          {currentStep === 4 && (
            <StepEducation
              education={cvData.education}
              onChange={(education) => setCvData({ ...cvData, education })}
            />
          )}

          {currentStep === 5 && (
            <StepSkills
              digitalSkills={cvData.digitalSkills}
              softSkills={cvData.softSkills}
              targetJobTitle={cvData.targetJobTitle}
              onDigitalSkillsChange={(digitalSkills) => setCvData({ ...cvData, digitalSkills })}
              onSoftSkillsChange={(softSkills) => setCvData({ ...cvData, softSkills })}
            />
          )}

          {currentStep === 6 && (
            <StepLanguages
              languages={cvData.languages}
              onChange={(languages) => setCvData({ ...cvData, languages })}
            />
          )}

          {currentStep === 7 && (
            <StepAdditional
              additionalInfo={cvData.additionalInfo}
              onChange={(additionalInfo) => setCvData({ ...cvData, additionalInfo })}
            />
          )}

          {currentStep === 8 && (
            <StepReviewAndExport
              cvData={cvData}
              onNavigateToStep={(step) => {
                setCurrentStep(step);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </div>
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        currentStep={currentStep}
        totalSteps={STEP_TITLES.length}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* Hidden container for print-only */}
      <div className="hidden print:block">
        <EuropassPreview cvData={cvData} />
      </div>

      {/* AI Assistant Modal for Profile Writing */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        targetJobTitle={cvData.targetJobTitle}
        currentSummary={cvData.summary}
        onSelectSummary={(newSummary) => setCvData({ ...cvData, summary: newSummary })}
        onOpenApiKeyModal={() => {
          setIsAiAssistantOpen(false);
          setIsApiKeyModalOpen(true);
        }}
      />

      {/* Gemini API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => {}}
      />
    </div>
  );
};

export default App;
