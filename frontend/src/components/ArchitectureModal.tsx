'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Code2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Makine Öğrenmesi Boru Hattı ve Mimarisi
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-6 space-y-5">
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Bu uygulama, kursta eğitilen ve{' '}
              <code className="text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                30-diamond_model_complete.pkl
              </code>{' '}
              dosyası içerisinde saklanan Scikit-Learn ML boru hattını canlı olarak çalıştırır:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 py-3">
              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  1. Adım
                </span>
                <span className="text-xs font-bold text-slate-200">Girdi Özellikleri</span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Carat, Cut, Color, Clarity, X, Y, Z
                </span>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  2. Adım
                </span>
                <span className="text-xs font-bold text-amber-300">LabelEncoder</span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Kategorik metinleri sayısal matrise dönüştürür
                </span>
              </div>

              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                  3. Adım
                </span>
                <span className="text-xs font-bold text-emerald-300">StandardScaler</span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Ortalamayı 0, standart sapmayı 1 yapar
                </span>
              </div>

              <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/30 flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-amber-400 uppercase mb-1">
                  4. Adım
                </span>
                <span className="text-xs font-bold text-amber-200">SVR Modeli</span>
                <span className="text-[10px] text-amber-300/80 mt-1">
                  Tahmini Dolar Fiyatını Hesaplar
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Code2 className="w-4 h-4 text-amber-400" /> Bağımsız Mimari (Decoupled Microservice)
              </div>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-normal">
                <li>
                  <strong className="text-slate-200">Backend API:</strong> Python 3.12 + FastAPI asenkron REST API sunucusu.
                </li>
                <li>
                  <strong className="text-zinc-200">Frontend UI:</strong> Next.js 16 App Router + Tailwind CSS v4 + Framer Motion.
                </li>
                <li>
                  <strong className="text-slate-200">ML Modeli:</strong> 50.000+ elmas verisinde eğitilmiş Support Vector Regressor.
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
            >
              Anladım
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
