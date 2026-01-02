import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      (async () => {
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (userData) {
            const [firstName, ...lastNameParts] = userData.full_name.split(' ');
            setState({
              user: {
                id: userData.id,
                email: userData.email,
                firstName: firstName || '',
                lastName: lastNameParts.join(' ') || '',
                phone: userData.phone || undefined,
                addresses: [],
                orderHistory: [],
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            setState({ user: null, isAuthenticated: false, isLoading: false });
          }
        } else {
          setState({ user: null, isAuthenticated: false, isLoading: false });
        }
      })();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (userData) {
            const [firstName, ...lastNameParts] = userData.full_name.split(' ');
            setState({
              user: {
                id: userData.id,
                email: userData.email,
                firstName: firstName || '',
                lastName: lastNameParts.join(' ') || '',
                phone: userData.phone || undefined,
                addresses: [],
                orderHistory: [],
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            setState({ user: null, isAuthenticated: false, isLoading: false });
          }
        } else {
          setState({ user: null, isAuthenticated: false, isLoading: false });
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (userData) {
          const [firstName, ...lastNameParts] = userData.full_name.split(' ');
          setState({
            user: {
              id: userData.id,
              email: userData.email,
              firstName: firstName || '',
              lastName: lastNameParts.join(' ') || '',
              phone: userData.phone || undefined,
              addresses: [],
              orderHistory: [],
            },
            isAuthenticated: true,
            isLoading: false,
          });
        }
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (userData: Partial<User>) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email || '',
        password: userData.password || '',
      });

      if (authError) throw authError;

      if (authData.user) {
        const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: userData.email || '',
            full_name: fullName,
            phone: userData.phone || null,
          });

        if (insertError) throw insertError;

        setState({
          user: {
            id: authData.user.id,
            email: userData.email || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone,
            addresses: [],
            orderHistory: [],
          },
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};