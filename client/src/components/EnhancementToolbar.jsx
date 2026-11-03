import React from 'react';
import { Sparkles, UserX, ZoomIn, FileText, CheckSquare, Square } from 'lucide-react';

export default function EnhancementToolbar({ enhancements, onToggle }) {
  const tools = [
    {
      id: 'removeBackground',
      label: 'AUTO-REMOVE CROWD / BG',
      description: 'Isolate lost item from crowded campus walkways',
      icon: UserX,
    },
    {
      id: 'upscale',
      label: 'UPSCALE RESOLUTION',
      description: 'Super-res boost for low-light smartphone shots',
      icon: ZoomIn,
    },
    {
      id: 'sharpenText',
      label: 'SHARPEN TEXT & ID BADGES',
      description: 'Enhances micro-contrast on student cards and tags',
      icon: FileText,
    },
  ];

  const activeCount = Object.values(enhancements).filter(Boolean).length;

  return (
    <div className="mt-4 p-4 bg-black border-2 border-black shadow-[4px_4px_0px_0px_#FFE600]">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/20">
        <div className="flex items-center space-x-2">
          <span className="bg-[#FFE600] text-black p-1 border border-black font-black text-xs">
            <Sparkles className="w-4 h-4 stroke-[3]" />
          </span>
          <div>
            <div className="font-display font-black text-xs sm:text-sm uppercase tracking-tight text-white">
              AI PHOTO PRE-PROCESSING STUDIO
            </div>
            <div className="font-mono text-[10px] text-white/70 uppercase">
              Apply filters before publishing to campus feed
            </div>
          </div>
        </div>
        <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFE600] text-black border border-black">
          {activeCount} ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = enhancements[tool.id];

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onToggle(tool.id)}
              className={`p-3 border-2 border-black text-left transition-all ${
                isActive
                  ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_0px_#FFF] -translate-x-0.5 -translate-y-0.5'
                  : 'bg-white hover:bg-[#F4F4F0] text-black shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center space-x-1.5 font-display font-black text-xs uppercase tracking-tight">
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                  <span>{tool.label}</span>
                </div>
                {isActive ? (
                  <CheckSquare className="w-4 h-4 text-black stroke-[3] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-black/40 stroke-[2] shrink-0" />
                )}
              </div>
              <p className="font-mono text-[10px] text-black/80 uppercase leading-snug">
                {tool.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
