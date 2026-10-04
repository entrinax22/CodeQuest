import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, CheckCircle2, ArrowDown } from 'lucide-react';
import { sounds } from '../lib/sound';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  label?: string;
}

const PULL_THRESHOLD = 65;

export default function PullToRefresh({ onRefresh, children, className = '', label = 'data' }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justRefreshed, setJustRefreshed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const executeRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setPullDistance(60);
    try {
      sounds.playClick();
    } catch {}

    try {
      await onRefresh();
      setJustRefreshed(true);
      setTimeout(() => setJustRefreshed(false), 2000);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, [onRefresh, isRefreshing]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    // Only initiate pull if we are scrolled to the very top
    if (container.scrollTop <= 2) {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      touchStartY.current = clientY;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current || touchStartY.current === null || isRefreshing) return;

    const container = containerRef.current;
    if (!container || container.scrollTop > 2) {
      isDragging.current = false;
      setPullDistance(0);
      return;
    }

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - touchStartY.current;

    if (deltaY > 0) {
      // Non-linear dampening formula for realistic spring resistance
      const dampened = Math.min(110, Math.pow(deltaY, 0.82));
      setPullDistance(dampened);

      // Prevent native rubber-band scrolling when pulling down
      if (deltaY > 10 && e.cancelable) {
        e.preventDefault();
      }
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    touchStartY.current = null;

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      executeRefresh();
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      className={`relative overflow-y-auto select-none ${className}`}
      style={{ touchAction: pullDistance > 0 ? 'none' : 'auto' }}
    >
      {/* Pull-to-Refresh Indicator Header */}
      <div 
        className="w-full flex flex-col items-center justify-center transition-all duration-200 overflow-hidden pointer-events-none z-20"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance > 10 || isRefreshing ? 1 : 0
        }}
      >
        <div className="flex items-center gap-2 py-2 px-4 rounded-full bg-[#161824] border border-white/10 shadow-lg text-xs font-bold text-sky-300">
          {isRefreshing ? (
            <>
              <RefreshCw size={14} className="animate-spin text-sky-400" />
              <span>Updating {label}...</span>
            </>
          ) : justRefreshed ? (
            <>
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-emerald-300">Updated {label}!</span>
            </>
          ) : pullDistance >= PULL_THRESHOLD ? (
            <>
              <RefreshCw size={14} className="text-amber-400 animate-bounce" />
              <span className="text-amber-300">Release to refresh</span>
            </>
          ) : (
            <>
              <ArrowDown 
                size={14} 
                className="text-sky-400 transition-transform duration-200"
                style={{ transform: `rotate(${(pullDistance / PULL_THRESHOLD) * 180}deg)` }}
              />
              <span className="text-white/60">Pull down to refresh {label}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Container Content */}
      <div className="transition-transform duration-150" style={{ transform: pullDistance > 0 ? `translateY(${pullDistance * 0.25}px)` : 'none' }}>
        {children}
      </div>
    </div>
  );
}
