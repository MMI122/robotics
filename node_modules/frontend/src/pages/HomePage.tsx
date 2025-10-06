import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  Card,
  CardContent,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Whatshot as TrendingIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  LocalOffer as OfferIcon,
  Inventory as CategoryIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useAppDispatch, useAppSelector } from '../hooks/redux.ts';
import type { RootState } from '../store/index.ts';
import { fetchFeaturedProducts, fetchProducts } from '../store/slices/productsSlice.ts';
import { fetchCategories } from '../store/slices/categoriesSlice.ts';
import type { Category, Product } from '../types/index.ts';
import ProductCard from '../components/products/ProductCard.tsx';
import CategoryCard from '../components/categories/CategoryCard.tsx';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();

  const {
    featuredProducts,
    products,
    loading: productsLoading,
  } = useAppSelector((state: RootState) => state.products);
  
  const {
    categories,
    loading: categoriesLoading,
  } = useAppSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchProducts({}));
    dispatch(fetchCategories());
  }, [dispatch]);

  const heroSlides = [
    {
      id: 1,
      title: 'Build Your Dream Robot',
      subtitle: 'Premium robotics components and kits for every skill level',
      image: '/images/hero-robot-1.jpg',
      cta: 'Shop Now',
      link: '/products',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 2,
      title: 'Advanced Sensors & Controllers',
      subtitle: 'Cutting-edge technology for your next innovation',
      image: '/images/hero-sensors.jpg',
      cta: 'Explore',
      link: '/products?category=sensors',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 3,
      title: 'Educational Robotics Kits',
      subtitle: 'Perfect for learning and teaching robotics concepts',
      image: '/images/hero-education.jpg',
      cta: 'Learn More',
      link: '/products?category=educational',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  ];

  const featuredSections = [
    {
      title: 'Featured Products',
      subtitle: 'Hand-picked products for robotics enthusiasts',
      icon: <StarIcon />,
      products: featuredProducts,
    },
    {
      title: 'Trending Now',
      subtitle: 'Most popular items this month',
      icon: <TrendingIcon />,
      products: products.slice(0, 4),
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '80vh' },
          overflow: 'hidden',
        }}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          effect="fade"
          loop
          style={{ height: '100%' }}
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <Box
                sx={{
                  height: '100%',
                  background: slide.gradient,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `url(${slide.image}) center/cover`,
                    opacity: 0.3,
                    zIndex: 0,
                  },
                }}
              >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          color: 'white',
                          textAlign: { xs: 'center', md: 'left' },
                        }}
                      >
                        <Typography
                          variant="h2"
                          sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            animation: 'slideInUp 1s ease-out',
                          }}
                        >
                          {slide.title}
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            mb: 4,
                            fontSize: { xs: '1.2rem', md: '1.5rem' },
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                            animation: 'slideInUp 1s ease-out 0.3s both',
                          }}
                        >
                          {slide.subtitle}
                        </Typography>
                        <Button
                          component={Link}
                          to={slide.link}
                          variant="contained"
                          size="large"
                          endIcon={<ArrowIcon />}
                          sx={{
                            py: 2,
                            px: 4,
                            fontSize: '1.1rem',
                            borderRadius: 3,
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            '&:hover': {
                              background: 'rgba(255,255,255,0.3)',
                              transform: 'translateY(-2px)',
                            },
                            animation: 'slideInUp 1s ease-out 0.6s both',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {slide.cta}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Container>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Shop by Category
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Explore our comprehensive range of robotics components and kits
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {categoriesLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
            : categories.slice(0, 6).map((category: Category) => (
                <Grid item xs={6} sm={4} md={2} key={category.id}>
                  <CategoryCard category={category} />
                </Grid>
              ))
          }
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            component={Link}
            to="/categories"
            variant="outlined"
            size="large"
            endIcon={<ArrowIcon />}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            View All Categories
          </Button>
        </Box>
      </Container>

      {/* Featured Products Sections */}
      {featuredSections.map((section, sectionIndex) => (
        <Box
          key={sectionIndex}
          sx={{
            py: 8,
            backgroundColor: sectionIndex % 2 === 0 ? 'grey.50' : 'white',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 6,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                      color: 'white',
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>
                <Typography variant="h6" color="text.secondary">
                  {section.subtitle}
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/products"
                variant="outlined"
                endIcon={<ArrowIcon />}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                View All
              </Button>
            </Box>

            <Grid container spacing={3}>
              {productsLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card>
                        <Skeleton variant="rectangular" height={240} />
                        <CardContent>
                          <Skeleton variant="text" height={60} />
                          <Skeleton variant="text" height={40} />
                          <Skeleton variant="text" height={30} />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                : section.products.slice(0, 4).map((product: Product) => (
                    <Grid item xs={12} sm={6} md={3} key={product.id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))
              }
            </Grid>
          </Container>
        </Box>
      ))}

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Why Choose RoboticsShop?
                </Typography>
                <Grid container spacing={3}>
                  {[
                    {
                      icon: <StarIcon sx={{ fontSize: 40 }} />,
                      title: 'Premium Quality',
                      description: 'Only the best components from trusted manufacturers',
                    },
                    {
                      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
                      title: 'Latest Technology',
                      description: 'Cutting-edge robotics technology and innovations',
                    },
                    {
                      icon: <OfferIcon sx={{ fontSize: 40 }} />,
                      title: 'Best Prices',
                      description: 'Competitive pricing with regular discounts',
                    },
                    {
                      icon: <CategoryIcon sx={{ fontSize: 40 }} />,
                      title: 'Wide Selection',
                      description: 'Thousands of products for every robotics need',
                    },
                  ].map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ color: 'secondary.main' }}>{feature.icon}</Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 400,
                  borderRadius: 3,
                  background: 'url(/images/robotics-workshop.jpg) center/cover',
                  border: '4px solid rgba(255,255,255,0.2)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.100' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Stay Updated with Latest Robotics Trends
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Subscribe to our newsletter for product updates, tutorials, and exclusive offers
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                gap: 2,
                maxWidth: 500,
                mx: 'auto',
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196f3, #1976d2)',
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;