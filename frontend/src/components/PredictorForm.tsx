'use client';

import React, { useState } from 'react';
import { DiamondFeatures, estimateDimensions } from '@/lib/api';
import { SlidersHorizontal, Wand2, ChevronDown, ChevronUp, Ruler } from 'lucide-react';

interface PredictorFormProps {
  features: DiamondFeatures;
  onChange: (updated: DiamondFeatures) => void;
}

const CUT_OPTIONS = [
  { value: 'Ideal', label: 'İdeal' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Very Good', label: 'Çok İyi' },
  { value: 'Good', label: 'İyi' },
  { value: 'Fair', label: 'Makul' },
];

const COLOR_OPTIONS = [
  { value: 'D', desc: 'Renksiz' },
  { value: 'E', desc: 'Renksiz' },
  { value: 'F', desc: 'Renksiz' },
  { value: 'G', desc: 'Yakın' },
  { value: 'H', desc: 'Yakın' },
  { value: 'I', desc: 'Yakın' },
  { value: 'J', desc: 'Hafif' },
];

const CLARITY_OPTIONS = [
  { value: 'IF', desc: 'Kusursuz' },
  { value: 'VVS1', desc: 'VVS1' },
  { value: 'VVS2', desc: 'VVS2' },
  { value: 'VS1', desc: 'VS1' },
  { value: 'VS2', desc: 'VS2' },
  { value: 'SI1', desc: 'SI1' },
  { value: 'SI2', desc: 'SI2' },
  { value: 'I1', desc: 'I1' },
];

export const PredictorForm: React.FC<PredictorFormProps> = ({
  features,
  onChange,
}) => {
  // Varsayılan olarak AÇIK tutuyoruz
  const [showAdvanced, setShowAdvanced] = useState(true);

  const updateField = (key: keyof DiamondFeatures, value: string | number) => {
    if (key === 'carat') {
      const newCarat = typeof value === 'number' ? value : parseFloat(value as string) || 0.2;
      const estimated = estimateDimensions(newCarat, features.depth);
      onChange({
        ...features,
        carat: newCarat,
        x: estimated.x,
        y: estimated.y,
        z: estimated.z,
      });
    } else {
      onChange({
        ...features,
        [key]: value,
      });
    }
  };

  const handleAutoDimensions = () => {
    const estimated = estimateDimensions(features.carat, features.depth);
    onChange({
      ...features,
      x: estimated.x,
      y: estimated.y,
      z: estimated.z,
    });
  };

  return (
    <div className="bg-[#111319] rounded-2xl border border-zinc-800/90 p-6 sm:p-7 shadow-xl space-y-6 flex-1">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <h3 className="text-sm font-bold text-white flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" /> Elmas Özellikleri & Parametreleri
        </h3>
        <span className="text-[11px] text-zinc-400 bg-[#0a0b0e] px-3 py-1 rounded-full border border-zinc-800 font-medium font-mono">
          ML GIRDILERI
        </span>
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-zinc-200">
            Karat Ağırlığı (Carat)
            <span className="text-xs text-zinc-400 font-normal ml-2">(0.20 - 5.00 ct)</span>
          </label>
          <span className="text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl font-mono">
            {features.carat.toFixed(2)} ct
          </span>
        </div>
        <input
          type="range"
          min="0.2"
          max="5.0"
          step="0.05"
          value={features.carat}
          onChange={(e) => updateField('carat', parseFloat(e.target.value))}
          className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <div className="flex justify-between text-xs text-zinc-400 font-medium font-mono">
          <span>0.20 ct</span>
          <span>1.00 ct</span>
          <span>2.50 ct</span>
          <span>5.00 ct</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-200 block">
          Kesim Kalitesi (Cut) <span className="text-xs font-normal text-zinc-400">(Işık Parlaklığı)</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
          {CUT_OPTIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => updateField('cut', c.value)}
              className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${features.cut === c.value
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-md scale-[1.02]'
                  : 'bg-[#0a0b0e] text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-200 block">
          Renk Derecesi (Color) <span className="text-xs font-normal text-zinc-400">(D = Renksiz → J = Şampanya)</span>
        </label>
        <div className="grid grid-cols-7 gap-1.5">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => updateField('color', c.value)}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center ${features.color === c.value
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-md scale-[1.02]'
                  : 'bg-[#0a0b0e] text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                }`}
            >
              <span>{c.value}</span>
              <span className="text-[9px] font-normal opacity-75 mt-0.5">{c.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-200 block">
          Berraklık Derecesi (Clarity) <span className="text-xs font-normal text-zinc-400">(IF = Kusursuz → I1 = Lekeli)</span>
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {CLARITY_OPTIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => updateField('clarity', c.value)}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${features.clarity === c.value
                  ? 'bg-emerald-400 text-zinc-950 font-bold shadow-md scale-[1.02]'
                  : 'bg-[#0a0b0e] text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                }`}
            >
              {c.value}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-800/80">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full py-2 flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-amber-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-amber-400" /> Fiziksel Geometri ve Boyutlar (X, Y, Z, Derinlik)
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 bg-[#0a0b0e] rounded-2xl border border-zinc-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <span className="text-xs text-zinc-400 font-medium">Milimetre Cinsinden Ölçüler</span>
              <button
                type="button"
                onClick={handleAutoDimensions}
                className="text-xs bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all font-medium"
              >
                <Wand2 className="w-3.5 h-3.5" /> Otomatik Boyut Hesapla
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Derinlik Oranı (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={features.depth}
                  onChange={(e) => updateField('depth', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Tabla Oranı (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={features.table}
                  onChange={(e) => updateField('table', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Uzunluk X (mm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={features.x}
                  onChange={(e) => updateField('x', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Genişlik Y (mm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={features.y}
                  onChange={(e) => updateField('y', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Derinlik Z (mm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={features.z}
                  onChange={(e) => updateField('z', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
