import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, CheckCircle, ShieldCheck, CreditCard, Sparkles, Plus, Minus, Check, Zap } from 'lucide-react';
import { PsCross, PsCircle, PsTriangle, PsSquare } from './PlayStationIcons';
import { PSNCardVisual, getRegionTheme } from './PSNCardVisual';

export const GiftCardSection: React.FC = () => {
  const { currentRegion, giftCards, addToCart, digitalCodes, cart, updateQuantity, triggerFlyAnimation, customRegionTopupImages } = useStore();

  const cardsForRegion = giftCards.filter(c => c.regionId === currentRegion.id);
  const theme = getRegionTheme(currentRegion.id);
  const topupImage = customRegionTopupImages?.[currentRegion.id];

  // Calculate live codes count in inventory for each denomination
  const getAvailableCodes = (denomination: number) => {
    return digitalCodes.filter(
      c => c.regionId === currentRegion.id &&
           c.denomination === denomination &&
           c.status === 'available'
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Denominations Grid Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Номиналы карт {currentRegion.name}</span>
            <span className="text-base leading-none">{currentRegion.flag}</span>
          </h3>
        </div>
      </div>

      {/* Responsive Grid of Denominations - Compact square design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
        {cardsForRegion.map((card) => {
          const availableStock = getAvailableCodes(card.localAmount);
          const cartItem = cart.find(
            item =>
              item.type === 'gift_card' &&
              item.regionId === currentRegion.id &&
              item.denomination === card.localAmount
          );
          const quantityInCart = cartItem ? cartItem.quantity : 0;

          return (
            <div
              key={card.id}
              className={`aspect-square w-full group relative overflow-hidden rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 border ${
                quantityInCart > 0
                  ? 'border-white/50 ring-2'
                  : 'border-[#1e2638] hover:border-slate-500'
              }`}
              style={
                quantityInCart > 0
                  ? { borderColor: theme.accentColor, boxShadow: `0 0 16px ${theme.glowColorSoft}` }
                  : undefined
              }
            >
              {/* IMAGE FILLS 100% OF THE TILE (1 IMAGE PER REGION FOR TOP-UPS) */}
              {(topupImage || card.imageUrl) ? (
                <div className="absolute inset-0 pointer-events-none select-none z-0">
                  <img
                    src={topupImage || card.imageUrl}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/95 via-[#07090e]/70 to-[#07090e]/40" />
                </div>
              ) : (
                <PSNCardVisual
                  regionId={currentRegion.id}
                  isBackground={true}
                  overlayOpacity={0.38}
                  showDenomination={false}
                  className="w-full h-full"
                />
              )}

              {/* FOREGROUND CONTENT DIRECTLY ON TOP OF THE IMAGE */}
              <div className="relative z-10 flex flex-col justify-between h-full space-y-2">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="text-base sm:text-lg font-black font-mono text-white tracking-tight drop-shadow-md">
                    {card.localAmount.toLocaleString()} {currentRegion.currencySymbol}
                  </div>

                  {quantityInCart > 0 ? (
                    <span
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black text-white shadow-md font-mono"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>{quantityInCart}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-300 flex items-center gap-0.5 font-medium drop-shadow-sm">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>{availableStock > 0 ? `${availableStock}` : 'Есть'}</span>
                    </span>
                  )}
                </div>

                {/* Price and Add/Counter Button */}
                <div className="pt-1.5 border-t border-white/10 flex items-center justify-between gap-1 backdrop-blur-[2px]">
                  <div>
                    <div
                      className="text-xs sm:text-sm font-black font-mono drop-shadow-md truncate"
                      style={{ color: theme.accentLight }}
                    >
                      {card.priceByn.toFixed(2)} BYN
                    </div>
                  </div>

                  {quantityInCart > 0 && cartItem ? (
                    /* Interactive Stepper Counter for Added Vouchers */
                    <div className="flex items-center bg-black/75 border border-white/20 rounded-md p-0.5 shadow-sm backdrop-blur-xs shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(cartItem.id, -1);
                        }}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-white/10 hover:bg-red-500/30 hover:text-red-300 text-white flex items-center justify-center transition-all active:scale-80 cursor-pointer"
                        aria-label="Уменьшить количество"
                        title="Уменьшить количество"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <div className="flex items-center px-1 min-w-[1.2rem] justify-center text-center select-none">
                        <span className="font-mono text-xs font-black text-white">
                          {quantityInCart}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerFlyAnimation(e, {
                            label: `${card.localAmount} ${currentRegion.currencySymbol}`,
                            icon: 'card'
                          });
                          updateQuantity(cartItem.id, 1);
                        }}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded text-white flex items-center justify-center transition-all active:scale-80 cursor-pointer shadow-sm"
                        style={{ backgroundColor: theme.accentColor }}
                        aria-label="Увеличить количество"
                        title="Увеличить количество"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    /* Responsive Add To Cart Button */
                    <button
                      onClick={(e) => {
                        triggerFlyAnimation(e, {
                          label: `${card.localAmount} ${currentRegion.currencySymbol}`,
                          icon: 'card'
                        });
                        addToCart({
                          type: 'gift_card',
                          title: `Карта пополнения PS Store ${card.localAmount} ${currentRegion.currencySymbol} (${currentRegion.name})`,
                          regionId: currentRegion.id,
                          denomination: card.localAmount,
                          currencySymbol: currentRegion.currencySymbol,
                          priceByn: card.priceByn,
                          quantity: 1
                        });
                      }}
                      className="px-2.5 py-1 sm:py-1.5 rounded-lg text-white text-[10px] sm:text-xs font-black flex items-center gap-1 transition-all shadow-md cursor-pointer select-none active:scale-90 hover:scale-105 shrink-0"
                      style={{
                        backgroundColor: theme.accentColor,
                        boxShadow: `0 2px 10px ${theme.glowColorSoft}`
                      }}
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Купить</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful banner */}
      <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#1e2638] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Все карты пополнения активируются в PS Store и мгновенно зачисляют средства на ваш баланс.
          </span>
        </div>
        <span className="text-emerald-400 font-semibold text-left sm:text-right shrink-0">
          ✓ Моментальная доставка 12-значного кода
        </span>
      </div>
    </div>
  );
};
