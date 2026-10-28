'use client';

import React from 'react';
import { Database, Layers, ExternalLink, HelpCircle, Server } from 'lucide-react';
import { RepositoryConnectionStatus } from '@/domain/repositories/product-repository.interface';

interface NavbarProps {
  status: RepositoryConnectionStatus | null;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ status, onOpenGuide }) => {
  const isSupabaseLive = status?.isConnected && status?.provider === 'supabase';

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                ViberStore
              </h1>
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Clean Architecture / MVC
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Next.js 16 • Supabase Database • 100% Vercel Deployable
            </p>
          </div>
        </div>

        {/* Database Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Badge */}
          <button
            onClick={onOpenGuide}
            title={status?.message || 'Trạng thái Database'}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isSupabaseLive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isSupabaseLive ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-semibold">
              {isSupabaseLive ? 'Supabase Live' : 'Chế độ Fake Data (Mock)'}
            </span>
          </button>

          {/* Guide Modal Trigger */}
          <button
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Cấu hình Supabase & Vercel</span>
          </button>

          {/* Vercel Project Link */}
          <a
            href="https://vercel.com/nguyen-duc-hoangs-projects/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-black hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition shadow-sm"
          >
            <Server className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vercel</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
          </a>
        </div>
      </div>
    </header>
  );
};
