import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  ContactSupport as ContactIcon,
  ShoppingCart as CartIcon,
  Category as CategoryIcon,
  Lightbulb as LightbulbIcon,
  Refresh as RefreshIcon,
  SmartToy as RobotIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFoundContainer = styled(Box)(({ theme }) => ({
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%)`,
}));

const RobotAnimation = styled(Box)(({ theme }) => ({
  fontSize: '120px',
  color: theme.palette.primary.main,
  animation: 'float 3s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
  },
}));

const SuggestionCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

interface SuggestedPage {
  title: string;
  description: string;
  path: string;
  image: string;
  category: string;
  popular?: boolean;
}

interface QuickLink {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const NotFoundPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);

  // Extract attempted path for better error messaging
  const attemptedPath = location.pathname;

  // Countdown for auto-redirect
  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoRedirect && countdown === 0) {
      navigate('/');
    }
  }, [countdown, autoRedirect, navigate]);

  const suggestedPages: SuggestedPage[] = [
    {
      title: 'Arduino Microcontrollers',
      description: 'Explore our complete collection of Arduino boards and compatible microcontrollers',
      path: '/categories/microcontrollers',
      image: '/api/placeholder/300/200',
      category: 'Electronics',
      popular: true
    },
    {
      title: 'Robot Kits',
      description: 'Ready-to-build robot kits for beginners and advanced makers',
      path: '/categories/robot-kits',
      image: '/api/placeholder/300/200',
      category: 'Robotics'
    },
    {
      title: 'Sensors & Components',
      description: 'High-quality sensors and electronic components for your projects',
      path: '/categories/sensors',
      image: '/api/placeholder/300/200',
      category: 'Components',
      popular: true
    },
    {
      title: 'Programming Guides',
      description: 'Learn robotics programming with our comprehensive tutorials',
      path: '/resources/guides',
      image: '/api/placeholder/300/200',
      category: 'Learning'
    }
  ];

  const quickLinks: QuickLink[] = [
    {
      title: 'Browse All Products',
      description: 'Explore our complete product catalog',
      path: '/products',
      icon: <CategoryIcon />
    },
    {
      title: 'Shopping Cart',
      description: 'View items in your cart',
      path: '/cart',
      icon: <CartIcon />
    },
    {
      title: 'Customer Support',
      description: 'Get help from our support team',
      path: '/support',
      icon: <ContactIcon />
    },
    {
      title: 'Learning Resources',
      description: 'Tutorials and guides for robotics',
      path: '/resources',
      icon: <LightbulbIcon />
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const stopAutoRedirect = () => {
    setAutoRedirect(false);
  };

  return (
    <Box>
      <NotFoundContainer>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <RobotAnimation>
                <RobotIcon fontSize="inherit" />
              </RobotAnimation>
              
              <Typography variant="h1" component="h1" sx={{ 
                fontSize: { xs: '3rem', md: '4rem' },
                fontWeight: 700,
                color: 'text.primary',
                mb: 2 
              }}>
                404
              </Typography>
              
              <Typography variant="h4" component="h2" gutterBottom sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 2
              }}>
                Oops! Page Not Found
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                The page <code style={{ 
                  background: theme.palette.grey[200], 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  color: theme.palette.error.main
                }}>{attemptedPath}</code> you're looking for doesn't exist. 
                But don't worry, we have plenty of amazing robotics products to explore!
              </Typography>

              {/* Auto-redirect countdown */}
              {autoRedirect && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Redirecting to home page in {countdown} seconds...
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={stopAutoRedirect}
                  >
                    Cancel Auto-redirect
                  </Button>
                </Box>
              )}

              {/* Search Box */}
              <Box sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search for products, guides, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleSearch}
                    sx={{ minWidth: 'auto', px: 3 }}
                  >
                    <SearchIcon />
                  </Button>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                >
                  Go to Homepage
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<RefreshIcon />}
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </NotFoundContainer>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            Quick Links
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {quickLinks.map((link, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SuggestionCard onClick={() => navigate(link.path)}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Box sx={{ color: 'primary.main', mb: 2 }}>
                        <Box sx={{ fontSize: 'large' }}>{link.icon}</Box>
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {link.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {link.description}
                      </Typography>
                    </CardContent>
                  </SuggestionCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Suggested Pages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            You Might Be Looking For
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {suggestedPages.map((page, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SuggestionCard onClick={() => navigate(page.path)}>
                    {page.popular && (
                      <Chip
                        label="Popular"
                        color="primary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 1,
                        }}
                      />
                    )}
                    <CardMedia
                      component="img"
                      height="140"
                      image={page.image}
                      alt={page.title}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label={page.category} 
                          size="small" 
                          variant="outlined" 
                          sx={{ mr: 1 }}
                        />
                        {page.popular && (
                          <Chip 
                            label="🔥 Hot" 
                            size="small" 
                            color="error"
                          />
                        )}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {page.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {page.description}
                      </Typography>
                    </CardContent>
                  </SuggestionCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            py: 4, 
            px: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            borderRadius: 2,
            color: 'white'
          }}>
            <ContactIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Still Can't Find What You're Looking For?
            </Typography>
            <Typography variant="body1" paragraph sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Our customer support team is here to help you find exactly what you need. 
              Whether it's a specific product, technical assistance, or general questions about robotics.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 3 }}>
              <Button
                variant="contained"
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                startIcon={<ContactIcon />}
                onClick={() => navigate('/contact')}
              >
                Contact Support
              </Button>
              <Button
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                onClick={() => navigate('/faq')}
              >
                View FAQ
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Common Issues */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box sx={{ mt: 6, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Common Reasons for This Error:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LightbulbIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Mistyped URL" 
                  secondary="Double-check the URL for any typos or missing characters"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LightbulbIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Outdated Bookmark" 
                  secondary="The page may have moved to a new location"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LightbulbIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Removed Product" 
                  secondary="The product might no longer be available"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LightbulbIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Temporary Issue" 
                  secondary="Try refreshing the page or clearing your browser cache"
                />
              </ListItem>
            </List>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotFoundPage;