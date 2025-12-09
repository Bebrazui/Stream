'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthModal } from '@/hooks/use-auth-modal';
import { AuthForm } from '@/components/auth/auth-form';

export function AuthModal() {
  const { isOpen, closeModal, view } = useAuthModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{view === 'login' ? 'Log In' : 'Create Account'}</DialogTitle>
        </DialogHeader>
        <AuthForm view={view} />
      </DialogContent>
    </Dialog>
  );
}
