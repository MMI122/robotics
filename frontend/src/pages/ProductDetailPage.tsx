import React, { useState } from 'react';
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
  useMediaQuery
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
import { useAppDispatch } from '../hooks/redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/products/ProductCard';

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
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Mock product data - replace with actual API call
  const product = {
    id: 1,
    name: "Advanced AI Robot Kit",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviewCount: 124,
    availability: "In Stock",
    images: [
      "/api/placeholder/600/600",
      "/api/placeholder/600/600",
      "/api/placeholder/600/600",
      "/api/placeholder/600/600",
    ],
    description: "Complete AI robot kit with advanced sensors and programmable features. Perfect for educational purposes and hobbyist projects.",
    features: [
      "Advanced AI processing unit",
      "Multiple sensors (ultrasonic, camera, gyroscope)",
      "Programmable via Python and Scratch",
      "Wireless connectivity (WiFi, Bluetooth)",
      "Rechargeable battery - 8 hours runtime",
      "Comprehensive documentation and tutorials"
    ],
    specifications: {
      "Processor": "ARM Cortex-A72 quad-core",
      "Memory": "4GB RAM, 32GB Storage",
      "Sensors": "Camera, Ultrasonic, Gyroscope, Accelerometer",
      "Connectivity": "WiFi 802.11ac, Bluetooth 5.0",
      "Battery": "7.4V 2500mAh Li-Po",
      "Dimensions": "25 x 20 x 15 cm",
      "Weight": "1.2 kg"
    },
    colors: ["Red", "Blue", "Black", "White"],
    sizes: ["Standard", "Pro", "Educational"],
    category: "AI Robots",
    tags: ["AI", "Educational", "Programming", "Sensors"]
  };

  const reviews = [
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      comment: "Excellent robot kit! Very educational and fun to work with.",
      date: "2024-01-15"
    },
    {
      id: 2,
      user: "Jane Smith", 
      rating: 4,
      comment: "Great quality but documentation could be better.",
      date: "2024-01-10"
    }
  ];

  const relatedProducts = [
    {
      id: 2,
      name: "Smart Sensor Module",
      price: 49.99,
      image: "/api/placeholder/300/300",
      rating: 4.5
    },
    {
      id: 3,
      name: "Robot Programming Guide",
      price: 29.99,
      image: "/api/placeholder/300/300", 
      rating: 4.7
    },
    {
      id: 4,
      name: "Advanced Camera Module",
      price: 79.99,
      image: "/api/placeholder/300/300",
      rating: 4.6
    }
  ];

  const handleAddToCart = () => {
    dispatch(addToCart({
      productId: product.id,
      quantity
    }));
  };

  const handleAddToWishlist = () => {
    dispatch(addToWishlist(product.id));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 4 }}
      >
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/products">Products</Link>
        <Link color="inherit" href={`/category/${product.category}`}>
          {product.category}
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
              image={product.images[selectedImage]}
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
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
            {product.images.map((image, index) => (
              <CardMedia
                key={index}
                component="img"
                height="80"
                image={image}
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
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.1} readOnly />
            <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
              ({product.reviewCount} reviews)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ${product.price}
            </Typography>
            {product.originalPrice && (
              <Typography 
                variant="h5" 
                sx={{ 
                  ml: 2, 
                  textDecoration: 'line-through', 
                  color: 'text.secondary' 
                }}
              >
                ${product.originalPrice}
              </Typography>
            )}
          </Box>

          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            {product.description}
          </Typography>

          {/* Quantity Selector */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Quantity:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="h6">{quantity}</Typography>
              <IconButton onClick={() => setQuantity(quantity + 1)}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CartIcon />}
              onClick={handleAddToCart}
              sx={{ flex: 1 }}
            >
              Add to Cart
            </Button>
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
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {product.features.map((feature, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant="body1">{feature}</Typography>
            </Paper>
          ))}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Customer Reviews ({reviews.length})
            </Typography>
            {reviews.map((review) => (
              <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {review.user}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.date}
                  </Typography>
                </Box>
                <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                <Typography variant="body2">{review.comment}</Typography>
              </Paper>
            ))}
          </Box>
        </TabPanel>
      </Box>

      {/* Related Products */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Related Products
        </Typography>
        <Grid container spacing={3}>
          {relatedProducts.map((relatedProduct) => (
            <Grid item xs={12} sm={6} md={4} key={relatedProduct.id}>
              <ProductCard product={relatedProduct as any} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;