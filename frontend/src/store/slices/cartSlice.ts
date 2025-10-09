import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem, CartResponse } from '../../types';
import { cartAPI } from '../../services/api';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
  isOpen: false,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }: { productId: number; quantity?: number }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(productId, quantity);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }: { id: number; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(id, quantity);
      return response.data.data!;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id: number, { rejectWithValue }) => {
    try {
      await cartAPI.removeFromCart(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        // The API returns CartResponse: { items: CartItem[], total: number, count: number }
        const cartData = action.payload as CartResponse;
        const items = cartData.items || [];
        state.items = items;
        state.totalItems = cartData.count || 0;
        state.totalPrice = cartData.total || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
        if (existingItem) {
          existingItem.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        // Recalculate totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = state.items.reduce((total, item) => {
          const price = Number(item.product?.sale_price || item.product?.price || 0);
          return total + (price * item.quantity);
        }, 0);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Recalculate totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = state.items.reduce((total, item) => {
          const price = Number(item.product?.sale_price || item.product?.price || 0);
          return total + (price * item.quantity);
        }, 0);
      })
      
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        // Recalculate totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = state.items.reduce((total, item) => {
          const price = Number(item.product?.sale_price || item.product?.price || 0);
          return total + (price * item.quantity);
        }, 0);
      })
      
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      });
  },
});

export const { toggleCart, closeCart, openCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;