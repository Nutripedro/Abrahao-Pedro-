import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-amber-600 text-white shadow-2xl border border-amber-500 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <WifiOff className="w-4 h-4 text-white animate-pulse" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold leading-tight">Modo Offline Ativo</p>
          <p className="text-[11px] text-amber-100 leading-tight truncate">
            Navegando pelos dados cacheados do app.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
        title="Tentar reconectar"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Reconectar</span>
      </button>
    </div>
  );
};
