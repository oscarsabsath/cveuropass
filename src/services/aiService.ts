import type { CVData } from '../types/cv';

const LOCAL_STORAGE_KEY = 'gemini_europass_api_key';

export function getStoredApiKey(): string {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || '';
}

export function saveStoredApiKey(key: string): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
}

export function clearStoredApiKey(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export interface ProfileDraftOption {
  title: string;
  focus: string;
  text: string;
}

interface GenerateProfilesParams {
  jobTitle: string;
  yearsOfExperience: string;
  strengths: string;
  keyAchievements?: string;
  targetSector?: string;
}

/**
 * Call Gemini API directly with resilience and fallback
 */
async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Error HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Attempt with ${model} failed:`, err);
    }
  }

  throw lastError || new Error('No se pudo conectar con el servicio de IA de Gemini.');
}

/**
 * Generates 3 professional profile options tailored to Europass standards
 */
export async function generateEuropassProfiles(
  params: GenerateProfilesParams,
  customApiKey?: string
): Promise<ProfileDraftOption[]> {
  const key = customApiKey || getStoredApiKey();

  if (key) {
    const prompt = `
Actúa como un experto europeo en reclutamiento internacional y redacción de CVs estándar Europass de la Comisión Europea.
Crea 3 propuestas de "Perfil Profesional / Resumen" (Summary) de alto impacto para un currículum Europass en español.

Datos del candidato:
- Puesto o Área: ${params.jobTitle || 'Profesional'}
- Años de Experiencia: ${params.yearsOfExperience || 'Varios años'}
- Competencias y Fortalezas: ${params.strengths || 'Gestión y ejecución'}
- Logros clave: ${params.keyAchievements || 'Orientado a objetivos medibles'}
- Sector objetivo: ${params.targetSector || 'General'}

Normas estrictas de Europass:
1. Máximo 3 a 5 líneas por opción (entre 45 y 75 palabras).
2. Tono formal, riguroso, directo, sin redundancias ni frases vacías como "persona apasionada" o "puntual".
3. Redactado en estilo profesional moderno (tercera persona implícita o estructurado en competencias + experiencia + valor añadido).
4. Compatible con filtros ATS europeos.

Devuelve EXACTAMENTE un formato JSON válido con esta estructura (sin texto extra fuera del bloque JSON):
[
  {
    "title": "Opción 1: Enfoque Ejecutivo y Resultados",
    "focus": "Orientado a impacto cuantificable y liderazgo",
    "text": "..."
  },
  {
    "title": "Opción 2: Enfoque Técnico y Metodológico",
    "focus": "Destaca dominio de herramientas y rigor operativo",
    "text": "..."
  },
  {
    "title": "Opción 3: Enfoque Internacional y Adaptabilidad",
    "focus": "Ideal para entornos multiculturales y movilidad europea",
    "text": "..."
  }
]
`;

    try {
      const responseText = await callGemini(prompt, key);
      // Clean JSON backticks if present
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        return parsed;
      }
    } catch (e) {
      console.warn('Fallo llamada Gemini, recurriendo a generador inteligente local:', e);
    }
  }

  // Smart Offline Fallback with tailored templates
  const role = params.jobTitle.trim() || 'Especialista';
  const exp = params.yearsOfExperience ? `con más de ${params.yearsOfExperience} años de trayectoria` : 'con sólida experiencia';
  const skills = params.strengths ? `Especializado en ${params.strengths}.` : 'Con amplias competencias técnicas y organizativas.';
  const achievements = params.keyAchievements ? `Destacada capacidad para ${params.keyAchievements}.` : 'Orientado a la consecución de objetivos e innovación continua.';

  return [
    {
      title: 'Opción 1: Enfoque Ejecutivo y Resultados',
      focus: 'Impacto medible y valor organizativo',
      text: `${role} ${exp} en optimización de procesos y entrega de soluciones de alto rendimiento. ${skills} ${achievements} Demostrada aptitud para la toma de decisiones estratégicas y gestión bajo estándares europeos de calidad.`,
    },
    {
      title: 'Opción 2: Enfoque Técnico y Metodológico',
      focus: 'Rigor operativo, herramientas y calidad',
      text: `Profesional en el área de ${role} ${exp}. Sólida base metodológica con dominio avanzado en ${params.strengths || 'herramientas clave del sector'}. Enfocado en la eficiencia, resolución de problemas complejos y cumplimiento de normativas internacionales.`,
    },
    {
      title: 'Opción 3: Enfoque Internacional y Adaptabilidad',
      focus: 'Movilidad europea, idiomas y trabajo multicultural',
      text: `${role} proactivo y versátil ${exp} en entornos colaborativos y dinámicos. ${skills} Gran capacidad de comunicación interpersonal, resiliencia y compromiso con el aprendizaje continuo en el marco laboral europeo.`,
    },
  ];
}

/**
 * Enhances a work experience bullet point or duty list using STAR action verbs
 */
export async function enhanceJobDescription(
  position: string,
  company: string,
  rawDuties: string,
  customApiKey?: string
): Promise<string> {
  const key = customApiKey || getStoredApiKey();

  if (key && rawDuties.trim()) {
    const prompt = `
Como consultor de empleo en Europa, reescribe las siguientes responsabilidades de trabajo para un currículum Europass:
- Cargo: ${position}
- Empresa: ${company}
- Borrador original: "${rawDuties}"

Pautas:
- Convierte el texto en 3 o 4 viñetas (bullets que comiencen con "• ").
- Usa verbos de acción fuertes en pasado o presente (e.g., "Coordinó", "Implementó", "Optimizó", "Desarrolló").
- Aplica el estándar STAR: Acción + Contexto + Resultado/Impacto.
- Estilo conciso, profesional y limpio.
- Devuelve SOLAMENTE las viñetas, sin introducciones ni saludos.
`;

    try {
      const responseText = await callGemini(prompt, key);
      if (responseText.trim().length > 10) {
        return responseText.trim();
      }
    } catch (e) {
      console.warn('Error al mejorar funciones con Gemini:', e);
    }
  }

  // Offline transformation fallback
  const lines = rawDuties
    .split('\n')
    .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return `• Lideró las actividades operativas clave en ${company || 'la organización'}, asegurando el cumplimiento de los estándares de calidad.\n• Coordinó flujos de trabajo interdepartamentales optimizando los tiempos de respuesta.\n• Implementó mejoras continuas alineadas con las metas estratégicas del puesto.`;
  }

  return lines
    .map((line) => {
      if (!line.startsWith('•')) {
        return `• Gestionó y ejecutó: ${line}`;
      }
      return line;
    })
    .join('\n');
}

/**
 * Suggests in-demand European digital and technical skills
 */
export async function suggestSkillsForRole(
  jobTitle: string,
  customApiKey?: string
): Promise<{ digital: string[]; soft: string[] }> {
  const key = customApiKey || getStoredApiKey();

  if (key && jobTitle.trim()) {
    const prompt = `
Lista las 6 competencias digitales (DigComp/herramientas) y 4 competencias blandas más valoradas en la Unión Europea para el cargo de: "${jobTitle}".
Responde únicamente en formato JSON válido con este esquema:
{
  "digital": ["Herramienta 1", "Herramienta 2", ...],
  "soft": ["Competencia 1", "Competencia 2", ...]
}
`;
    try {
      const response = await callGemini(prompt, key);
      const cleanJson = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed.digital) && Array.isArray(parsed.soft)) {
        return parsed;
      }
    } catch (e) {
      console.warn('Error sugiriendo habilidades con IA:', e);
    }
  }

  // Pre-compiled European Skill Sets
  return {
    digital: [
      'Herramientas colaborativas (Slack, Teams, Notion)',
      'Gestión de suites ofimáticas (Microsoft 365, Google Workspace)',
      'Gestión de datos y análisis básico',
      'Seguridad de la información y RGPD (GDPR)',
      'Herramientas específicas del sector',
      'Gestión de proyectos en la nube (Trello / Jira / Asana)',
    ],
    soft: [
      'Comunicación asertiva en entornos multiculturales',
      'Resolución de problemas complejos y pensamiento crítico',
      'Gestión eficaz del tiempo y priorización',
      'Adaptabilidad y aprendizaje autónomo',
    ],
  };
}

/**
 * Validates CV completeness and gives an ATS/Europass score
 */
export function calculateEuropassScore(cv: CVData): { score: number; tips: string[] } {
  let score = 0;
  const tips: string[] = [];

  // Personal Info
  if (cv.personalInfo.firstName && cv.personalInfo.lastName) score += 10;
  else tips.push('Añade tu nombre y apellidos completos.');

  if (cv.personalInfo.email && cv.personalInfo.phone) score += 10;
  else tips.push('Asegúrate de incluir correo y teléfono con prefijo internacional (+34, etc.).');

  if (cv.personalInfo.city && cv.personalInfo.country) score += 5;
  if (cv.personalInfo.photoUrl) score += 10;
  else tips.push('La foto es habitual en los CVs Europass (fondo neutro y vestimenta profesional).');

  // Summary
  if (cv.summary && cv.summary.length >= 60) score += 20;
  else tips.push('Redacta un perfil profesional de al menos 3 líneas con ayuda de la IA.');

  // Experience
  if (cv.workExperience.length > 0) {
    score += 20;
    const hasDetailedBullets = cv.workExperience.some((exp) => exp.description.length > 50);
    if (!hasDetailedBullets) tips.push('Detalla las responsabilidades y logros en tu experiencia laboral.');
  } else {
    tips.push('Añade al menos una experiencia laboral o prácticas profesionales.');
  }

  // Education
  if (cv.education.length > 0) score += 10;
  else tips.push('Añade tu formación académica o certificaciones oficiales.');

  // Languages
  if (cv.languages.length > 0) score += 10;

  // Skills
  if (cv.digitalSkills.length >= 3) score += 5;
  else tips.push('Incluye al menos 3 competencias digitales clave.');

  return {
    score: Math.min(100, score),
    tips,
  };
}
