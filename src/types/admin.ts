export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'editor';
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'products' | 'orders' | 'users' | 'analytics' | 'settings';
}

export interface OrderManagement extends Order {
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes: string[];
  trackingNumber?: string;
}

export interface ProductFormData {
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  categories: string[];
  skinConcerns: string[];
  skinTypes: string[];
  ingredients: string[];
  picture: string;
  inStock: boolean;
  isPopular: boolean;
  isNew: boolean;
}

export interface OrderReview {
  id: string;
  orderId: string;
  customerId: string;
  rating: number;
  comment: string;
  productId: string;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: Date;
  adminResponse?: string;
}