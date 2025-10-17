import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Rating,
  Button,
  IconButton,
  Chip,
  Paper,
  Tabs,
  Tab,
  Divider,
  Breadcrumbs,
  Link,
  CardMedia,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Compare as CompareIcon,
  ShoppingCart as CartIcon,
  ZoomIn as ZoomInIcon,
  NavigateNext as NavigateNextIcon,
  Verified as VerifiedIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProduct } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/products/ProductCard';
import { getProductImageUrl } from '../utils/imageUtils';

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
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  
  const { currentProduct: product, loading, error } = useAppSelector((state) => state.products);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Fetch product data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [id, dispatch]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
  }, [product]);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={50} />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // Product not found
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Product not found
        </Alert>
      </Container>
    );
  }

  // Get product images array, fallback to featured_image if no images array
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.featured_image 
      ? [product.featured_image] 
      : ['/api/placeholder/600/600'];

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product.id,
      quantity,
    }));
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product.id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const quantityIncrease = () => setQuantity(prev => prev + 1);
  const quantityDecrease = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 4 }}
      >
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/products">Products</Link>
        <Link color="inherit" href={`/category/${product.category?.slug || 'products'}`}>
          {product.category?.name || 'Products'}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="500"
              image={getProductImageUrl(productImages[selectedImage])}
              alt={product.name}
              sx={{ 
                borderRadius: 2,
                mb: 2,
                cursor: 'zoom-in',
                objectFit: 'cover'
              }}
            />
            
            {/* Zoom overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
                p: 1,
                cursor: 'pointer'
              }}
            >
              <ZoomInIcon sx={{ color: 'white' }} />
            </Box>
          </Box>

          {/* Thumbnail images */}
          {productImages.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
              {productImages.map((image, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  height="80"
                  image={getProductImageUrl(image)}
                  alt={`${product.name} ${index + 1}`}
                  sx={{
                    minWidth: 80,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid' : '2px solid transparent',
                    borderColor: selectedImage === index ? 'primary.main' : 'transparent'
                  }}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.avg_rating || 0} precision={0.1} readOnly />
            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
              ({product.review_count || 0} reviews)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {formatPrice(product.sale_price || product.price)}
            </Typography>
            {product.sale_price && product.sale_price < product.price && (
              <Typography 
                variant="h5" 
                sx={{ 
                  ml: 2, 
                  textDecoration: 'line-through', 
                  color: 'text.secondary' 
                }}
              >
                {formatPrice(product.price)}
              </Typography>
            )}
          </Box>

          {/* Stock Status */}
          <Box sx={{ mb: 2 }}>
            <Chip
              label={product.in_stock ? 'In Stock' : 'Out of Stock'}
              color={product.in_stock ? 'success' : 'error'}
              size="small"
            />
          </Box>

          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            {product.description}
          </Typography>

          {/* Quantity Selector */}
          {product.in_stock && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Quantity:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                  onClick={quantityDecrease}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="h6">{quantity}</Typography>
                <IconButton onClick={quantityIncrease}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {product.in_stock && (
              <Button
                variant="contained"
                size="large"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                sx={{ flex: 1 }}
              >
                Add to Cart
              </Button>
            )}
            <IconButton onClick={handleAddToWishlist} size="large">
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton size="large">
              <ShareIcon />
            </IconButton>
            <IconButton size="large">
              <CompareIcon />
            </IconButton>
          </Box>

          {/* Product Guarantees */}
          <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <VerifiedIcon color="primary" sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Authentic Product Guarantee
              </Typography>
            </Box>
          </Paper>

          {/* Feature Chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            <Chip icon={<ShippingIcon />} label="Free Shipping" variant="outlined" />
            <Chip icon={<SecurityIcon />} label="Secure Payment" variant="outlined" />
            <Chip icon={<VerifiedIcon />} label="Authentic" variant="outlined" />
          </Box>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Specifications" />
          <Tab label="Features" />
          <Tab label="Reviews" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {product.specifications && Object.keys(product.specifications).length > 0 ? (
            <Grid container spacing={2}>
              {Object.entries(product.specifications).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {key}:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value}
                    </Typography>
                  </Box>
                  <Divider />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No specifications available for this product.
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {product.short_description || product.description ? (
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {product.short_description || product.description}
            </Typography>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No additional details available for this product.
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1" color="text.secondary">
            Reviews will be available soon.
          </Typography>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;