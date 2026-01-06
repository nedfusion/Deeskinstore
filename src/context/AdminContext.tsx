import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, Permission } from '../types/admin';
import { supabase } from '../lib/supabase';

interface AdminState {
  currentAdmin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AdminContextType {
  state: AdminState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

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
  moderator: defaultPermissions.filter(p => p.category !== 'users'),
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AdminState>({
    currentAdmin: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const adminData = localStorage.getItem('adminUser');
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        const permissions = rolePermissions[admin.role as keyof typeof rolePermissions] || [];
        setState({
          currentAdmin: {
            ...admin,
            permissions,
            createdAt: new Date(admin.createdAt),
            lastLogin: admin.lastLogin ? new Date(admin.lastLogin) : undefined,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('adminUser');
        setState({ currentAdmin: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setState({ currentAdmin: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new Error('Invalid email or password');
      if (!authData.user) throw new Error('Invalid email or password');

      // Fetch admin record using the authenticated user's ID
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', authData.user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (adminError) throw new Error('Failed to fetch admin data');
      if (!adminData) throw new Error('Admin account not found or inactive');

      const permissions = rolePermissions[adminData.role as keyof typeof rolePermissions] || [];
      const [firstName, ...lastNameParts] = adminData.full_name.split(' ');

      const adminUser: AdminUser = {
        id: adminData.id,
        email: adminData.email,
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        role: adminData.role,
        permissions,
        isActive: adminData.is_active,
        createdAt: new Date(adminData.created_at),
        lastLogin: new Date(),
      };

      localStorage.setItem('adminUser', JSON.stringify(adminUser));

      setState({
        currentAdmin: adminUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('adminUser');
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