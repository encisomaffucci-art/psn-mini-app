import React from 'react';
import { useStore } from '../context/ApiStoreContext';
import { Send, CreditCard } from 'lucide-react';
import { PSNLogo } from './PSNLogo';

export const Footer: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <footer className="border-t border-white/10 bg-black/50 text-white/40 text-xs py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Каталог</h4>
            <ul className="space-y-1.5">
              <li><button onClick={() => setActiveTab('latest')} className="hover:text-white transition-colors">Новинки</button></li>
              <li><button onClick={() => setActiveTab('collections')} className="hover:text-white transition-colors">Коллекции</button></li>
              <li><button onClick={() => setActiveTab('deals')} className="hover:text-white transition-colors">Скидки</button></li>
              <li><button onClick={() => setActiveTab('subscriptions')} className="hover:text-white transition-colors">Подписки</button></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Поддержка</h4>
            <ul className="space-y-1.5">
              <li><button className="hover:text-white transition-colors">Как создать аккаунт</button></li>
              <li><button className="hover:text-white transition-colors">Активация кодов</button></li>
              <li><button className="hover:text-white transition-colors">Console Sharing</button></li>
              <li><button className="hover:text-white transition-colors">FAQ</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-3 text-[11px] text-white/40 text-center">
          <div className="flex items-center gap-1.5 justify-center">
            <CreditCard className="w-3.5 h-3.5 text-[#0070d1]" />
            <span>Карта BYN · ЕРИП · USDT (TRC-20)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#229ed9]">
            <Send className="w-3.5 h-3.5" />
            <span className="font-mono">Telegram: @psn_store_support</span>
          </div>
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 leading-tight">
            Поддержка: ежедневно 09:00–23:00 (МСК)
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 text-center">
          © {new Date().getFullYear()} PSN.BY. PlayStation, PS5, PS4, DualSense и PlayStation Plus — торговые марки Sony Interactive Entertainment. Сервис не связан с Sony.
        </div>
      </div>
    </footer>
  );
};