'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface AuthPageProps {
    title: string;
    description: string;
    formComponent: ReactNode;
    switchLinkHref: string;
    switchLinkText: string;
}

export function AuthPage({ title, description, formComponent, switchLinkHref, switchLinkText }: AuthPageProps) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/home'); // Redirect if already logged in
        }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
            <LiquidGlass className="mx-auto max-w-sm">
                <Card className="bg-transparent border-none shadow-none">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {formComponent}
                        </div>
                        <div className="mt-4 text-center text-sm">
                            <Link href={switchLinkHref} className="underline">
                                {switchLinkText}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </LiquidGlass>
        </div>
    );
}
