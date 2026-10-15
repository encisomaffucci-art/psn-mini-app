import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  User,
  Copy,
  Check,
  ShieldCheck,
  Key,
  Clock,
  ExternalLink,
  Send,
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { DualSenseIcon, PsCross, PsCircle, PsTriangle, PsSquare } from './PlayStationIcons';
import { Order } from '../types';

export const UserAccountModal: React.FC = () => {
  const {
    isAccountOpen,
    closeAccount,
    currentUser,
    loginWithTelegram,
    logout,
    orders,
    currentRegion,
    setActiveTab
  } = useStore();

  const [inputUsername, setInputUsername] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedOrderNum, setCopiedOrderNum] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'verifying' | 'pending_payment'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAccountOpen) return null;

  // Determine which orders to show:
  // 1. If user is logged in: show their orders (or all if query matches)
  // 2. If guest: show all orders matching their search query, or all recent orders on this device
  const effectiveOrders = orders.filter((o) => {
    // If search query is entered, match orderNumber, phone, telegram, or item titles
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNumber = o.orderNumber.toLowerCase().includes(q);
      const matchTg = o.telegramUsername.toLowerCase().includes(q);
      const matchPhone = o.phone.toLowerCase().includes(q);
      const matchItems = o.items.some(item => item.title.toLowerCase().includes(q));
      if (!matchNumber && !matchTg && !matchPhone && !matchItems) return false;
    } else if (currentUser.isAuthenticated && currentUser.telegramUsername) {
      // Filter by authenticated username
      if (o.telegramUsername.toLowerCase() !== currentUser.telegramUsername.toLowerCase()) {
        return false;
      }
    }

    // Filter by status
    if (statusFilter !== 'all' && o.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCopyOrderNum = (orderNum: string) => {
    navigator.clipboard.writeText(orderNum);
    setCopiedOrderNum(orderNum);
    setTimeout(() => setCopiedOrderNum(null), 2000);
  };

  return (
    <div
      onClick={closeAccount}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#0f141f] border border-[#1e2638] rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col transition-all max-h-[92vh]"
      >
        {/* Floating Close Button */}
        <button
          onClick={closeAccount}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer active:scale-90"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-[#141b29] to-[#0f141f] border-b border-[#1e2638]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0070d1]/20 text-[#0070d1] flex items-center justify-center border border-[#0070d1]/30 shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  История заказов и мои коды
                </h2>
                <div className="hidden sm:flex items-center gap-1 opacity-70">
                  <PsTriangle className="w-2 h-2 text-emerald-400" />
                  <PsCircle className="w-2 h-2 text-rose-400" />
                  <PsCross className="w-2 h-2 text-sky-400" />
                  <PsSquare className="w-2 h-2 text-pink-400" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Просмотр статуса оплаты, купленных ваучеров и активация цифровых кодов PS Store
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* User Account / Telegram Connection Strip */}
          <div className="p-3.5 rounded-xl bg-[#080b11] border border-[#1e2638] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#229ed9]/20 text-[#229ed9] flex items-center justify-center shrink-0">
                <Send className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-slate-400">Привязка к Telegram: </span>
                <span className="font-mono text-white font-bold">
                  {currentUser.isAuthenticated ? currentUser.telegramUsername : 'Гостевой режим'}
                </span>
              </div>
            </div>

            {!currentUser.isAuthenticated ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="@telegram_username"
                  className="bg-[#121722] border border-[#1e2638] focus:border-[#0070d1] text-white text-xs py-1.5 px-2.5 rounded-lg outline-none font-mono w-44"
                />
                <button
                  onClick={() => {
                    if (inputUsername) loginWithTelegram(inputUsername);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0070d1] text-white text-xs font-semibold hover:bg-[#005fb3] transition-colors cursor-pointer"
                >
                  Войти
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                Выйти / Сменить
              </button>
            )}
          </div>

          {/* Search & Filter Toolbar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по номеру заказа (#PSN-...) или названию..."
                  className="w-full bg-[#080b11] border border-[#1e2638] focus:border-[#0070d1] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'all'
                      ? 'bg-[#0070d1] text-white shadow-sm'
                      : 'bg-[#121722] text-slate-400 hover:text-white border border-[#1e2638]'
                  }`}
                >
                  Все ({orders.length})
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'completed'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-[#121722] text-slate-400 hover:text-white border border-[#1e2638]'
                  }`}
                >
                  Выполненные
                </button>
                <button
                  onClick={() => setStatusFilter('verifying')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === 'verifying'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-[#121722] text-slate-400 hover:text-white border border-[#1e2638]'
                  }`}
                >
                  На проверке
                </button>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3.5">
            {effectiveOrders.length === 0 ? (
              <div className="p-8 sm:p-10 rounded-2xl bg-[#080b11] border border-[#1e2638] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#121722] border border-[#1e2638] flex items-center justify-center mx-auto text-slate-500">
                  <Key className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white">
                  {searchQuery ? 'Заказы по вашему запросу не найдены' : 'У вас пока нет оформленных заказов'}
                </div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  После оформления покупки в корзине здесь сразу появится статус заказа и ваши 12-значные коды активации для PSN.BY.
                </p>
                <button
                  onClick={() => {
                    closeAccount();
                    setActiveTab('catalog');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0070d1] hover:bg-[#005fb3] text-white text-xs font-bold transition-all shadow-md mt-2 cursor-pointer"
                >
                  <span>Перейти в каталог игр</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              effectiveOrders.map((order) => {
                const isCompleted = order.status === 'completed';
                const hasIssuedCodes = order.issuedCodes && order.issuedCodes.length > 0;

                return (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#080b11] border border-[#1e2638] hover:border-[#2a364f] transition-all space-y-3.5 shadow-sm"
                  >
                    {/* Order Top Bar: Number, Date, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#1e2638]/70">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleCopyOrderNum(order.orderNumber)}
                          className="font-mono font-bold text-white bg-[#141b29] hover:bg-[#1a2335] border border-[#1e2638] px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                          title="Скопировать номер заказа"
                        >
                          <span>{order.orderNumber}</span>
                          {copiedOrderNum === order.orderNumber ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{order.createdAt}</span>
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        {order.status === 'completed' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Выполнен (коды выданы)</span>
                          </span>
                        )}
                        {order.status === 'verifying' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-xs">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>Проверка оплаты</span>
                          </span>
                        )}
                        {order.status === 'pending_payment' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1 shadow-xs">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Ожидает оплаты</span>
                          </span>
                        )}
                        {order.status === 'cancelled' && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 shadow-xs">
                            <X className="w-3.5 h-3.5" />
                            <span>Отменён</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Purchased Items List */}
                    <div className="space-y-1.5 text-xs">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-slate-300 py-1 px-2 rounded-lg bg-[#0e131d]"
                        >
                          <span className="font-medium">
                            <span className="text-white font-bold">{item.quantity}×</span> {item.title}
                          </span>
                          <span className="font-mono font-bold text-white ml-2 shrink-0">
                            {(item.priceByn * item.quantity).toFixed(2)} BYN
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* STATUS OF DIGITAL CODES */}
                    {hasIssuedCodes ? (
                      /* CODES ARE ISSUED */
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/30 via-[#0a1218] to-[#080b11] border border-emerald-500/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <Key className="w-4 h-4" />
                            <span>Ваши цифровые коды активации PS Store:</span>
                          </div>
                          <a
                            href="https://store.playstation.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                          >
                            <span>Активировать на сайте</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="space-y-2">
                          {order.issuedCodes.map((codeItem, cIdx) => (
                            <div
                              key={cIdx}
                              className="p-3 rounded-lg bg-[#06080e] border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm"
                            >
                              <div className="space-y-0.5">
                                <div className="text-[11px] text-slate-400 font-medium">
                                  {codeItem.itemTitle}
                                </div>
                                <div className="font-mono text-base sm:text-lg font-black text-white tracking-widest select-all text-emerald-300">
                                  {codeItem.code}
                                </div>
                              </div>

                              <button
                                onClick={() => handleCopyCode(codeItem.code, `${order.id}-${cIdx}`)}
                                className="px-3.5 py-2 rounded-lg bg-[#141b29] hover:bg-[#1f293d] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10 shrink-0"
                              >
                                {copiedCodeId === `${order.id}-${cIdx}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                                    <span className="text-emerald-400">Скопировано!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Копировать код</span>
                                  </>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : order.status === 'verifying' ? (
                      /* CODE IS PENDING VERIFICATION */
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300">
                        <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-spin" />
                        <div>
                          <strong>Оплата на проверке оператором.</strong> 12-значный код появится прямо здесь сразу после подтверждения платежа (обычно занимает 1–5 минут).
                        </div>
                      </div>
                    ) : order.status === 'pending_payment' ? (
                      /* PENDING PAYMENT */
                      <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30 flex items-center gap-2.5 text-xs text-sky-300">
                        <AlertCircle className="w-4 h-4 shrink-0 text-sky-400" />
                        <div>
                          <strong>Заказ ожидает оплаты.</strong> Произведите оплату по реквизитам, чтобы получить цифровой код.
                        </div>
                      </div>
                    ) : null}

                    {/* Order Footer: Method and Total */}
                    <div className="pt-2.5 border-t border-[#1e2638]/70 flex items-center justify-between text-xs">
                      <div className="text-slate-400">
                        Способ оплаты: <strong className="text-slate-200">{order.paymentMethod.toUpperCase()}</strong>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-400">Итого:</span>
                        <span className="font-mono text-base font-black text-white">
                          {order.totalByn.toFixed(2)} BYN
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Activation Guide Accordion/Box */}
          <div className="p-4 rounded-xl bg-[#080b11] border border-[#1e2638] space-y-2.5 text-xs">
            <div className="font-bold text-white flex items-center gap-2">
              <DualSenseIcon className="w-4 h-4 text-[#0070d1]" />
              <span>Как активировать полученный код на консоли PlayStation:</span>
            </div>
            <div className="text-slate-300 space-y-1 pl-6 leading-relaxed">
              <p>1. Включите консоль PS5 / PS4 и войдите в аккаунт нужного региона (Турция, Индия, Польша, Украина).</p>
              <p>2. Перейдите в <strong>PlayStation Store → Меню (...) → Погашение кодов (Redeem Code)</strong>.</p>
              <p>3. Введите 12-значный код и нажмите <strong>Подтвердить</strong> — баланс кошелька пополнится мгновенно!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
