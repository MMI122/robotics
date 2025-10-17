import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  Skeleton,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  NavigateNext as NavigateNextIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { getCategoryImageUrl } from '../utils/imageUtils';
import { Category } from '../types';

const CategoriesHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(6, 0),
  marginBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  border: '1px solid rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '& .category-image': {
      transform: 'scale(1.1)',
    },
  },
}));

const CategoriesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { categories, loading } = useAppSelector((state) => state.categories);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/products?category=${categorySlug}`);
  };

  return (
    <Box>
      {/* Categories Header */}
      <CategoriesHeader>
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
              <Typography sx={{ color: 'white' }}>Categories</Typography>
            </Breadcrumbs>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  <CategoryIcon sx={{ mr: 2, fontSize: 'inherit', verticalAlign: 'middle' }} />
                  All Categories
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
                  Explore our comprehensive range of robotics components, kits, and accessories
                </Typography>
                <Chip 
                  label={`${categories.length} Categories Available`} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </CategoriesHeader>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search Bar */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search categories..."
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
                maxWidth: 500,
                mx: 'auto',
                display: 'block',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          {/* Categories Grid */}
          {loading ? (
            <Grid container spacing={3}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
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
          ) : filteredCategories.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CategoryIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                {searchQuery ? 'No categories found' : 'No categories available'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Categories will appear here when available'
                }
              </Typography>
              {searchQuery && (
                <Button variant="outlined" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredCategories.map((category) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <StyledCard onClick={() => handleCategoryClick(category.slug)}>
                      <CardMedia
                        component="img"
                        height={200}
                        image={getCategoryImageUrl(category.image)}
                        alt={category.name}
                        className="category-image"
                        sx={{
                          transition: 'transform 0.3s ease',
                          objectFit: 'cover',
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                          {category.description || 'Explore our collection of high-quality products'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip 
                            label={`${category.products_count || 0} Products`} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                          />
                          <Button 
                            variant="text" 
                            size="small"
                            sx={{ fontWeight: 600 }}
                          >
                            View Products →
                          </Button>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default CategoriesPage;