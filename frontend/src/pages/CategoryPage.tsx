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
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Skeleton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ShoppingCart as CartIcon,
  FavoriteBorder as FavoriteBorderIcon,
  NavigateNext as NavigateNextIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';

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

const CategoryHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(6, 0),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(0, 0, 4, 4),
}));

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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  subcategories?: Category[];
  isPopular: boolean;
}

interface CategoryStats {
  totalProducts: number;
  averagePrice: number;
  topBrands: string[];
  popularTags: string[];
}

const CategoryPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      
      setTimeout(() => {
        // Mock category data based on slug
        const categoryData: { [key: string]: any } = {
          'microcontrollers': {
            category: {
              id: '1',
              name: 'Microcontrollers',
              slug: 'microcontrollers',
              description: 'Powerful microcontroller boards for your robotics and electronics projects. From Arduino to Raspberry Pi, find the perfect brain for your next creation.',
              image: '/api/placeholder/800/400',
              productCount: 45,
              isPopular: true
            },
            subcategories: [
              { id: '1a', name: 'Arduino Boards', slug: 'arduino-boards', description: 'Official Arduino boards and compatibles', image: '/api/placeholder/300/200', productCount: 23, isPopular: true },
              { id: '1b', name: 'Raspberry Pi', slug: 'raspberry-pi', description: 'Single-board computers for advanced projects', image: '/api/placeholder/300/200', productCount: 12, isPopular: true },
              { id: '1c', name: 'ESP32/ESP8266', slug: 'esp-boards', description: 'WiFi-enabled microcontrollers', image: '/api/placeholder/300/200', productCount: 8, isPopular: false },
              { id: '1d', name: 'STM32', slug: 'stm32', description: 'High-performance ARM microcontrollers', image: '/api/placeholder/300/200', productCount: 6, isPopular: false }
            ],
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
                name: 'ESP32 Development Board',
                slug: 'esp32-dev-board',
                description: 'WiFi and Bluetooth enabled microcontroller for IoT projects.',
                price: 15.99,
                originalPrice: 19.99,
                images: ['/api/placeholder/400/300'],
                category: 'Microcontrollers',
                brand: 'Espressif',
                rating: 4.6,
                reviewCount: 67,
                stock: 78,
                isOnSale: true,
                isFeatured: false,
                tags: ['wifi', 'iot', 'bluetooth']
              }
            ],
            stats: {
              totalProducts: 45,
              averagePrice: 42.30,
              topBrands: ['Arduino', 'Raspberry Pi', 'Espressif', 'Adafruit'],
              popularTags: ['beginner-friendly', 'wifi-enabled', 'educational', 'professional']
            }
          },
          'sensors': {
            category: {
              id: '2',
              name: 'Sensors',
              slug: 'sensors',
              description: 'Complete range of sensors for robotics, IoT, and automation projects. From basic switches to advanced environmental monitoring.',
              image: '/api/placeholder/800/400',
              productCount: 67,
              isPopular: true
            },
            subcategories: [
              { id: '2a', name: 'Distance Sensors', slug: 'distance-sensors', description: 'Ultrasonic, laser, and IR distance sensors', image: '/api/placeholder/300/200', productCount: 15, isPopular: true },
              { id: '2b', name: 'Environmental', slug: 'environmental-sensors', description: 'Temperature, humidity, and air quality sensors', image: '/api/placeholder/300/200', productCount: 18, isPopular: true },
              { id: '2c', name: 'Motion & Position', slug: 'motion-sensors', description: 'Accelerometers, gyroscopes, and encoders', image: '/api/placeholder/300/200', productCount: 12, isPopular: false },
              { id: '2d', name: 'Light & Color', slug: 'light-sensors', description: 'Photoresistors, RGB sensors, and cameras', image: '/api/placeholder/300/200', productCount: 22, isPopular: false }
            ],
            products: [
              {
                id: '4',
                name: 'Ultrasonic Distance Sensor HC-SR04',
                slug: 'ultrasonic-sensor-hc-sr04',
                description: 'Accurate distance measurement from 2cm to 400cm.',
                price: 8.99,
                originalPrice: 12.99,
                images: ['/api/placeholder/400/300'],
                category: 'Sensors',
                brand: 'Generic',
                rating: 4.5,
                reviewCount: 67,
                stock: 156,
                isOnSale: true,
                isFeatured: true,
                tags: ['distance', 'ultrasonic']
              }
            ],
            stats: {
              totalProducts: 67,
              averagePrice: 18.75,
              topBrands: ['Adafruit', 'SparkFun', 'Seeed Studio', 'DFRobot'],
              popularTags: ['precise', 'calibrated', 'arduino-compatible', 'digital']
            }
          }
        };

        const data = categoryData[slug || 'microcontrollers'] || categoryData['microcontrollers'];
        
        setCategory(data.category);
        setSubcategories(data.subcategories);
        setProducts(data.products);
        setStats(data.stats);
        setTotalPages(Math.ceil(data.products.length / 12));
        setLoading(false);
      }, 1000);
    };

    fetchCategoryData();
  }, [slug]);

  const filteredProducts = products.filter(product =>
    searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
      default: // featured
        return b.isFeatured ? 1 : -1;
    }
  });

  const paginatedProducts = sortedProducts.slice((page - 1) * 12, page * 12);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={300} sx={{ mb: 4, borderRadius: 2 }} />
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
      </Container>
    );
  }

  if (!category) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Category Not Found</Typography>
        <Button variant="contained" onClick={() => navigate('/products')}>
          Browse All Products
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      {/* Category Header */}
      <CategoryHeader>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumbs */}
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              sx={{ mb: 3, color: 'rgba(255,255,255,0.8)' }}
            >
              <Link component={RouterLink} to="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
                Home
              </Link>
              <Link component={RouterLink} to="/products" sx={{ color: 'inherit', textDecoration: 'none' }}>
                Products
              </Link>
              <Typography sx={{ color: 'white' }}>{category.name}</Typography>
            </Breadcrumbs>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  {category.name}
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
                  {category.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${category.productCount} Products`} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  {category.isPopular && (
                    <Chip 
                      label="Popular Category" 
                      icon={<TrendingIcon />}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  )}
                  {stats && (
                    <Chip 
                      label={`Avg. $${stats.averagePrice.toFixed(2)}`} 
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                      Category Stats
                    </Typography>
                    {stats && (
                      <List dense>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText 
                            primary="Total Products" 
                            secondary={stats.totalProducts.toString()}
                            primaryTypographyProps={{ color: 'rgba(255,255,255,0.8)' }}
                            secondaryTypographyProps={{ color: 'white', fontWeight: 600 }}
                          />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText 
                            primary="Top Brands" 
                            secondary={stats.topBrands.slice(0, 3).join(', ')}
                            primaryTypographyProps={{ color: 'rgba(255,255,255,0.8)' }}
                            secondaryTypographyProps={{ color: 'white', fontWeight: 600 }}
                          />
                        </ListItem>
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </CategoryHeader>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Subcategories */}
          {subcategories && subcategories.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Browse by Subcategory
              </Typography>
              <Grid container spacing={3}>
                {subcategories.map((subcat) => (
                  <Grid item xs={12} sm={6} md={3} key={subcat.id}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <StyledCard onClick={() => navigate(`/category/${subcat.slug}`)}>
                        <CardMedia
                          component="img"
                          height="160"
                          image={subcat.image}
                          alt={subcat.name}
                        />
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {subcat.name}
                            </Typography>
                            {subcat.isPopular && (
                              <Chip label="Popular" size="small" color="primary" />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {subcat.description}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {subcat.productCount} products
                          </Typography>
                        </CardContent>
                      </StyledCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Search and Controls */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder={`Search in ${category.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
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
                      <MenuItem value="featured">Featured</MenuItem>
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

          {/* Results Info */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </Typography>
            {stats && stats.popularTags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Popular:
                </Typography>
                {stats.popularTags.slice(0, 3).map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            )}
          </Box>

          {/* Products Grid */}
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

          {/* Pagination */}
          {filteredProducts.length > 12 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredProducts.length / 12)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search terms or browse all products
              </Typography>
              <Button variant="outlined" onClick={() => navigate('/products')}>
                Browse All Products
              </Button>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default CategoryPage;