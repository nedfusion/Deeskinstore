import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AdminUser, Permission } from '../types/admin';

interface AdminState {
  currentAdmin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AdminContextType {
  state: AdminState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

// Default permissions
const defaultPermissions: Permission[] = [
  { id: 'products.view', name: 'View Products', description: 'View product listings', category: 'products' },
  { id: 'products.create', name: 'Create Products', description: 'Add new products', category: 'products' },
  { id: 'products.edit', name: 'Edit Products', description: 'Modify existing products', category: 'products' },
  { id: 'products.delete', name: 'Delete Products', description: 'Remove products', category: 'products' },
  { id: 'orders.view', name: 'View Orders', description: 'View order listings', category: 'orders' },
  { id: 'orders.edit', name: 'Edit Orders', description: 'Modify order status', category: 'orders' },
  { id: 'orders.reviews', name: 'Manage Reviews', description: 'Moderate order reviews', category: 'orders' },
  { id: 'users.view', name: 'View Users', description: 'View user listings', category: 'users' },
  { id: 'users.create', name: 'Create Users', description: 'Add new admin users', category: 'users' },
  { id: 'users.edit', name: 'Edit Users', description: 'Modify user permissions', category: 'users' },
  { id: 'analytics.view', name: 'View Analytics', description: 'Access analytics dashboard', category: 'analytics' },
];

const rolePermissions = {
  super_admin: defaultPermissions,
  admin: defaultPermissions.filter(p => !p.id.includes('users.create')),
  manager: defaultPermissions.filter(p => p.category !== 'users'),
  editor: defaultPermissions.filter(p => p.category === 'products' || p.category === 'orders'),
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AdminState>({
    currentAdmin: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Mock admin login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAdmin: AdminUser = {
        id: '1',
        email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'super_admin',
        permissions: rolePermissions.super_admin,
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      setState({
        currentAdmin: mockAdmin,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    setState({
      currentAdmin: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.currentAdmin) return false;
    return state.currentAdmin.permissions.some(p => p.id === permission);
  };

  return (
    <AdminContext.Provider value={{ state, login, logout, hasPermission }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};