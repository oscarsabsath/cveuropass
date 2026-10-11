import React, { useState, useEffect } from 'react';
import type { CVData, CVProfile } from './types/cv';
import { INITIAL_CV_DATA, EMPTY_CV_DATA, DEFAULT_PROFILES } from './types/cv';
import { Header } from './components/Header';
import { ProfileSelector } from './components/ProfileSelector';
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

const PROFILES_STORAGE_KEY = 'europass_cv_profiles_v2';
const ACTIVE_PROFILE_KEY = 'europass_active_profile_id_v2';
const LEGACY_STORAGE_KEY = 'europass_cv_app_data_v1';

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
  // Load the 3 profiles from phone localStorage
  const [profiles, setProfiles] = useState<CVProfile[]>(() => {
    try {
      const saved = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed;
        }
      }

      // Check legacy single profile data to avoid data loss
      const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyData) {
        const parsedLegacy = JSON.parse(legacyData);
        return [
          {
            id: 'profile-1',
            name: 'Perfil 1: Principal',
            updatedAt: new Date().toISOString(),
            data: parsedLegacy,
          },
          DEFAULT_PROFILES[1],
          DEFAULT_PROFILES[2],
        ];
      }
    } catch (e) {
      console.warn('Error al leer perfiles guardados:', e);
    }
    return DEFAULT_PROFILES;
  });

  // Active profile ID ('profile-1' | 'profile-2' | 'profile-3')
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const savedActive = localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (savedActive) return savedActive;
    } catch (e) {
      console.warn('Error reading active profile:', e);
    }
    return 'profile-1';
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Auto-save profiles to localStorage on any change
  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
      localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);
    } catch (e) {
      console.warn('Error guardando en el celular:', e);
    }
  }, [profiles, activeProfileId]);

  // Current active profile and its data
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const cvData = activeProfile.data;

  // Update active profile CVData
  const updateCurrentCvData = (newData: CVData) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfile.id
          ? {
              ...p,
              updatedAt: new Date().toISOString(),
              data: newData,
            }
          : p
      )
    );
  };

  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRenameProfile = (id: string, newName: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  };

  const handleCloneProfile = (fromId: string, toId: string) => {
    const sourceProfile = profiles.find((p) => p.id === fromId);
    if (!sourceProfile) return;

    setProfiles((prev) =>
      prev.map((p) =>
        p.id === toId
          ? {
              ...p,
              updatedAt: new Date().toISOString(),
              data: JSON.parse(JSON.stringify(sourceProfile.data)),
            }
          : p
      )
    );
  };

  const handleResetProfile = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              updatedAt: new Date().toISOString(),
              data: EMPTY_CV_DATA,
            }
          : p
      )
    );
    setCurrentStep(1);
  };

  const handleLoadExample = () => {
    if (
      window.confirm(
        `¿Deseas cargar el currículum de ejemplo completo en "${activeProfile.name}"?`
      )
    ) {
      updateCurrentCvData(INITIAL_CV_DATA);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        `¿Estás seguro de vaciar todos los campos de "${activeProfile.name}" para empezar desde cero?`
      )
    ) {
      handleResetProfile(activeProfile.id);
    }
  };

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

      {/* 3 Profile Selector Bar */}
      <ProfileSelector
        profiles={profiles}
        activeProfileId={activeProfile.id}
        onSelectProfile={handleSelectProfile}
        onRenameProfile={handleRenameProfile}
        onCloneProfile={handleCloneProfile}
        onResetProfile={handleResetProfile}
      />

      {/* Main Questionnaire Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 no-print">
        <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-4 sm:p-7 shadow-sm border border-slate-200/80 mb-6">
          {currentStep === 1 && (
            <StepPersonalInfo
              personalInfo={cvData.personalInfo}
              onChange={(personalInfo) =>
                updateCurrentCvData({ ...cvData, personalInfo })
              }
            />
          )}

          {currentStep === 2 && (
            <StepProfile
              targetJobTitle={cvData.targetJobTitle}
              summary={cvData.summary}
              onJobTitleChange={(targetJobTitle) =>
                updateCurrentCvData({ ...cvData, targetJobTitle })
              }
              onSummaryChange={(summary) =>
                updateCurrentCvData({ ...cvData, summary })
              }
              onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            />
          )}

          {currentStep === 3 && (
            <StepExperience
              workExperience={cvData.workExperience}
              onChange={(workExperience) =>
                updateCurrentCvData({ ...cvData, workExperience })
              }
            />
          )}

          {currentStep === 4 && (
            <StepEducation
              education={cvData.education}
              onChange={(education) =>
                updateCurrentCvData({ ...cvData, education })
              }
            />
          )}

          {currentStep === 5 && (
            <StepSkills
              digitalSkills={cvData.digitalSkills}
              softSkills={cvData.softSkills}
              targetJobTitle={cvData.targetJobTitle}
              onDigitalSkillsChange={(digitalSkills) =>
                updateCurrentCvData({ ...cvData, digitalSkills })
              }
              onSoftSkillsChange={(softSkills) =>
                updateCurrentCvData({ ...cvData, softSkills })
              }
            />
          )}

          {currentStep === 6 && (
            <StepLanguages
              languages={cvData.languages}
              onChange={(languages) =>
                updateCurrentCvData({ ...cvData, languages })
              }
            />
          )}

          {currentStep === 7 && (
            <StepAdditional
              additionalInfo={cvData.additionalInfo}
              onChange={(additionalInfo) =>
                updateCurrentCvData({ ...cvData, additionalInfo })
              }
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
        <EuropassPreview cvData={cvData} id="europass-cv-print-only" />
      </div>

      {/* AI Assistant Modal for Profile Writing */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        targetJobTitle={cvData.targetJobTitle}
        currentSummary={cvData.summary}
        onSelectSummary={(newSummary) =>
          updateCurrentCvData({ ...cvData, summary: newSummary })
        }
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
