'use client';

import { Heart, MessageCircle, Repeat, Share } from 'lucide-react';
import React from 'react';

export function BackgroundIcons() {
  const icons = [
    { Icon: Heart, className: 'text-red-500' },
    { Icon: MessageCircle, className: 'text-blue-500' },
    { Icon: Repeat, className: 'text-green-500' },
    { Icon: Share, className: 'text-yellow-500' },
  ];

  const positions = React.useMemo(() => {
    return Array.from({ length: 50 }).map(() => ({
      iconIndex: Math.floor(Math.random() * icons.length),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      rotation: `${Math.random() * 360}deg`,
    }));
  }, [icons.length]);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-10 pointer-events-none">
      {positions.map((pos, i) => {
        const { Icon, className } = icons[pos.iconIndex];
        return (
          <div
            key={i}
            className="absolute"
            style={{ top: pos.top, left: pos.left, transform: `rotate(${pos.rotation})` }}
          >
            <Icon className={`w-16 h-16 ${className}`} strokeWidth={1} />
          </div>
        );
      })}
    </div>
  );
}
