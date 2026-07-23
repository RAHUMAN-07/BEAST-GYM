import React, { useEffect, useRef, useState } from 'react';

interface OpeningScreenProps {
  onComplete: () => void;
}

/* ─── Minimal type for particle data ─────────────────── */
interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  size: number; alpha: number; color: string;
}

const LETTER_CHARS = ['B', 'E', 'A', 'S', 'T', ' ', 'G', 'Y', 'M'];

export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [letterStages, setLetterStages] = useState<number[]>(Array(LETTER_CHARS.length).fill(0));
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  /* ── 3D-like canvas particle field ─────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', resize);

    // Dual-colour embers — electric-green + emerald
    const particles: Particle[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * W, y: Math.random() * H, z: Math.random(),
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 0.8 + 0.2),
      vz: (Math.random() - 0.5) * 0.004,
      size: Math.random() * 3 + 0.5,
      alpha: Math.random() * 0.7 + 0.15,
      color: Math.random() > 0.45 ? '#00ff66' : '#10b981',
    }));

    // Bigger, slow-floating bokeh orbs
    const orbs: { x: number; y: number; r: number; alpha: number; color: string; dx: number; dy: number }[] = Array.from({ length: 12 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 120 + 60,
      alpha: Math.random() * 0.15 + 0.04,
      color: Math.random() > 0.5 ? '#00ff66' : '#047857',
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.2,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Radial dark backdrop
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
      bg.addColorStop(0, 'rgba(11,19,41,0.92)');
      bg.addColorStop(1, 'rgba(7,13,25,1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Draw bokeh orbs
      orbs.forEach(o => {
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, o.color.replace(')', `,${o.alpha})`).replace('rgb', 'rgba'));
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
        o.x += o.dx; o.y += o.dy;
        if (o.x < -o.r) o.x = W + o.r;
        if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r;
        if (o.y > H + o.r) o.y = -o.r;
      });

      // Draw ember particles
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha * p.z;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        if (p.z <= 0.1) p.z = 0.1;
        if (p.z >= 1.2) p.vz = -Math.abs(p.vz);
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── Letter cascade animation ───────────────────────── */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LETTER_CHARS.forEach((_, i) => {
      if (i === 5) return; // space — skip
      // Each letter enters staggered every 120ms
      const t = setTimeout(() => {
        setLetterStages(prev => {
          const next = [...prev];
          next[i] = 1; // revealed
          return next;
        });
      }, 300 + i * 130);
      timers.push(t);
    });

    // Show subtitle at 1.9s
    const t2 = setTimeout(() => setSubtitleVisible(true), 1900);
    timers.push(t2);

    // Start fade at 3.5s
    const t3 = setTimeout(() => setIsFading(true), 3500);
    timers.push(t3);

    // Complete at 4.2s
    const t4 = setTimeout(() => onComplete(), 4200);
    timers.push(t4);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: isFading ? 'none' : 'all',
      }}
    >
      {/* Canvas 3D Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Center glow corona */}
      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,87,34,0.18) 0%, rgba(37,99,235,0.10) 50%, transparent 75%)',
          filter: 'blur(40px)',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-52%)',
        }}
      />

      {/* Letter Assembly Row */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {LETTER_CHARS.map((char, i) => {
            if (char === ' ') {
              return <div key={i} className="w-4 sm:w-8" />;
            }
            const isGymWord = i >= 6; // G Y M portion
            const isVisible = letterStages[i] === 1;

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: 'transparent',
                  backgroundImage: isGymWord
                    ? 'linear-gradient(135deg, #a7f3d0 0%, #10b981 50%, #047857 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #34d399 50%, #00ff66 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  filter: isVisible
                    ? (isGymWord
                        ? 'drop-shadow(0 0 25px rgba(16,185,129,0.9))'
                        : 'drop-shadow(0 0 30px rgba(0,255,102,1))')
                    : 'none',
                  transform: isVisible
                    ? 'translateY(0) scale(1) rotate(0deg)'
                    : 'translateY(80px) scale(0.3) rotate(-15deg)',
                  opacity: isVisible ? 1 : 0,
                  transition: `transform 0.65s cubic-bezier(0.16,1,0.3,1), opacity 0.55s ease, filter 0.8s ease`,
                  transitionDelay: '0ms',
                  userSelect: 'none',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Animated underline that draws in */}
        <div
          style={{
            height: '3px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #00ff66, #10b981, #34d399)',
            width: subtitleVisible ? '100%' : '0%',
            transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 0 16px rgba(0,255,102,0.7)',
            alignSelf: 'stretch',
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subtitleVisible ? 1 : 0,
            transform: subtitleVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.7s ease',
          }}
          className="text-center space-y-1"
        >
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.45em] text-slate-300">
            High-Performance Athletic Sanctuary
          </p>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            Strength · Conditioning · Recovery
          </p>
        </div>

        {/* Entering indicator */}
        {subtitleVisible && (
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-orange-500/80 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            Entering Sanctuary
          </div>
        )}
      </div>
    </div>
  );
};
