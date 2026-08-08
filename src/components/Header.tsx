import React from 'react';
import { Download, Printer, Sparkles, FileCode, RefreshCw, Layers } from 'lucide-react';
import { LetterheadConfig } from '../types';

interface HeaderProps {
  templates: LetterheadConfig[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onOpenAiModal: () => void;
  onOpenFlaskModal: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onReset: () => void;
  isExportingPdf: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onOpenAiModal,
  onOpenFlaskModal,
  onPrint,
  onDownloadPdf,
  onReset,
  isExportingPdf,
}) => {
  return (
    <header className="bg-[#141414] border-b border-white/10 text-white px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-2xl">
      {/* Brand Title & Editorial Subtitle */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white flex items-center gap-1.5 leading-none">
            SMARTSPORTZ<span className="text-white/40 font-normal">.</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-50 font-bold mt-1 text-white">
            Professional Letterhead System
          </p>
        </div>
      </div>

      {/* Center Controls: Template Preset Selector */}
      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
        <Layers className="w-3.5 h-3.5 text-white/60 ml-1 hidden sm:inline" />
        <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold hidden md:inline">
          Template:
        </span>
        <select
          value={selectedTemplateId}
          onChange={(e) => onSelectTemplate(e.target.value)}
          className="bg-transparent text-white text-xs font-bold uppercase tracking-wider px-2 py-1 outline-none cursor-pointer"
        >
          {templates.map((tmpl) => (
            <option key={tmpl.id} value={tmpl.id} className="bg-[#141414] text-white font-sans text-xs">
              {tmpl.name}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Gemini AI Assist Button */}
        <button
          onClick={onOpenAiModal}
          className="bg-white/5 hover:bg-white/10 text-white border border-white/20 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm flex items-center gap-2 transition-all active:scale-95"
          title="Draft letter with Gemini AI"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Draft</span>
        </button>

        {/* Flask Codebase Button */}
        <button
          onClick={onOpenFlaskModal}
          className="bg-white/5 hover:bg-white/10 text-white/80 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-sm border border-white/10 flex items-center gap-2 transition-all"
          title="View & Download Python Flask Source Code"
        >
          <FileCode className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Flask App</span>
        </button>

        {/* Print Button */}
        <button
          onClick={onPrint}
          className="bg-white/5 hover:bg-white/10 text-white/80 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-sm border border-white/10 flex items-center gap-2 transition-all"
          title="Print document directly"
        >
          <Printer className="w-3.5 h-3.5 text-white/70" />
          <span className="hidden md:inline">Print</span>
        </button>

        {/* Download PDF Button (Primary Editorial CTA) */}
        <button
          onClick={onDownloadPdf}
          disabled={isExportingPdf}
          className="bg-[#E4E3E0] hover:bg-white text-black font-bold text-xs uppercase tracking-widest px-6 py-2 rounded-sm flex items-center gap-2 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isExportingPdf ? 'Exporting...' : 'Download PDF'}</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-sm transition-all"
          title="Reset Form to Defaults"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};

