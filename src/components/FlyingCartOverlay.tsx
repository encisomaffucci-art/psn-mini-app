import React, { useEffect, useRef } from 'react';
import { useStore, FlyingParticle } from '../context/StoreContext';
import { ShoppingBag, CreditCard, Sparkles, Gamepad2 } from 'lucide-react';

interface ParticleItemProps {
  particle: FlyingParticle;
  regionId: string;
}

const ParticleItem: React.FC<ParticleItemProps> = ({ particle, regionId }) => {
  const elRef = useRef<HTMLDivElement>(null);

  const getCardStyle = () => {
    switch (regionId) {
      case 'turkey':
        return 'from-red-600 to-rose-400 ring-red-500/40 shadow-red-500/80';
      case 'india':
        return 'from-emerald-600 to-green-400 ring-emerald-500/40 shadow-emerald-500/80';
      case 'poland':
        return 'from-orange-600 to-amber-400 ring-orange-500/40 shadow-orange-500/80';
      default:
        return 'from-[#0070d1] to-sky-400 ring-[#0070d1]/40 shadow-[#0070d1]/80';
    }
  };

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Check if web animations API is supported
    if (typeof el.animate === 'function') {
      const dx = particle.targetX - particle.startX;
      const dy = particle.targetY - particle.startY;

      // Parabolic flight trajectory
      const keyframes: Keyframe[] = [
        {
          transform: `translate3d(${particle.startX}px, ${particle.startY}px, 0) scale(0.9) translate(-50%, -50%)`,
          opacity: 0.95
        },
        {
          // Apex of arc: lift upward ~70px and advance 35% toward target
          transform: `translate3d(${particle.startX + dx * 0.35}px, ${particle.startY - 70}px, 0) scale(1.25) translate(-50%, -50%)`,
          opacity: 1,
          offset: 0.32
        },
        {
          // Swoop toward target
          transform: `translate3d(${particle.startX + dx * 0.8}px, ${particle.startY + dy * 0.75}px, 0) scale(0.75) translate(-50%, -50%)`,
          opacity: 0.95,
          offset: 0.8
        },
        {
          // Impact into cart
          transform: `translate3d(${particle.targetX}px, ${particle.targetY}px, 0) scale(0.25) translate(-50%, -50%)`,
          opacity: 0.1
        }
      ];

      const animation = el.animate(keyframes, {
        duration: 650,
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
        fill: 'forwards'
      });

      return () => {
        animation.cancel();
      };
    }
  }, [particle]);

  return (
    <div
      ref={elRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate3d(${particle.startX}px, ${particle.startY}px, 0) translate(-50%, -50%)`,
        willChange: 'transform, opacity',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    >
      {/* Visual Badge depending on item type */}
      {particle.image ? (
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-2xl shadow-[#0070d1]/80 ring-4 ring-[#0070d1]/40 bg-black flex items-center justify-center">
          <img src={particle.image} alt="" className="w-full h-full object-cover" />
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-mono text-[9px] font-black rounded-full px-1 shadow-sm border border-black/40">
            +1
          </span>
        </div>
      ) : particle.icon === 'card' ? (
        <div className={`relative w-11 h-11 rounded-full bg-gradient-to-tr ${getCardStyle()} text-white flex items-center justify-center font-bold shadow-2xl border-2 border-white ring-4`}>
          <CreditCard className="w-5 h-5 text-white drop-shadow-sm" />
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white font-mono text-[9px] font-black rounded-full px-1 shadow-sm border border-black/40">
            +1
          </span>
        </div>
      ) : particle.icon === 'sub' ? (
        <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center font-bold shadow-2xl shadow-amber-500/80 border-2 border-white ring-4 ring-amber-400/40">
          <Sparkles className="w-5 h-5 text-black drop-shadow-sm" />
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white font-mono text-[9px] font-black rounded-full px-1 shadow-sm border border-black/40">
            +1
          </span>
        </div>
      ) : (
        <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[#0070d1] to-blue-500 text-white flex items-center justify-center font-bold shadow-2xl shadow-[#0070d1]/80 border-2 border-white ring-4 ring-[#0070d1]/40">
          <ShoppingBag className="w-5 h-5 text-white drop-shadow-sm" />
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white font-mono text-[9px] font-black rounded-full px-1 shadow-sm border border-black/40">
            +1
          </span>
        </div>
      )}
    </div>
  );
};

export const FlyingCartOverlay: React.FC = () => {
  const { flyingParticles, currentRegion } = useStore();

  if (flyingParticles.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    >
      {flyingParticles.map((particle) => (
        <ParticleItem key={particle.id} particle={particle} regionId={currentRegion.id} />
      ))}
    </div>
  );
};
