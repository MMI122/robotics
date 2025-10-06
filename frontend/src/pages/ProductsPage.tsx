import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  Skeleton,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Sort as SortIcon,
  GridView as GridIcon,
  ViewList as ListIcon,
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux.ts';
import type { RootState } from '../store/index.ts';
import { fetchProducts, searchProducts } from '../store/slices/productsSlice.ts';
import { fetchCategories } from '../store/slices/categoriesSlice.ts';
import type { Category, Product } from '../types/index.ts';
import ProductCard from '../components/products/ProductCard.tsx';

const ProductsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    products,
    pagination,
    loading: productsLoading,
  } = useAppSelector((state: RootState) => state.products);
  
  const {
    categories,
    loading: categoriesLoading,
  } = useAppSelector((state: RootState) => state.categories);

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    priceRange: [0, 10000] as [number, number],
    sortBy: searchParams.get('sort') || 'name',
    sortDirection: searchParams.get('sort_direction') || 'asc',
    inStock: searchParams.get('in_stock') === 'true',
    featured: searchParams.get('featured') === 'true',
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    const { priceRange, ...otherFilters } = filters;
    const params = {
      page: currentPage,
      per_page: 12,
      ...otherFilters,
      price_min: priceRange[0],
      price_max: priceRange[1],
    };

    if (filters.search) {
      dispatch(searchProducts(filters.search));
    } else {
      dispatch(fetchProducts(params));
    }
  }, [dispatch, filters, currentPage]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        if (key === 'priceRange' && Array.isArray(value)) {
          params.set('price_min', value[0].toString());
          params.set('price_max', value[1].toString());
        } else if (typeof value === 'string' || typeof value === 'number') {
          params.set(key, value.toString());
        }
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key: string, value: any) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setFilterDrawerOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      priceRange: [0, 10000] as [number, number],
      sortBy: 'name',
      sortDirection: 'asc',
      inStock: false,
      featured: false,
    };
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: tempFilters.search }));
    setCurrentPage(1);
  };

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'created_at', label: 'Newest' },
    { value: 'avg_rating', label: 'Rating' },
    { value: 'views', label: 'Popularity' },
  ];

  const FilterContent = () => (
    <Box sx={{ p: 3, minWidth: { xs: 280, md: 320 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Filters
        </Typography>
        <Button
          onClick={clearFilters}
          startIcon={<ClearIcon />}
          size="small"
          sx={{ textTransform: 'none' }}
        >
          Clear All
        </Button>
      </Box>

      {/* Search */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={tempFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="outlined"
          fullWidth
          sx={{ textTransform: 'none' }}
        >
          Search
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Category Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={tempFilters.category}
          label="Category"
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category: Category) => (
            <MenuItem key={category.id} value={category.slug}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Price Range: ${tempFilters.priceRange[0]} - ${tempFilters.priceRange[1]}
        </Typography>
        <Slider
          value={tempFilters.priceRange}
          onChange={(_, value) => handleFilterChange('priceRange', value)}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={50}
          valueLabelFormat={(value) => `$${value}`}
        />
      </Box>

      {/* Sort Options */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={tempFilters.sortBy}
          label="Sort By"
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Order</InputLabel>
        <Select
          value={tempFilters.sortDirection}
          label="Order"
          onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <Chip
          label="In Stock Only"
          clickable
          color={tempFilters.inStock ? 'primary' : 'default'}
          onClick={() => handleFilterChange('inStock', !tempFilters.inStock)}
        />
        <Chip
          label="Featured Only"
          clickable
          color={tempFilters.featured ? 'primary' : 'default'}
          onClick={() => handleFilterChange('featured', !tempFilters.featured)}
        />
      </Box>

      {/* Apply Filters Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={applyFilters}
        sx={{
          textTransform: 'none',
          py: 1.5,
          borderRadius: 2,
        }}
      >
        Apply Filters
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
          Products
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover our comprehensive range of robotics components and kits
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Desktop Filters Sidebar */}
        {!isMobile && (
          <Grid item md={3}>
            <Paper elevation={1} sx={{ position: 'sticky', top: 100 }}>
              <FilterContent />
            </Paper>
          </Grid>
        )}

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {/* Toolbar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              {pagination && (
                <Typography variant="body1" color="text.secondary">
                  Showing {((pagination.currentPage - 1) * pagination.perPage) + 1}-
                  {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of{' '}
                  {pagination.total} products
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Mobile Filter Button */}
              {isMobile && (
                <IconButton
                  onClick={() => setFilterDrawerOpen(true)}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <FilterIcon />
                </IconButton>
              )}

              {/* View Mode Toggle */}
              <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => setViewMode('grid')}
                  sx={{
                    color: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
                    borderRadius: 0,
                  }}
                >
                  <GridIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setViewMode('list')}
                  sx={{
                    color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
                    borderRadius: 0,
                  }}
                >
                  <ListIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Active Filters */}
          {(filters.search || filters.category || filters.inStock || filters.featured) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Active Filters:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filters.search && (
                  <Chip
                    label={`Search: "${filters.search}"`}
                    onDelete={() => setFilters(prev => ({ ...prev, search: '' }))}
                    size="small"
                  />
                )}
                {filters.category && (
                  <Chip
                    label={`Category: ${categories.find((c: Category) => c.slug === filters.category)?.name || filters.category}`}
                    onDelete={() => setFilters(prev => ({ ...prev, category: '' }))}
                    size="small"
                  />
                )}
                {filters.inStock && (
                  <Chip
                    label="In Stock Only"
                    onDelete={() => setFilters(prev => ({ ...prev, inStock: false }))}
                    size="small"
                  />
                )}
                {filters.featured && (
                  <Chip
                    label="Featured Only"
                    onDelete={() => setFilters(prev => ({ ...prev, featured: false }))}
                    size="small"
                  />
                )}
              </Box>
            </Box>
          )}

          {/* Products Grid */}
          {productsLoading ? (
            <Grid container spacing={3}>
              {Array.from({ length: 12 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={index}>
                  <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : products.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {products.map((product: Product) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={viewMode === 'grid' ? 4 : 12}
                    key={product.id}
                  >
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {pagination && pagination.lastPage > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pagination.lastPage}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search criteria or browse our categories
              </Typography>
              <Button
                variant="contained"
                onClick={clearFilters}
                sx={{ textTransform: 'none' }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: { width: '100vw', maxWidth: 400 },
        }}
      >
        <FilterContent />
      </Drawer>
    </Container>
  );
};

export default ProductsPage;