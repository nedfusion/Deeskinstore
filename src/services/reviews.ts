import { supabase } from '../lib/supabase';

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    full_name: string;
  };
  product?: {
    name: string;
  };
}

export const reviewsService = {
  async getAll(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (
          email,
          full_name
        ),
        products (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByProductId(productId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (
          email,
          full_name
        )
      `)
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(review: {
    product_id: string;
    user_id?: string;
    rating: number;
    comment?: string;
  }) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: review.product_id,
        user_id: review.user_id || null,
        rating: review.rating,
        comment: review.comment || null,
        is_approved: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async approve(reviewId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(reviewId: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
  },
};
