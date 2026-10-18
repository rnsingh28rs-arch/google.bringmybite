import React, { useState, useRef, useCallback } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface WaterLightGlassProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'vibrant';
  enableRipples?: boolean;
  enableLightFollow?: boolean;
  onClick?: () => void;
  title?: string;
}

export const WaterLightGlass: React.FC<WaterLightGlassProps> = ({
  children,
  className = '',
  intensity = 'medium',
  enableRipples = true,
  enableLightFollow = true,
  onClick,
  title
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50, active: false });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  // Throttled / smooth mouse movement tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y, active: true });

    // Spawn gentle water ripple as finger/cursor moves across water surface
    if (enableRipples && Math.random() > 0.65) {
      const newId = ++rippleIdRef.current;
      const newRipple: Ripple = {
        id: newId,
        x,
        y,
        size: Math.floor(Math.random() * 40 + 70)
      };

      setRipples(prev => [...prev.slice(-4), newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newId));
      }, 1000);
    }
  }, [enableRipples]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y, active: true });

    // Create an initial entry ripple (like finger touching the water surface)
    if (enableRipples) {
      const newId = ++rippleIdRef.current;
      setRipples(prev => [...prev, { id: newId, x, y, size: 90 }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newId));
      }, 1100);
    }
  }, [enableRipples]);

  const handleMouseLeave = useCallback(() => {
    setMousePos(prev => ({ ...prev, active: false }));
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current && enableRipples) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Click creates a stronger water wave ring
      const newId = ++rippleIdRef.current;
      setRipples(prev => [...prev, { id: newId, x, y, size: 140 }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newId));
      }, 1200);
    }
    if (onClick) onClick();
  }, [enableRipples, onClick]);

  const intensityGradients = {
    subtle: {
      light: 'radial-gradient(circle 120px at var(--mx) var(--my), rgba(255, 255, 255, 0.45) 0%, rgba(224, 242, 254, 0.25) 45%, transparent 80%)',
      border: 'rgba(255, 255, 255, 0.85)'
    },
    medium: {
      light: 'radial-gradient(circle 140px at var(--mx) var(--my), rgba(255, 255, 255, 0.7) 0%, rgba(191, 219, 254, 0.35) 40%, rgba(147, 197, 253, 0.15) 60%, transparent 85%)',
      border: 'rgba(255, 255, 255, 0.95)'
    },
    vibrant: {
      light: 'radial-gradient(circle 160px at var(--mx) var(--my), rgba(255, 255, 255, 0.85) 0%, rgba(147, 197, 253, 0.45) 35%, rgba(199, 210, 254, 0.25) 65%, transparent 90%)',
      border: 'rgba(255, 255, 255, 1)'
    }
  };

  const currentTheme = intensityGradients[intensity];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      title={title}
      className={`relative overflow-hidden water-glass-surface ${className}`}
      style={{
        '--mx': `${mousePos.x}px`,
        '--my': `${mousePos.y}px`,
      } as React.CSSProperties}
    >
      {/* 1. Fluid Cursor Spotlight - glides across glass like light penetrating water */}
      {enableLightFollow && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: mousePos.active ? 1 : 0,
            backgroundImage: currentTheme.light,
          }}
        />
      )}

      {/* 2. Concentric Expanding Water Ripples */}
      {enableRipples && ripples.map(ripple => (
        <span
          key={ripple.id}
          className="water-ripple-wave"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
          }}
        />
      ))}

      {/* 3. Fluid Optical Caustic Refraction Shimmer */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-40 water-caustic-layer"
        style={{
          opacity: mousePos.active ? 0.6 : 0.2
        }}
      />

      {/* 4. Child Content (Elevated above liquid layers) */}
      <div className="relative z-10 w-full h-full flex items-center">
        {children}
      </div>
    </div>
  );
};
