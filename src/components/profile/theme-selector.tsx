
'use client';

import { CheckCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/use-toast';

const THEMES = {
  default: { bg: 'bg-card', text: 'text-foreground', accent: 'text-accent' },
  dark: { bg: 'bg-gray-900', text: 'text-gray-100', accent: 'text-blue-400' },
  ocean: { bg: 'bg-blue-100', text: 'text-blue-900', accent: 'text-blue-600' },
  sunrise: { bg: 'bg-orange-100', text: 'text-orange-900', accent: 'text-red-500' },
  'premium-galaxy': { bg: 'bg-indigo-900', text: 'text-purple-200', accent: 'text-pink-400' },
} as const;

type ThemeName = keyof typeof THEMES;

interface ThemeSelectorProps {
  value: ThemeName;
  onChange: (value: ThemeName) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleThemeClick = (themeName: ThemeName) => {
    if (themeName === 'premium-galaxy' && !user?.hasPremium) {
      toast({
        title: "Premium Theme Locked",
        description: "This theme is only available for premium users.",
        variant: "destructive",
      });
    } else {
      onChange(themeName);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {(Object.keys(THEMES) as ThemeName[]).map((themeName) => {
        const theme = THEMES[themeName];
        const isSelected = value === themeName;
        const isPremium = themeName === 'premium-galaxy';
        const isLocked = isPremium && !user?.hasPremium;

        return (
          <div
            key={themeName}
            onClick={() => handleThemeClick(themeName)}
            className={cn(
              'relative cursor-pointer rounded-lg border-2 p-4 transition-all',
              isSelected ? 'border-primary scale-105' : 'border-muted hover:border-muted-foreground',
              isLocked ? 'cursor-not-allowed opacity-50' : ''
            )}
          >
            <div className={cn('h-16 w-full rounded-md', theme.bg)}>
                <div className='p-2'>
                    <p className={cn('text-sm font-bold', theme.text)}>{themeName}</p>
                    <p className={cn('text-xs', theme.text)}>Some text</p>
                    <p className={cn('text-xs font-bold', theme.accent)}>Accent</p>
                </div>
            </div>
            {isSelected && (
              <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CheckCircle className="h-4 w-4" />
              </div>
            )}
            {isLocked && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Lock className="h-8 w-8 text-foreground" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
