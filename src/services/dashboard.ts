import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  activeUsers: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const [ordersData, productsData, usersData] = await Promise.all([
        supabase.from('orders').select('total_amount, status'),
        supabase.from('products').select('id'),
        supabase.from('users').select('id'),
      ]);

      const totalRevenue = ordersData.data?.reduce((sum, order) => {
        if (order.status === 'delivered' || order.status === 'processing' || order.status === 'shipped') {
          return sum + Number(order.total_amount);
        }
        return sum;
      }, 0) || 0;

      const totalOrders = ordersData.data?.length || 0;
      const totalProducts = productsData.data?.length || 0;
      const activeUsers = usersData.data?.length || 0;

      return {
        totalRevenue,
        totalOrders,
        totalProducts,
        activeUsers,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        activeUsers: 0,
      };
    }
  },

  async getRecentOrders(limit = 5): Promise<RecentOrder[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at, shipping_address')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(order => ({
        id: `#${order.id.slice(0, 8)}`,
        customerName: order.shipping_address?.fullName || 'Guest Customer',
        customerEmail: order.shipping_address?.email || '',
        totalAmount: Number(order.total_amount),
        status: order.status,
        createdAt: new Date(order.created_at).toLocaleDateString('en-NG'),
      }));
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  },
};
