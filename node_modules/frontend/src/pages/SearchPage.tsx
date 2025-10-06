import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Chip,
  IconButton,
  Rating,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Skeleton,
  Alert,
  Autocomplete,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ShoppingCart as CartIcon,
  FavoriteBorder as FavoriteBorderIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  },
}));

const SearchHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(4, 0),
  marginBottom: theme.spacing(4),
}));

const SuggestionChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isOnSale: boolean;
  isFeatured: boolean;
  tags: string[];
}

interface SearchResult {
  products: Product[];
  totalResults: number;
  suggestions: string[];
  relatedQueries: string[];
  categories: Array<{ name: string; count: number }>;
  brands: Array<{ name: string; count: number }>;
}

const SearchPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularSearches] = useState([
    'Arduino Uno', 'Raspberry Pi', 'Servo Motor', 'Ultrasonic Sensor',
    'Robot Kit', 'LED Strip', 'Breadboard', 'Jumper Wires'
  ]);

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q') || '';
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    
    // Add to search history
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Simulate API call
    setTimeout(() => {
      const mockResults: SearchResult = {
        products: [
          {
            id: '1',
            name: 'Arduino Uno R3 Microcontroller Board',
            slug: 'arduino-uno-r3',
            description: 'The most popular Arduino board, perfect for beginners and professionals alike.',
            price: 29.99,
            originalPrice: 34.99,
            images: ['/api/placeholder/400/300'],
            category: 'Microcontrollers',
            brand: 'Arduino',
            rating: 4.8,
            reviewCount: 124,
            stock: 45,
            isOnSale: true,
            isFeatured: true,
            tags: ['beginner-friendly', 'popular']
          },
          {
            id: '2',
            name: 'Raspberry Pi 4 Model B 8GB',
            slug: 'raspberry-pi-4-8gb',
            description: 'Latest Raspberry Pi with 8GB RAM for demanding applications.',
            price: 89.99,
            images: ['/api/placeholder/400/300'],
            category: 'Microcontrollers',
            brand: 'Raspberry Pi',
            rating: 4.9,
            reviewCount: 89,
            stock: 23,
            isOnSale: false,
            isFeatured: true,
            tags: ['advanced', 'ai-ready']
          },
          {
            id: '3',
            name: 'Arduino Nano Every',
            slug: 'arduino-nano-every',
            description: 'Compact Arduino board with enhanced features.',
            price: 12.99,
            originalPrice: 15.99,
            images: ['/api/placeholder/400/300'],
            category: 'Microcontrollers',
            brand: 'Arduino',
            rating: 4.6,
            reviewCount: 67,
            stock: 78,
            isOnSale: true,
            isFeatured: false,
            tags: ['compact', 'enhanced']
          }
        ],
        totalResults: 47,
        suggestions: ['Arduino Mega', 'Arduino Leonardo', 'Arduino Pro Mini'],
        relatedQueries: ['microcontroller boards', 'arduino shields', 'raspberry pi accessories'],
        categories: [
          { name: 'Microcontrollers', count: 23 },
          { name: 'Sensors', count: 12 },
          { name: 'Components', count: 8 },
          { name: 'Robot Kits', count: 4 }
        ],
        brands: [
          { name: 'Arduino', count: 18 },
          { name: 'Adafruit', count: 12 },
          { name: 'SparkFun', count: 9 },
          { name: 'Seeed Studio', count: 8 }
        ]
      };

      setSearchResults(mockResults);
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    const params = new URLSearchParams();
    params.set('q', query);
    navigate(`/search?${params.toString()}`);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    navigate('/search');
  };

  const sortedProducts = searchResults?.products ? [...searchResults.products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return b.id.localeCompare(a.id);
      default: // relevance
        return b.isFeatured ? 1 : -1;
    }
  }) : [];

  const paginatedProducts = sortedProducts.slice((page - 1) * 12, page * 12);

  return (
    <Box>
      {/* Search Header */}
      <SearchHeader>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              Search Products
            </Typography>
            
            {/* Search Bar */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Autocomplete
                  freeSolo
                  options={[...searchHistory, ...popularSearches]}
                  value={searchQuery}
                  onInputChange={(_, value) => setSearchQuery(value || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      placeholder="Search for Arduino, Raspberry Pi, sensors..."
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'white',
                          borderRadius: 3,
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                          <InputAdornment position="end">
                            <IconButton onClick={clearSearch} size="small">
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleSearch()}
                  disabled={!searchQuery.trim()}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                    borderRadius: 3,
                    px: 4
                  }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>

            {/* Search Suggestions */}
            {!searchQuery && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                  Popular searches:
                </Typography>
                <Box>
                  {popularSearches.slice(0, 6).map((search) => (
                    <SuggestionChip
                      key={search}
                      label={search}
                      onClick={() => handleSearch(search)}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </motion.div>
        </Container>
      </SearchHeader>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search Results */}
          {searchResults && (
            <>
              {/* Results Info */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Search Results for "{searchQuery}"
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Found {searchResults.totalResults} products
                </Typography>

                {/* Related Suggestions */}
                {searchResults.suggestions.length > 0 && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Did you mean:
                    </Typography>
                    <Box>
                      {searchResults.suggestions.map((suggestion) => (
                        <Chip
                          key={suggestion}
                          label={suggestion}
                          variant="outlined"
                          size="small"
                          onClick={() => handleSearch(suggestion)}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Alert>
                )}

                {/* Tabs */}
                <Paper sx={{ mb: 3 }}>
                  <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label={`Products (${searchResults.totalResults})`} />
                    <Tab label={`Categories (${searchResults.categories.length})`} />
                    <Tab label={`Brands (${searchResults.brands.length})`} />
                  </Tabs>
                </Paper>
              </Box>

              <TabPanel value={tabValue} index={0}>
                {/* Products Tab */}
                {/* Controls */}
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography variant="body1" color="text.secondary">
                        Showing {paginatedProducts.length} of {searchResults.totalResults} products
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <FormControl sx={{ minWidth: 150 }}>
                          <InputLabel>Sort by</InputLabel>
                          <Select
                            value={sortBy}
                            label="Sort by"
                            onChange={(e) => setSortBy(e.target.value)}
                          >
                            <MenuItem value="relevance">Relevance</MenuItem>
                            <MenuItem value="newest">Newest</MenuItem>
                            <MenuItem value="price-low">Price: Low to High</MenuItem>
                            <MenuItem value="price-high">Price: High to Low</MenuItem>
                            <MenuItem value="rating">Rating</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                          </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton
                            onClick={() => setViewMode('grid')}
                            color={viewMode === 'grid' ? 'primary' : 'default'}
                          >
                            <ViewModuleIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => setViewMode('list')}
                            color={viewMode === 'list' ? 'primary' : 'default'}
                          >
                            <ViewListIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Products Grid */}
                {loading ? (
                  <Grid container spacing={3}>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                          <Skeleton variant="rectangular" height={200} />
                          <CardContent>
                            <Skeleton variant="text" />
                            <Skeleton variant="text" width="60%" />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <AnimatePresence>
                    <Grid container spacing={3}>
                      {paginatedProducts.map((product) => (
                        <Grid
                          item
                          xs={12}
                          sm={viewMode === 'grid' ? 6 : 12}
                          md={viewMode === 'grid' ? 3 : 12}
                          key={product.id}
                        >
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                          >
                            <StyledCard onClick={() => navigate(`/products/${product.slug}`)}>
                              {viewMode === 'grid' ? (
                                <>
                                  <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.images[0]}
                                    alt={product.name}
                                  />
                                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography gutterBottom variant="h6" component="h2" sx={{ 
                                        fontWeight: 600,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                      }}>
                                        {product.name}
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Rating value={product.rating} readOnly size="small" precision={0.1} />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                          ({product.reviewCount})
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                          ${product.price.toFixed(2)}
                                        </Typography>
                                        {product.originalPrice && (
                                          <Typography 
                                            variant="body2" 
                                            sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                          >
                                            ${product.originalPrice.toFixed(2)}
                                          </Typography>
                                        )}
                                        {product.isOnSale && (
                                          <Chip label="Sale" size="small" color="error" />
                                        )}
                                      </Box>
                                    </Box>
                                    <Button
                                      variant="contained"
                                      fullWidth
                                      startIcon={<CartIcon />}
                                      disabled={product.stock === 0}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Add to cart logic
                                      }}
                                    >
                                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </Button>
                                  </CardContent>
                                </>
                              ) : (
                                <Box sx={{ display: 'flex', p: 2 }}>
                                  <CardMedia
                                    component="img"
                                    sx={{ width: 150, height: 150, borderRadius: 2, mr: 2 }}
                                    image={product.images[0]}
                                    alt={product.name}
                                  />
                                  <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                      {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                      {product.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <Rating value={product.rating} readOnly size="small" precision={0.1} />
                                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        ({product.reviewCount} reviews)
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                          ${product.price.toFixed(2)}
                                        </Typography>
                                        {product.originalPrice && (
                                          <Typography 
                                            variant="body2" 
                                            sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                          >
                                            ${product.originalPrice.toFixed(2)}
                                          </Typography>
                                        )}
                                        {product.isOnSale && (
                                          <Chip label="Sale" size="small" color="error" />
                                        )}
                                      </Box>
                                      <Button
                                        variant="contained"
                                        startIcon={<CartIcon />}
                                        disabled={product.stock === 0}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Add to cart logic
                                        }}
                                      >
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                      </Button>
                                    </Box>
                                  </Box>
                                </Box>
                              )}
                            </StyledCard>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </AnimatePresence>
                )}

                {/* Pagination */}
                {searchResults.totalResults > 12 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={Math.ceil(searchResults.totalResults / 12)}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {/* Categories Tab */}
                <Grid container spacing={3}>
                  {searchResults.categories.map((category) => (
                    <Grid item xs={12} sm={6} md={4} key={category.name}>
                      <Card sx={{ cursor: 'pointer' }} onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {category.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {category.count} products
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                {/* Brands Tab */}
                <Grid container spacing={3}>
                  {searchResults.brands.map((brand) => (
                    <Grid item xs={12} sm={6} md={4} key={brand.name}>
                      <Card sx={{ cursor: 'pointer' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {brand.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {brand.count} products
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              {/* Related Queries */}
              {searchResults.relatedQueries.length > 0 && (
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Related Searches
                  </Typography>
                  <Box>
                    {searchResults.relatedQueries.map((query) => (
                      <Chip
                        key={query}
                        label={query}
                        variant="outlined"
                        onClick={() => handleSearch(query)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}

          {/* No Search Results */}
          {!loading && searchQuery && searchResults && searchResults.totalResults === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                No products found for "{searchQuery}"
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try different keywords or browse our categories
              </Typography>
              <Button variant="outlined" onClick={() => navigate('/products')}>
                Browse All Products
              </Button>
            </Box>
          )}

          {/* Search History & Popular Searches */}
          {!searchQuery && (
            <Grid container spacing={4}>
              {searchHistory.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Recent Searches
                      </Typography>
                      <List>
                        {searchHistory.slice(0, 5).map((search, index) => (
                          <ListItem 
                            key={index} 
                            button 
                            onClick={() => handleSearch(search)}
                            sx={{ borderRadius: 1 }}
                          >
                            <ListItemText primary={search} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      <TrendingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Popular Searches
                    </Typography>
                    <List>
                      {popularSearches.slice(0, 8).map((search, index) => (
                        <ListItem 
                          key={index} 
                          button 
                          onClick={() => handleSearch(search)}
                          sx={{ borderRadius: 1 }}
                        >
                          <ListItemText primary={search} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default SearchPage;