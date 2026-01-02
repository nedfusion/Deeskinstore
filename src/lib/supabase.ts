import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      admins: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          full_name: string;
          role: 'super_admin' | 'admin' | 'moderator';
          is_active: boolean;
          created_at: string;
          last_login: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category: string;
          stock: number;
          rating: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category: string;
          stock?: number;
          rating?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image?: string;
          category?: string;
          stock?: number;
          rating?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          total_amount: number;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          payment_reference: string | null;
          shipping_address: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          total_amount: number;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          payment_reference?: string | null;
          shipping_address: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          total_amount?: number;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          payment_reference?: string | null;
          shipping_address?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          quantity: number;
          price: number;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          rating: number;
          comment: string | null;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id?: string | null;
          rating: number;
          comment?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string | null;
          rating?: number;
          comment?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
