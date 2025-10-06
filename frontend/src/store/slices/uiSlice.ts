import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface UIState {
  isLoading: boolean;
  sidebarOpen: boolean;
  cartDrawerOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  searchQuery: string;
  filters: {
    isOpen: boolean;
    category: string;
    priceRange: [number, number];
    rating: number;
    inStock: boolean;
  };
  modal: {
    isOpen: boolean;
    type: string | null;
    data: any;
  };
  quickView: {
    isOpen: boolean;
    product: any;
  };
  currency: 'BDT' | 'USD';
  language: 'en' | 'bn';
}

const initialState: UIState = {
  isLoading: false,
  sidebarOpen: false,
  cartDrawerOpen: false,
  theme: 'light',
  notifications: [],
  searchQuery: '',
  filters: {
    isOpen: false,
    category: '',
    priceRange: [0, 100000],
    rating: 0,
    inStock: false,
  },
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  quickView: {
    isOpen: false,
    product: null,
  },
  currency: 'BDT',
  language: 'en',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.cartDrawerOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleFilters: (state) => {
      state.filters.isOpen = !state.filters.isOpen;
    },
    setFilters: (state, action: PayloadAction<Partial<UIState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        isOpen: false,
        category: '',
        priceRange: [0, 100000],
        rating: 0,
        inStock: false,
      };
    },
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    openQuickView: (state, action: PayloadAction<any>) => {
      state.quickView = {
        isOpen: true,
        product: action.payload,
      };
    },
    closeQuickView: (state) => {
      state.quickView = {
        isOpen: false,
        product: null,
      };
    },
    setCurrency: (state, action: PayloadAction<'BDT' | 'USD'>) => {
      state.currency = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'bn'>) => {
      state.language = action.payload;
    },
  },
});

export const {
  setLoading,
  toggleSidebar,
  setSidebarOpen,
  toggleCartDrawer,
  setCartDrawerOpen,
  toggleTheme,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setSearchQuery,
  toggleFilters,
  setFilters,
  resetFilters,
  openModal,
  closeModal,
  openQuickView,
  closeQuickView,
  setCurrency,
  setLanguage,
} = uiSlice.actions;

export default uiSlice.reducer;