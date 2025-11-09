'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

export const AuthModal = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLoginView ? 'Login' : 'Create an Account'}</DialogTitle>
          <DialogDescription>
            {isLoginView ? "You need to be logged in to do that." : "Join the community to share and connect."}
          </DialogDescription>
        </DialogHeader>
        {isLoginView ? <LoginForm /> : <RegisterForm />}
        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? "Don't have an account? Register" : "Already have an account? Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
