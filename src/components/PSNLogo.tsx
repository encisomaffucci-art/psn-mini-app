import React from 'react';

interface PSNLogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'icon';
  size?: number | string;
}

export const PSNLogo: React.FC<PSNLogoProps> = ({
  className = '',
  variant = 'horizontal',
  size = 40
}) => {
  if (variant === 'icon') {
    // Only the controller with orbital blue swoosh (e.g. for badges or square spots)
    return (
      <svg
        viewBox="0 0 600 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ height: size, width: 'auto' }}
      >
        <defs>
          <linearGradient id="blue-swoosh" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0055ff" />
            <stop offset="50%" stopColor="#0070d1" />
            <stop offset="100%" stopColor="#2997ff" />
          </linearGradient>
          <filter id="blue-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Back portion of the orbital ring (behind the controller) */}
        <path
          d="M 400 120 C 470 120, 540 145, 570 180 C 585 200, 570 230, 520 255"
          stroke="url(#blue-swoosh)"
          strokeWidth="32"
          strokeLinecap="round"
          fill="none"
        />

        {/* CONTROLLER MAIN BODY */}
        <g id="controller-body">
          {/* Black inner chassis & grip accents */}
          <path
            d="M 120 260 L 175 320 C 190 300, 215 285, 240 280 C 265 275, 335 275, 360 280 C 385 285, 410 300, 425 320 L 485 260 C 500 240, 505 180, 480 140 L 450 115 L 390 125 L 350 140 L 250 140 L 210 125 L 150 115 L 120 140 C 95 180, 100 240, 120 260 Z"
            fill="#090c12"
          />

          {/* White outer faceplate & handles */}
          {/* Left Handle & Faceplate */}
          <path
            d="M 150 115 C 175 110, 205 120, 215 130 C 220 135, 240 170, 250 175 C 240 210, 210 245, 175 265 C 145 285, 110 260, 105 210 C 100 170, 125 125, 150 115 Z"
            fill="#ffffff"
          />
          {/* Right Handle & Faceplate */}
          <path
            d="M 450 115 C 425 110, 395 120, 385 130 C 380 135, 360 170, 350 175 C 360 210, 390 245, 425 265 C 455 285, 490 260, 495 210 C 500 170, 475 125, 450 115 Z"
            fill="#ffffff"
          />
          {/* Center Touchpad & Bridge */}
          <path
            d="M 250 125 L 350 125 C 365 125, 370 135, 365 155 L 350 185 C 345 195, 335 200, 300 200 C 265 200, 255 195, 250 185 L 235 155 C 230 135, 235 125, 250 125 Z"
            fill="#ffffff"
          />
          {/* Touchpad border contour */}
          <path
            d="M 255 135 L 345 135 L 335 175 L 265 175 Z"
            fill="#0b0e14"
          />

          {/* Thumbstick Docks (Two Circles with glowing blue rims) */}
          {/* Left Thumbstick */}
          <circle cx="255" cy="225" r="32" fill="#090c12" stroke="#0070d1" strokeWidth="8" filter="url(#blue-glow)" />
          <circle cx="255" cy="225" r="24" fill="#090c12" />

          {/* Right Thumbstick */}
          <circle cx="345" cy="225" r="32" fill="#090c12" stroke="#0070d1" strokeWidth="8" filter="url(#blue-glow)" />
          <circle cx="345" cy="225" r="24" fill="#090c12" />

          {/* D-Pad (Left side) */}
          <g transform="translate(185, 175)">
            <path
              d="M -7 -22 L 7 -22 L 7 -7 L 22 -7 L 22 7 L 7 7 L 7 22 L -7 22 L -7 7 L -22 7 L -22 -7 L -7 -7 Z"
              fill="#090c12"
            />
          </g>

          {/* Action Buttons (Right side - P, S, B, Y) */}
          <g transform="translate(415, 175)">
            {/* Top Button: P */}
            <circle cx="0" cy="-24" r="14" fill="#090c12" />
            <text x="0" y="-19" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif">P</text>

            {/* Left Button: S */}
            <circle cx="-24" cy="0" r="14" fill="#090c12" />
            <text x="0" y="5" transform="translate(-24, 0)" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif">S</text>

            {/* Right Button: B */}
            <circle cx="24" cy="0" r="14" fill="#090c12" />
            <text x="0" y="5" transform="translate(24, 0)" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif">B</text>

            {/* Bottom Button: Y */}
            <circle cx="0" cy="24" r="14" fill="#090c12" />
            <text x="0" y="29" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif">Y</text>
          </g>
        </g>

        {/* Front portion of the orbital blue swoosh (looping in front of controller) */}
        <path
          d="M 540 180 C 580 230, 480 300, 360 325 C 240 350, 90 325, 45 270 C 15 230, 40 180, 110 160 C 120 157, 130 163, 128 172 C 85 195, 65 235, 95 265 C 135 305, 270 325, 380 295 C 470 270, 530 220, 505 185 C 500 178, 510 168, 518 172 Z"
          fill="url(#blue-swoosh)"
          filter="url(#blue-glow)"
        />

        {/* Double-tapered tail streaks on bottom right of the swoop */}
        <path
          d="M 230 330 C 290 325, 380 305, 440 270 C 445 267, 448 273, 444 276 C 380 315, 290 335, 226 333 C 220 333, 222 328, 230 330 Z"
          fill="#0070d1"
        />
      </svg>
    );
  }

  // HORIZONTAL / NAVBAR DISPLAY (Controller Emblem + Slanted Wordmark)
  return (
    <div className={`flex items-center gap-2 select-none shrink-0 ${className}`}>
      {/* 1. Official Controller with Blue Orbital Ring */}
      <svg
        viewBox="0 0 580 370"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md"
        style={{ height: size, width: 'auto' }}
      >
        <defs>
          <linearGradient id="nav-swoosh" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0055ff" />
            <stop offset="60%" stopColor="#0070d1" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <filter id="nav-blue-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Back swoosh loop */}
        <path
          d="M 390 90 C 460 90, 530 115, 555 150 C 570 170, 550 200, 500 225"
          stroke="url(#nav-swoosh)"
          strokeWidth="30"
          strokeLinecap="round"
          fill="none"
        />

        {/* Controller Body */}
        {/* Black Chassis */}
        <path
          d="M 120 230 L 175 285 C 190 270, 215 255, 240 250 C 265 245, 325 245, 350 250 C 375 255, 400 270, 415 285 L 470 230 C 485 210, 490 155, 465 120 L 440 95 L 380 105 L 340 120 L 250 120 L 210 105 L 150 95 L 125 120 C 100 155, 105 210, 120 230 Z"
          fill="#090c12"
        />

        {/* White Left Faceplate & Handle */}
        <path
          d="M 150 95 C 175 90, 205 100, 215 110 C 220 115, 240 150, 250 155 C 240 190, 210 225, 175 245 C 145 265, 110 240, 105 190 C 100 150, 125 105, 150 95 Z"
          fill="#ffffff"
        />
        {/* White Right Faceplate & Handle */}
        <path
          d="M 440 95 C 415 90, 385 100, 375 110 C 370 115, 350 150, 340 155 C 350 190, 380 225, 415 245 C 445 265, 480 240, 485 190 C 490 150, 465 105, 440 95 Z"
          fill="#ffffff"
        />
        {/* White Touchpad & Bridge */}
        <path
          d="M 245 105 L 345 105 C 360 105, 365 115, 360 135 L 345 165 C 340 175, 330 180, 295 180 C 260 180, 250 175, 245 165 L 230 135 C 225 115, 230 105, 245 105 Z"
          fill="#ffffff"
        />
        <path d="M 250 115 L 340 115 L 330 155 L 260 155 Z" fill="#0b0e14" />

        {/* Glowing Blue Thumbsticks */}
        <circle cx="250" cy="200" r="28" fill="#090c12" stroke="#0070d1" strokeWidth="7" filter="url(#nav-blue-glow)" />
        <circle cx="250" cy="200" r="20" fill="#090c12" />

        <circle cx="340" cy="200" r="28" fill="#090c12" stroke="#0070d1" strokeWidth="7" filter="url(#nav-blue-glow)" />
        <circle cx="340" cy="200" r="20" fill="#090c12" />

        {/* D-Pad on Left */}
        <g transform="translate(180, 155)">
          <path
            d="M -6 -18 L 6 -18 L 6 -6 L 18 -6 L 18 6 L 6 6 L 6 18 L -6 18 L -6 6 L -18 6 L -18 -6 L -6 -6 Z"
            fill="#090c12"
          />
        </g>

        {/* Action Buttons P, S, B, Y on Right */}
        <g transform="translate(410, 155)">
          {/* Top: P */}
          <circle cx="0" cy="-21" r="12" fill="#090c12" />
          <text x="0" y="-17" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">P</text>

          {/* Left: S */}
          <circle cx="-21" cy="0" r="12" fill="#090c12" />
          <text x="-21" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">S</text>

          {/* Right: B */}
          <circle cx="21" cy="0" r="12" fill="#090c12" />
          <text x="21" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">B</text>

          {/* Bottom: Y */}
          <circle cx="0" cy="21" r="12" fill="#090c12" />
          <text x="0" y="25" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">Y</text>
        </g>

        {/* Front Blue Orbital Loop with Gradient and Glow */}
        <path
          d="M 525 150 C 560 195, 470 260, 350 285 C 235 310, 85 285, 45 235 C 18 200, 40 155, 105 138 C 114 135, 122 140, 120 148 C 80 170, 62 205, 90 232 C 128 268, 255 286, 360 260 C 445 238, 502 195, 480 162 C 475 155, 484 146, 492 149 Z"
          fill="url(#nav-swoosh)"
          filter="url(#nav-blue-glow)"
        />

        {/* Dynamic Streak Tail */}
        <path
          d="M 215 288 C 275 283, 360 265, 415 235 C 420 232, 423 238, 418 241 C 360 273, 275 292, 212 291 C 206 291, 208 286, 215 288 Z"
          fill="#0070d1"
        />
      </svg>

      {/* 2. Slanted Geometric Wordmark PSN.BY */}
      <span className="font-black text-2xl sm:text-[26px] tracking-tight leading-none inline-flex items-baseline italic select-none">
        <span className="text-white drop-shadow-sm">PSN</span>
        <span className="text-[#0070d1] drop-shadow-sm ml-0.5">.BY</span>
      </span>
    </div>
  );
};
