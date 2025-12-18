import { supabase } from '../lib/supabase';

export interface OrderWithItems {
  id: string;
  user_id: string | null;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_reference: string | null;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  items?: any[];
  user?: any;
}

export const ordersService = {
  async getAll(): Promise<OrderWithItems[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product_id,
          products (
            id,
            name,
            image
          )
        ),
        users (
          id,
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByUserId(userId: string): Promise<OrderWithItems[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product_id,
          products (
            id,
            name,
            image
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(order: {
    user_id?: string;
    total_amount: number;
    payment_reference?: string;
    shipping_address: any;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
  }) {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: order.user_id || null,
        total_amount: order.total_amount,
        payment_reference: order.payment_reference || null,
        shipping_address: order.shipping_address,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = order.items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return orderData;
  },

  async updateStatus(orderId: string, status: OrderWithItems['status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getStats() {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_amount, status, created_at');

    if (error) throw error;

    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    const totalOrders = orders?.length || 0;
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
    const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0;

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
    };
  },
};
