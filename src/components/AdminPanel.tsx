import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { RegionId, OrderStatus, CatalogCategory, GameProduct } from '../types';
import {
  X,
  Shield,
  Package,
  Key,
  DollarSign,
  Layers,
  Settings,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  RefreshCw,
  Search,
  Upload,
  Image as ImageIcon,
  Film,
  Save,
  Check,
  Globe
} from 'lucide-react';
import { compressImage } from '../utils/imageStorage';
import { safeStorage } from '../utils/safeStorage';

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    closeAdmin,
    orders,
    updateOrderStatus,
    manualIssueCode,
    digitalCodes,
    addBatchCodes,
    deleteDigitalCode,
    giftCards,
    updateGiftCardPrice,
    updateGiftCardImage,
    subscriptions,
    updateSubscriptionPrice,
    games,
    addProduct,
    updateProduct,
    deleteProduct,
    updateGamePrice,
    toggleGameCategory,
    regions,
    customLogoUrl,
    customRegionImages,
    customRegionTopupImages,
    setCustomLogoUrl,
    setCustomRegionImage,
    setCustomRegionTopupImage,
    resetCustomImages
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'codes' | 'prices' | 'catalog' | 'settings' | 'branding'>('branding');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedRegionForCodes, setSelectedRegionForCodes] = useState<RegionId>('turkey');

  // Bulk codes state
  const [bulkCodesText, setBulkCodesText] = useState('');
  const [bulkRegion, setBulkRegion] = useState<RegionId>('turkey');
  const [bulkDenomination, setBulkDenomination] = useState<number>(1000);
  const [bulkProductType, setBulkProductType] = useState<'gift_card' | 'subscription'>('gift_card');
  const [bulkTitle, setBulkTitle] = useState('PS Store 1000 TRY');
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');

  // Product Create / Edit state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState('');

  const [productFormData, setProductFormData] = useState<{
    title: string;
    publisher: string;
    releaseYear: number;
    platforms: ('PS5' | 'PS4')[];
    category: CatalogCategory;
    genres: string;
    russianLocalization: 'full' | 'subtitles' | 'none';
    description: string;
    priceTurkey: number;
    pricePoland: number;
    priceIndia: number;
    priceUkraine: number;
    imageUrl: string;
    videoTrailerUrl: string;
    screenshots: string[];
  }>({
    title: '',
    publisher: '',
    releaseYear: 2024,
    platforms: ['PS5'],
    category: 'new',
    genres: 'Экшен, Приключения',
    russianLocalization: 'full',
    description: '',
    priceTurkey: 1499,
    pricePoland: 339,
    priceIndia: 4999,
    priceUkraine: 2299,
    imageUrl: '',
    videoTrailerUrl: '',
    screenshots: []
  });

  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');

  if (!isAdminOpen) return null;

  const filteredOrders = orders.filter(o =>
    orderStatusFilter === 'all' ? true : o.status === orderStatusFilter
  );

  const availableCodesCount = digitalCodes.filter(c => c.status === 'available').length;
  const issuedCodesCount = digitalCodes.filter(c => c.status === 'issued').length;

  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkCodesText.trim()) return;

    const lines = bulkCodesText.split('\n');
    const addedCount = addBatchCodes(
      lines,
      bulkRegion,
      bulkDenomination,
      bulkProductType,
      bulkTitle
    );

    setBulkSuccessMsg(`Успешно добавлено ${addedCount} кодов в пул!`);
    setBulkCodesText('');
    setTimeout(() => setBulkSuccessMsg(''), 4000);
  };

  // Product Handlers
  const handleStartAddNew = () => {
    setEditingProductId(null);
    setProductFormData({
      title: '',
      publisher: '',
      releaseYear: 2024,
      platforms: ['PS5'],
      category: 'new',
      genres: 'Экшен, Приключения',
      russianLocalization: 'full',
      description: '',
      priceTurkey: 1499,
      pricePoland: 339,
      priceIndia: 4999,
      priceUkraine: 2299,
      imageUrl: '',
      videoTrailerUrl: '',
      screenshots: []
    });
    setIsEditingProduct(true);
  };

  const handleStartEdit = (game: GameProduct) => {
    setEditingProductId(game.id);
    setProductFormData({
      title: game.title,
      publisher: game.publisher,
      releaseYear: game.releaseYear,
      platforms: [...game.platforms],
      category: game.category,
      genres: game.genres.join(', '),
      russianLocalization: game.russianLocalization,
      description: game.description,
      priceTurkey: game.regionalStorePrices.turkey || 0,
      pricePoland: game.regionalStorePrices.poland || 0,
      priceIndia: game.regionalStorePrices.india || 0,
      priceUkraine: game.regionalStorePrices.ukraine || 0,
      imageUrl: game.imageUrl || '',
      videoTrailerUrl: game.videoTrailerUrl || '',
      screenshots: game.screenshots ? [...game.screenshots] : []
    });
    setIsEditingProduct(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'screenshot') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (target === 'cover') {
        setProductFormData(prev => ({ ...prev, imageUrl: base64 }));
      } else {
        setProductFormData(prev => ({ ...prev, screenshots: [...prev.screenshots, base64] }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddScreenshotFromUrl = () => {
    if (!newScreenshotUrl.trim()) return;
    setProductFormData(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, newScreenshotUrl.trim()]
    }));
    setNewScreenshotUrl('');
  };

  const handleRemoveScreenshot = (index: number) => {
    setProductFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.title.trim()) return;

    const genresArray = productFormData.genres
      .split(',')
      .map(g => g.trim())
      .filter(Boolean);

    const regionalStorePrices: Record<RegionId, number> = {
      turkey: productFormData.priceTurkey || 1499,
      poland: productFormData.pricePoland || 339,
      india: productFormData.priceIndia || 4999,
      ukraine: productFormData.priceUkraine || 2299
    };

    if (editingProductId) {
      updateProduct(editingProductId, {
        title: productFormData.title,
        publisher: productFormData.publisher,
        releaseYear: productFormData.releaseYear,
        platforms: productFormData.platforms.length > 0 ? productFormData.platforms : ['PS5'],
        category: productFormData.category,
        genres: genresArray.length > 0 ? genresArray : ['Экшен'],
        russianLocalization: productFormData.russianLocalization,
        description: productFormData.description,
        regionalStorePrices,
        imageUrl: productFormData.imageUrl,
        videoTrailerUrl: productFormData.videoTrailerUrl,
        screenshots: productFormData.screenshots
      });
    } else {
      addProduct({
        title: productFormData.title,
        publisher: productFormData.publisher || 'PSN.BY',
        releaseYear: productFormData.releaseYear,
        platforms: productFormData.platforms.length > 0 ? productFormData.platforms : ['PS5'],
        category: productFormData.category,
        genres: genresArray.length > 0 ? genresArray : ['Экшен'],
        russianLocalization: productFormData.russianLocalization,
        description: productFormData.description,
        accentColor: '#0070d1',
        gradient: 'from-blue-950 via-slate-900 to-black',
        iconSymbol: 'cross',
        regionalStorePrices,
        rating: 5.0,
        imageUrl: productFormData.imageUrl,
        videoTrailerUrl: productFormData.videoTrailerUrl,
        screenshots: productFormData.screenshots
      });
    }

    setIsEditingProduct(false);
    setEditingProductId(null);
  };

  const filteredGames = games.filter(g => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return g.title.toLowerCase().includes(q) || g.publisher.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#121722] border border-[#1e2638] rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Bar */}
        <div className="p-5 bg-gradient-to-r from-[#161d2b] to-[#121722] border-b border-[#1e2638] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Панель администратора PSN.BY
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400">
                  Управление магазином
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Товары и медиа · Цены в регионах · Заказы · Склад кодов · Настройки
              </p>
            </div>
          </div>

          <button
            onClick={closeAdmin}
            className="w-8 h-8 rounded-lg bg-[#1a2130] hover:bg-[#232c3f] text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-[#1e2638] bg-[#0e121b] flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => { setActiveTab('catalog'); setIsEditingProduct(false); }}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-[#0070d1] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Товары и Медиа ({games.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('orders'); setIsEditingProduct(false); }}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#0070d1] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Заказы ({orders.length})</span>
            {orders.filter(o => o.status === 'verifying').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            onClick={() => { setActiveTab('codes'); setIsEditingProduct(false); }}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'codes'
                ? 'border-[#0070d1] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Склад кодов ({availableCodesCount} доступно)</span>
          </button>

          <button
            onClick={() => { setActiveTab('prices'); setIsEditingProduct(false); }}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'prices'
                ? 'border-[#0070d1] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Цены и Регионы (BYN)</span>
          </button>

          <button
            onClick={() => { setActiveTab('branding'); setIsEditingProduct(false); }}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'branding'
                ? 'border-[#0070d1] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Логотип и Плиточки</span>
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setIsEditingProduct(false); }}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#0070d1] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Реквизиты и ЕРИП</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB: CATALOG / PRODUCTS & MEDIA */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              {/* Top controls: Add button + Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2638]">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Управление товарами, обложками и медиа</span>
                    <span className="text-xs text-slate-400 font-normal">
                      ({games.length} позиций)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Добавляйте новые игры, загружайте изображения, ссылки на трейлеры и редактируйте цены.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleStartAddNew}
                    className="px-4 py-2 rounded-lg bg-[#0070d1] hover:bg-[#005fb3] text-white text-xs font-bold transition-all shadow-md shadow-[#0070d1]/20 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить новый товар</span>
                  </button>
                </div>
              </div>

              {/* PRODUCT EDIT / ADD FORM MODAL / PANEL */}
              {isEditingProduct && (
                <div className="p-6 rounded-2xl bg-[#0b0e14] border-2 border-[#0070d1] space-y-6 animate-fade-in shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1e2638]">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-[#0070d1]" />
                      <h4 className="text-sm font-bold text-white">
                        {editingProductId ? 'Редактирование товара' : 'Создание нового товара'}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Отмена
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Название игры: <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={productFormData.title}
                          onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })}
                          placeholder="Например: Alan Wake 2"
                          className="w-full bg-[#121722] border border-[#1e2638] focus:border-[#0070d1] text-white text-xs py-2 px-3 rounded-lg outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Издатель / Разработчик:
                        </label>
                        <input
                          type="text"
                          value={productFormData.publisher}
                          onChange={(e) => setProductFormData({ ...productFormData, publisher: e.target.value })}
                          placeholder="Например: Epic Games / Remedy"
                          className="w-full bg-[#121722] border border-[#1e2638] focus:border-[#0070d1] text-white text-xs py-2 px-3 rounded-lg outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Раздел каталога:
                        </label>
                        <select
                          value={productFormData.category}
                          onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value as CatalogCategory })}
                          className="w-full bg-[#121722] border border-[#1e2638] text-white text-xs p-2 rounded-lg"
                        >
                          <option value="bestsellers">Бестселлер</option>
                          <option value="new">Новинка</option>
                          <option value="preorder">Предзаказ</option>
                          <option value="deals">Скидка</option>
                          <option value="all">Обычный каталог</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Русская локализация:
                        </label>
                        <select
                          value={productFormData.russianLocalization}
                          onChange={(e) => setProductFormData({ ...productFormData, russianLocalization: e.target.value as 'full' | 'subtitles' | 'none' })}
                          className="w-full bg-[#121722] border border-[#1e2638] text-white text-xs p-2 rounded-lg"
                        >
                          <option value="full">Полный дубляж + текст</option>
                          <option value="subtitles">Русские субтитры</option>
                          <option value="none">Английский</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Год релиза:
                        </label>
                        <input
                          type="number"
                          value={productFormData.releaseYear}
                          onChange={(e) => setProductFormData({ ...productFormData, releaseYear: Number(e.target.value) })}
                          className="w-full bg-[#121722] border border-[#1e2638] text-white text-xs py-2 px-3 rounded-lg font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Платформы:
                        </label>
                        <div className="flex items-center gap-4 pt-2">
                          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={productFormData.platforms.includes('PS5')}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setProductFormData(prev => ({
                                  ...prev,
                                  platforms: checked
                                    ? [...prev.platforms.filter(p => p !== 'PS5'), 'PS5']
                                    : prev.platforms.filter(p => p !== 'PS5')
                                }));
                              }}
                              className="rounded"
                            />
                            <span>PS5</span>
                          </label>

                          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={productFormData.platforms.includes('PS4')}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setProductFormData(prev => ({
                                  ...prev,
                                  platforms: checked
                                    ? [...prev.platforms.filter(p => p !== 'PS4'), 'PS4']
                                    : prev.platforms.filter(p => p !== 'PS4')
                                }));
                              }}
                              className="rounded"
                            />
                            <span>PS4</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Genres & Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Жанры (через запятую):
                      </label>
                      <input
                        type="text"
                        value={productFormData.genres}
                        onChange={(e) => setProductFormData({ ...productFormData, genres: e.target.value })}
                        placeholder="Экшен, Хоррор, Приключения"
                        className="w-full bg-[#121722] border border-[#1e2638] text-white text-xs py-2 px-3 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Описание игры:
                      </label>
                      <textarea
                        rows={3}
                        value={productFormData.description}
                        onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                        placeholder="Краткое описание игры, сюжет, особенности..."
                        className="w-full bg-[#121722] border border-[#1e2638] text-white text-xs p-3 rounded-lg"
                      />
                    </div>

                    {/* REGIONAL PRICES IN LOCAL CURRENCIES */}
                    <div className="p-4 rounded-xl bg-[#121722] border border-[#1e2638] space-y-3">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>Цены в официальных регионах PS Store (местная валюта):</span>
                        <span className="text-slate-400 text-[11px]">
                          Система автоматически подберёт подарочные карты в BYN
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">
                            🇹🇷 Турция (TRY ₺):
                          </label>
                          <input
                            type="number"
                            value={productFormData.priceTurkey}
                            onChange={(e) => setProductFormData({ ...productFormData, priceTurkey: Number(e.target.value) })}
                            className="w-full bg-[#0b0e14] border border-[#1e2638] text-white font-mono text-xs p-2 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">
                            🇵🇱 Польша (PLN zł):
                          </label>
                          <input
                            type="number"
                            value={productFormData.pricePoland}
                            onChange={(e) => setProductFormData({ ...productFormData, pricePoland: Number(e.target.value) })}
                            className="w-full bg-[#0b0e14] border border-[#1e2638] text-white font-mono text-xs p-2 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">
                            🇮🇳 Индия (INR ₹):
                          </label>
                          <input
                            type="number"
                            value={productFormData.priceIndia}
                            onChange={(e) => setProductFormData({ ...productFormData, priceIndia: Number(e.target.value) })}
                            className="w-full bg-[#0b0e14] border border-[#1e2638] text-white font-mono text-xs p-2 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">
                            🇺🇦 Украина (UAH ₴):
                          </label>
                          <input
                            type="number"
                            value={productFormData.priceUkraine}
                            onChange={(e) => setProductFormData({ ...productFormData, priceUkraine: Number(e.target.value) })}
                            className="w-full bg-[#0b0e14] border border-[#1e2638] text-white font-mono text-xs p-2 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    {/* MEDIA & IMAGES SECTION */}
                    <div className="p-4 rounded-xl bg-[#121722] border border-[#1e2638] space-y-4">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#0070d1]" />
                        <span>Медиа, обложки и скриншоты:</span>
                      </div>

                      {/* Main Cover Image */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-semibold text-slate-300 block">
                            Обложка игры (URL или загрузка файла):
                          </label>
                          <input
                            type="text"
                            value={productFormData.imageUrl}
                            onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
                            placeholder="https://... или загрузите файл с компьютера"
                            className="w-full bg-[#0b0e14] border border-[#1e2638] text-white text-xs py-2 px-3 rounded-lg"
                          />

                          <div className="flex items-center gap-2 pt-1">
                            <label className="px-3 py-1.5 rounded-lg bg-[#1a2130] hover:bg-[#232c3f] text-slate-200 text-xs font-semibold border border-[#1e2638] cursor-pointer flex items-center gap-1.5 transition-colors">
                              <Upload className="w-3.5 h-3.5 text-[#0070d1]" />
                              <span>Выбрать файл с ПК</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileUpload(e, 'cover')}
                                className="hidden"
                              />
                            </label>
                            {productFormData.imageUrl && (
                              <button
                                type="button"
                                onClick={() => setProductFormData({ ...productFormData, imageUrl: '' })}
                                className="text-xs text-red-400 hover:underline"
                              >
                                Удалить обложку
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Image Preview Box */}
                        <div className="w-full h-32 rounded-xl bg-[#0b0e14] border border-[#1e2638] overflow-hidden flex items-center justify-center relative">
                          {productFormData.imageUrl ? (
                            <img
                              src={productFormData.imageUrl}
                              alt="Превью"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center text-slate-500 text-xs space-y-1">
                              <ImageIcon className="w-6 h-6 mx-auto" />
                              <span>Нет обложки</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Video Trailer URL */}
                      <div className="space-y-1.5 pt-2 border-t border-[#1e2638]">
                        <label className="text-xs font-semibold text-slate-300 block flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-red-400" />
                          <span>Ссылка на трейлер (YouTube и др.):</span>
                        </label>
                        <input
                          type="text"
                          value={productFormData.videoTrailerUrl}
                          onChange={(e) => setProductFormData({ ...productFormData, videoTrailerUrl: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full bg-[#0b0e14] border border-[#1e2638] text-white text-xs py-2 px-3 rounded-lg"
                        />
                      </div>

                      {/* Screenshots Gallery Upload */}
                      <div className="space-y-2 pt-2 border-t border-[#1e2638]">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Галерея скриншотов игры:
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newScreenshotUrl}
                            onChange={(e) => setNewScreenshotUrl(e.target.value)}
                            placeholder="URL скриншота"
                            className="flex-1 bg-[#0b0e14] border border-[#1e2638] text-white text-xs py-2 px-3 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleAddScreenshotFromUrl}
                            className="px-3 py-1.5 rounded-lg bg-[#1a2130] text-slate-200 text-xs font-medium hover:bg-[#232c3f]"
                          >
                            Добавить URL
                          </button>
                          <label className="px-3 py-1.5 rounded-lg bg-[#1a2130] text-slate-200 text-xs font-medium hover:bg-[#232c3f] cursor-pointer flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Файл</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileUpload(e, 'screenshot')}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Thumbnails */}
                        {productFormData.screenshots.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                            {productFormData.screenshots.map((sUrl, idx) => (
                              <div key={idx} className="relative h-16 rounded-lg overflow-hidden border border-[#1e2638] group">
                                <img src={sUrl} alt={`Screenshot ${idx}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveScreenshot(idx)}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Удалить"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit / Cancel Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#0070d1] hover:bg-[#005fb3] text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-[#0070d1]/30 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingProductId ? 'Сохранить изменения' : 'Создать товар'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsEditingProduct(false)}
                        className="px-4 py-2.5 rounded-xl bg-[#121722] hover:bg-[#1a2130] text-slate-400 hover:text-white text-xs border border-[#1e2638] transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* PRODUCTS LIST TABLE */}
              <div className="p-5 rounded-xl bg-[#0b0e14] border border-[#1e2638] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs font-bold text-white">
                    Каталог товаров магазина ({filteredGames.length}):
                  </div>

                  {/* Search */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Быстрый поиск по названию..."
                      className="w-full bg-[#121722] border border-[#1e2638] text-white text-xs pl-8 pr-3 py-1.5 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#1e2638] text-slate-400">
                        <th className="py-2.5 px-3">Обложка</th>
                        <th className="py-2.5 px-3">Название</th>
                        <th className="py-2.5 px-3">Раздел</th>
                        <th className="py-2.5 px-3">Локализация</th>
                        <th className="py-2.5 px-3">Цены (TRY / PLN)</th>
                        <th className="py-2.5 px-3 text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2638]">
                      {filteredGames.map((game) => (
                        <tr key={game.id} className="text-slate-300 hover:bg-[#121722]/60 transition-colors">
                          {/* Thumbnail */}
                          <td className="py-2 px-3">
                            <div className="w-10 h-12 rounded bg-[#1a2130] border border-[#1e2638] overflow-hidden flex items-center justify-center">
                              {game.imageUrl ? (
                                <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-slate-500" />
                              )}
                            </div>
                          </td>

                          {/* Title & Publisher */}
                          <td className="py-2 px-3">
                            <div className="font-bold text-white line-clamp-1">{game.title}</div>
                            <div className="text-[11px] text-slate-400">{game.publisher} · {game.platforms.join('/')}</div>
                          </td>

                          {/* Category Badge */}
                          <td className="py-2 px-3">
                            <select
                              value={game.category}
                              onChange={(e) => toggleGameCategory(game.id, e.target.value as CatalogCategory)}
                              className="bg-[#121722] border border-[#1e2638] text-white text-[11px] p-1 rounded"
                            >
                              <option value="bestsellers">Бестселлер</option>
                              <option value="new">Новинка</option>
                              <option value="preorder">Предзаказ</option>
                              <option value="deals">Скидка</option>
                              <option value="all">Все</option>
                            </select>
                          </td>

                          {/* Localization */}
                          <td className="py-2 px-3">
                            <span className="text-[11px] text-slate-300">
                              {game.russianLocalization === 'full' ? 'Рус. дубляж' : game.russianLocalization === 'subtitles' ? 'Субтитры' : 'Англ.'}
                            </span>
                          </td>

                          {/* Regional Prices */}
                          <td className="py-2 px-3 font-mono text-[11px]">
                            <span className="text-amber-400">{game.regionalStorePrices.turkey} ₺</span>
                            <span className="text-slate-500 mx-1">/</span>
                            <span className="text-sky-400">{game.regionalStorePrices.poland} zł</span>
                          </td>

                          {/* Actions */}
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEdit(game)}
                                className="p-1.5 rounded-lg bg-[#1a2130] hover:bg-[#232c3f] text-slate-200 transition-colors"
                                title="Редактировать товар и медиа"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#0070d1]" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Удалить товар «${game.title}» из каталога?`)) {
                                    deleteProduct(game.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-[#1a2130] hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                                title="Удалить товар"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-[#1e2638]">
                <div className="flex items-center gap-1.5 p-1 bg-[#0b0e14] border border-[#1e2638] rounded-lg">
                  <button
                    onClick={() => setOrderStatusFilter('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      orderStatusFilter === 'all'
                        ? 'bg-[#1a2130] text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Все ({orders.length})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter('verifying')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      orderStatusFilter === 'verifying'
                        ? 'bg-amber-500/20 text-amber-400 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Проверка оплаты ({orders.filter(o => o.status === 'verifying').length})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter('completed')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      orderStatusFilter === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Выполненные ({orders.filter(o => o.status === 'completed').length})
                  </button>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 text-xs bg-[#0b0e14] rounded-xl border border-[#1e2638]">
                    Нет заказов с выбранным статусом
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-xl bg-[#0b0e14] border border-[#1e2638] space-y-4"
                    >
                      <div className="flex items-start justify-between flex-wrap gap-3 pb-3 border-b border-[#1e2638]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-white">
                              {order.orderNumber}
                            </span>
                            <span className="text-xs text-slate-400">· {order.createdAt}</span>
                            <span className="text-xs font-semibold text-[#0070d1] uppercase">
                              [{order.regionId}]
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                            <span>Покупатель: <strong className="text-white">{order.customerName}</strong></span>
                            <span>Telegram: <strong className="text-[#229ed9] font-mono">{order.telegramUsername}</strong></span>
                            <span>Тел: <strong className="text-slate-200 font-mono">{order.phone}</strong></span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-base font-bold text-white">
                            {order.totalByn.toFixed(2)} BYN
                          </div>
                          <div className="text-[11px] text-slate-400 uppercase font-medium">
                            Метод: {order.paymentMethod}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="text-slate-400 font-medium">Товары в заказе:</div>
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-[#121722] text-slate-200"
                          >
                            <span>
                              {item.quantity} × {item.title}
                            </span>
                            <span className="font-mono font-bold">
                              {(item.priceByn * item.quantity).toFixed(2)} BYN
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.receiptNote && (
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                          <strong>Чек / Комментарий клиента:</strong> {order.receiptNote}
                        </div>
                      )}

                      {order.issuedCodes && order.issuedCodes.length > 0 && (
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1.5 text-xs">
                          <div className="font-semibold text-emerald-400">Выданные коды:</div>
                          {order.issuedCodes.map((codeItem, cIdx) => (
                            <div key={cIdx} className="font-mono font-bold text-white flex items-center justify-between">
                              <span>{codeItem.itemTitle}</span>
                              <span className="bg-black/50 px-2 py-0.5 rounded tracking-wider">
                                {codeItem.code}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-[#1e2638] flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Статус:</span>
                          <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase font-mono bg-[#1a2130] text-white">
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {order.status !== 'completed' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed', 'Оплата подтверждена')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Подтвердить оплату и выдать коды</span>
                            </button>
                          )}

                          {order.status !== 'cancelled' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelled', 'Отклонено администратором')}
                              className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Отклонить</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: DIGITAL CODES POOL */}
          {activeTab === 'codes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#1e2638]">
                  <div className="text-xs text-slate-400">Всего кодов в базе</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    {digitalCodes.length}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#1e2638]">
                  <div className="text-xs text-slate-400">Доступно для выдачи</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {availableCodesCount}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#0b0e14] border border-[#1e2638]">
                  <div className="text-xs text-slate-400">Выдано клиентам</div>
                  <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
                    {issuedCodesCount}
                  </div>
                </div>
              </div>

              {/* Bulk code upload box */}
              <div className="p-5 rounded-xl bg-[#0b0e14] border border-[#1e2638] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#0070d1]" />
                  <span>Массовая загрузка кодов в склад</span>
                </h3>

                <form onSubmit={handleBulkUpload} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Регион:
                      </label>
                      <select
                        value={bulkRegion}
                        onChange={(e) => setBulkRegion(e.target.value as RegionId)}
                        className="w-full bg-[#121722] border border-[#1e2638] text-white text-xs p-2 rounded-lg"
                      >
                        {regions.map(r => (
                          <option key={r.id} value={r.id}>{r.name} ({r.currencyCode})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Тип товара:
                      </label>
                      <select
                        value={bulkProductType}
                        onChange={(e) => setBulkProductType(e.target.value as 'gift_card' | 'subscription')}
                        className="w-full bg-[#121722] border border-[#1e2638] text-white text-xs p-2 rounded-lg"
                      >
                        <option value="gift_card">Подарочная карта (Wallet)</option>
                        <option value="subscription">Подписка PS Plus</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Номинал в валюте:
                      </label>
                      <input
                        type="number"
                        value={bulkDenomination}
                        onChange={(e) => setBulkDenomination(Number(e.target.value))}
                        className="w-full bg-[#121722] border border-[#1e2638] text-white text-xs p-2 rounded-lg font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        Название товара:
                      </label>
                      <input
                        type="text"
                        value={bulkTitle}
                        onChange={(e) => setBulkTitle(e.target.value)}
                        className="w-full bg-[#121722] border border-[#1e2638] text-white text-xs p-2 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Список 12-значных кодов (каждый код с новой строки):
                    </label>
                    <textarea
                      rows={4}
                      value={bulkCodesText}
                      onChange={(e) => setBulkCodesText(e.target.value)}
                      placeholder="4X7K-9M2L-8PQW&#10;9BL2-4V8P-7Q1M&#10;2TK8-5NR9-1WQ7"
                      className="w-full bg-[#121722] border border-[#1e2638] text-white font-mono text-xs p-3 rounded-lg outline-none"
                    />
                  </div>

                  {bulkSuccessMsg && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs">
                      {bulkSuccessMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#0070d1] hover:bg-[#005fb3] text-white text-xs font-bold transition-colors"
                  >
                    Загрузить коды в инвентарь
                  </button>
                </form>
              </div>

              {/* Codes list table */}
              <div className="p-5 rounded-xl bg-[#0b0e14] border border-[#1e2638] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    Список кодов в системе ({digitalCodes.length})
                  </h3>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedRegionForCodes}
                      onChange={(e) => setSelectedRegionForCodes(e.target.value as RegionId)}
                      className="bg-[#121722] border border-[#1e2638] text-white text-xs p-1.5 rounded-lg"
                    >
                      {regions.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#1e2638] text-slate-400">
                        <th className="py-2.5 px-3">Код</th>
                        <th className="py-2.5 px-3">Регион</th>
                        <th className="py-2.5 px-3">Номинал</th>
                        <th className="py-2.5 px-3">Статус</th>
                        <th className="py-2.5 px-3">Дата</th>
                        <th className="py-2.5 px-3 text-right">Действие</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2638]">
                      {digitalCodes
                        .filter(c => c.regionId === selectedRegionForCodes)
                        .map((code) => (
                          <tr key={code.id} className="text-slate-300">
                            <td className="py-2.5 px-3 font-mono font-bold text-white">
                              {code.code}
                            </td>
                            <td className="py-2.5 px-3 uppercase">{code.regionId}</td>
                            <td className="py-2.5 px-3 font-mono">{code.denomination}</td>
                            <td className="py-2.5 px-3">
                              {code.status === 'available' ? (
                                <span className="text-emerald-400 font-semibold">Свободен</span>
                              ) : (
                                <span className="text-slate-500 font-semibold">Выдан</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">{code.createdAt}</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => deleteDigitalCode(code.id)}
                                className="text-slate-500 hover:text-red-400 p-1"
                                title="Удалить"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRICES */}
          {activeTab === 'prices' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#0b0e14] border border-[#1e2638] space-y-4">
                <h3 className="text-sm font-bold text-white">
                  Управление ценами подарочных карт PS Store (в BYN)
                </h3>
                <p className="text-xs text-slate-400">
                  Измените розничные цены в белорусских рублях для любого номинала. Изменения сохраняются сразу.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {giftCards.map((card) => {
                    const reg = regions.find(r => r.id === card.regionId);
                    return (
                      <div
                        key={card.id}
                        className="p-3.5 rounded-lg bg-[#121722] border border-[#1e2638] flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">
                            {reg?.flag} {card.localAmount} {reg?.currencySymbol} ({reg?.name})
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {card.id}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="0.5"
                            value={card.priceByn}
                            onChange={(e) => updateGiftCardPrice(card.id, parseFloat(e.target.value) || 0)}
                            className="w-20 bg-[#0b0e14] border border-[#1e2638] focus:border-[#0070d1] text-white font-mono font-bold text-xs py-1.5 px-2 rounded outline-none text-right"
                          />
                          <span className="text-xs text-slate-400 font-mono">BYN</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="p-5 rounded-xl bg-[#0b0e14] border border-[#1e2638] space-y-4 text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white">
                Настройки магазина и реквизиты (Беларусь)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold block">ЕРИП Код услуги:</label>
                  <input
                    type="text"
                    defaultValue="49201"
                    className="w-full bg-[#121722] border border-[#1e2638] text-white py-2 px-3 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold block">УНП организации:</label>
                  <input
                    type="text"
                    defaultValue="193849102"
                    className="w-full bg-[#121722] border border-[#1e2638] text-white py-2 px-3 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold block">Telegram канал поддержки:</label>
                  <input
                    type="text"
                    defaultValue="@psn_by_support"
                    className="w-full bg-[#121722] border border-[#1e2638] text-white py-2 px-3 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold block">Telegram бот оповещений:</label>
                  <input
                    type="text"
                    defaultValue="@psn_by_bot"
                    className="w-full bg-[#121722] border border-[#1e2638] text-white py-2 px-3 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: BRANDING & CUSTOM IMAGES */}
          {activeTab === 'branding' && (
            <div className="space-y-6 text-xs text-slate-300">
              {/* Instructions Banner */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-[#0d1424] to-[#0b0e14] border border-[#1e2d4d] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-sky-400" />
                    <span>Управление логотипом и фоновыми изображениями плиточек</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        safeStorage.clearNonEssential();
                        resetCustomImages();
                      }}
                      className="px-3 py-1 bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 rounded-lg border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer text-[11px]"
                      title="Очистить кэш браузера и освободить память"
                    >
                      Очистить кэш
                    </button>
                    <button
                      onClick={resetCustomImages}
                      className="px-3 py-1 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 rounded-lg border border-white/10 hover:border-red-500/30 transition-all cursor-pointer text-[11px]"
                    >
                      Сбросить всё к стандарту
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Вы можете загрузить свои картинки прямо здесь через кнопку <strong>«Загрузить файл»</strong> (они мгновенно оптимизируются и сохраняются), либо положить файлы в папку проекта <strong><code className="text-sky-300 font-mono">public/images/</code></strong>.
                </p>

                <div className="p-3.5 rounded-xl bg-[#07090e] border border-[#1e2638] text-[11px] font-mono space-y-1.5 text-slate-400">
                  <div className="text-slate-200 font-bold mb-1 flex items-center justify-between">
                    <span>📁 Куда загружать файлы в проекте и в каком виде:</span>
                    <span className="text-[10px] text-emerald-400 font-sans font-normal bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">Хранилище защищено от переполнения</span>
                  </div>
                  <div>• <strong>Логотип в шапке:</strong> <span className="text-emerald-400">public/images/logo.png</span> (горизонтальный PNG с прозрачным фоном или SVG, выс. 40-70px)</div>
                  <div>• <strong>Картинка региона (плитка выбора):</strong> <span className="text-rose-400">public/images/regions/{'{регион}'}.png</span> (квадрат 1:1, например 600×600 px)</div>
                  <div>• <strong>Картинка пополнений региона (все плитки пополнения):</strong> <span className="text-sky-400">public/images/topup/{'{регион}'}.png</span> (квадрат 1:1, например 600×600 px)</div>
                  <div className="text-sky-300 font-sans pt-1">
                    🎯 <strong>2 квадратные картинки (1:1) на каждый регион:</strong> 1 картинка на сам регион и 1 отдельная картинка на пополнения! Все плиточки в магазине отображаются строго квадратными с равными сторонами.
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans pt-1">
                    💡 Форматы: <strong>PNG, JPG, WebP, SVG</strong>. Картинки автоматически сжимаются на холсте перед сохранением.
                  </div>
                </div>
              </div>

              {/* 1. Header Logo Setting */}
              <div className="p-5 rounded-xl bg-[#0b0e14] border border-[#1e2638] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">1. Логотип в верхнем баре</h4>
                    <p className="text-[11px] text-slate-400">
                      Рекомендуется: горизонтальный логотип с прозрачным фоном (PNG/SVG, высота ~40-60px)
                    </p>
                  </div>
                  {customLogoUrl && (
                    <button
                      onClick={() => setCustomLogoUrl('')}
                      className="text-xs text-red-400 hover:underline cursor-pointer"
                    >
                      Удалить свой логотип
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-48 h-16 rounded-lg bg-[#121722] border border-[#1e2638] flex items-center justify-center p-2 overflow-hidden shrink-0">
                    {customLogoUrl ? (
                      <img src={customLogoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-slate-500 text-[11px]">Стандартный логотип PSN.BY</span>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-2 rounded-lg bg-[#0070d1] hover:bg-[#005fb3] text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Загрузить файл с устройства</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const compressed = await compressImage(file, 800, 0.85);
                                setCustomLogoUrl(compressed);
                              } catch (err) {
                                console.error('Error compressing logo:', err);
                              }
                            }
                          }}
                        />
                      </label>
                      <span className="text-slate-500 text-xs">или укажите путь/URL:</span>
                    </div>

                    <input
                      type="text"
                      placeholder="/images/logo.png или https://..."
                      value={customLogoUrl}
                      onChange={(e) => setCustomLogoUrl(e.target.value)}
                      className="w-full bg-[#121722] border border-[#1e2638] text-white py-2 px-3 rounded-lg font-mono text-xs outline-none focus:border-[#0070d1]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Region Tile & Top-up Images (1 Image per Region + 1 Image per Region Top-ups) */}
              <div className="p-5 rounded-xl bg-[#0b0e14] border border-[#1e2638] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-sky-400" />
                      <span>2. Изображения регионов и пополнений</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Для каждого региона настраиваются <strong>две картинки</strong>: одна для плитки самого региона (выбор региона при входе), и другая для всех пополнений в этом регионе (плиточки быстрого пополнения и карты баланса).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {(
                    [
                      { id: 'turkey', name: 'Турция', flag: '🇹🇷', regionDefaultPath: '/images/regions/turkey.png', topupDefaultPath: '/images/topup/turkey.png' },
                      { id: 'india', name: 'Индия', flag: '🇮🇳', regionDefaultPath: '/images/regions/india.png', topupDefaultPath: '/images/topup/india.png' },
                      { id: 'poland', name: 'Польша', flag: '🇵🇱', regionDefaultPath: '/images/regions/poland.png', topupDefaultPath: '/images/topup/poland.png' },
                      { id: 'ukraine', name: 'Украина', flag: '🇺🇦', regionDefaultPath: '/images/regions/ukraine.png', topupDefaultPath: '/images/topup/ukraine.png' }
                    ] as const
                  ).map((reg) => {
                    const currentRegionImg = customRegionImages?.[reg.id];
                    const currentTopupImg = customRegionTopupImages?.[reg.id];

                    return (
                      <div
                        key={reg.id}
                        className="p-4 rounded-xl bg-[#121722] border border-[#1e2638] space-y-4"
                      >
                        {/* Region Header */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2 font-bold text-white text-sm">
                            <span className="text-xl">{reg.flag}</span>
                            <span>{reg.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono bg-[#0b0e14] px-2 py-0.5 rounded border border-[#1e2638]">
                            Код: {reg.id}
                          </span>
                        </div>

                        {/* 2 Sub-Sections: 1 for Region Tile, 1 for Top-ups in this Region */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* 1. REGION TILE IMAGE */}
                          <div className="p-3 rounded-lg bg-[#0a0d14] border border-[#1a2336] space-y-2.5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-bold text-slate-200 text-[11px] flex items-center gap-1">
                                  <span>1. Картинка региона</span>
                                </span>
                                {currentRegionImg && (
                                  <button
                                    onClick={() => setCustomRegionImage(reg.id, '')}
                                    className="text-[10px] text-red-400 hover:underline cursor-pointer"
                                  >
                                    Сброс
                                  </button>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 mb-2">
                                Плитка выбора региона на старте
                              </p>

                              {/* Preview Box (Square 1:1) */}
                              <div className="w-full aspect-square max-w-[150px] mx-auto rounded-xl bg-[#121722] border border-white/10 overflow-hidden relative flex items-center justify-center">
                                {currentRegionImg ? (
                                  <img src={currentRegionImg} alt={`Регион ${reg.name}`} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-slate-500 text-[10px] text-center px-2">
                                    Стандартная плитка
                                  </span>
                                )}
                                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-white">
                                  Плитка выбора (1:1)
                                </div>
                              </div>
                            </div>

                            {/* Controls */}
                            <div className="space-y-1.5 pt-1">
                              <label className="w-full py-1.5 px-2 rounded-lg bg-[#1a2336] hover:bg-[#222f48] text-white font-medium text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-white/10">
                                <Upload className="w-3 h-3 text-rose-400" />
                                <span>Загрузить для региона</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const compressed = await compressImage(file, 1200, 0.82);
                                        setCustomRegionImage(reg.id, compressed);
                                      } catch (err) {
                                        console.error('Error compressing region image:', err);
                                      }
                                    }
                                  }}
                                />
                              </label>

                              <input
                                type="text"
                                placeholder={reg.regionDefaultPath}
                                value={currentRegionImg || ''}
                                onChange={(e) => setCustomRegionImage(reg.id, e.target.value)}
                                className="w-full bg-[#07090e] border border-[#1e2638] text-white py-1 px-2 rounded font-mono text-[10px] outline-none focus:border-[#0070d1]"
                              />
                            </div>
                          </div>

                          {/* 2. REGION TOP-UP TILES IMAGE */}
                          <div className="p-3 rounded-lg bg-[#0a0d14] border border-[#1a2336] space-y-2.5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-bold text-slate-200 text-[11px] flex items-center gap-1">
                                  <span>2. Картинка пополнений</span>
                                </span>
                                {currentTopupImg && (
                                  <button
                                    onClick={() => setCustomRegionTopupImage(reg.id, '')}
                                    className="text-[10px] text-red-400 hover:underline cursor-pointer"
                                  >
                                    Сброс
                                  </button>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 mb-2">
                                Все плиточки пополнения {reg.name}
                              </p>

                              {/* Preview Box (Square 1:1) */}
                              <div className="w-full aspect-square max-w-[150px] mx-auto rounded-xl bg-[#121722] border border-white/10 overflow-hidden relative flex items-center justify-center">
                                {currentTopupImg ? (
                                  <img src={currentTopupImg} alt={`Пополнения ${reg.name}`} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-slate-500 text-[10px] text-center px-2">
                                    Стандартный арт
                                  </span>
                                )}
                                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-emerald-400">
                                  Все плитки пополнений (1:1)
                                </div>
                              </div>
                            </div>

                            {/* Controls */}
                            <div className="space-y-1.5 pt-1">
                              <label className="w-full py-1.5 px-2 rounded-lg bg-[#1a2336] hover:bg-[#222f48] text-white font-medium text-[11px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-white/10">
                                <Upload className="w-3 h-3 text-sky-400" />
                                <span>Загрузить для пополнений</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const compressed = await compressImage(file, 1200, 0.82);
                                        setCustomRegionTopupImage(reg.id, compressed);
                                      } catch (err) {
                                        console.error('Error compressing region topup image:', err);
                                      }
                                    }
                                  }}
                                />
                              </label>

                              <input
                                type="text"
                                placeholder={reg.topupDefaultPath}
                                value={currentTopupImg || ''}
                                onChange={(e) => setCustomRegionTopupImage(reg.id, e.target.value)}
                                className="w-full bg-[#07090e] border border-[#1e2638] text-white py-1 px-2 rounded font-mono text-[10px] outline-none focus:border-[#0070d1]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
