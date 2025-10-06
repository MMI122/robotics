import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFilter } from '../../types';

interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  searchResults: Product[];
  currentProduct: Product | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
  filters: ProductFilter;
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list';
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  searchResults: [],
  currentProduct: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 12,
    total: 0,
    from: 0,
    to: 0,
  },
  filters: {},
  loading: false,
  searchLoading: false,
  error: null,
  viewMode: 'grid',
  sortBy: 'name',
  sortDirection: 'asc',
};

// Mock async thunks for now - replace with real API calls later
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: any = {}) => {
    // Mock data for now
    return {
      data: [],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 12,
        total: 0,
        from: 0,
        to: 0,
      }
    };
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async () => {
    // Mock data for now
    return [];
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string) => {
    // Mock data for now
    return [];
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilter>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortDirection = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch featured products';
      })
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message || 'Failed to search products';
      });
  },
});

export const { setFilters, clearFilters, setViewMode, setSortBy, setSortDirection } = productsSlice.actions;
export default productsSlice.reducer;