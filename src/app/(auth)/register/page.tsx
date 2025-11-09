'use client';

import { RegisterForm } from "@/components/auth/register-form";
import { AuthPage } from "@/components/auth/auth-page";

export default function RegisterPage() {
    return (
        <AuthPage 
            title="Join Stream"
            description="Create an account to start your journey."
            formComponent={<RegisterForm />}
            switchLinkHref="/login"
            switchLinkText="Already have an account? Login"
        />
    );
}
