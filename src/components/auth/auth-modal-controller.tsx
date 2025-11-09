'use client';

import { useState } from 'react';
import { AuthModal } from './auth-modal';
import { InteractionProvider } from '@/context/interaction-context';

export const AuthModalController = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <InteractionProvider openAuthModal={() => setIsModalOpen(true)}>
      {children}
      <AuthModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </InteractionProvider>
  );
};
