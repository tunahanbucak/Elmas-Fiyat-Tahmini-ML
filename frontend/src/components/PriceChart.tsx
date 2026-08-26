'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { DiamondFeatures } from '@/lib/api';

interface PriceChartProps {
  features: DiamondFeatures;
  currentPrice: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  features,
  currentPrice,
}) => {
  const points = [0.3, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0].map((caratVal) => {
    const scaleFactor = Math.pow(caratVal / Math.max(0.1, features.carat), 1.65);
    const estPrice = Math.round(currentPrice * scaleFactor);
    return { carat: caratVal, price: estPrice };
  });

  const maxPrice = Math.max(...points.map((p) => p.price), 1000);
  const minPrice = Math.min(...points.map((p) => p.price), 100);

  const width = 360;
  const height = 110;
  const padding = 15;

  const svgPoints = points
    .map((p, index) => {
      const x = padding + (index / (points.length - 1)) * (width - 2 * padding);
      const normalizedY = (p.price - minPrice) / Math.max(1, maxPrice - minPrice);
      const y = height - padding - normalizedY * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  const activeIndex = points.findIndex((p) => p.carat >= features.carat);
  const safeIndex = activeIndex === -1 ? points.length - 1 : activeIndex;
  const activeX = padding + (safeIndex / (points.length - 1)) * (width - 2 * padding);
  const activeNormalizedY = (points[safeIndex].price - minPrice) / Math.max(1, maxPrice - minPrice);
  const activeY = height - padding - activeNormalizedY * (height - 2 * padding);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 shadow-xl space-y-2">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" /> Karat vs Fiyat Duyarlılık Eğrisi
        </h4>
        <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
          Simülasyon
        </span>
      </div>

      <div className="relative w-full h-[100px] flex items-center justify-center my-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="chartSubGradLinear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <polygon
            points={`${padding},${height - padding} ${svgPoints} ${width - padding},${height - padding}`}
            fill="url(#chartSubGradLinear)"
          />

          <polyline
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={svgPoints}
          />

          <motion.circle
            cx={activeX}
            cy={activeY}
            r="4"
            fill="#F59E0B"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
        <span>0.3 ct</span>
        <span>1.0 ct</span>
        <span>2.0 ct</span>
        <span>4.0 ct</span>
      </div>
    </div>
  );
};
