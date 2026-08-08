import React, { useRef } from 'react';
import { LetterheadConfig } from '../types';
import { Building2, Globe, Mail, Phone, MapPin, Upload, Palette, CheckCircle2 } from 'lucide-react';

interface LetterheadCustomizerProps {
  config: LetterheadConfig;
  onChange: (updated: LetterheadConfig) => void;
  closingSalutation: string;
  onClosingChange: (val: string) => void;
  fontSize: 'small' | 'medium' | 'large';
  onFontSizeChange: (val: 'small' | 'medium' | 'large') => void;
}

export const LetterheadCustomizer: React.FC<LetterheadCustomizerProps> = ({
  config,
  onChange,
  closingSalutation,
  onClosingChange,
  fontSize,
  onFontSizeChange,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const updateConfig = (field: keyof LetterheadConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateConfig('logoUrl', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateConfig('signatureUrl', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Company Branding */}
      <div className="bg-white/5 border border-white/10 rounded-sm p-4 space-y-4">
        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-white/60" /> Company Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold">Company Name</label>
            <input
              type="text"
              value={config.companyName}
              onChange={(e) => updateConfig('companyName', e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold">Tagline / Motto</label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => updateConfig('tagline', e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold">Custom Logo</label>
          <div className="flex items-center gap-3">
            {config.logoUrl ? (
              <div className="flex items-center gap-3">
                <img src={config.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded bg-white p-1 border border-white/20" />
                <button
                  type="button"
                  onClick={() => updateConfig('logoUrl', undefined)}
                  className="text-xs text-rose-400 hover:underline uppercase tracking-wider font-bold"
                >
                  Remove Logo
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs px-4 py-2 rounded-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Logo
              </button>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Header & Style Colors */}
      <div className="bg-white/5 border border-white/10 rounded-sm p-4 space-y-4">
        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-white/60" /> Layout &amp; Theme Styling
        </h4>

        <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.hasGeometricHeader}
              onChange={(e) => updateConfig('hasGeometricHeader', e.target.checked)}
              className="rounded-sm accent-white w-4 h-4 cursor-pointer"
            />
            <span className="text-xs uppercase tracking-wider">Geometric Corner Accents</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.hasWatermark}
              onChange={(e) => updateConfig('hasWatermark', e.target.checked)}
              className="rounded-sm accent-white w-4 h-4 cursor-pointer"
            />
            <span className="text-xs uppercase tracking-wider">Background Watermark</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateConfig('primaryColor', e.target.value)}
                className="w-8 h-8 rounded-sm border border-white/20 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-white/70">{config.primaryColor}</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => updateConfig('accentColor', e.target.value)}
                className="w-8 h-8 rounded-sm border border-white/20 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-mono text-white/70">{config.accentColor}</span>
            </div>
          </div>
        </div>

        {/* Font Size Selector */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold">Body Text Size</label>
          <div className="grid grid-cols-3 gap-2">
            {(['small', 'medium', 'large'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => onFontSizeChange(sz)}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-sm border text-center transition-all ${
                  fontSize === sz
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white/5 border border-white/10 rounded-sm p-4 space-y-4">
        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-white/60" /> Footer Contact Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold flex items-center gap-1">
              <Globe className="w-3 h-3 text-white/40" /> Website
            </label>
            <input
              type="text"
              value={config.website}
              onChange={(e) => updateConfig('website', e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold flex items-center gap-1">
              <Mail className="w-3 h-3 text-white/40" /> Email
            </label>
            <input
              type="text"
              value={config.email}
              onChange={(e) => updateConfig('email', e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>
      </div>

      {/* Signatory Options */}
      <div className="bg-white/5 border border-white/10 rounded-sm p-4 space-y-4">
        <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-white/60" /> Signatory &amp; Digital Signature
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold">Closing Salutation</label>
            <input
              type="text"
              value={closingSalutation}
              onChange={(e) => onClosingChange(e.target.value)}
              placeholder="Sincerely,"
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold">Signatory Title</label>
            <input
              type="text"
              value={config.signatoryTitle}
              onChange={(e) => updateConfig('signatoryTitle', e.target.value)}
              placeholder="FOUNDER"
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white uppercase font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold">Signatory Name</label>
            <input
              type="text"
              value={config.signatoryName || ''}
              onChange={(e) => updateConfig('signatoryName', e.target.value)}
              placeholder="S. K. RATHORE"
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold">Company Line</label>
            <input
              type="text"
              value={config.signatoryCompany}
              onChange={(e) => updateConfig('signatoryCompany', e.target.value)}
              placeholder="SMARTSPORTZ.IN"
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white font-bold uppercase"
            />
          </div>
        </div>

        {/* Digital Signature Upload */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold">Digital Signature Image</label>
          <div className="flex items-center gap-3">
            {config.signatureUrl ? (
              <div className="flex items-center gap-3">
                <img src={config.signatureUrl} alt="Signature" className="h-10 object-contain bg-white p-1 rounded-sm border border-white/20" />
                <button
                  type="button"
                  onClick={() => updateConfig('signatureUrl', undefined)}
                  className="text-xs text-rose-400 hover:underline uppercase font-bold tracking-wider"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signatureInputRef.current?.click()}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs px-4 py-2 rounded-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Signature
              </button>
            )}
            <input
              ref={signatureInputRef}
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

