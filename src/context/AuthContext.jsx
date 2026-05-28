import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for session info
    const storedUser = localStorage.getItem('printease_user');
    const storedRole = localStorage.getItem('printease_role');
    const storedToken = localStorage.getItem('printease_token');

    if (storedUser && storedRole) {
      setUser({
        email: storedUser,
        role: storedRole,
        token: storedToken,
        name: storedRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Shop Manager',
      });
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Clean strings
    const trimmedEmail = email.trim().toLowerCase();
    
    if (trimmedEmail === 'superadmin@printease.com' && password === 'SuperAdmin123!') {
      const userData = {
        email: trimmedEmail,
        role: 'SUPER_ADMIN',
        token: 'superadmin-mock-jwt-token-xyz789',
        name: 'Super Admin',
      };
      localStorage.setItem('printease_user', userData.email);
      localStorage.setItem('printease_role', userData.role);
      localStorage.setItem('printease_token', userData.token);
      setUser(userData);
      return { success: true, role: 'SUPER_ADMIN' };
    } 
    
    if (trimmedEmail === 'owner@printease.com' && password === 'Password123!') {
      const userData = {
        email: trimmedEmail,
        role: 'ADMIN',
        token: 'admin-mock-jwt-token-abc123',
        name: 'Campus Quick Print Manager',
        shopId: 'a90b4d45-ff1a-4643-982c-d9c087b322a3', // Linked to Campus Quick Print by default
        shopSlug: 'campus-quick-print'
      };
      localStorage.setItem('printease_user', userData.email);
      localStorage.setItem('printease_role', userData.role);
      localStorage.setItem('printease_token', userData.token);
      setUser(userData);
      return { success: true, role: 'ADMIN' };
    }

    // Dynamic login for dynamically registered shop admins
    const registeredShops = JSON.parse(localStorage.getItem('printease_shops') || '[]');
    const matchingShop = registeredShops.find(s => s.adminEmail?.toLowerCase() === trimmedEmail);
    if (matchingShop && password === 'Password123!') { // Standard password for demo
      const userData = {
        email: trimmedEmail,
        role: 'ADMIN',
        token: `admin-mock-jwt-${matchingShop.id}`,
        name: matchingShop.adminName || 'Shop Manager',
        shopId: matchingShop.id,
        shopSlug: matchingShop.slug
      };
      localStorage.setItem('printease_user', userData.email);
      localStorage.setItem('printease_role', userData.role);
      localStorage.setItem('printease_token', userData.token);
      setUser(userData);
      return { success: true, role: 'ADMIN' };
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  const logout = () => {
    localStorage.removeItem('printease_user');
    localStorage.removeItem('printease_role');
    localStorage.removeItem('printease_token');
    setUser(null);
  };

  const changePassword = (currentPassword, newPassword) => {
    // In a mock environment, we will simulate successful password updates
    if (user.role === 'SUPER_ADMIN' && currentPassword !== 'SuperAdmin123!') {
      return { success: false, error: 'Current password is incorrect.' };
    }
    if (user.role === 'ADMIN' && currentPassword !== 'Password123!') {
      return { success: false, error: 'Current password is incorrect.' };
    }
    // Success simulation
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
