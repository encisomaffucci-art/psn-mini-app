import React from 'react';
import { Send, MessageCircle, Clock, ShieldCheck } from 'lucide-react';

export const GuidesStandaloneSection: React.FC = () => {
  const handleOpenTelegramSupport = () => {
    if (typeof window !== 'undefined') {
      const tgUrl = 'https://t.me/psn_by_support';
      const tgWebApp = (window as unknown as { Telegram?: { WebApp?: { openTelegramLink?: (url: string) => void } } })?.Telegram?.WebApp;
      if (tgWebApp?.openTelegramLink) {
        tgWebApp.openTelegramLink(tgUrl);
      } else {
        window.open(tgUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Служба поддержки
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Возникли трудности с заказом, оплатой или кодами активации? Мы всегда на связи и готовы помочь.
        </p>
      </div>

      {/* Support Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121722] border border-[#1e2638] shadow-2xl relative overflow-hidden text-center space-y-6">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-[#229ed9]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#229ed9]/20 border border-[#229ed9]/40 text-[#229ed9] mx-auto shadow-lg shadow-[#229ed9]/10">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Онлайн-чат в Telegram
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
            Прямая связь с оператором: консультации по покупкам, активации и проверка оплат
          </p>
        </div>

        {/* Telegram Direct Button */}
        <div className="relative pt-2">
          <button
            onClick={handleOpenTelegramSupport}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#229ed9] hover:bg-[#1b8ec6] text-white font-bold text-base sm:text-lg transition-all shadow-xl shadow-[#229ed9]/30 hover:shadow-[#229ed9]/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Send className="w-5 h-5 fill-white" />
            <span>Написать в Telegram (@psn_by_support)</span>
          </button>
        </div>

        {/* Support Meta Info */}
        <div className="relative pt-4 border-t border-[#1e2638] flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ежедневно с 09:00 до 23:00</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#229ed9] shrink-0" />
            <span>Среднее время ответа 3–5 минут</span>
          </div>
        </div>
      </div>
    </div>
  );
};
