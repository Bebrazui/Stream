
'use client';

import { useState } from 'react';
import { Check, Palette, Sparkles, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { ProfileTheme } from '@/types';

const themes: { name: ProfileTheme; isPremium: boolean; color: string }[] = [
  { name: 'default', isPremium: false, color: '#ffffff' },
  { name: 'dark', isPremium: false, color: '#1a202c' },
  { name: 'ocean', isPremium: false, color: '#4f9de9' },
  { name: 'sunrise', isPremium: false, color: '#f6ad55' },
  { name: 'premium-galaxy', isPremium: true, color: '#4a0e89' },
];

export default function ThemeSelector() {
  const { user } = useAuth();
  const { toast } = useToast();
  // DUMMY STATE: In a real app, this would come from user.profileTheme
  const [selectedTheme, setSelectedTheme] = useState<ProfileTheme>('default');

  const handleSelectTheme = (theme: ProfileTheme, isPremium: boolean) => {
    if (isPremium && !user?.hasPremium) {
      toast({
        title: 'Premium Feature',
        description: 'Upgrade to premium to use this theme!',
        variant: 'destructive',
      });
      return;
    }
    setSelectedTheme(theme);
    toast({ title: 'Theme Updated!', description: `Switched to ${theme} theme.` });
    // In a real app, you would call a server action here to save the theme
    // e.g., updateUserTheme(theme);
  };

  return (
    <div className="p-6 bg-card border rounded-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center"><Palette className="mr-2" /> Profile Theme</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Customize your profile with a unique theme. Premium themes are available for subscribers.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {themes.map((theme) => (
          <div key={theme.name} className="relative">
            <Button
              variant="outline"
              className={cn(
                'w-full h-24 flex flex-col items-center justify-center transition-all',
                selectedTheme === theme.name && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              )}
              onClick={() => handleSelectTheme(theme.name, theme.isPremium)}
            >
              <div className="w-10 h-10 rounded-full mb-2" style={{ backgroundColor: theme.color }} />
              <span className="text-xs capitalize">{theme.name.replace('-', ' ')}</span>
            </Button>
            {selectedTheme === theme.name && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check size={14} />
              </div>
            )}
            {theme.isPremium && (
              <div className="absolute bottom-2 right-2 text-yellow-500">
                {user?.hasPremium ? <Sparkles size={16} /> : <Lock size={16} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

