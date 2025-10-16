import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
  MoreVert,
  Search,
  FilterList,
  Download,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { analyticsAPI, ordersAPI, productsAPI } from '../../services/api';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: any) => state.auth);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dashboard data state
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    ordersGrowth: 0,
    totalCustomers: 0,
    customersGrowth: 0,
    totalProducts: 0,
    productsGrowth: 0,
    pendingOrders: 0,
    lowStockItems: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  
  // Mock chart data (will be replaced with real data later)
  const [salesData] = useState([
    { month: 'Jan', revenue: 8500, orders: 120, customers: 85 },
    { month: 'Feb', revenue: 9200, orders: 135, customers: 92 },
    { month: 'Mar', revenue: 10800, orders: 158, customers: 108 },
    { month: 'Apr', revenue: 11500, orders: 167, customers: 115 },
    { month: 'May', revenue: 13200, orders: 189, customers: 128 },
    { month: 'Jun', revenue: 14750, orders: 203, customers: 142 },
  ]);

  const [categoryData] = useState([
    { name: 'Arduino & Microcontrollers', value: 35, color: '#0ea5e9' },
    { name: 'Sensors & Modules', value: 25, color: '#10b981' },
    { name: 'Motors & Actuators', value: 20, color: '#f59e0b' },
    { name: 'Electronic Components', value: 15, color: '#ef4444' },
    { name: 'Others', value: 5, color: '#8b5cf6' },
  ]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch analytics data
        const [statsResponse, ordersResponse, productsResponse] = await Promise.all([
          analyticsAPI.getDashboardStats(),
          ordersAPI.getAdminOrders({ per_page: 5 }),
          productsAPI.getAdminProducts({ per_page: 10 })
        ]);

        // Update stats
        const stats = statsResponse.data.data;
        setDashboardStats({
          totalRevenue: stats?.total_revenue || 0,
          revenueGrowth: 12.5, // Mock growth percentage for now
          totalOrders: stats?.total_orders || 0,
          ordersGrowth: 8.3, // Mock growth percentage for now
          totalCustomers: stats?.total_users || 0,
          customersGrowth: 15.2, // Mock growth percentage for now
          totalProducts: stats?.total_products || 0,
          productsGrowth: 5.7, // Mock growth percentage for now
          pendingOrders: 0, // Will calculate from orders
          lowStockItems: 0, // Will calculate from products
        });

        // Update recent orders
        const orders = ordersResponse.data.data?.data || [];
        setRecentOrders(orders.slice(0, 4).map((order: any) => ({
          id: order.id || order.order_number || 'N/A',
          customer: order.user?.name || order.customer_name || 'Unknown Customer',
          total: order.total_amount || order.total || 0,
          status: order.status || 'pending',
          date: order.created_at || new Date().toISOString(),
        })));

        // Update top products
        const products = productsResponse.data.data?.data || [];
        setTopProducts(products.slice(0, 4).map((product: any, index: number) => ({
          id: product.id || index + 1,
          name: product.name || 'Unknown Product',
          sales: Math.floor(Math.random() * 200) + 50, // Mock sales data
          revenue: (product.price || 0) * (Math.floor(Math.random() * 50) + 10),
          growth: (Math.random() - 0.5) * 30, // Mock growth between -15% and +15%
        })));

        // Calculate pending orders and low stock items
        const pendingOrdersCount = orders.filter((order: any) => order.status === 'pending').length;
        const lowStockCount = products.filter((product: any) => (product.stock || 0) < 10).length;
        
        setDashboardStats(prev => ({
          ...prev,
          pendingOrders: pendingOrdersCount,
          lowStockItems: lowStockCount,
        }));

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: '#10b981', bg: alpha('#10b981', 0.1) };
      case 'processing':
        return { color: '#f59e0b', bg: alpha('#f59e0b', 0.1) };
      case 'shipped':
        return { color: '#3b82f6', bg: alpha('#3b82f6', 0.1) };
      case 'pending':
        return { color: '#ef4444', bg: alpha('#ef4444', 0.1) };
      default:
        return { color: '#6b7280', bg: alpha('#6b7280', 0.1) };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatGrowth = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <Box 
      sx={{ 
        p: 3,
        overflowX: 'auto',
        minWidth: '1200px',  // Force minimum width to ensure horizontal scroll
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
      }}
    >
      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Dashboard Content */}
      {!loading && !error && (
        <>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
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
                  Admin Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Welcome back, {user?.name || 'Admin User'}! Here's your store overview
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  sx={{ borderRadius: '12px', textTransform: 'none' }}
                >
                  Export Report
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ borderRadius: '12px', textTransform: 'none' }}
                  onClick={() => navigate('/admin/products/new')}
                >
                  Add Product
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ minWidth: '1200px' }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <TrendingUp sx={{ color: '#0ea5e9', fontSize: '2rem' }} />
                    <Chip
                      label={formatGrowth(dashboardStats.revenueGrowth)}
                      size="small"
                      sx={{
                        bgcolor: alpha('#10b981', 0.1),
                        color: '#10b981',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#0ea5e9', mb: 1 }}>
                    {formatCurrency(dashboardStats.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Revenue
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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <ShoppingCart sx={{ color: '#10b981', fontSize: '2rem' }} />
                    <Chip
                      label={formatGrowth(dashboardStats.ordersGrowth)}
                      size="small"
                      sx={{
                        bgcolor: alpha('#10b981', 0.1),
                        color: '#10b981',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981', mb: 1 }}>
                    {dashboardStats.totalOrders.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <People sx={{ color: '#f59e0b', fontSize: '2rem' }} />
                    <Chip
                      label={formatGrowth(dashboardStats.customersGrowth)}
                      size="small"
                      sx={{
                        bgcolor: alpha('#10b981', 0.1),
                        color: '#10b981',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', mb: 1 }}>
                    {dashboardStats.totalCustomers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Customers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: alpha('#8b5cf6', 0.2),
                  background: alpha('#8b5cf6', 0.05),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Inventory sx={{ color: '#8b5cf6', fontSize: '2rem' }} />
                    <Chip
                      label={formatGrowth(dashboardStats.productsGrowth)}
                      size="small"
                      sx={{
                        bgcolor: alpha('#10b981', 0.1),
                        color: '#10b981',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6', mb: 1 }}>
                    {dashboardStats.totalProducts.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Products
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          </Box>

          {/* Charts Row */}
          <Box sx={{ minWidth: '1200px' }}>
            <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Revenue Chart */}
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: '16px', 
                height: { xs: 350, md: 400 }
              }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Revenue Overview
                  </Typography>
                  <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart 
                        data={salesData} 
                        margin={{ 
                          top: 10, 
                          right: 30, 
                          left: 20, 
                          bottom: 5 
                        }}
                      >
                        <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0ea5e9"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          </Box>

          {/* Pie Chart Row */}
          <Box sx={{ minWidth: '1200px' }}>
            <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Category Distribution */}
            <Grid item xs={12} md={6} lg={8}>
              <Card sx={{ 
                borderRadius: '16px', 
                height: { xs: 400, md: 450 }
              }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Sales by Category
                  </Typography>
                  <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="45%"
                          outerRadius={80}
                          dataKey="value"
                          label={(props: any) => `${(props.percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend 
                          verticalAlign="bottom" 
                          height={80}
                          wrapperStyle={{ 
                            paddingTop: '20px',
                            fontSize: '14px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ borderRadius: '16px', height: { xs: 400, md: 450 } }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Quick Stats
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha('#10b981', 0.1), borderRadius: '12px' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981', mb: 1 }}>
                        {dashboardStats.pendingOrders}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Orders
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha('#ef4444', 0.1), borderRadius: '12px' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444', mb: 1 }}>
                        {dashboardStats.lowStockItems}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Low Stock Items
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: alpha('#0ea5e9', 0.1), borderRadius: '12px' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#0ea5e9', mb: 1 }}>
                        98.5%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Customer Satisfaction
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          </Box>

          {/* Tables Row */}
          <Box sx={{ minWidth: '1200px' }}>
            <Grid container spacing={4}>
            {/* Recent Orders */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ borderRadius: '16px' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Orders
                    </Typography>
                    <Button
                      variant="text"
                      onClick={() => navigate('/admin/orders')}
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
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {order.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.customer}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center', mx: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {formatCurrency(order.total)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.date}
                            </Typography>
                          </Box>
                          <Chip
                            label={order.status}
                            size="small"
                            sx={{
                              bgcolor: statusStyle.bg,
                              color: statusStyle.color,
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              minWidth: 80,
                            }}
                          />
                        </Box>
                        {index < recentOrders.length - 1 && (
                          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mx: 2 }} />
                        )}
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>

            {/* Top Products */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ borderRadius: '16px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Top Products
                  </Typography>

                  {topProducts.map((product, index) => (
                    <Box key={product.id} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {product.name}
                        </Typography>
                        <Chip
                          label={formatGrowth(product.growth)}
                          size="small"
                          sx={{
                            bgcolor: product.growth >= 0 ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
                            color: product.growth >= 0 ? '#10b981' : '#ef4444',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          {product.sales} sales
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#10b981' }}>
                          {formatCurrency(product.revenue)}
                        </Typography>
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
                    onClick={() => navigate('/admin/products')}
                  >
                    View All Products
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminDashboard;