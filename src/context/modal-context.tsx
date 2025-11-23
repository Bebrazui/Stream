
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ModalContextType {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isModalOpen && (
        <Dialog open onOpenChange={setIsModalOpen}>
          <DialogContent>
            {modalContent}
          </DialogContent>
        </Dialog>
      )}
    </ModalContext.Provider>
  );
};

// Basic Modal component to be used with the provider
export const Modal = ({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: ReactNode }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}
