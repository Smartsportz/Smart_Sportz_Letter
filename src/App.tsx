import React, { useState } from 'react';
import { DEFAULT_TEMPLATES } from './data/templates';
import { PRESET_SAMPLES } from './data/presets';
import { LetterState, LetterMethod, Method1Data, Method2Data, LetterheadConfig } from './types';
import { Header } from './components/Header';
import { Method1Form } from './components/Method1Form';
import { Method2Form } from './components/Method2Form';
import { LetterheadCustomizer } from './components/LetterheadCustomizer';
import { LetterPreview } from './components/LetterPreview';
import { AiAssistantModal } from './components/AiAssistantModal';
import { FlaskExporterModal } from './components/FlaskExporterModal';
import { exportLetterToPdf } from './utils/pdfGenerator';

import {
  FileText,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
} from 'lucide-react';

export default function App() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [letterState, setLetterState] = useState<LetterState>({
    method: 'from_to_sub_body',
    letterhead: DEFAULT_TEMPLATES[0],
    method1: {
      title: 'APPOINTMENT LETTER',
      date: todayStr,
      refNo: 'REF: SS/2026/089',
      from: 'The Management,\nSMARTSPORTZ.IN,\nBangalore, India',
      to: 'To,\nMr. Rajesh Kumar,\nSenior Sports Coordinator,\nBangalore',
      subject: 'SUB: Letter of Appointment as Senior Sports Coordinator',
      body: `We are pleased to offer you the position of Senior Sports Coordinator at SMARTSPORTZ.IN. Based on your experience and skills in managing athletic tournaments, we believe you will be a valuable asset to our organization.

Your roles and responsibilities will involve coordinating inter-school sports competitions, overseeing venue logistics, and promoting our youth fitness programs across regional centers.

Please sign and return the duplicate copy of this letter as a token of your acceptance of the terms and conditions outlined herein. We look forward to welcoming you to the SMARTSPORTZ.IN team.`,
    },
    method2: {
      title: 'OFFICIAL ANNOUNCEMENT',
      date: todayStr,
      refNo: 'REF: SS/2026/089',
      dear: 'Dear Valued Sports Partner,',
      body: `We are thrilled to announce the launch of our upcoming National Junior Championship 2026 sponsored by SMARTSPORTZ.IN.

Over the past year, our platform has empowered thousands of young athletes to play, compete, inspire, and succeed across multiple sports disciplines. This tournament brings together top talent from over 50 schools across the region.

We cordially invite your organization to participate as an official partner for this flagship event. Detailed event schedules and sponsorship kits are attached with this notice.`,
    },
    closingSalutation: 'Sincerely,',
    showWatermark: true,
    showSignatureLine: true,
    fontSize: 'medium',
  });

  const [activeTab, setActiveTab] = useState<'form' | 'customizer' | 'presets'>('form');
  const [previewScale, setPreviewScale] = useState<number>(0.85);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isFlaskModalOpen, setIsFlaskModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Switch Method 1 vs Method 2
  const handleSwitchMethod = (method: LetterMethod) => {
    setLetterState((prev) => ({ ...prev, method }));
  };

  // Change Template
  const handleSelectTemplate = (templateId: string) => {
    const tmpl = DEFAULT_TEMPLATES.find((t) => t.id === templateId) || DEFAULT_TEMPLATES[0];
    setLetterState((prev) => ({ ...prev, letterhead: tmpl }));
  };

  // Load Sample Preset
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_SAMPLES.find((p) => p.id === presetId);
    if (!preset) return;

    setLetterState((prev) => {
      const updated = { ...prev, method: preset.method };
      if (preset.method === 'from_to_sub_body' && preset.method1) {
        updated.method1 = { ...prev.method1, ...preset.method1 };
      } else if (preset.method === 'dear_body' && preset.method2) {
        updated.method2 = { ...prev.method2, ...preset.method2 };
      }
      return updated;
    });

    setActiveTab('form');
  };

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  // PDF Export Action
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const currentTitle =
        letterState.method === 'from_to_sub_body' ? letterState.method1.title : letterState.method2.title;
      const cleanName = (currentTitle || 'Company_Letter').toLowerCase().replace(/[^a-z0-9]/gi, '_');
      await exportLetterToPdf('letter-a4-document', `${cleanName}_smartsportz.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Reset to default
  const handleReset = () => {
    if (confirm('Reset letter form to default content?')) {
      setLetterState((prev) => ({
        ...prev,
        method: 'from_to_sub_body',
        letterhead: DEFAULT_TEMPLATES[0],
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Top Header Navbar */}
      <Header
        templates={DEFAULT_TEMPLATES}
        selectedTemplateId={letterState.letterhead.id}
        onSelectTemplate={handleSelectTemplate}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenFlaskModal={() => setIsFlaskModalOpen(true)}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        onReset={handleReset}
        isExportingPdf={isExportingPdf}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: Input Forms, Customizer & Presets */}
        <div className="w-full lg:w-[440px] xl:w-[480px] bg-[#141414] border-r border-white/10 flex flex-col shrink-0">
          {/* Main Method Selector Capsule (Formal Dispatch vs Direct Address) */}
          <div className="p-5 bg-[#141414] border-b border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 block mb-3">
              Dispatch Protocol:
            </span>
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
              <button
                type="button"
                onClick={() => handleSwitchMethod('from_to_sub_body')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all text-center ${
                  letterState.method === 'from_to_sub_body'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <span>Method 1 (Formal)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMethod('dear_body')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all text-center ${
                  letterState.method === 'dear_body'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <span>Method 2 (Direct)</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between bg-[#141414] border-b border-white/10 text-xs px-4">
            <button
              onClick={() => setActiveTab('form')}
              className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all text-[10px] font-bold uppercase tracking-widest ${
                activeTab === 'form'
                  ? 'border-white text-white'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Letter Fields</span>
            </button>

            <button
              onClick={() => setActiveTab('customizer')}
              className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all text-[10px] font-bold uppercase tracking-widest ${
                activeTab === 'customizer'
                  ? 'border-white text-white'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Letterhead &amp; Style</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-all text-[10px] font-bold uppercase tracking-widest ${
                activeTab === 'presets'
                  ? 'border-white text-white'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>
          </div>

          {/* Form Scroll Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#141414]">
            {activeTab === 'form' && (
              <div>
                {letterState.method === 'from_to_sub_body' ? (
                  <Method1Form
                    data={letterState.method1}
                    onChange={(method1) => setLetterState((p) => ({ ...p, method1 }))}
                  />
                ) : (
                  <Method2Form
                    data={letterState.method2}
                    onChange={(method2) => setLetterState((p) => ({ ...p, method2 }))}
                  />
                )}
              </div>
            )}

            {activeTab === 'customizer' && (
              <LetterheadCustomizer
                config={letterState.letterhead}
                onChange={(letterhead) => setLetterState((p) => ({ ...p, letterhead }))}
                closingSalutation={letterState.closingSalutation}
                onClosingChange={(val) => setLetterState((p) => ({ ...p, closingSalutation: val }))}
                fontSize={letterState.fontSize}
                onFontSizeChange={(fontSize) => setLetterState((p) => ({ ...p, fontSize }))}
              />
            )}

            {activeTab === 'presets' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">
                    Pre-Drafted Correspondence
                  </h3>
                  <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono">Select to apply</span>
                </div>

                <div className="space-y-2.5">
                  {PRESET_SAMPLES.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleLoadPreset(preset.id)}
                      className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white group-hover:underline">
                            {preset.name}
                          </span>
                          <span className="bg-white/10 text-white/70 text-[9px] uppercase font-mono px-2 py-0.5 rounded-sm">
                            {preset.method === 'from_to_sub_body' ? 'Method 1' : 'Method 2'}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 mt-1">{preset.category}</p>
                      </div>

                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Optical A4 Document Preview on Editorial Bone (#E4E3E0) Canvas */}
        <div className="flex-1 bg-[#E4E3E0] flex flex-col overflow-hidden relative">
          {/* Zoom & View Toolbar */}
          <div className="bg-[#141414] border-b border-white/10 px-6 py-2.5 flex items-center justify-between text-xs text-white z-10">
            <div className="flex items-center gap-3">
              <span className="font-bold text-xs uppercase tracking-widest text-white/90">A4 Live Document</span>
              <span className="bg-white/10 text-white/80 border border-white/20 text-[9px] px-2 py-0.5 rounded-sm font-mono uppercase tracking-wider">
                Encryption Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewScale((s) => Math.max(0.5, s - 0.05))}
                className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-12 text-center text-white/60">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale((s) => Math.min(1.2, s + 0.05))}
                className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewScale(0.85)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono uppercase rounded-sm transition-colors"
                title="Reset Zoom"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Canvas Scroll Area */}
          <div className="flex-1 overflow-auto p-12 flex justify-center items-start bg-[#E4E3E0]">
            <LetterPreview state={letterState} previewScale={previewScale} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentMethod={letterState.method}
        onApplyMethod1={(data1) => {
          setLetterState((p) => ({ ...p, method: 'from_to_sub_body', method1: data1 }));
          setActiveTab('form');
        }}
        onApplyMethod2={(data2) => {
          setLetterState((p) => ({ ...p, method: 'dear_body', method2: data2 }));
          setActiveTab('form');
        }}
      />

      <FlaskExporterModal
        isOpen={isFlaskModalOpen}
        onClose={() => setIsFlaskModalOpen(false)}
      />
    </div>
  );
}
