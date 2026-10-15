import { createRoot } from 'react-dom/client';
import { StoreProvider } from './context/ApiStoreContext';
import App from './App.tsx';
import './index.css';

const tg = (window as any).Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.ready();
  tg.MainButton.setText('Корзина').onClick(() => {
    const event = new CustomEvent('open-cart');
    window.dispatchEvent(event);
  });
  tg.HapticFeedback?.impactOccurred?.('light');
}

createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <App />
  </StoreProvider>
);