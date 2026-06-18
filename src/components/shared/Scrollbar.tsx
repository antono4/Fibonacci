'use client';

import { clsx } from 'clsx';
import type { CSSProperties, ReactNode } from 'react';

interface ScrollbarProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  direction?: 'vertical' | 'horizontal' | 'both';
  hideScrollbar?: boolean;
}

export function Scrollbar({
  children,
  className,
  style,
  direction = 'vertical',
  hideScrollbar = false,
}: ScrollbarProps) {
  return (
    <div
      className={clsx(
        'overflow-auto',
        direction === 'vertical' && 'overflow-y-auto',
        direction === 'horizontal' && 'overflow-x-auto',
        !hideScrollbar && 'custom-scrollbar',
        hideScrollbar && 'scrollbar-hidden',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function CustomStyles() {
  return (
    <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #3E4451;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #5C6370;
      }
      .custom-scrollbar::-webkit-scrollbar-corner {
        background: transparent;
      }
      .scrollbar-hidden::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hidden {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      /* Animation classes */
      .animate-slide-in {
        animation: slideIn 0.2s ease-out;
      }
      .animate-fade-in {
        animation: fadeIn 0.15s ease-out;
      }
      .animate-pulse-cursor {
        animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      @keyframes slideIn {
        from {
          transform: translateX(-10px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      /* xterm.js styles */
      .xterm {
        padding: 8px;
      }
      .xterm-viewport::-webkit-scrollbar {
        width: 8px;
      }
      .xterm-viewport::-webkit-scrollbar-thumb {
        background-color: #3E4451;
        border-radius: 4px;
      }
    `}</style>
  );
}
