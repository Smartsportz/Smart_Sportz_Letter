import React from 'react';
import { Method2Data } from '../types';
import { Calendar, Hash, Heart, FileText } from 'lucide-react';

interface Method2FormProps {
  data: Method2Data;
  onChange: (updated: Method2Data) => void;
}

export const Method2Form: React.FC<Method2FormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof Method2Data, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Letter Title & Ref No */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-white/60" /> Letter Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. OFFICIAL ANNOUNCEMENT"
            className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white placeholder:text-white/20 font-bold uppercase tracking-wider"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-white/60" /> Reference No.
          </label>
          <input
            type="text"
            value={data.refNo}
            onChange={(e) => handleChange('refNo', e.target.value)}
            placeholder="REF: SS/2026/089"
            className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white placeholder:text-white/20 font-mono text-xs"
          />
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-white/60" /> Date
        </label>
        <input
          type="date"
          value={data.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white font-mono text-xs cursor-pointer"
        />
      </div>

      {/* Dear Field */}
      <div>
        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-white/60" /> Salutation (Dear &lt;Name&gt;)
        </label>
        <input
          type="text"
          value={data.dear}
          onChange={(e) => handleChange('dear', e.target.value)}
          placeholder="Dear Valued Partner,"
          className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white font-semibold"
        />
      </div>

      {/* Body Content */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-white/60" /> Correspondence Body
          </label>
          <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">Paragraph Layout Preserved</span>
        </div>
        <textarea
          rows={11}
          value={data.body}
          onChange={(e) => handleChange('body', e.target.value)}
          placeholder="Type the body of the letter here. Use line breaks for paragraph separation..."
          className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-sm text-white focus:outline-none focus:border-white/40 resize-y leading-relaxed font-sans placeholder:text-white/20"
        />
      </div>
    </div>
  );
};

