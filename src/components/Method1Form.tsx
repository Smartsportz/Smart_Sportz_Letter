import React from 'react';
import { Method1Data } from '../types';
import { Calendar, Hash, User, UserCheck, FileText, AlignLeft } from 'lucide-react';

interface Method1FormProps {
  data: Method1Data;
  onChange: (updated: Method1Data) => void;
}

export const Method1Form: React.FC<Method1FormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof Method1Data, value: string) => {
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
            placeholder="e.g. APPOINTMENT LETTER"
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

      {/* From Field */}
      <div>
        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-white/60" /> From Address (Sender)
        </label>
        <textarea
          rows={3}
          value={data.from}
          onChange={(e) => handleChange('from', e.target.value)}
          placeholder="The Management,&#10;SMARTSPORTZ.IN,&#10;Bangalore, India"
          className="w-full bg-white/5 border border-white/10 rounded-sm p-3.5 text-sm text-white focus:outline-none focus:border-white/40 resize-y leading-relaxed font-sans placeholder:text-white/20"
        />
      </div>

      {/* To Field */}
      <div>
        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-white/60" /> Recipient Details (To)
        </label>
        <textarea
          rows={3}
          value={data.to}
          onChange={(e) => handleChange('to', e.target.value)}
          placeholder="To,&#10;Mr. Rajesh Kumar,&#10;Senior Sports Coordinator,&#10;Bangalore"
          className="w-full bg-white/5 border border-white/10 rounded-sm p-3.5 text-sm text-white focus:outline-none focus:border-white/40 resize-y leading-relaxed font-sans placeholder:text-white/20"
        />
      </div>

      {/* Subject Line */}
      <div>
        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-bold flex items-center gap-1.5">
          <AlignLeft className="w-3.5 h-3.5 text-white/60" /> Subject Line
        </label>
        <input
          type="text"
          value={data.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          placeholder="SUB: Appointment as Senior Sports Coordinator"
          className="w-full bg-transparent border-b border-white/20 pb-2 text-sm text-white focus:outline-none focus:border-white placeholder:text-white/20 font-semibold"
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
          rows={9}
          value={data.body}
          onChange={(e) => handleChange('body', e.target.value)}
          placeholder="Type the body of the letter here. Use line breaks for paragraph separation..."
          className="w-full bg-white/5 border border-white/10 rounded-sm p-4 text-sm text-white focus:outline-none focus:border-white/40 resize-y leading-relaxed font-sans placeholder:text-white/20"
        />
      </div>
    </div>
  );
};

