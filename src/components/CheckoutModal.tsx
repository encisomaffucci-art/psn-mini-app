import React, { useState, useRef } from 'react';
import { useStore } from '../context/ApiStoreContext';
import { X, CheckCircle, ShieldCheck, ArrowRight, QrCode, CreditCard, Send, Copy, Check, Coins, Loader2, Image, AlertCircle } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    closeCheckout,
    cart,
    currentRegion,
    checkoutData,
    createOrder,
    uploadReceipt,
    triggerHaptic,
  } = useStore();

  const [step, setStep] = useState<'payment' | 'receipt' | 'success'>('payment');
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'ERIP' | 'USDT'>('CARD');
  const [receiptNote, setReceiptNote] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isCheckoutOpen) return null;

  const handleCreateOrder = async () => {
    if (!checkoutData || cart.length === 0) return;
    triggerHaptic('medium');
    
    try {
      const orderId = await createOrder(paymentMethod);
      if (orderId) {
        setCreatedOrderId(orderId);
        setStep('receipt');
      }
    } catch (e) {
      console.error('Order creation failed:', e);
      triggerHaptic('heavy');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadReceipt = async () => {
    if (!receiptFile || !createdOrderId) return;
    setUploading(true);
    triggerHaptic('medium');
    
    try {
      await uploadReceipt(createdOrderId, receiptFile);
      setStep('success');
    } catch (e) {
      console.error('Receipt upload failed:', e);
      triggerHaptic('heavy');
    } finally {
      setUploading(false);
    }
  };

  const getPaymentDetails = () => {
    switch (paymentMethod) {
      case 'CARD':
        return (
          <div className="space-y-2 p-4 rounded-xl bg-black/50 border border-white/10 text-sm">
            <div className="text-white/50">Перевод по номеру карты:</div>
            <div className="font-mono text-base font-bold tracking-wider select-all bg-black/30 px-3 py-2 rounded-lg border border-white/10">9112 3849 1029 4810</div>
            <div className="text-white/60">Сумма к переводу: <b className="text-white">{checkoutData?.totalFiat?.toFixed(2)} BYN</b></div>
            <div className="text-xs text-white/40">Получатель: ИП Иванов И.И.</div>
          </div>
        );
      case 'ERIP':
        return (
          <div className="space-y-2 p-4 rounded-xl bg-black/50 border border-white/10 text-sm">
            <div className="text-white/50">Путь в дереве ЕРИП:</div>
            <div className="font-semibold text-white text-xs">Банковские, финансовые услуги → Банки, НКФО → Пополнение счета</div>
            <div className="font-mono text-sm font-bold select-all bg-black/30 px-3 py-2 rounded-lg border border-white/10">BY49 ALFA 3014 2910 3840 0000 0933</div>
            <div className="text-xs text-white/40">Номер заказа: <b>{createdOrderId?.slice(-6)}</b></div>
          </div>
        );
      case 'USDT':
        return (
          <div className="space-y-2 p-4 rounded-xl bg-black/50 border border-white/10 text-sm">
            <div className="text-white/50">Сеть TRC-20 (USDT):</div>
            <div className="font-mono text-xs font-bold break-all select-all bg-black/30 px-3 py-2 rounded-lg border border-white/10">TX9kP2wL9vQ8mN4xR7sT1cB5zH3jF6gK9L</div>
            <div className="text-white/60">Сумма: <b className="text-white">{checkoutData?.totalFiat?.toFixed(2)} BYN по курсу</b></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-md mx-auto bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121418] rounded-t-2xl border-t border-white/10 max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <span className="font-bold text-base">Оформление заказа</span>
          <button onClick={() => { setStep('payment'); closeCheckout(); triggerHaptic('light'); }} className="text-white/50 hover:text-white text-sm font-medium">Закрыть</button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="ps-card p-3.5 rounded-xl border border-white/10 flex justify-between items-center">
                <div>
                  <div className="text-xs text-white/50">К выдаче: Карты PSN ({currentRegion.code}) на {checkoutData?.totalFaceValue.toLocaleString('ru-RU')} {currentRegion.symbol}</div>
                  <div className="text-lg font-extrabold mt-0.5">{checkoutData?.totalFiat?.toFixed(2)} BYN</div>
                </div>
                <span className="text-lg">{currentRegion.flag}</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-white/50 uppercase">Способ оплаты</div>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => { setPaymentMethod('CARD'); triggerHaptic('light'); }} className="py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors {paymentMethod === 'CARD' ? 'border-[#0070d1] bg-[#0070d1]/15 text-white' : 'border-white/10 bg-black/40 text-white/60'}">Карта (BYN)</button>
                  <button onClick={() => { setPaymentMethod('ERIP'); triggerHaptic('light'); }} className="py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors {paymentMethod === 'ERIP' ? 'border-[#0070d1] bg-[#0070d1]/15 text-white' : 'border-white/10 bg-black/40 text-white/60'}">ЕРИП</button>
                  <button onClick={() => { setPaymentMethod('USDT'); triggerHaptic('light'); }} className="py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors {paymentMethod === 'USDT' ? 'border-emerald-500 bg-emerald-500/15 text-white' : 'border-white/10 bg-black/40 text-white/60'}">USDT (TRC20)</button>
                </div>
              </div>

              {getPaymentDetails()}

              <button onClick={handleCreateOrder} className="w-full ps-blue text-white font-bold py-3.5 rounded-full text-sm transition-colors hover:bg-[#005bb0]">Подтвердить и загрузить чек</button>
            </div>
          )}

          {/* STEP 2: RECEIPT UPLOAD */}
          {step === 'receipt' && (
            <div className="space-y-5">
              <button onClick={() => { setStep('payment'); triggerHaptic('light'); }} className="text-xs text-white/60 flex items-center gap-1 self-start">← Назад к способу оплаты</button>

              <div className="ps-card p-3.5 rounded-xl border border-white/10 flex justify-between items-center">
                <div>
                  <div className="text-xs text-white/50">Заказ #{createdOrderId?.slice(-6)}</div>
                  <div className="text-lg font-extrabold mt-0.5">{checkoutData?.totalFiat?.toFixed(2)} BYN</div>
                </div>
                <span className="text-lg">{currentRegion.flag}</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-white/50 uppercase">Подтверждение оплаты</div>
                <label className="block cursor-pointer ps-card border border-dashed {receiptPreview ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/20'} rounded-xl p-4 text-center">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full">
                    <div className="text-xs font-bold {receiptPreview ? 'text-emerald-400' : 'text-white/80'}">
                      {receiptPreview ? (
                        <>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Image className="w-5 h-5 text-emerald-400" />
                            <span>Чек прикреплен ✓</span>
                          </div>
                          <div className="relative h-32 rounded-lg overflow-hidden">
                            <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                          </div>
                        </>
                      ) : (
                        <>
                          <span>Прикрепить скриншот чека</span>
                          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                        </>
                      )}
                    </div>
                  </button>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50 uppercase block">Комментарий к платежу</label>
                <input
                  type="text"
                  value={receiptNote}
                  onChange={(e) => setReceiptNote(e.target.value)}
                  placeholder="Номер транзакции, примечание..."
                  className="w-full bg-black/30 border border-white/10 text-white text-xs py-2.5 px-3 rounded-lg outline-none"
                />
              </div>

              <button
                onClick={handleUploadReceipt}
                disabled={!receiptFile || uploading}
                className="w-full {receiptFile && !uploading ? 'ps-blue text-white' : 'bg-white/10 text-white/30 cursor-not-allowed'} font-bold py-3.5 rounded-full text-sm transition-colors"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Отправить на проверку'}
              </button>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
              <div className="font-bold text-base">Заказ передан на выдачу</div>
              <p className="text-xs text-white/60 max-w-xs mx-auto">Чек отправлен администратору. Коды пополнения PSN придут вам в Telegram.</p>
              <button onClick={() => { closeCheckout(); triggerHaptic('success'); }} className="mt-4 ps-blue text-white text-xs font-bold px-6 py-3 rounded-full">Вернуться в магазин</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};