'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import { useAuthModal } from '@/hooks/use-auth-modal';
import { AuthForm } from '@/components/auth/auth-form';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { cn } from '@/lib/utils';

export function AuthModal() {
  const { isOpen, closeModal, view } = useAuthModal();
  const [currentView, setCurrentView] = useState(view);

  // Sync state with hook
  useEffect(() => {
    setCurrentView(view);
  }, [view]);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
      <DialogContent className={cn(
        "sm:max-w-[425px]",
        "bg-transparent border-none p-0",
        "outline-none",
        "focus:outline-none",
        "data-[state=open]:animate-content-show",
        "data-[state=closed]:animate-content-hide"
      )}>
        <LiquidGlass motionProps={{ layout: true }} className="p-6">
          <DialogHeader>
            <DialogTitle className="text-slate-100 text-2xl font-bold">
              {currentView === 'login' ? 'Log In' : 'Create Account'}
            </DialogTitle>
          </DialogHeader>
          <AuthForm view={currentView} />
        </LiquidGlass>
      </DialogContent>
    </Dialog>
  );
}
