import React from 'react';
import type { CVData } from '../types/cv';
import { Mail, Phone, MapPin, Globe, Calendar, User, CheckCircle } from 'lucide-react';

interface EuropassPreviewProps {
  cvData: CVData;
}

export const EuropassPreview: React.FC<EuropassPreviewProps> = ({ cvData }) => {
  const {
    personalInfo,
    targetJobTitle,
    summary,
    workExperience,
    education,
    languages,
    digitalSkills,
    softSkills,
    additionalInfo,
  } = cvData;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr === 'present') return 'Presente';
    const [year, month] = dateStr.split('-');
    if (!month) return year;
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthIndex = parseInt(month, 10) - 1;
    return `${months[monthIndex] || month} ${year}`;
  };

  const motherTongue = languages.find((l) => l.isMotherTongue);
  const otherLanguages = languages.filter((l) => !l.isMotherTongue);

  return (
    <div
      id="europass-cv-document"
      className="a4-page bg-white text-slate-800 mx-auto shadow-xl print:shadow-none border border-slate-200 print:border-none relative box-border overflow-hidden"
      style={{
        width: '210mm',
        minHeight: '297mm',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Europass Header Stripe */}
      <div className="bg-[#0e417a] text-white px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Official EU Stars Motif Badge */}
          <div className="w-9 h-9 rounded-full bg-[#003399] border-2 border-amber-300 flex items-center justify-center relative shadow-xs">
            <span className="text-amber-300 text-xs font-black tracking-widest">★EU★</span>
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight lowercase">europass</span>
            <span className="text-[10px] text-blue-200 block uppercase tracking-wider font-medium -mt-1">
              Curriculum Vitae
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-blue-200 font-light block">Formato Oficial Europeo</span>
          <span className="text-xs text-white font-medium">A4 Impresión Estándar</span>
        </div>
      </div>

      {/* Main Grid: Left Column (34%) + Right Column (66%) */}
      <div className="grid grid-cols-12 min-h-[calc(297mm-80px)]">
        {/* Left Column: Personal Info, Languages, Skills */}
        <div className="col-span-4 bg-[#f8fafc] border-r border-slate-200 p-6 flex flex-col gap-6 text-left">
          {/* Photo */}
          {personalInfo.photoUrl ? (
            <div className="flex justify-center">
              <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-[#0e417a] shadow-sm">
                <img
                  src={personalInfo.photoUrl}
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="w-32 h-36 mx-auto rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-center p-2">
              <User className="w-8 h-8 mb-1 text-slate-400" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Sin Fotografía</span>
            </div>
          )}

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0e417a] uppercase tracking-wider border-b border-[#0e417a]/30 pb-1">
              Información de contacto
            </h3>

            <div className="space-y-2 text-xs text-slate-700">
              {personalInfo.email && (
                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#0e417a] shrink-0 mt-0.5" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}

              {personalInfo.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#0e417a] shrink-0 mt-0.5" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}

              {(personalInfo.address || personalInfo.city || personalInfo.country) && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0e417a] shrink-0 mt-0.5" />
                  <span>
                    {[personalInfo.address, personalInfo.city, personalInfo.country]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              )}

              {personalInfo.nationality && (
                <div className="flex items-start gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">Nacionalidad:</span>
                  <span>{personalInfo.nationality}</span>
                </div>
              )}

              {personalInfo.birthDate && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#0e417a] shrink-0 mt-0.5" />
                  <span>Nacimiento: {personalInfo.birthDate}</span>
                </div>
              )}

              {personalInfo.linkedin && (
                <div className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-[#0e417a] shrink-0 mt-0.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span className="break-all text-[11px]">{personalInfo.linkedin}</span>
                </div>
              )}

              {personalInfo.website && (
                <div className="flex items-start gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#0e417a] shrink-0 mt-0.5" />
                  <span className="break-all text-[11px]">{personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Languages Section with official CEFR Table */}
          {languages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#0e417a] uppercase tracking-wider border-b border-[#0e417a]/30 pb-1">
                Competencias Lingüísticas
              </h3>

              {motherTongue && (
                <div className="text-xs">
                  <span className="font-semibold text-slate-700">Lengua materna: </span>
                  <span className="text-slate-900 font-bold">{motherTongue.name}</span>
                </div>
              )}

              {otherLanguages.length > 0 && (
                <div className="space-y-2 mt-2">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Otros idiomas (Marco Europeo MCER):
                  </span>

                  {otherLanguages.map((lang) => (
                    <div key={lang.id} className="bg-white p-2 rounded border border-slate-200 text-[10px]">
                      <div className="font-bold text-[#0e417a] text-xs mb-1">{lang.name}</div>
                      <div className="grid grid-cols-5 gap-1 text-center font-mono">
                        <div>
                          <div className="text-[8px] text-slate-400 uppercase">Comp.</div>
                          <div className="font-bold bg-blue-50 text-[#0e417a] rounded py-0.5">{lang.listening}</div>
                        </div>
                        <div>
                          <div className="text-[8px] text-slate-400 uppercase">Lect.</div>
                          <div className="font-bold bg-blue-50 text-[#0e417a] rounded py-0.5">{lang.reading}</div>
                        </div>
                        <div>
                          <div className="text-[8px] text-slate-400 uppercase">Int.</div>
                          <div className="font-bold bg-blue-50 text-[#0e417a] rounded py-0.5">{lang.spokenInteraction}</div>
                        </div>
                        <div>
                          <div className="text-[8px] text-slate-400 uppercase">Oral</div>
                          <div className="font-bold bg-blue-50 text-[#0e417a] rounded py-0.5">{lang.spokenProduction}</div>
                        </div>
                        <div>
                          <div className="text-[8px] text-slate-400 uppercase">Escr.</div>
                          <div className="font-bold bg-blue-50 text-[#0e417a] rounded py-0.5">{lang.writing}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-[9px] text-slate-400 italic">
                    Niveles: A1/A2 (Básico) - B1/B2 (Independiente) - C1/C2 (Competente)
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Digital Skills */}
          {digitalSkills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#0e417a] uppercase tracking-wider border-b border-[#0e417a]/30 pb-1">
                Competencias Digitales
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {digitalSkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="bg-white border border-slate-300 text-slate-800 text-[10px] px-2 py-0.5 rounded font-medium shadow-2xs"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional info / Driving licenses */}
          {(additionalInfo.drivingLicenses.length > 0 || additionalInfo.certifications.length > 0) && (
            <div className="space-y-2 text-xs">
              <h3 className="text-xs font-bold text-[#0e417a] uppercase tracking-wider border-b border-[#0e417a]/30 pb-1">
                Información Adicional
              </h3>
              {additionalInfo.drivingLicenses.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-600 text-[11px]">Permiso de conducir: </span>
                  <span className="font-bold text-slate-800">
                    {additionalInfo.drivingLicenses.join(', ')}
                  </span>
                </div>
              )}
              {additionalInfo.certifications.length > 0 && (
                <div className="space-y-1">
                  <span className="font-semibold text-slate-600 text-[11px]">Certificaciones:</span>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5">
                    {additionalInfo.certifications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Name, Objective, Summary, Experience, Education */}
        <div className="col-span-8 p-7 flex flex-col gap-6 text-left">
          {/* Header with Full Name and Target Position */}
          <div className="border-b-2 border-[#0e417a] pb-4">
            <h1 className="text-2xl font-extrabold text-[#0e417a] tracking-tight uppercase">
              {personalInfo.firstName || 'Nombre'} {personalInfo.lastName || 'Apellidos'}
            </h1>
            {targetJobTitle && (
              <h2 className="text-sm font-bold text-slate-600 mt-1 uppercase tracking-wide">
                {targetJobTitle}
              </h2>
            )}
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#0e417a] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#0e417a] rounded-full inline-block" />
                Perfil Profesional
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                {summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#0e417a] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                <span className="w-2 h-2 bg-[#0e417a] rounded-full inline-block" />
                Experiencia Laboral
              </h3>

              <div className="space-y-4">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="relative pl-3 border-l-2 border-blue-200 space-y-1">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{exp.position}</span>
                      <span className="text-[11px] font-semibold text-[#0e417a]">
                        {formatDate(exp.startDate)} –{' '}
                        {exp.isCurrent ? 'Presente' : formatDate(exp.endDate)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium">
                      {exp.company}
                      {(exp.city || exp.country) && (
                        <span> — {[exp.city, exp.country].filter(Boolean).join(', ')}</span>
                      )}
                    </div>

                    {exp.description && (
                      <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed pt-1">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education and Training */}
          {education.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#0e417a] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                <span className="w-2 h-2 bg-[#0e417a] rounded-full inline-block" />
                Educación y Formación
              </h3>

              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-3 border-l-2 border-blue-200 space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{edu.degree}</span>
                      <span className="text-[11px] font-semibold text-[#0e417a]">
                        {formatDate(edu.startDate)} –{' '}
                        {edu.isCurrent ? 'Presente' : formatDate(edu.endDate)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium">
                      {edu.institution}
                      {(edu.city || edu.country) && (
                        <span> — {[edu.city, edu.country].filter(Boolean).join(', ')}</span>
                      )}
                      {edu.eqfLevel && (
                        <span className="ml-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          {edu.eqfLevel}
                        </span>
                      )}
                    </div>

                    {edu.description && (
                      <p className="text-xs text-slate-700 leading-relaxed pt-0.5">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {softSkills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#0e417a] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                <span className="w-2 h-2 bg-[#0e417a] rounded-full inline-block" />
                Competencias Interpersonales y de Gestión
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                {softSkills.map((sk, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{sk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Europass Footer */}
      <div className="absolute bottom-2 left-6 right-6 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-200 pt-1">
        <span>© Unión Europea, Portal Europass</span>
        <span>Página 1 / 1</span>
        <span>Generado con Europass IA</span>
      </div>
    </div>
  );
};
