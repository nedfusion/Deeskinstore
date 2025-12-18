import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const productsService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(product => ({
      id: product.id,
      name: product.name,
      brand: 'Various',
      sizes: ['Standard'],
      categories: [product.category],
      description: product.description,
      picture: product.image,
      price: product.price,
      inStock: product.stock > 0,
      rating: product.rating,
      reviewCount: 0,
      skinConcerns: [],
      skinTypes: [],
      ingredients: [],
      isPopular: product.rating >= 4.5,
      isNew: false,
    }));
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      brand: 'Various',
      sizes: ['Standard'],
      categories: [data.category],
      description: data.description,
      picture: data.image,
      price: data.price,
      inStock: data.stock > 0,
      rating: data.rating,
      reviewCount: 0,
      skinConcerns: [],
      skinTypes: [],
      ingredients: [],
      isPopular: data.rating >= 4.5,
      isNew: false,
    };
  },

  async getAllAdmin(): Promise<any[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(product: {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
  }) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, product: {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    category?: string;
    stock?: number;
    is_active?: boolean;
  }) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },
};
