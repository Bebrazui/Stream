'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void; 
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Basic in-memory cache for user session
let userCache: User | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(userCache);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a session from IndexedDB on initial load
    const checkSession = async () => {
      try {
        // In a real app, you'd use a library like `idb-keyval`
        const storedUser = localStorage.getItem('user-session');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          userCache = userData;
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
        // Clear corrupted session data
        localStorage.removeItem('user-session');
      } finally {
        setIsLoading(false);
      }
    };

    if (!userCache) {
      checkSession();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('user-session', JSON.stringify(userData));
    setUser(userData);
    userCache = userData;
  };

  const logout = () => {
    localStorage.removeItem('user-session');
    setUser(null);
    userCache = null;
    // Optionally, redirect or refresh the page
    window.location.href = '/home'; // Redirect to a public page after logout
  };
  
  const updateUser = (userData: User) => {
    // This function can be expanded to also update the backend.
    // For now, it just updates the local state and cache.
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user-session', JSON.stringify(updatedUser));
    setUser(updatedUser);
    userCache = updatedUser;
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
