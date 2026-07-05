import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Track if the initial session check has already run to avoid StrictMode double-fire
  const initialized = useRef(false);

  // On mount, prime the CSRF cookie first, then check the existing session.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let cancelled = false;
    const checkSession = async () => {
      try {
        // Silently prime CSRF token — ignore errors
        await api.csrf().catch(() => {});
        const userData = await api.me();
        if (!cancelled) setUser(userData);
      } catch {
        // 401 = no valid session — that's fine
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    checkSession();
    return () => { cancelled = true; };
  }, []);

  // Listen for token-expired events dispatched by api.js interceptor.
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      // Don't redirect if we're already on the login page — that would
      // cause an infinite hard-reload loop.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = async (email, password) => {
    try {
      await api.login(email, password);
      const userData = await api.me();
      setUser(userData);
      return { success: true, role: userData.role };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Best-effort — clear local state regardless
    }
    setUser(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.changePassword(currentPassword, newPassword);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, changePassword, loading: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
