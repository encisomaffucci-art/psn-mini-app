import React from 'react';
import { RegionId } from '../types';

interface VoucherArtworkProps {
  regionId: RegionId;
  denomination: number;
  currencySymbol: string;
  customImage?: string;
  className?: string;
}

export const VoucherArtwork: React.FC<VoucherArtworkProps> = ({
  regionId,
  denomination,
  currencySymbol,
  customImage,
  className = ''
}) => {
  // If custom topup image was uploaded in admin panel, render it with sleek denomination pill
  if (customImage) {
    return (
      <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-[#0c101a] select-none ${className}`}>
        <img
          src={customImage}
          alt={`Карта ${denomination} ${currencySymbol}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
        
        {/* Top Header */}
        <div className="absolute top-2.5 left-0 right-0 text-center">
          <span className="text-[10px] tracking-wider font-extrabold uppercase text-white/90 drop-shadow-md">
            КАРТА ПОПОЛНЕНИЯ
          </span>
        </div>

        {/* Center Pill */}
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div className="bg-white/95 text-slate-900 px-3.5 py-1.5 rounded-xl shadow-2xl border border-white flex items-center justify-center">
            <span className="text-sm sm:text-base font-black font-mono tracking-tight text-[#ff1a2a]">
              {denomination} {currencySymbol}
            </span>
          </div>
        </div>

        {/* Bottom Logo */}
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span className="text-[9px] font-bold tracking-widest text-white/80 font-mono">
            PSN {regionId.toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  // Region specific styling
  const config = {
    turkey: {
      bg: 'from-[#6e0b14] via-[#40060c] to-[#120204]',
      glow: '#ff1a2a',
      pillText: '#d90429',
      sub: 'PSN TURKEY',
      ornament: '#e63946'
    },
    poland: {
      bg: 'from-[#702a05] via-[#421703] to-[#140601]',
      glow: '#ff7700',
      pillText: '#e85d04',
      sub: 'PSN POLAND',
      ornament: '#f48c06'
    },
    india: {
      bg: 'from-[#0a4d22] via-[#052b13] to-[#011207]',
      glow: '#00e640',
      pillText: '#008728',
      sub: 'PSN INDIA',
      ornament: '#2ec4b6'
    },
    ukraine: {
      bg: 'from-[#083a6b] via-[#052240] to-[#010d1a]',
      glow: '#0070d1',
      pillText: '#005fb3',
      sub: 'PSN UKRAINE',
      ornament: '#48cae4'
    }
  }[regionId] || {
    bg: 'from-[#6e0b14] via-[#40060c] to-[#120204]',
    glow: '#ff1a2a',
    pillText: '#d90429',
    sub: 'PSN STORE',
    ornament: '#e63946'
  };

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b ${config.bg} border border-white/10 shadow-lg select-none flex flex-col justify-between p-3 transition-transform group-hover:scale-[1.02] duration-300 ${className}`}
    >
      {/* Background ambient radial glow */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.glow} 0%, transparent 70%)`
        }}
      />

      {/* Top Header: "КАРТА ПОПОЛНЕНИЯ" */}
      <div className="relative z-10 text-center pt-0.5">
        <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow-sm font-sans block leading-tight">
          КАРТА
        </span>
        <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white drop-shadow-sm font-sans block leading-tight">
          ПОПОЛНЕНИЯ
        </span>
      </div>

      {/* Center: Turkish/Ornamental Motif & White Pill */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
        {/* Ornamental Decorative SVG Flower behind the pill */}
        <div className="relative flex items-center justify-center">
          <svg
            className="w-20 h-16 opacity-75 drop-shadow-md"
            viewBox="0 0 100 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Petal */}
            <path
              d="M50 0 C40 15, 40 25, 50 35 C60 25, 60 15, 50 0 Z"
              fill={config.ornament}
              opacity="0.9"
            />
            {/* Left Petals */}
            <path
              d="M10 25 C25 20, 35 25, 45 40 C30 40, 20 35, 10 25 Z"
              fill="#06d6a0"
              opacity="0.85"
            />
            <path
              d="M15 55 C25 60, 35 55, 45 40 C30 40, 20 45, 15 55 Z"
              fill="#118ab2"
              opacity="0.85"
            />
            {/* Right Petals */}
            <path
              d="M90 25 C75 20, 65 25, 55 40 C70 40, 80 35, 90 25 Z"
              fill="#06d6a0"
              opacity="0.85"
            />
            <path
              d="M85 55 C75 60, 65 55, 55 40 C70 40, 80 45, 85 55 Z"
              fill="#118ab2"
              opacity="0.85"
            />
            {/* Bottom Petal */}
            <path
              d="M50 80 C40 65, 40 55, 50 45 C60 55, 60 65, 50 80 Z"
              fill={config.ornament}
              opacity="0.9"
            />
          </svg>

          {/* White Center Badge with Denomination (Exact like screenshot) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-2xl border border-white/80 flex items-center justify-center min-w-[76px] sm:min-w-[88px]">
              <span
                className="text-sm sm:text-base font-black font-mono tracking-tight"
                style={{ color: config.pillText }}
              >
                {denomination} {currencySymbol}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer: PlayStation Logo & Subtitle */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 pb-0.5 text-white/90">
        {/* Minimal PlayStation Icon */}
        <svg className="w-3.5 h-3.5 fill-current opacity-90" viewBox="0 0 24 24">
          <path d="M8.5 2C7.7 2 7 2.7 7 3.5V17L11 15.5V5.5C11 4.7 10.3 4 9.5 4H8.5V2ZM13 7.5V14.5L16 13.5V8.5C16 7.7 15.3 7 14.5 7H13V7.5ZM5.5 18L18.5 13C19.3 12.7 20 13.3 20 14.1C20 14.6 19.6 15 19.1 15.2L6.1 20.2C5.3 20.5 4.6 19.9 4.6 19.1C4.6 18.6 5 18.2 5.5 18Z" />
        </svg>
        <span className="text-[9px] font-bold tracking-widest uppercase font-mono drop-shadow-xs">
          {config.sub}
        </span>
      </div>
    </div>
  );
};
