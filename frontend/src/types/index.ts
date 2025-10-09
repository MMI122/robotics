export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  role: 'admin' | 'customer';
  avatar?: string;
  is_active: boolean;
  last_login_at?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  sku: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  manage_stock: boolean;
  in_stock: boolean;
  images?: string[];
  featured_image?: string;
  weight?: number;
  dimensions?: string;
  category_id: number;
  category?: Category;
  specifications?: Record<string, any>;
  views: number;
  is_featured: boolean;
  is_verified: boolean;
  is_active: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  avg_rating: number;
  review_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Computed properties
  discount_percentage?: number;
  current_price?: number;
  is_on_sale?: boolean;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
  count: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  user?: User;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: 'stripe' | 'paypal' | 'cod';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_id?: string;
  shipping_address: Address;
  billing_address: Address;
  notes?: string;
  shipped_at?: string;
  delivered_at?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface Address {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface Review {
  id: number;
  user_id: number;
  user?: User;
  product_id: number;
  product?: Product;
  order_id?: number;
  rating: number;
  comment?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: number;
  user_id: number;
  product_id: number;
  product?: Product;
  created_at: string;
  updated_at: string;
}

export interface Support {
  id: number;
  ticket_number: string;
  user_id: number;
  user?: User;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  admin_reply?: string;
  replied_at?: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Form Types
export interface ProductFilter {
  category?: string;
  price_min?: number;
  price_max?: number;
  priceRange?: [number, number];
  search?: string;
  sort?: 'name' | 'price' | 'rating' | 'newest';
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface DashboardStats {
  total_products: number;
  total_categories: number;
  total_orders: number;
  total_customers: number;
  total_sales: number;
  pending_orders: number;
  low_stock_products: number;
  recent_orders: Order[];
  popular_products: Product[];
  sales_chart_data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }[];
  };
}