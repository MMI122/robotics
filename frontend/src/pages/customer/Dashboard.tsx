import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ShoppingBag,
  FavoriteBorder,
  AccountBox,
  Notifications,
  LocalShipping,
  Star,
  TrendingUp,
  Edit,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import CustomerSidebar from '../../components/dashboards/CustomerSidebar';

const CustomerDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: any) => state.auth);

  // Mock data for dashboard
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 24,
    pendingOrders: 3,
    completedOrders: 21,
    totalSpent: 15420,
    wishlistItems: 12,
    reviewsGiven: 18,
    loyaltyPoints: 2850,
  });

  const [recentOrders] = useState([
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 1250,
      items: 3,
      image: '/api/placeholder/60/60',
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-12',
      status: 'processing',
      total: 890,
      items: 2,
      image: '/api/placeholder/60/60',
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-10',
      status: 'shipped',
      total: 2340,
      items: 5,
      image: '/api/placeholder/60/60',
    },
  ]);

  const [recommendations] = useState([
    {
      id: 1,
      name: 'Arduino Uno R3',
      price: 25.99,
      image: '/api/placeholder/120/120',
      rating: 4.8,
      discount: 15,
    },
    {
      id: 2,
      name: 'ESP32 DevKit',
      price: 12.50,
      image: '/api/placeholder/120/120',
      rating: 4.9,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultrasonic Sensor',
      price: 8.99,
      image: '/api/placeholder/120/120',
      rating: 4.7,
      discount: 10,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return { color: '#10b981', bg: alpha('#10b981', 0.1) };
      case 'processing':
        return { color: '#f59e0b', bg: alpha('#f59e0b', 0.1) };
      case 'shipped':
        return { color: '#3b82f6', bg: alpha('#3b82f6', 0.1) };
      default:
        return { color: '#6b7280', bg: alpha('#6b7280', 0.1) };
    }
  };

  const loyaltyProgress = (dashboardStats.loyaltyPoints % 1000) / 10;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <CustomerSidebar open={false} onClose={() => {}} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  mr: 3,
                  background: 'linear-gradient(45deg, #0ea5e9, #06b6d4)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #1e293b, #475569)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome back, {user?.name || 'Customer'}!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Here's what's happening with your account
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => navigate('/customer/profile')}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Edit Profile
              </Button>
            </Box>

            {/* Loyalty Progress */}
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '16px',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Loyalty Points: {dashboardStats.loyaltyPoints}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {1000 - (dashboardStats.loyaltyPoints % 1000)} points to next reward
                    </Typography>
                  </Box>
                  <Star sx={{ fontSize: '3rem', opacity: 0.8 }} />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={loyaltyProgress}
                  sx={{
                    mt: 2,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha('#fff', 0.2),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#fff',
                      borderRadius: 4,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: alpha('#0ea5e9', 0.2),
                  background: alpha('#0ea5e9', 0.05),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(14, 165, 233, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ShoppingBag sx={{ color: '#0ea5e9', mr: 2, fontSize: '2rem' }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0ea5e9' }}>
                      {dashboardStats.totalOrders}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Orders
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: alpha('#10b981', 0.2),
                  background: alpha('#10b981', 0.05),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp sx={{ color: '#10b981', mr: 2, fontSize: '2rem' }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                      ${dashboardStats.totalSpent.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Spent
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: alpha('#f59e0b', 0.2),
                  background: alpha('#f59e0b', 0.05),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(245, 158, 11, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalShipping sx={{ color: '#f59e0b', mr: 2, fontSize: '2rem' }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                      {dashboardStats.pendingOrders}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Pending Orders
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: alpha('#ec4899', 0.2),
                  background: alpha('#ec4899', 0.05),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(236, 72, 153, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FavoriteBorder sx={{ color: '#ec4899', mr: 2, fontSize: '2rem' }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#ec4899' }}>
                      {dashboardStats.wishlistItems}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Wishlist Items
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {/* Recent Orders */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ borderRadius: '16px', height: 'fit-content' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Orders
                    </Typography>
                    <Button
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/customer/orders')}
                      sx={{ textTransform: 'none' }}
                    >
                      View All
                    </Button>
                  </Box>

                  {recentOrders.map((order, index) => {
                    const statusStyle = getStatusColor(order.status);
                    return (
                      <Box key={order.id}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            py: 2,
                            cursor: 'pointer',
                            borderRadius: '8px',
                            px: 2,
                            mx: -2,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                            },
                          }}
                          onClick={() => navigate(`/customer/orders/${order.id}`)}
                        >
                          <Box
                            component="img"
                            src={order.image}
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '8px',
                              mr: 2,
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Order {order.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.items} items • {order.date}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right', mr: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              ${order.total}
                            </Typography>
                            <Chip
                              label={order.status}
                              size="small"
                              sx={{
                                bgcolor: statusStyle.bg,
                                color: statusStyle.color,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                              }}
                            />
                          </Box>
                          <ArrowForward sx={{ color: 'text.secondary' }} />
                        </Box>
                        {index < recentOrders.length - 1 && (
                          <Divider sx={{ my: 1 }} />
                        )}
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>

            {/* Recommendations */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ borderRadius: '16px', height: 'fit-content' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Recommended for You
                  </Typography>

                  {recommendations.map((product) => (
                    <Box
                      key={product.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.5),
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(14, 165, 233, 0.15)',
                        },
                      }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '8px',
                          mr: 2,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Star sx={{ color: '#fbbf24', fontSize: '1rem', mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            {product.rating}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#10b981' }}>
                            ${product.price}
                          </Typography>
                          {product.discount > 0 && (
                            <Chip
                              label={`-${product.discount}%`}
                              size="small"
                              sx={{
                                ml: 1,
                                bgcolor: alpha('#ef4444', 0.1),
                                color: '#ef4444',
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))}

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                    }}
                    onClick={() => navigate('/products')}
                  >
                    Explore More Products
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerDashboard;