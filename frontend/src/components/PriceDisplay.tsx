'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PredictionResult } from '@/lib/api';
import { Award, ShieldCheck } from 'lucide-react';

interface PriceDisplayProps {
  prediction: PredictionResult | null;
  loading: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  prediction,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-[#111319] rounded-2xl border border-zinc-800/90 p-6 flex flex-col items-center justify-center min-h-[180px] text-center shadow-xl">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mb-3" />
        <span className="text-zinc-400 text-xs font-medium animate-pulse">
          Fiyat Hesaplaması Yapılıyor...
        </span>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-[#111319] rounded-2xl border border-zinc-800/90 p-6 text-center min-h-[180px] flex items-center justify-center shadow-xl">
        <span className="text-zinc-400 text-xs">Tahmin için özellikleri güncelleyin</span>
      </div>
    );
  }

  const { predicted_price, price_per_carat, tier, isBackendConnected } = prediction;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(predicted_price);

  const formattedPerCarat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price_per_carat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#111319] rounded-2xl border border-amber-500/30 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
    >
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          {isBackendConnected ? 'Scikit-Learn SVR Modeli' : 'Tahmini Modül'}
        </span>
        <span className="text-xs font-semibold px-3 py-1 bg-[#0a0b0e] text-zinc-300 rounded-full border border-zinc-800 flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-amber-400" /> {tier}
        </span>
      </div>

      <div className="my-4">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">
          Tahmini Piyasa Değeri
        </span>
        <div className="flex items-baseline gap-2">
          <motion.h2
            key={predicted_price}
            initial={{ scale: 0.97 }}
            animate={{ scale: 1 }}
            className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight"
          >
            {formattedPrice}
          </motion.h2>
          <span className="text-sm font-semibold text-zinc-400 font-mono">USD</span>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Karat Başına Ortalama:</span>
          <strong className="text-white font-semibold font-mono">{formattedPerCarat} / ct</strong>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Ağırlık:</span>
          <strong className="text-amber-400 font-semibold font-mono">{prediction.features.carat.toFixed(2)} ct</strong>
        </div>
      </div>
    </motion.div>
  );
};
