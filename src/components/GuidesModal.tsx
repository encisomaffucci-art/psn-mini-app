import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, BookOpen, ShieldCheck, HelpCircle, Check, ArrowRight } from 'lucide-react';
import { REGION_GUIDES } from '../data/initialData';
import { DualSenseIcon } from './PlayStationIcons';

export const GuidesModal: React.FC = () => {
  const { isGuidesOpen, closeGuides, currentRegion, setRegion, regions } = useStore();
  const [selectedGuideRegion, setSelectedGuideRegion] = useState(currentRegion.id);

  if (!isGuidesOpen) return null;

  const activeGuide = REGION_GUIDES[selectedGuideRegion] || REGION_GUIDES.turkey;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121722] border border-[#1e2638] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={closeGuides}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-[#161d2b] to-[#121722] border-b border-[#1e2638]">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>База знаний PSN.BY</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Инструкции по созданию аккаунта и активации кодов
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Пошаговые руководства без необходимости использовать VPN.
          </p>
        </div>

        {/* Region selector tabs */}
        <div className="px-6 py-3 border-b border-[#1e2638] bg-[#0e121b] flex items-center gap-2 overflow-x-auto">
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedGuideRegion(reg.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedGuideRegion === reg.id
                  ? 'bg-[#0070d1] text-white font-bold'
                  : 'bg-[#121722] text-slate-300 hover:text-white border border-[#1e2638]'
              }`}
            >
              <span>{reg.flag}</span>
              <span>{reg.name}</span>
            </button>
          ))}
        </div>

        {/* Guide Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DualSenseIcon className="w-5 h-5 text-[#0070d1]" />
              <span>{activeGuide.title}</span>
            </h3>

            <div className="space-y-3">
              {activeGuide.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0b0e14] border border-[#1e2638] text-xs text-slate-300"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#0070d1]/20 text-[#0070d1] font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed mt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Console Sharing Callout */}
          <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#1e2638] space-y-2 text-xs">
            <div className="font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Как играть с белорусского аккаунта со всеми трофеями:</span>
            </div>
            <p className="text-slate-400 leading-normal">
              На PS5 перейдите в: <strong>Настройки → Пользователи и учетные записи → Другое → Общий доступ к консоли и автономная игра (Console Sharing) → Включить</strong>. Теперь все игры и подписка PS Plus работают для всех профилей на вашей консоли!
            </p>
          </div>

          {/* Safety Guarantee */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Безопасность на 100%:</strong> Мы продаём официальные коды пополнения кошелька PS Store. Вы не передаёте логин/пароль посторонним лицам, что исключает риск угона аккаунта или санкций со стороны Sony.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
