
'use client';

import { AuthProvider } from "@/context/auth-context";
import { InteractionProvider } from "@/context/interaction-context";
import { AuthModal } from "@/components/auth/auth-modal";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    return (
        <AuthProvider>
            <InteractionProvider openAuthModal={() => setAuthModalOpen(true)}>
                {children}
                <AuthModal isOpen={isAuthModalOpen} closeModal={() => setAuthModalOpen(false)} />
            </InteractionProvider>
        </AuthProvider>
    );
}
