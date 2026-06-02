import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext(null);

const TOKEN_KEY = 'gch_admin_token';
const ADMIN_PASSWORD = 'goldcoasthair2026';

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) === 'authenticated';
    } catch {
      return false;
    }
  });
  const isLoading = false;
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    navigate('/admin/login');
  }, [navigate]);

  // No effect needed: auth state is initialized synchronously from localStorage.

  const login = async (password) => {
    try {
      // Simulate a brief network delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem(TOKEN_KEY, 'authenticated');
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Invalid master password.' };
    } catch {
      return { success: false, error: 'An unexpected error occurred during login.' };
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    adminUser: isAuthenticated ? { role: 'admin', name: 'Administrator' } : null
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}

AdminAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};