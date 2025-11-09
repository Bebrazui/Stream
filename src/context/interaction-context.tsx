'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-context';

// Define the shape of the context
interface InteractionContextType {
  requireAuth: () => boolean; // Returns true if authenticated, false otherwise
}

// Create the context
const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

// Custom hook to use the interaction context
export const useInteraction = () => {
  const context = useContext(InteractionContext);
  if (context === undefined) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  return context;
};

// Provider component props
interface InteractionProviderProps {
  children: ReactNode;
  openAuthModal: () => void; // A function to open the authentication modal
}

// Provider component
export const InteractionProvider = ({ children, openAuthModal }: InteractionProviderProps) => {
  const { user } = useAuth();

  const requireAuth = useCallback(() => {
    if (user) {
      return true; // User is authenticated
    }
    // User is not authenticated, open the modal
    openAuthModal();
    return false;
  }, [user, openAuthModal]);

  return (
    <InteractionContext.Provider value={{ requireAuth }}>
      {children}
    </InteractionContext.Provider>
  );
};
