import React, { useEffect } from 'react';
import { useStore } from '../context/ApiStoreContext';

export const TelegramMiniAppFrame: React.FC = () => {
  const { triggerHaptic } = useStore();

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.ready();
      tg.MainButton.setText('Корзина').onClick(() => {
        window.dispatchEvent(new CustomEvent('open-cart'));
        triggerHaptic('medium');
      });
      tg.HapticFeedback?.impactOccurred?.('light');
      
      // Handle back button
      tg.BackButton.onClick(() => {
        // Let the app handle navigation
      });
      tg.BackButton.show();
    }
  }, [triggerHaptic]);

  return null;
};