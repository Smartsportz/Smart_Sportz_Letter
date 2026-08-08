import React, { useState } from 'react';
import { Sparkles, X, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { LetterMethod, Method1Data, Method2Data } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMethod: LetterMethod;
  onApplyMethod1: (data: Method1Data) => void;
  onApplyMethod2: (data: Method2Data) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  currentMethod,
  onApplyMethod1,
  onApplyMethod2,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<LetterMethod>(currentMethod);
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Formal & Executive');
  const [sender, setSender] = useState('SMARTSPORTZ.IN Management');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a brief description of the letter you need.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: selectedMethod,
          prompt,
          tone,
          sender,
          recipient,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to generate letter content.');
      }

      const generated = resData.data;

      const todayStr = new Date().toISOString().split('T')[0];
      const randomRef = `REF: SS/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`;

      if (selectedMethod === 'from_to_sub_body') {
        onApplyMethod1({
          title: generated.title || 'COMPANY LETTER',
          date: todayStr,
          refNo: randomRef,
          from: generated.from || sender,
          to: generated.to || recipient || 'To,\nRecipient Name,\nAddress',
          subject: generated.subject || 'SUB: Official Communication',
          body: generated.body || '',
        });
      } else {
        onApplyMethod2({
          title: generated.title || 'OFFICIAL LETTER',
          date: todayStr,
          refNo: randomRef,
          dear: generated.dear || 'Dear Recipient,',
          body: generated.body || '',
        });
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the letter.');
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'Offer letter for a Senior Badminton Coach with 2 years probation and performance bonus',
    'Official invitation to inter-school sports tournament title sponsorship',
    'Experience certificate for an event manager with outstanding service record',
    'Announcement of new youth athletic championship with prize pool details',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-100">Gemini AI Letter Assistant</h3>
            <p className="text-xs text-slate-400">
              Generate structured, professional company letters instantly
            </p>
          </div>
        </div>

        {/* Target Format Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
            Target Input Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMethod('from_to_sub_body')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedMethod === 'from_to_sub_body'
                  ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="text-xs font-bold mb-0.5">Method 1</div>
              <div className="text-[10px] text-slate-400 font-normal">From - To - Sub - Body</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('dear_body')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedMethod === 'dear_body'
                  ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="text-xs font-bold mb-0.5">Method 2</div>
              <div className="text-[10px] text-slate-400 font-normal">Dear &lt;Name&gt; - Body</div>
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              What letter would you like to create?
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Write an appointment letter for Senior Sports Coordinator mentioning salary, duties, and joining date..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-slate-100 text-xs rounded-xl p-3 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Quick Prompts */}
          <div>
            <span className="text-[11px] text-slate-400 font-medium mb-1 block">Quick Prompts:</span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(sp)}
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 text-[10px] px-2.5 py-1 rounded-md border border-slate-800 transition-all text-left"
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Letter Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 outline-none"
              >
                <option value="Formal & Executive">Formal & Executive</option>
                <option value="Courteous & Warm">Courteous & Warm</option>
                <option value="Strict & Official">Strict & Official</option>
                <option value="Persuasive & Enthusiastic">Persuasive & Enthusiastic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Name (Optional)</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Mr. John Doe"
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 outline-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Generate Action */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Drafting Letter...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Generate Letter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
