
'use client';

import { AuthProvider } from "@/context/auth-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as DefaultToaster } from "@/components/ui/toaster"; 
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ModalProvider, Modal } from "@/context/modal-context";
import { useState } from "react";

export function Providers({ children, ...props }: { children: React.ReactNode }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AuthProvider>
            <TooltipProvider>
                <ModalProvider>
                    {children}
                    <DefaultToaster />
                    <SonnerToaster />
                    {/* Example Modal Usage - can be triggered from anywhere via useModal */}
                    <Modal 
                        open={isModalOpen} 
                        onOpenChange={setIsModalOpen}
                    >
                        <h2>Modal Content</h2>
                        <p>This is a sample modal.</p>
                    </Modal>
                </ModalProvider>
            </TooltipProvider>
        </AuthProvider>
    );
}
