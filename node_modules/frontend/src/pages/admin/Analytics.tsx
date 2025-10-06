import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  alpha,
  useTheme,
  Tooltip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as OrderIcon,
  People as PeopleIcon,
  Visibility as ViewIcon,
  DateRange as DateRangeIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Inventory as ProductIcon,
  Category as CategoryIcon,
  Star as RatingIcon,
  LocationOn as LocationIcon,
  DeviceHub as DeviceIcon,
  Schedule as TimeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminSidebar from '../../components/dashboards/AdminSidebar';

const AdminContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50],
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: 280,
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    transform: 'translate(30px, -30px)',
  },
  '&.secondary': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  },
  '&.success': {
    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
  },
  '&.warning': {
    background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
  },
  '&.error': {
    background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
  },
}));

const ControlsToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  minHeight: '64px !important',
}));

const ChartCard = styled(Card)(({ theme }) => ({
  height: '400px',
  '& .recharts-wrapper': {
    width: '100% !important',
    height: '350px !important',
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
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminAnalytics: React.FC = () => {
  const theme = useTheme();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock data
  const salesData = [
    { name: 'Jan', sales: 4000, orders: 240, customers: 200 },
    { name: 'Feb', sales: 3000, orders: 198, customers: 180 },
    { name: 'Mar', sales: 2000, orders: 180, customers: 160 },
    { name: 'Apr', sales: 2780, orders: 208, customers: 190 },
    { name: 'May', sales: 1890, orders: 189, customers: 170 },
    { name: 'Jun', sales: 2390, orders: 239, customers: 220 },
    { name: 'Jul', sales: 3490, orders: 349, customers: 280 },
    { name: 'Aug', sales: 4000, orders: 400, customers: 320 },
    { name: 'Sep', sales: 3200, orders: 320, customers: 290 },
    { name: 'Oct', sales: 4500, orders: 450, customers: 350 },
    { name: 'Nov', sales: 5200, orders: 520, customers: 420 },
    { name: 'Dec', sales: 6100, orders: 610, customers: 480 },
  ];

  const categoryData = [
    { name: 'Microcontrollers', value: 35, sales: 15400, color: '#8884d8' },
    { name: 'Sensors', value: 25, sales: 11000, color: '#82ca9d' },
    { name: 'Robot Kits', value: 20, sales: 8800, color: '#ffc658' },
    { name: 'Motors', value: 12, sales: 5280, color: '#ff7300' },
    { name: 'Accessories', value: 8, sales: 3520, color: '#00ff00' },
  ];

  const topProducts = [
    { id: 1, name: 'Arduino Uno R3', sales: 1250, revenue: 32475, growth: 15.2 },
    { id: 2, name: 'Raspberry Pi 4', sales: 980, revenue: 88200, growth: 12.8 },
    { id: 3, name: 'Ultrasonic Sensor', sales: 750, revenue: 11250, growth: 8.5 },
    { id: 4, name: 'Servo Motor Kit', sales: 620, revenue: 55800, growth: -2.3 },
    { id: 5, name: 'Robot Building Kit', sales: 480, revenue: 95760, growth: 22.1 },
  ];

  const customerSegments = [
    { segment: 'New Customers', count: 245, percentage: 35, color: '#8884d8' },
    { segment: 'Returning Customers', count: 342, percentage: 49, color: '#82ca9d' },
    { segment: 'VIP Customers', count: 98, percentage: 14, color: '#ffc658' },
    { segment: 'Inactive Customers', count: 15, percentage: 2, color: '#ff7300' },
  ];

  const trafficSources = [
    { source: 'Organic Search', visitors: 4250, percentage: 45, color: '#8884d8' },
    { source: 'Direct', visitors: 2380, percentage: 25, color: '#82ca9d' },
    { source: 'Social Media', visitors: 1420, percentage: 15, color: '#ffc658' },
    { source: 'Email Campaign', visitors: 950, percentage: 10, color: '#ff7300' },
    { source: 'Referrals', visitors: 475, percentage: 5, color: '#00ff00' },
  ];

  const deviceData = [
    { device: 'Desktop', sessions: 5240, percentage: 52 },
    { device: 'Mobile', sessions: 3680, percentage: 37 },
    { device: 'Tablet', sessions: 1100, percentage: 11 },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const stats = [
    {
      title: 'Total Revenue',
      value: '$124,580',
      change: '+15.3%',
      icon: <MoneyIcon fontSize="large" />,
      color: 'primary' as const,
      isPositive: true
    },
    {
      title: 'Total Orders',
      value: '2,847',
      change: '+8.2%',
      icon: <OrderIcon fontSize="large" />,
      color: 'success' as const,
      isPositive: true
    },
    {
      title: 'New Customers',
      value: '1,245',
      change: '+12.7%',
      icon: <PeopleIcon fontSize="large" />,
      color: 'secondary' as const,
      isPositive: true
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-0.5%',
      icon: <TrendingUpIcon fontSize="large" />,
      color: 'warning' as const,
      isPositive: false
    }
  ];

  if (loading) {
    return (
      <AdminContainer>
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <MainContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Typography variant="h6">Loading analytics...</Typography>
          </Box>
        </MainContent>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <MainContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Analytics Dashboard
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                  Export Report
                </Button>
                <Button variant="outlined" startIcon={<RefreshIcon />}>
                  Refresh
                </Button>
              </Box>
            </Box>

            {/* Controls */}
            <ControlsToolbar>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Time Period</InputLabel>
                  <Select
                    value={dateRange}
                    label="Time Period"
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <MenuItem value="7">Last 7 days</MenuItem>
                    <MenuItem value="30">Last 30 days</MenuItem>
                    <MenuItem value="90">Last 3 months</MenuItem>
                    <MenuItem value="365">Last year</MenuItem>
                  </Select>
                </FormControl>
                
                <Box sx={{ flexGrow: 1 }} />
                
                <Typography variant="body2" color="text.secondary">
                  Data updated: {new Date().toLocaleString()}
                </Typography>
              </Box>
            </ControlsToolbar>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StatsCard className={stat.color}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ opacity: 0.8 }}>
                          {stat.icon}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {stat.isPositive ? (
                            <TrendingUpIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }} />
                          ) : (
                            <TrendingDownIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.8)' }} />
                          )}
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {stat.change}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {stat.title}
                      </Typography>
                    </CardContent>
                  </StatsCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Analytics Tabs */}
          <Box sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Sales & Revenue" />
              <Tab label="Products & Categories" />
              <Tab label="Customers" />
              <Tab label="Traffic & Devices" />
            </Tabs>
          </Box>

          {/* Sales & Revenue Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {/* Sales Trend */}
              <Grid item xs={12} lg={8}>
                <ChartCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sales Trend
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stackId="1"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </ChartCard>
              </Grid>

              {/* Orders vs Customers */}
              <Grid item xs={12} lg={4}>
                <ChartCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Orders vs Customers
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData.slice(-6)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="orders" fill="#8884d8" />
                        <Bar dataKey="customers" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </ChartCard>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Products & Categories Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {/* Category Performance */}
              <Grid item xs={12} lg={6}>
                <ChartCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Category Performance
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={(entry) => `${entry.name}: ${entry.value}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </ChartCard>
              </Grid>

              {/* Top Products */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ height: '400px' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Top Selling Products
                    </Typography>
                    <List>
                      {topProducts.map((product, index) => (
                        <ListItem key={product.id}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {index + 1}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={product.name}
                            secondary={`${product.sales} units sold`}
                          />
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              ${product.revenue.toLocaleString()}
                            </Typography>
                            <Chip
                              label={`${product.growth > 0 ? '+' : ''}${product.growth}%`}
                              size="small"
                              color={product.growth > 0 ? 'success' : 'error'}
                            />
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Customers Tab */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              {/* Customer Segments */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ height: '400px' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Customer Segments
                    </Typography>
                    {customerSegments.map((segment) => (
                      <Box key={segment.segment} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{segment.segment}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {segment.count} ({segment.percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={segment.percentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: segment.color,
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Customer Acquisition */}
              <Grid item xs={12} lg={6}>
                <ChartCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Customer Acquisition
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData.slice(-6)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="customers"
                          stroke="#8884d8"
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </ChartCard>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Traffic & Devices Tab */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              {/* Traffic Sources */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ height: '400px' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Traffic Sources
                    </Typography>
                    {trafficSources.map((source) => (
                      <Box key={source.source} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{source.source}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {source.visitors.toLocaleString()} ({source.percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={source.percentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: source.color,
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>

              {/* Device Usage */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ height: '400px' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Device Usage
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      {deviceData.map((device) => (
                        <Box key={device.device} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DeviceIcon color="primary" />
                              <Typography variant="body2">{device.device}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {device.sessions.toLocaleString()} ({device.percentage}%)
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={device.percentage}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </motion.div>
      </MainContent>
    </AdminContainer>
  );
};

export default AdminAnalytics;