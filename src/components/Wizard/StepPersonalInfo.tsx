import React from 'react';
import type { PersonalInfo } from '../../types/cv';
import { PhotoUploader } from '../PhotoUploader';
import { User, Mail, Phone, MapPin, Globe, Calendar, Flag } from 'lucide-react';

interface StepPersonalInfoProps {
  personalInfo: PersonalInfo;
  onChange: (info: PersonalInfo) => void;
}

export const StepPersonalInfo: React.FC<StepPersonalInfoProps> = ({ personalInfo, onChange }) => {
  const updateField = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...personalInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn text-left">
      <div>
        <h2 className="text-lg font-bold text-slate-800">1. Datos Personales y Fotografía</h2>
        <p className="text-xs text-slate-500">
          Información básica de contacto según las normas oficiales de la Unión Europea.
        </p>
      </div>

      {/* Photo Uploader */}
      <PhotoUploader
        photoUrl={personalInfo.photoUrl}
        onPhotoChange={(url) => updateField('photoUrl', url)}
      />

      {/* Name and Surname */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#0e417a]" />
            Nombre(s) *
          </label>
          <input
            type="text"
            placeholder="Ej. Alejandro"
            value={personalInfo.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Apellidos *
          </label>
          <input
            type="text"
            placeholder="Ej. García Moreno"
            value={personalInfo.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
            required
          />
        </div>
      </div>

      {/* Email and Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#0e417a]" />
            Correo Electrónico *
          </label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={personalInfo.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#0e417a]" />
            Teléfono Móvil (con prefijo) *
          </label>
          <input
            type="tel"
            placeholder="+34 612 345 678"
            value={personalInfo.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
            required
          />
        </div>
      </div>

      {/* Address & City */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0e417a]" />
            Dirección / Calle
          </label>
          <input
            type="text"
            placeholder="Calle, número, piso"
            value={personalInfo.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Código Postal
          </label>
          <input
            type="text"
            placeholder="28013"
            value={personalInfo.postalCode}
            onChange={(e) => updateField('postalCode', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
        </div>
      </div>

      {/* City and Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Ciudad / Municipio
          </label>
          <input
            type="text"
            placeholder="Madrid, Barcelona, París..."
            value={personalInfo.city}
            onChange={(e) => updateField('city', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            País
          </label>
          <input
            type="text"
            placeholder="España, Alemania, etc."
            value={personalInfo.country}
            onChange={(e) => updateField('country', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
        </div>
      </div>

      {/* Nationality and Birth Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-[#0e417a]" />
            Nacionalidad
          </label>
          <input
            type="text"
            placeholder="Española, Colombiana, etc."
            value={personalInfo.nationality}
            onChange={(e) => updateField('nationality', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#0e417a]" />
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            value={personalInfo.birthDate}
            onChange={(e) => updateField('birthDate', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
        </div>
      </div>

      {/* LinkedIn and Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#0e417a] fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            Perfil de LinkedIn (opcional)
          </label>
          <input
            type="text"
            placeholder="linkedin.com/in/tu-perfil"
            value={personalInfo.linkedin || ''}
            onChange={(e) => updateField('linkedin', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#0e417a]" />
            Sitio Web / Portfolio (opcional)
          </label>
          <input
            type="text"
            placeholder="https://tuweb.com"
            value={personalInfo.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0e417a] outline-hidden bg-white"
          />
        </div>
      </div>
    </div>
  );
};
