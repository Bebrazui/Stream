'use client';

import { LoginForm } from "@/components/auth/login-form";
import { AuthPage } from "@/components/auth/auth-page";

export default function LoginPage() {
    return (
        <AuthPage 
            title="Welcome Back!"
            description="Log in to continue sharing and connecting."
            formComponent={<LoginForm />}
            switchLinkHref="/register"
            switchLinkText="Don't have an account? Register"
        />
    );
}
