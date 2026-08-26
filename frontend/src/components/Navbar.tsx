'use client';

import React, { useState } from 'react';
import { Cpu, Code2, Terminal, Copy, Check } from 'lucide-react';

interface NavbarProps {
  onOpenArchitecture: () => void;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenArchitecture, isBackendConnected }) => {
  const [showStatusHelp, setShowStatusHelp] = useState(false);
  const [copied, setCopied] = useState(false);

  const command = 'uvicorn app:app --reload --port 8000';

  const copyCommand = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="w-full bg-[#0a0b0e] border-b border-zinc-800/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-base">
            ◇
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white">
                GemVal AI
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20">
                SVR Engine
              </span>
            </div>
            <span className="text-xs text-zinc-400 font-normal">
              Elmas Fiyat Değerleme Platformu
            </span>
          </div>
        </div>

        {/* Actions & Status */}
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              onClick={() => setShowStatusHelp(!showStatusHelp)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                isBackendConnected
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
              <span className="hidden sm:inline">
                {isBackendConnected ? 'Backend Bağlı (Port 8000)' : 'FastAPI Sunucusu Kapalı'}
              </span>
            </button>

            {showStatusHelp && (
              <div className="absolute right-0 mt-2 w-80 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 text-xs text-zinc-300 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-amber-400" /> Python Backend Çalıştırma
                  </span>
                  <button onClick={() => setShowStatusHelp(false)} className="text-zinc-400 hover:text-zinc-200">
                    ✕
                  </button>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Canlı SVR model tahminleri için terminalinizde şu komutu çalıştırın:
                </p>
                <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-amber-300 truncate">{command}</span>
                  <button onClick={copyCommand} className="ml-2 text-zinc-400 hover:text-zinc-200" title="Kopyala">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onOpenArchitecture}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-800 flex items-center gap-1.5 transition-all"
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">ML Mimarisi</span>
          </button>

          <a
            href="https://github.com/tunahanbucak/Elmas-Fiyat-Tahmini-ML"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-zinc-800 transition-all"
            title="GitHub Kaynak Kodu"
          >
            <Code2 className="w-4 h-4 text-amber-400" />
          </a>
        </div>
      </div>
    </header>
  );
};
