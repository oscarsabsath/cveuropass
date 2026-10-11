export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LanguageSkill {
  id: string;
  name: string;
  isMotherTongue: boolean;
  listening: CEFRLevel;
  reading: CEFRLevel;
  spokenInteraction: CEFRLevel;
  spokenProduction: CEFRLevel;
  writing: CEFRLevel;
}

export interface WorkExperience {
  id: string;
  position: string;
  company: string;
  city: string;
  country: string;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM or 'present'
  isCurrent: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description?: string;
  eqfLevel?: string; // Marco Europeo de Cualificaciones (p. ej. Nivel 6 - Grado, Nivel 7 - Máster)
}

export interface DigitalSkill {
  id: string;
  name: string;
  category?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  photoUrl: string; // base64 o url
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  nationality: string;
  birthDate: string;
  gender?: string;
  website?: string;
  linkedin?: string;
}

export interface AdditionalInfo {
  drivingLicenses: string[]; // B, A1, etc.
  certifications: string[];
  projects: string[];
  honors: string[];
}

export interface CVData {
  personalInfo: PersonalInfo;
  targetJobTitle: string;
  summary: string;
  workExperience: WorkExperience[];
  education: EducationItem[];
  languages: LanguageSkill[];
  digitalSkills: DigitalSkill[];
  softSkills: string[];
  additionalInfo: AdditionalInfo;
}

export const INITIAL_CV_DATA: CVData = {
  personalInfo: {
    firstName: 'Alejandro',
    lastName: 'García Moreno',
    photoUrl: '',
    email: 'alejandro.garcia@email.com',
    phone: '+34 612 345 678',
    address: 'Calle Mayor 45, 3ºB',
    city: 'Madrid',
    postalCode: '28013',
    country: 'España',
    nationality: 'Española',
    birthDate: '1994-06-15',
    gender: 'Masculino',
    website: 'https://alejandrogarcia.dev',
    linkedin: 'linkedin.com/in/alejandrogarcia',
  },
  targetJobTitle: 'Desarrollador Full Stack & Consultor Tecnológico',
  summary:
    'Profesional proactivo con más de 5 años de experiencia liderando proyectos de desarrollo web escalable y transformación digital. Especializado en ecosistemas React, Node.js y arquitecturas cloud, con sólidas competencias en metodologías ágiles y orientación a objetivos medibles en entornos multiculturales europeos.',
  workExperience: [
    {
      id: 'exp-1',
      position: 'Senior Frontend Developer',
      company: 'Tech Solutions Iberia',
      city: 'Madrid',
      country: 'España',
      startDate: '2022-03',
      endDate: 'present',
      isCurrent: true,
      description:
        '• Lideré el desarrollo y migración de la plataforma SaaS principal utilizando React, TypeScript y Tailwind CSS, incrementando el rendimiento en un 40%.\n• Diseñé flujos de integración continua (CI/CD) y coordiné un equipo multidisciplinar de 6 ingenieros bajo metodología Scrum.\n• Implementé estándares de accesibilidad WCAG 2.1 AA y diseño responsivo enfocado en mobile-first.',
    },
    {
      id: 'exp-2',
      position: 'Desarrollador Web Junior',
      company: 'Innovación Digital S.L.',
      city: 'Valencia',
      country: 'España',
      startDate: '2019-09',
      endDate: '2022-02',
      isCurrent: false,
      description:
        '• Construcción y mantenimiento de portales web interactivos y APIs REST seguras en Node.js.\n• Optimización de bases de datos relacionales PostgreSQL y reducción del tiempo de carga de consultas en un 25%.\n• Colaboración activa con clientes para levantamiento de requerimientos y soporte técnico.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Grado en Ingeniería Informática',
      institution: 'Universidad Politécnica de Madrid',
      city: 'Madrid',
      country: 'España',
      startDate: '2014-09',
      endDate: '2019-06',
      isCurrent: false,
      eqfLevel: 'Nivel 6 EQF',
      description: 'Mención en Ingeniería del Software y Sistemas de Información.',
    },
    {
      id: 'edu-2',
      degree: 'Certificación Profesional Cloud Architect',
      institution: 'European Tech Institute',
      city: 'En línea',
      country: 'Unión Europea',
      startDate: '2021-01',
      endDate: '2021-07',
      isCurrent: false,
      description: 'Especialización en microservicios, seguridad en la nube y DevOps.',
    },
  ],
  languages: [
    {
      id: 'lang-1',
      name: 'Español',
      isMotherTongue: true,
      listening: 'C2',
      reading: 'C2',
      spokenInteraction: 'C2',
      spokenProduction: 'C2',
      writing: 'C2',
    },
    {
      id: 'lang-2',
      name: 'Inglés',
      isMotherTongue: false,
      listening: 'C1',
      reading: 'C1',
      spokenInteraction: 'B2',
      spokenProduction: 'B2',
      writing: 'B2',
    },
    {
      id: 'lang-3',
      name: 'Francés',
      isMotherTongue: false,
      listening: 'B1',
      reading: 'B1',
      spokenInteraction: 'A2',
      spokenProduction: 'A2',
      writing: 'A2',
    },
  ],
  digitalSkills: [
    { id: 'sk-1', name: 'React / Next.js', category: 'Frontend' },
    { id: 'sk-2', name: 'TypeScript / JavaScript', category: 'Lenguajes' },
    { id: 'sk-3', name: 'Node.js / Express', category: 'Backend' },
    { id: 'sk-4', name: 'Git & GitHub Actions', category: 'DevOps' },
    { id: 'sk-5', name: 'Tailwind CSS & UI/UX', category: 'Diseño' },
    { id: 'sk-6', name: 'Docker & AWS Basics', category: 'Cloud' },
  ],
  softSkills: [
    'Pensamiento analítico y resolución de problemas',
    'Trabajo en equipo y comunicación intercultural',
    'Gestión ágil de proyectos (Scrum / Kanban)',
    'Capacidad de adaptación y aprendizaje continuo',
  ],
  additionalInfo: {
    drivingLicenses: ['B'],
    certifications: [
      'Scrum Master Certified (SMC®)',
      'Cambridge English: Advanced (CAE - C1)',
    ],
    projects: [
      'Contribuidor open-source en librerías de UI para la comunidad internacional.',
    ],
    honors: [],
  },
};

export const EMPTY_CV_DATA: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    photoUrl: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    nationality: '',
    birthDate: '',
  },
  targetJobTitle: '',
  summary: '',
  workExperience: [],
  education: [],
  languages: [
    {
      id: 'lang-native',
      name: 'Español',
      isMotherTongue: true,
      listening: 'C2',
      reading: 'C2',
      spokenInteraction: 'C2',
      spokenProduction: 'C2',
      writing: 'C2',
    },
  ],
  digitalSkills: [],
  softSkills: [],
  additionalInfo: {
    drivingLicenses: [],
    certifications: [],
    projects: [],
    honors: [],
  },
};
