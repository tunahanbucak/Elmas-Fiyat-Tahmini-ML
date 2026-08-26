'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { DiamondVisualizer } from '@/components/DiamondVisualizer';
import { PredictorForm } from '@/components/PredictorForm';
import { PriceDisplay } from '@/components/PriceDisplay';
import { FeatureImportance } from '@/components/FeatureImportance';
import { Presets } from '@/components/Presets';
import { ArchitectureModal } from '@/components/ArchitectureModal';
import {
  DiamondFeatures,
  PredictionResult,
  PresetItem,
  predictPrice,
  fetchPresets,
} from '@/lib/api';

const DEFAULT_FEATURES: DiamondFeatures = {
  carat: 1.0,
  cut: 'Ideal',
  color: 'E',
  clarity: 'VS1',
  depth: 61.5,
  table: 57.0,
  x: 6.45,
  y: 6.48,
  z: 3.98,
};

export default function Home() {
  const [features, setFeatures] = useState<DiamondFeatures>(DEFAULT_FEATURES);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [presets, setPresets] = useState<PresetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchPresets().then((data) => setPresets(data));
  }, []);

  const handlePrediction = useCallback(async (currentFeatures: DiamondFeatures) => {
    setLoading(true);
    try {
      const res = await predictPrice(currentFeatures);
      setPrediction(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handlePrediction(features);
    }, 150);

    return () => clearTimeout(timer);
  }, [features, handlePrediction]);

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950">
      <Navbar
        onOpenArchitecture={() => setModalOpen(true)}
        isBackendConnected={prediction?.isBackendConnected ?? false}
      />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#0a0b0e]">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Akıllı Elmas Değerleme & Fiyat Tahmini
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            Scikit-Learn Support Vector Regression (SVR) makine öğrenmesi modeliyle canlı piyasa tahmini.
          </p>
        </div>
        {presets.length > 0 && (
          <Presets
            presets={presets}
            onSelect={(selectedFeatures) => setFeatures(selectedFeatures)}
            activeFeatures={features}
          />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <PredictorForm
              features={features}
              onChange={(updated) => setFeatures(updated)}
            />
          </div>

          <div className="lg:col-span-6 flex flex-col space-y-6">
            <DiamondVisualizer
              carat={features.carat}
              cut={features.cut}
              color={features.color}
              clarity={features.clarity}
            />

            <PriceDisplay prediction={prediction} loading={loading} />

            <FeatureImportance
              carat={features.carat}
              cut={features.cut}
              color={features.color}
              clarity={features.clarity}
            />
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-zinc-800/80 bg-[#0a0b0e] py-6 text-center text-xs text-zinc-400 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 GEMVAL AI — ELMAS DEĞERLEME PLATFORMU</span>
          <span className="text-zinc-400 font-medium font-sans">Python 3.12 (FastAPI) + Next.js 16 (React 19)</span>
        </div>
      </footer>

      <ArchitectureModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
