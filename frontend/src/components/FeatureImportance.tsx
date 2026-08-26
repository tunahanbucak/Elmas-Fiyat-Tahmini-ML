'use client';

import React from 'react';

interface FeatureImportanceProps {
  carat: number;
  cut: string;
  color: string;
  clarity: string;
}

export const FeatureImportance: React.FC<FeatureImportanceProps> = ({
  carat,
  cut,
  color,
  clarity,
}) => {
  const factors = [
    {
      name: 'Karat Ağırlığı',
      detail: `${carat.toFixed(2)} ct`,
      percentage: 65,
      color: 'bg-amber-400',
    },
    {
      name: 'Berraklık (Clarity)',
      detail: clarity,
      percentage: 15,
      color: 'bg-emerald-400',
    },
    {
      name: 'Renk Derecesi (Color)',
      detail: color,
      percentage: 12,
      color: 'bg-sky-400',
    },
    {
      name: 'Kesim Kalitesi (Cut)',
      detail: cut,
      percentage: 8,
      color: 'bg-indigo-400',
    },
  ];

  return (
    <div className="bg-[#111319] rounded-2xl border border-zinc-800/90 p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
          ML Fiyat Etki Dağılımı (Feature Importance)
        </h4>
        <span className="text-[10px] text-zinc-400 font-medium bg-[#0a0b0e] px-2.5 py-0.5 rounded-full border border-zinc-800 font-mono">
          Model Ağırlıkları
        </span>
      </div>

      <div className="space-y-3.5 pt-1">
        {factors.map((factor) => (
          <div key={factor.name} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-medium">
              <span className="text-zinc-300">{factor.name}</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-zinc-400 text-[11px]">{factor.detail}</span>
                <span className="text-white font-bold text-xs">{factor.percentage}%</span>
              </div>
            </div>
            <div className="w-full h-2 bg-[#0a0b0e] rounded-full overflow-hidden border border-zinc-800/60">
              <div
                className={`h-full ${factor.color} rounded-full transition-all duration-500`}
                style={{ width: `${factor.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
