
'use client';

import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const FRAMES = {
  none: { className: '' },
  circle: { className: 'rounded-full' },
  'gold-border': { className: 'rounded-full border-4 border-yellow-400 p-1' },
  'neon-glow': { className: 'rounded-full shadow-[0_0_15px_rgba(74,222,128,0.8)]' },
  vintage: { className: 'border-8 border-yellow-700/80 p-1 sepia' },
} as const;

type FrameName = keyof typeof FRAMES;

interface FrameSelectorProps {
  value: FrameName;
  onChange: (value: FrameName) => void;
}

export function FrameSelector({ value, onChange }: FrameSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {(Object.keys(FRAMES) as FrameName[]).map((frameName) => {
        const frame = FRAMES[frameName];
        const isSelected = value === frameName;

        return (
          <div
            key={frameName}
            onClick={() => onChange(frameName)}
            className={cn(
              'relative cursor-pointer rounded-lg border-2 p-4 flex justify-center items-center aspect-square transition-all',
              isSelected ? 'border-primary scale-105' : 'border-muted hover:border-muted-foreground',
            )}
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                <div className={cn(
                    'w-20 h-20 bg-cover bg-center bg-[url(https://i.pravatar.cc/150)]',
                    frame.className
                )} />
            </div>

            <p className="absolute bottom-2 text-xs font-semibold">{frameName}</p>

            {isSelected && (
              <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CheckCircle className="h-4 w-4" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
