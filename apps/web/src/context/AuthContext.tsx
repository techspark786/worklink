"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'WORKER' | 'COOPERATIVE_ADMIN' | 'FEDERATION_ADMIN';
  phone?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
    city?: string;
  };
  isVerified?: boolean;
  workerProfile?: any;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  getDashboardUrl: (role?: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getDashboardUrl = (role?: string) => {
    const targetRole = role || user?.role;
    switch (targetRole) {
      case 'WORKER':
        return '/worker/dashboard';
      case 'COOPERATIVE_ADMIN':
        return '/admin/dashboard';
      case 'FEDERATION_ADMIN':
        return '/federation/dashboard';
      case 'CUSTOMER':
      default:
        return '/customer/dashboard';
    }
  };

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('shramsetu_token');
      const savedUserStr = localStorage.getItem('shramsetu_user');

      if (savedToken && savedUserStr) {
        const parsedUser = JSON.parse(savedUserStr);
        setToken(savedToken);
        setUser(parsedUser);

        // Verify/refresh user from backend
        fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.user) {
              const refreshed = { ...data.user, workerProfile: data.workerProfile || data.user.workerProfile };
              setUser(refreshed);
              localStorage.setItem('shramsetu_user', JSON.stringify(refreshed));
            }
          })
          .catch(() => {
            // Keep local copy if offline
          });
      }
    } catch (e) {
      console.error('Error hydrating auth state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: UserProfile) => {
    setToken(newToken);
    setUser(newUser);
    try {
      localStorage.setItem('shramsetu_token', newToken);
      localStorage.setItem('shramsetu_user', JSON.stringify(newUser));
    } catch (e) {
      console.error('Failed to persist auth state:', e);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('shramsetu_token');
      localStorage.removeItem('shramsetu_user');
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed to clear auth state:', e);
    }
    router.push('/login');
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const updated = { ...data.user, workerProfile: data.workerProfile || data.user.workerProfile };
          setUser(updated);
          localStorage.setItem('shramsetu_user', JSON.stringify(updated));
        }
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        refreshUser,
        getDashboardUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
