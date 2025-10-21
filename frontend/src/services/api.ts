import axios, { AxiosResponse } from 'axios';
import {
  User,
  Product,
  Category,
  CartItem,
  CartResponse,
  Order,
  Review,
  Wishlist,
  Support,
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ProductFilter,
  DashboardStats,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://robotics-production-8060.up.railway.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: LoginRequest): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    api.post('/login', data),
  
  register: (data: RegisterRequest): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    api.post('/register', data),
  
  logout: (): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/logout'),
  
  getUser: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get('/user'),
  
  updateProfile: (data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.put('/profile', data),
  
  forgotPassword: (email: string): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/forgot-password', { email }),
  
  resetPassword: (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/reset-password', data),
};

// Products API
export const productsAPI = {
  getProducts: (filters?: ProductFilter): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Product>>>> =>
    api.get('/products', { params: filters }),
  
  getProduct: (slug: string): Promise<AxiosResponse<ApiResponse<Product>>> =>
    api.get(`/products/${slug}`),
  
  getFeaturedProducts: (): Promise<AxiosResponse<ApiResponse<Product[]>>> =>
    api.get('/products/featured'),
  
  searchProducts: (query: string): Promise<AxiosResponse<ApiResponse<Product[]>>> =>
    api.get('/products/search', { params: { q: query } }),
  
  // Admin only
  getAdminProducts: (filters?: ProductFilter): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Product>>>> =>
    api.get('/products', { params: filters }), // Temporarily use public endpoint until auth is set up
  
  createProduct: (data: FormData): Promise<AxiosResponse<ApiResponse<Product>>> =>
    api.post('/admin/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updateProduct: (id: number, data: FormData): Promise<AxiosResponse<ApiResponse<Product>>> =>
    api.put(`/admin/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  deleteProduct: (id: number): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/admin/products/${id}`),
  
  uploadProductImages: (id: number, images: FormData): Promise<AxiosResponse<ApiResponse>> =>
    api.post(`/admin/products/${id}/images`, images, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Categories API
export const categoriesAPI = {
  getCategories: (): Promise<AxiosResponse<ApiResponse<Category[]>>> =>
    api.get('/categories', { params: { with_counts: true } }),
  
  getCategory: (slug: string): Promise<AxiosResponse<ApiResponse<Category>>> =>
    api.get(`/categories/${slug}`),
  
  getCategoryProducts: (slug: string, filters?: ProductFilter): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Product>>>> =>
    api.get(`/categories/${slug}/products`, { params: filters }),
  
  // Admin only
  createCategory: (data: FormData): Promise<AxiosResponse<ApiResponse<Category>>> =>
    api.post('/admin/categories', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updateCategory: (id: number, data: FormData): Promise<AxiosResponse<ApiResponse<Category>>> =>
    api.put(`/admin/categories/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  deleteCategory: (id: number): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/admin/categories/${id}`),
  
  uploadCategoryImage: (id: number, image: FormData): Promise<AxiosResponse<ApiResponse>> =>
    api.post(`/admin/categories/${id}/image`, image, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Cart API
export const cartAPI = {
  getCart: (): Promise<AxiosResponse<ApiResponse<CartResponse>>> =>
    api.get('/cart'),
  
  addToCart: (productId: number, quantity: number = 1): Promise<AxiosResponse<ApiResponse<CartItem>>> =>
    api.post('/cart', { product_id: productId, quantity }),
  
  updateCartItem: (id: number, quantity: number): Promise<AxiosResponse<ApiResponse<CartItem>>> =>
    api.put(`/cart/${id}`, { quantity }),
  
  removeFromCart: (id: number): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/cart/${id}`),
  
  clearCart: (): Promise<AxiosResponse<ApiResponse>> =>
    api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  getOrders: (): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Order>>>> =>
    api.get('/orders'),
  
  getOrder: (id: number): Promise<AxiosResponse<ApiResponse<Order>>> =>
    api.get(`/orders/${id}`),
  
  createOrder: (data: any): Promise<AxiosResponse<ApiResponse<Order>>> =>
    api.post('/orders', data),
  
  cancelOrder: (id: number): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/orders/${id}/cancel`),
  
  downloadInvoice: (orderNumber: string): Promise<AxiosResponse<Blob>> =>
    api.get(`/orders/${orderNumber}/invoice`, { responseType: 'blob' }),
  
  // Admin only
  getAdminOrders: (filters?: any): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Order>>>> =>
    api.get('/admin/orders', { params: filters }),
  
  updateOrderStatus: (id: number, status: string): Promise<AxiosResponse<ApiResponse<Order>>> =>
    api.put(`/admin/orders/${id}/status`, { status }),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: (): Promise<AxiosResponse<ApiResponse<Wishlist[]>>> =>
    api.get('/wishlist'),
  
  addToWishlist: (productId: number): Promise<AxiosResponse<ApiResponse<Wishlist>>> =>
    api.post('/wishlist', { product_id: productId }),
  
  removeFromWishlist: (productId: number): Promise<AxiosResponse<ApiResponse>> =>
    api.delete('/wishlist', { data: { product_id: productId } }),
};

// Reviews API
export const reviewsAPI = {
  getMyReviews: (): Promise<AxiosResponse<ApiResponse<Review[]>>> =>
    api.get('/my-reviews'),
  
  createReview: (productId: number, data: { rating: number; comment?: string }): Promise<AxiosResponse<ApiResponse<Review>>> =>
    api.post(`/products/${productId}/reviews`, data),
};

// Support API
export const supportAPI = {
  getTickets: (): Promise<AxiosResponse<ApiResponse<Support[]>>> =>
    api.get('/support'),
  
  getTicket: (id: number): Promise<AxiosResponse<ApiResponse<Support>>> =>
    api.get(`/support/${id}`),
  
  createTicket: (data: { subject: string; message: string; priority?: string }): Promise<AxiosResponse<ApiResponse<Support>>> =>
    api.post('/support', data),
  
  // Admin only
  getAdminTickets: (): Promise<AxiosResponse<ApiResponse<Support[]>>> =>
    api.get('/admin/support'),
  
  replyToTicket: (id: number, reply: string): Promise<AxiosResponse<ApiResponse<Support>>> =>
    api.put(`/admin/support/${id}/reply`, { admin_reply: reply }),
  
  updateTicketStatus: (id: number, status: string): Promise<AxiosResponse<ApiResponse<Support>>> =>
    api.put(`/admin/support/${id}/status`, { status }),
};

// Analytics API (Admin only)
export const analyticsAPI = {
  getDashboardStats: (): Promise<AxiosResponse<ApiResponse<{
    total_products: number;
    total_orders: number;
    total_users: number;
    total_revenue: number;
  }>>> =>
    api.get('/admin/analytics/dashboard'),
};

// Customers API (Admin only)
export const customersAPI = {
  getAll: (params?: {
    status?: string;
    tier?: string;
    search?: string;
  }): Promise<AxiosResponse<ApiResponse<{
    data: any[];
    stats: {
      total_customers: number;
      active_customers: number;
      vip_customers: number;
      total_revenue: number;
    };
  }>>> =>
    api.get('/admin/customers', { params }),
  
  getById: (id: number): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get(`/admin/customers/${id}`),
  
  update: (id: number, data: {
    name?: string;
    email?: string;
    phone?: string;
    is_active?: boolean;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  }): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.put(`/admin/customers/${id}`, data),
  
  updateTier: (id: number, tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip'): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.put(`/admin/customers/${id}/tier`, { tier }),
  
  updateStatus: (id: number, is_active: boolean): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.put(`/admin/customers/${id}/status`, { is_active }),
};

// PayPal API
export const paypalAPI = {
  createPayment: (orderId: number): Promise<AxiosResponse<ApiResponse<{
    paypal_order_id: string;
    approval_url: string;
  }>>> =>
    api.post('/paypal/create-payment', { order_id: orderId }),
  
  capturePayment: (data: {
    paypal_order_id: string;
    order_id: number;
  }): Promise<AxiosResponse<ApiResponse<{
    capture_id: string;
    status: string;
    order: Order;
  }>>> =>
    api.post('/paypal/capture-payment', data),
};

export default api;