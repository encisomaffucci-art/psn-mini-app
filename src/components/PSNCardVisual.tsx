import React from 'react';
import { RegionId } from '../types';

export interface PSNCardVisualProps {
  regionId: RegionId;
  denomination?: number;
  currencySymbol?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  showDenomination?: boolean;
  isBackground?: boolean;
  overlayOpacity?: number;
}

export interface ThemeConfig {
  accentColor: string;
  accentLight: string;
  accentDark: string;
  glowColor: string;
  glowColorSoft: string;
  gradientId: string;
}

export const REGION_THEMES: Record<RegionId, ThemeConfig> = {
  turkey: {
    accentColor: '#ff1a2a',
    accentLight: '#ff4d5a',
    accentDark: '#b3000d',
    glowColor: 'rgba(255, 26, 42, 0.7)',
    glowColorSoft: 'rgba(255, 26, 42, 0.22)',
    gradientId: 'turkey-red-grad'
  },
  india: {
    accentColor: '#00e640',
    accentLight: '#39ff68',
    accentDark: '#00992a',
    glowColor: 'rgba(0, 230, 64, 0.7)',
    glowColorSoft: 'rgba(0, 230, 64, 0.22)',
    gradientId: 'india-green-grad'
  },
  poland: {
    accentColor: '#ff7700',
    accentLight: '#ff9933',
    accentDark: '#b35400',
    glowColor: 'rgba(255, 119, 0, 0.7)',
    glowColorSoft: 'rgba(255, 119, 0, 0.22)',
    gradientId: 'poland-orange-grad'
  },
  ukraine: {
    accentColor: '#0070d1',
    accentLight: '#2997ff',
    accentDark: '#004c8f',
    glowColor: 'rgba(0, 112, 209, 0.7)',
    glowColorSoft: 'rgba(0, 112, 209, 0.22)',
    gradientId: 'ukraine-blue-grad'
  }
};

export const getRegionTheme = (regionId: RegionId): ThemeConfig => {
  return REGION_THEMES[regionId] || REGION_THEMES.turkey;
};

export const PSNCardVisual: React.FC<PSNCardVisualProps> = ({
  regionId,
  denomination,
  currencySymbol,
  size = 'md',
  className = '',
  showDenomination = true,
  isBackground = false,
  overlayOpacity = 0.38
}) => {
  const theme = REGION_THEMES[regionId] || REGION_THEMES.turkey;
  const uid = React.useId().replace(/:/g, '');

  if (isBackground) {
    // FULL TILE EDGE-TO-EDGE BACKGROUND
    return (
      <div className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden ${className}`}>
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ambient Background Gradient */}
            <linearGradient id={`bg-mesh-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#141822" />
              <stop offset="45%" stopColor="#0c0e14" />
              <stop offset="100%" stopColor="#050608" />
            </linearGradient>

            {/* Glowing Diagonal Slash Gradient */}
            <linearGradient id={`slash-grad-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.accentDark} stopOpacity="0.95" />
              <stop offset="40%" stopColor={theme.accentColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor={theme.accentLight} stopOpacity="0.85" />
            </linearGradient>

            {/* Glowing Filters */}
            <filter id={`neon-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id={`soft-glow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="24" result="blur" />
            </filter>
          </defs>

          {/* Base Matte Charcoal Background */}
          <rect width="800" height="500" fill={`url(#bg-mesh-${uid})`} />

          {/* Regional Ambient Color Blast */}
          <circle
            cx="650"
            cy="150"
            r="320"
            fill={theme.accentColor}
            fillOpacity="0.45"
            filter={`url(#soft-glow-${uid})`}
          />
          <circle
            cx="150"
            cy="400"
            r="260"
            fill={theme.accentDark}
            fillOpacity="0.35"
            filter={`url(#soft-glow-${uid})`}
          />

          {/* Outer Card Neon Rim Border */}
          <rect
            x="4"
            y="4"
            width="792"
            height="492"
            rx="24"
            fill="none"
            stroke={theme.accentColor}
            strokeWidth="3.5"
            strokeOpacity="0.75"
          />

          {/* Giant Dynamic Geometric Slash Across Tile */}
          <path
            d="M 380 500 L 760 0 L 800 0 L 800 500 Z"
            fill={`url(#slash-grad-${uid})`}
          />

          {/* Glowing Slash Highlight Edge */}
          <line
            x1="380"
            y1="500"
            x2="760"
            y2="0"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeOpacity="0.75"
          />

          {/* Background Technical Watermark Typography */}
          <text
            x="36"
            y="300"
            fill="#ffffff"
            fillOpacity="0.12"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
            fontSize="46"
            fontWeight="900"
            letterSpacing="2"
          >
            PLAYSTATION
          </text>
          <text
            x="36"
            y="345"
            fill={theme.accentLight}
            fillOpacity="0.22"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
            fontSize="26"
            fontWeight="800"
            letterSpacing="3"
          >
            BALANCE TOP-UP
          </text>

          {/* DualSense Controller Silhouette Wireframe */}
          <g opacity="0.45" stroke={theme.accentLight} strokeWidth="3" fill="none">
            <path d="M 580 320 C 620 280, 710 300, 750 360 C 780 410, 760 480, 700 500 Z" />
            <circle cx="660" cy="400" r="32" strokeWidth="3" />
          </g>

          {/* Floating Neon 3D PlayStation Action Symbols */}
          {/* Top-Right Square (3D Box) */}
          <g transform="translate(680, 50) rotate(18)" filter={`url(#neon-${uid})`}>
            <rect
              x="0"
              y="0"
              width="60"
              height="60"
              rx="10"
              stroke="#ffffff"
              strokeWidth="9"
              fill="none"
            />
          </g>

          {/* Floating Neon Cross (X) */}
          <g transform="translate(510, 160) rotate(22)" filter={`url(#neon-${uid})`}>
            <path
              d="M 0 0 L 52 52 M 52 0 L 0 52"
              stroke="#ffffff"
              strokeWidth="11"
              strokeLinecap="round"
            />
          </g>

          {/* Floating Neon Circle (O) */}
          <g transform="translate(420, 270)" filter={`url(#neon-${uid})`}>
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#ffffff"
              strokeWidth="10"
              fill="none"
            />
          </g>

          {/* Floating Neon Triangle */}
          <g transform="translate(540, 360) rotate(14)" filter={`url(#neon-${uid})`}>
            <polygon
              points="30,0 60,52 0,52"
              stroke="#ffffff"
              strokeWidth="10"
              fill="none"
              strokeLinejoin="round"
            />
          </g>

          {/* Left Floating Neon Cross */}
          <g transform="translate(70, 70) rotate(-15)" opacity="0.4" filter={`url(#neon-${uid})`}>
            <path
              d="M 0 0 L 36 36 M 36 0 L 0 36"
              stroke={theme.accentColor}
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>

          {/* Top Retail Hanger Punch-Hole Cutout (Centred at Top) */}
          <g transform="translate(350, 14)" opacity="0.85">
            <path
              d="M 18 0 L 82 0 C 90 0, 98 6, 98 15 C 98 24, 90 30, 82 30 L 64 30 C 60 30, 57 32, 55 35 C 53 37, 47 37, 45 35 C 43 32, 40 30, 36 30 L 18 30 C 10 30, 2 24, 2 15 C 2 6, 10 0, 18 0 Z"
              fill="#06080d"
              stroke={theme.accentColor}
              strokeWidth="1.5"
            />
          </g>

          {/* PSN.BY Brand Logo & Controller Emblem */}
          <g transform="translate(34, 28)">
            {/* Controller Icon */}
            <path
              d="M 28 8 C 38 2, 54 2, 64 8 C 70 13, 67 24, 60 29 C 55 26, 50 24, 46 24 C 42 24, 37 26, 32 29 C 25 24, 22 13, 28 8 Z"
              fill="#ffffff"
            />
            {/* Orbital Swirl Ring */}
            <ellipse
              cx="46"
              cy="16"
              rx="38"
              ry="14"
              stroke={theme.accentColor}
              strokeWidth="3.5"
              fill="none"
              transform="rotate(-12 46 16)"
            />
            {/* Brand Wordmark */}
            <text
              x="92"
              y="23"
              fill="#ffffff"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
              fontSize="20"
              fontWeight="900"
              fontStyle="italic"
              letterSpacing="0.5"
            >
              PSN<tspan fill={theme.accentColor}>.BY</tspan>
            </text>
          </g>

          {/* Official White 3D PlayStation Logo */}
          <g transform="translate(605, 235) scale(0.95)">
            {/* Standing 'P' */}
            <path
              d="M 52 145 L 52 15 C 52 8, 58 2, 65 2 C 73 2, 79 8, 79 15 L 79 82 C 92 82, 105 76, 110 65 C 114 55, 111 40, 102 32 C 98 28, 98 22, 102 18 C 107 14, 113 15, 118 20 C 131 33, 134 56, 126 73 C 117 92, 98 101, 79 101 L 79 145 Z"
              fill="#ffffff"
            />
            {/* Lying flat 'S' in 3D perspective */}
            <path
              d="M 12 135 C 24 122, 54 116, 82 116 C 112 116, 142 122, 154 135 C 160 142, 154 148, 140 151 C 122 155, 96 155, 82 153 C 65 151, 35 146, 16 142 C 10 140, 8 137, 12 135 Z"
              fill="#f1f5f9"
            />
            <path
              d="M 32 142 C 48 133, 72 128, 94 128 C 118 128, 136 133, 146 140 C 136 145, 112 148, 92 148 C 68 148, 48 145, 32 142 Z"
              fill="#cbd5e1"
            />
            <text
              x="146"
              y="155"
              fill="#ffffff"
              fontSize="12"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              ®
            </text>
          </g>
        </svg>

        {/* Semi-transparent Dark Vignette Overlay so text remains 100% legible */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#06080d]/90 via-[#06080d]/50 to-[#06080d]/30 pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
      </div>
    );
  }

  // STANDALONE 1:1 HERO DISPLAY (e.g. for Showcase Header Banner)
  return (
    <div
      className={`relative select-none overflow-hidden rounded-xl flex items-center justify-center ${className}`}
      style={{ aspectRatio: '1 / 1' }}
    >
      <svg
        viewBox="0 0 800 800"
        className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`bg-glow-${uid}`} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={theme.accentColor} stopOpacity="0.25" />
            <stop offset="60%" stopColor={theme.accentDark} stopOpacity="0.1" />
            <stop offset="100%" stopColor="#050608" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={`card-body-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1d24" />
            <stop offset="45%" stopColor="#101319" />
            <stop offset="100%" stopColor="#0a0c10" />
          </linearGradient>

          <linearGradient id={`card-border-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="35%" stopColor={theme.accentLight} stopOpacity="0.9" />
            <stop offset="70%" stopColor={theme.accentColor} stopOpacity="1" />
            <stop offset="100%" stopColor={theme.accentDark} stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id={`card-slash-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.accentDark} stopOpacity="0.95" />
            <stop offset="50%" stopColor={theme.accentColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={theme.accentLight} stopOpacity="0.85" />
          </linearGradient>

          <filter id={`neon-glow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id={`soft-shadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#000000" floodOpacity="0.8" />
            <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor={theme.accentColor} floodOpacity="0.35" />
          </filter>

          <clipPath id={`card-clip-${uid}`}>
            <rect x="210" y="110" width="380" height="570" rx="28" />
          </clipPath>
        </defs>

        <rect width="800" height="800" fill="#060709" />
        <circle cx="400" cy="400" r="380" fill={`url(#bg-glow-${uid})`} />

        {/* Diagonal Background Neon Geometry */}
        <path d="M 0 640 L 480 0 L 800 0 L 800 800 L 0 800 Z" fill={theme.accentColor} fillOpacity="0.08" />
        <path d="M 280 800 L 800 240 L 800 800 Z" fill={theme.accentColor} fillOpacity="0.14" />

        {/* Floating PS Action Symbols */}
        <g transform="translate(60, 230) rotate(-15)" filter={`url(#neon-glow-${uid})`}>
          <path d="M 0 0 L 45 45 M 45 0 L 0 45" stroke={theme.accentColor} strokeWidth="14" strokeLinecap="round" />
        </g>
        <g transform="translate(48, 400) rotate(8)" filter={`url(#neon-glow-${uid})`}>
          <polygon points="32,0 64,56 0,56" stroke={theme.accentColor} strokeWidth="12" fill="none" strokeLinejoin="round" />
        </g>
        <g transform="translate(45, 650)" filter={`url(#neon-glow-${uid})`}>
          <circle cx="40" cy="40" r="35" stroke={theme.accentColor} strokeWidth="14" fill="none" />
        </g>
        <g transform="translate(670, 120) rotate(22)" filter={`url(#neon-glow-${uid})`}>
          <rect x="0" y="0" width="56" height="56" rx="8" stroke={theme.accentColor} strokeWidth="12" fill="none" />
        </g>

        {/* The 3D Voucher Card */}
        <g filter={`url(#soft-shadow-${uid})`}>
          <rect x="208" y="108" width="384" height="574" rx="30" fill="none" stroke={`url(#card-border-${uid})`} strokeWidth="4" />
          <rect x="210" y="110" width="380" height="570" rx="28" fill={`url(#card-body-${uid})`} />

          <g clipPath={`url(#card-clip-${uid})`}>
            <path d="M 390 680 L 590 280 L 590 680 Z" fill={`url(#card-slash-${uid})`} />
            <line x1="390" y1="680" x2="590" y2="280" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.4" />

            {/* Hanger Peg Cutout */}
            <g transform="translate(345, 132)">
              <path
                d="M 22 0 L 88 0 C 98 0, 106 8, 106 18 C 106 28, 98 36, 88 36 L 68 36 C 64 36, 61 38, 59 41 C 57 44, 53 44, 51 41 C 49 38, 46 36, 42 36 L 22 36 C 12 36, 4 28, 4 18 C 4 8, 12 0, 22 0 Z"
                fill="#060709"
                stroke={theme.accentColor}
                strokeWidth="1.5"
              />
            </g>

            {/* Brand Logo */}
            <g transform="translate(300, 205)">
              <path d="M 60 18 C 76 6, 104 6, 120 18 C 128 26, 124 45, 112 53 C 104 49, 96 46, 90 46 C 84 46, 76 49, 68 53 C 56 45, 52 26, 60 18 Z" fill="#ffffff" />
              <ellipse cx="90" cy="33" rx="60" ry="22" stroke={theme.accentColor} strokeWidth="5" fill="none" transform="rotate(-12 90 33)" />
              <text x="90" y="88" textAnchor="middle" fill="#ffffff" fontFamily="sans-serif" fontSize="30" fontWeight="900" fontStyle="italic">
                PSN<tspan fill={theme.accentColor}>.BY</tspan>
              </text>
            </g>

            {/* Subtitle */}
            <text x="400" y="330" textAnchor="middle" fill="#94a3b8" fontFamily="sans-serif" fontSize="12" fontWeight="700" letterSpacing="3">
              PLAYSTATION
            </text>
            <text x="400" y="350" textAnchor="middle" fill="#cbd5e1" fontFamily="sans-serif" fontSize="13" fontWeight="800" letterSpacing="2.5">
              BALANCE TOP-UP
            </text>

            {/* White 3D PlayStation Logo */}
            <g transform="translate(325, 385)">
              <path d="M 52 145 L 52 15 C 52 8, 58 2, 65 2 C 73 2, 79 8, 79 15 L 79 82 C 92 82, 105 76, 110 65 C 114 55, 111 40, 102 32 C 98 28, 98 22, 102 18 C 107 14, 113 15, 118 20 C 131 33, 134 56, 126 73 C 117 92, 98 101, 79 101 L 79 145 Z" fill="#ffffff" />
              <path d="M 12 135 C 24 122, 54 116, 82 116 C 112 116, 142 122, 154 135 C 160 142, 154 148, 140 151 C 122 155, 96 155, 82 153 C 65 151, 35 146, 16 142 C 10 140, 8 137, 12 135 Z" fill="#e2e8f0" />
              <path d="M 32 142 C 48 133, 72 128, 94 128 C 118 128, 136 133, 146 140 C 136 145, 112 148, 92 148 C 68 148, 48 145, 32 142 Z" fill="#cbd5e1" />
              <text x="150" y="155" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">®</text>
            </g>

            {/* Denomination */}
            {showDenomination && denomination && (
              <g transform="translate(400, 620)">
                <rect x="-120" y="-26" width="240" height="52" rx="14" fill="#000000" fillOpacity="0.75" stroke={theme.accentColor} strokeWidth="2" />
                <text x="0" y="8" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="24" fontWeight="900">
                  {denomination.toLocaleString()} {currencySymbol || ''}
                </text>
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};
