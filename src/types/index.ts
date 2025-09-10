export interface Product {
  id: string;
  name: string;
  brand: string;
  sizes: string[];
  categories: string[];
  description: string;
  picture: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  skinConcerns: string[];
  skinTypes: string[];
  ingredients: string[];
  isPopular?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  orderHistory: Order[];
}

export interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: Address;
  billingAddress: Address;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  featuredImage: string;
  tags: string[];
  category: string;
}

export interface Consultation {
  id: string;
  userId: string;
  date: Date;
  time: string;
  type: 'virtual' | 'in-person';
  skinConcerns: string[];
  currentRoutine: string;
  goals: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface GiftCard {
  id: string;
  code: string;
  value: number;
  balance: number;
  isActive: boolean;
  expiresAt: Date;
  purchasedBy: string;
  purchasedAt: Date;
}