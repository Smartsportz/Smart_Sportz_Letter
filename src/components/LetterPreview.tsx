import React from 'react';
import { LetterState } from '../types';
import { Globe, Mail, Shield } from 'lucide-react';

interface LetterPreviewProps {
  state: LetterState;
  previewScale: number;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({ state, previewScale }) => {
  const { method, letterhead, method1, method2, closingSalutation, fontSize } = state;

  // Format Date string
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const fontSizeClass = {
    small: 'text-[12.5px] leading-[1.65]',
    medium: 'text-[13.5px] leading-[1.75]',
    large: 'text-[14.5px] leading-[1.85]',
  }[fontSize];

  return (
    <div
      style={{ transform: `scale(${previewScale})`, transformOrigin: 'top center' }}
      className="transition-transform duration-150 ease-out"
    >
      {/* A4 Sheet - Standard 210mm x 297mm Ratio Container */}
      <div
        id="letter-a4-document"
        style={{
          width: '210mm',
          minHeight: '297mm',
          height: '297mm',
        }}
        className="bg-white text-slate-900 relative shadow-2xl overflow-hidden p-[25mm_20mm_20mm_20mm] flex flex-col justify-between select-text"
      >
        {/* Top-Right Geometric Accents */}
        {letterhead.hasGeometricHeader && (
          <>
            {/* Dark Navy Triangle */}
            <div
              className="absolute top-0 right-0 w-[150px] h-[150px] z-10 pointer-events-none"
              style={{
                backgroundColor: letterhead.primaryColor,
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
              }}
            />
            {/* Gold Triangle Accent */}
            <div
              className="absolute top-0 right-0 w-[170px] h-[170px] z-0 pointer-events-none"
              style={{
                backgroundColor: letterhead.accentColor,
                clipPath: 'polygon(100% 0, 15% 0, 100% 85%)',
              }}
            />
          </>
        )}

        {/* Faint Background Watermark */}
        {letterhead.hasWatermark && (
          <div className="absolute top-[48%] left-[55%] -translate-x-1/2 -translate-y-1/2 opacity-[0.045] pointer-events-none z-0 flex flex-col items-center justify-center">
            {letterhead.logoUrl ? (
              <img src={letterhead.logoUrl} alt="Watermark" className="w-[380px] h-[380px] object-contain grayscale" />
            ) : (
              <Shield className="w-[360px] h-[360px] text-slate-900" />
            )}
          </div>
        )}

        {/* --- HEADER BLOCK --- */}
        <div className="relative z-10 mb-2">
          <div className="flex items-center justify-between mb-2">
            {/* Logo & Company Title */}
            <div className="flex items-center gap-3.5">
              {letterhead.logoUrl ? (
                <img src={letterhead.logoUrl} alt="Logo" className="w-14 h-14 object-contain" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-2xl shadow-sm border border-amber-400/40 shrink-0">
                  ⚡
                </div>
              )}

              <div>
                <div className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                  {letterhead.companyName.includes('.') ? (
                    <>
                      {letterhead.companyName.split('.')[0]}
                      <span style={{ color: letterhead.accentColor }}>.IN</span>
                    </>
                  ) : (
                    letterhead.companyName
                  )}
                </div>
                <div className="text-[9.5px] font-extrabold tracking-[2.5px] text-slate-500 uppercase mt-1">
                  {letterhead.tagline}
                </div>
              </div>
            </div>
          </div>

          {/* Top Line Divider */}
          <div className="relative w-full h-[3px] bg-slate-900 mt-3 mb-6">
            <div
              className="absolute left-0 top-[-2px] h-[3px] w-[90px]"
              style={{ backgroundColor: letterhead.accentColor }}
            />
          </div>
        </div>

        {/* --- MAIN LETTER CONTENT BODY --- */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Metadata Row: Ref No (Left) & Date (Right) */}
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-6">
            <div className="font-mono">
              {(method === 'from_to_sub_body' ? method1.refNo : method2.refNo) || 'REF: SS/2026/089'}
            </div>
            <div>
              Date:{' '}
              {formatDate(method === 'from_to_sub_body' ? method1.date : method2.date) ||
                new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
            </div>
          </div>

          {/* Letter Main Title */}
          <div className="text-center mb-6">
            <h2 className="inline-block text-base font-extrabold text-slate-900 tracking-wider uppercase border-b-2 border-slate-900 pb-0.5">
              {(method === 'from_to_sub_body' ? method1.title : method2.title) || 'COMPANY LETTER'}
            </h2>
          </div>

          {/* METHOD 1 LAYOUT: From -> To -> Sub -> Body */}
          {method === 'from_to_sub_body' ? (
            <div className="space-y-4">
              {/* From Details */}
              {method1.from && (
                <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-normal">
                  {method1.from}
                </div>
              )}

              {/* To Details */}
              {method1.to && (
                <div className="text-xs text-slate-900 font-medium whitespace-pre-line leading-relaxed">
                  {method1.to}
                </div>
              )}

              {/* Subject Line */}
              {method1.subject && (
                <div className="text-xs font-bold text-slate-900 tracking-wide mt-2 mb-3">
                  {method1.subject.startsWith('SUB:') ? method1.subject : `SUB: ${method1.subject}`}
                </div>
              )}

              {/* Body Paragraphs */}
              <div className={`text-slate-800 whitespace-pre-line text-justify font-sans ${fontSizeClass}`}>
                {method1.body}
              </div>
            </div>
          ) : (
            /* METHOD 2 LAYOUT: Dear <Name> -> Body */
            <div className="space-y-4">
              {/* Salutation */}
              {method2.dear && (
                <div className="text-xs font-bold text-slate-900 tracking-wide">{method2.dear}</div>
              )}

              {/* Body Paragraphs */}
              <div className={`text-slate-800 whitespace-pre-line text-justify font-sans ${fontSizeClass}`}>
                {method2.body}
              </div>
            </div>
          )}

          {/* Signatory Block (Bottom Right) */}
          <div className="mt-auto pt-8 self-end text-left min-w-[220px]">
            <p className="text-xs text-slate-700 font-medium mb-1">{closingSalutation || 'Sincerely,'}</p>

            {/* Signature Area */}
            <div className="h-12 flex items-center">
              {letterhead.signatureUrl ? (
                <img src={letterhead.signatureUrl} alt="Signature" className="h-10 object-contain max-w-[160px]" />
              ) : (
                <div className="h-8" />
              )}
            </div>

            {/* Signatory Title & Company */}
            {letterhead.signatoryName && (
              <p className="text-xs font-bold text-slate-900 leading-tight">{letterhead.signatoryName}</p>
            )}
            <p className="text-xs font-extrabold text-slate-900 uppercase tracking-wide leading-tight">
              {letterhead.signatoryTitle || 'FOUNDER'}
            </p>
            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
              {letterhead.signatoryCompany || 'SMARTSPORTZ.IN'}
            </p>
          </div>
        </div>

        {/* --- BOTTOM FOOTER BLOCK --- */}
        <div className="relative z-10 pt-4 mt-6 border-t border-slate-200">
          {/* Bottom Left Geometric Accents */}
          {letterhead.hasGeometricHeader && (
            <div
              className="absolute bottom-0 left-0 w-[100px] h-[100px] z-0 pointer-events-none opacity-90"
              style={{
                backgroundColor: letterhead.primaryColor,
                clipPath: 'polygon(0 100%, 0 0, 100% 100%)',
              }}
            />
          )}

          <div className="flex items-center justify-between text-[10.5px] font-semibold text-slate-600 relative z-10 pl-16">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-700" /> {letterhead.website}
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-700" /> {letterhead.email}
              </span>
            </div>

            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-800 border-t border-slate-800 pt-0.5">
              {letterhead.signatoryTitle} {letterhead.signatoryCompany}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
