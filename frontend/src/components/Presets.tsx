'use client';

import React from 'react';
import { PresetItem, DiamondFeatures } from '@/lib/api';
import { Sparkle, Zap } from 'lucide-react';

interface PresetsProps {
  presets: PresetItem[];
  onSelect: (features: DiamondFeatures) => void;
  activeFeatures: DiamondFeatures;
}

export const Presets: React.FC<PresetsProps> = ({
  presets,
  onSelect,
  activeFeatures,
}) => {
  return (
    <div className="bg-[#111319] rounded-2xl border border-zinc-800/90 p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-3.5">
        <Zap className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
          Ön Ayarlı Elmas Şablonları
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {presets.map((preset) => {
          const isActive =
            activeFeatures.carat === preset.features.carat &&
            activeFeatures.cut === preset.features.cut &&
            activeFeatures.color === preset.features.color;

          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset.features)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-md'
                  : 'bg-[#0a0b0e] border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                  {preset.title}
                </span>
                <Sparkle className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-1 mb-2.5 font-normal">
                {preset.description}
              </p>

              <div className="flex flex-wrap gap-1 text-[10px] font-medium font-mono">
                <span className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-300 border border-zinc-800">
                  {preset.features.carat} ct
                </span>
                <span className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-300 border border-zinc-800">
                  {preset.features.cut}
                </span>
                <span className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-300 border border-zinc-800">
                  {preset.features.color} / {preset.features.clarity}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
