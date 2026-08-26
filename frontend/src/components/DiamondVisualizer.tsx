'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gem } from 'lucide-react';

interface VisualizerProps {
  carat: number;
  cut: string;
  color: string;
  clarity: string;
}

export const DiamondVisualizer: React.FC<VisualizerProps> = ({
  carat,
  cut,
  color,
  clarity,
}) => {
  const scale = Math.min(1.3, Math.max(0.75, 0.75 + (carat / 5) * 0.55));

  const getColorGradient = (col: string) => {
    switch (col) {
      case 'D': return ['#FFFFFF', '#E0F7FA', '#B2EBF2'];
      case 'E': return ['#FFFFFF', '#E1F5FE', '#B3E5FC'];
      case 'F': return ['#FFFFFF', '#F0F4C3', '#E0F2F1'];
      case 'G': return ['#FFFFFF', '#FFF9C4', '#F5F5F5'];
      case 'H': return ['#FFFFFF', '#FFF59D', '#EEEEEE'];
      case 'I': return ['#FFFFFF', '#FFEE58', '#E0E0E0'];
      case 'J': return ['#FFFFFF', '#FDD835', '#D7CCC8'];
      default: return ['#FFFFFF', '#E0F7FA', '#B2EBF2'];
    }
  };

  const gradients = getColorGradient(color);

  const getCutTurkish = (cutVal: string) => {
    switch (cutVal) {
      case 'Ideal': return 'İdeal';
      case 'Premium': return 'Premium';
      case 'Very Good': return 'Çok İyi';
      case 'Good': return 'İyi';
      case 'Fair': return 'Makul';
      default: return cutVal;
    }
  };

  return (
    <div className="bg-[#111319] rounded-2xl border border-zinc-800/90 p-6 flex flex-col items-center justify-between min-h-[300px] shadow-xl relative">
      <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
          <Gem className="w-4 h-4 text-amber-400" /> Elmas Görsel Simülatörü
        </span>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-mono">
          {carat.toFixed(2)} ct
        </span>
      </div>

      <div className="my-5 relative flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: scale }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 cursor-pointer"
        >
          <svg
            width="140"
            height="140"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
          >
            <defs>
              <linearGradient id="crownGradLinear" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={gradients[0]} stopOpacity="0.95" />
                <stop offset="100%" stopColor={gradients[1]} stopOpacity="0.85" />
              </linearGradient>

              <linearGradient id="pavilionGradLinear" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={gradients[1]} stopOpacity="0.85" />
                <stop offset="100%" stopColor={gradients[2]} stopOpacity="0.95" />
              </linearGradient>

              <linearGradient id="tableGradLinear" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
                <stop offset="100%" stopColor={gradients[0]} stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Pavilion */}
            <polygon
              points="100,175 35,85 165,85"
              fill="url(#pavilionGradLinear)"
              stroke="#F59E0B"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            <polygon points="100,175 70,85 100,85" fill="#FFFFFF" fillOpacity="0.12" />
            <polygon points="100,175 130,85 100,85" fill="#000000" fillOpacity="0.18" />

            <polygon
              points="35,85 62,38 138,38 165,85"
              fill="url(#crownGradLinear)"
              stroke="#F59E0B"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            <polygon points="35,85 62,38 78,85" fill="#FFFFFF" fillOpacity="0.22" />
            <polygon points="165,85 138,38 122,85" fill="#000000" fillOpacity="0.18" />

            <polygon
              points="62,38 138,38 122,85 78,85"
              fill="url(#tableGradLinear)"
              stroke="#FFFFFF"
              strokeWidth="1"
            />

            <line x1="62" y1="38" x2="138" y2="38" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="35" y1="85" x2="165" y2="85" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.7" />
          </svg>
        </motion.div>

        <div className="w-32 h-2.5 bg-gradient-to-r from-transparent via-zinc-800 to-transparent rounded-full mt-3 opacity-60" />
      </div>

      <div className="w-full flex flex-wrap gap-2 justify-center pt-3 border-t border-zinc-800/80 text-xs">
        <span className="px-3 py-1 bg-[#0a0b0e] rounded-lg border border-zinc-800 text-zinc-300 font-medium">
          Kesim: <strong className="text-amber-400">{getCutTurkish(cut)}</strong>
        </span>
        <span className="px-3 py-1 bg-[#0a0b0e] rounded-lg border border-zinc-800 text-zinc-300 font-medium">
          Renk: <strong className="text-white">{color}</strong>
        </span>
        <span className="px-3 py-1 bg-[#0a0b0e] rounded-lg border border-zinc-800 text-zinc-300 font-medium">
          Berraklık: <strong className="text-emerald-400">{clarity}</strong>
        </span>
      </div>
    </div>
  );
};
