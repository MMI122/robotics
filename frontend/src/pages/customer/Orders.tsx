import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
  Support as SupportIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  Reorder as ReorderIcon,
  TrackChanges as TrackIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  color: 'white',
  fontWeight: 600,
  textTransform: 'capitalize',
  backgroundColor: 
    status === 'delivered' ? theme.palette.success.main :
    status === 'shipped' ? theme.palette.info.main :
    status === 'processing' ? theme.palette.warning.main :
    status === 'pending' ? theme.palette.secondary.main :
    status === 'cancelled' ? theme.palette.error.main :
    theme.palette.grey[500]
}));

const OrderProgressStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepLabel-root .Mui-completed': {
    color: theme.palette.success.main,
  },
  '& .MuiStepLabel-root .Mui-active': {
    color: theme.palette.primary.main,
  },
}));

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  paymentMethod: string;
  orderProgress: {
    ordered: boolean;
    confirmed: boolean;
    shipped: boolean;
    delivered: boolean;
  };
}

const CustomerOrders: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionOrderId, setActionOrderId] = useState<string>('');
  const ordersPerPage = 5;

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'ORD-2024-001',
            date: '2024-01-15T10:30:00Z',
            status: 'delivered',
            total: 459.98,
            subtotal: 399.98,
            shipping: 15.00,
            tax: 45.00,
            trackingNumber: 'TRK123456789',
            estimatedDelivery: '2024-01-18T00:00:00Z',
            paymentMethod: 'Credit Card ****1234',
            orderProgress: {
              ordered: true,
              confirmed: true,
              shipped: true,
              delivered: true
            },
            items: [
              {
                id: '1',
                name: 'Advanced AI Robot Kit',
                image: '/api/placeholder/100/100',
                price: 299.99,
                quantity: 1,
                sku: 'AIR-001'
              },
              {
                id: '2',
                name: 'Smart Sensor Module',
                image: '/api/placeholder/100/100',
                price: 99.99,
                quantity: 1,
                sku: 'SSM-002'
              }
            ],
            shippingAddress: {
              name: 'John Doe',
              address: '123 Tech Street',
              city: 'New York',
              zipCode: '10001',
              country: 'USA'
            }
          },
          {
            id: '2',
            orderNumber: 'ORD-2024-002',
            date: '2024-01-20T14:15:00Z',
            status: 'shipped',
            total: 189.99,
            subtotal: 159.99,
            shipping: 15.00,
            tax: 15.00,
            trackingNumber: 'TRK987654321',
            estimatedDelivery: '2024-01-25T00:00:00Z',
            paymentMethod: 'PayPal',
            orderProgress: {
              ordered: true,
              confirmed: true,
              shipped: true,
              delivered: false
            },
            items: [
              {
                id: '3',
                name: 'Robot Programming Guide',
                image: '/api/placeholder/100/100',
                price: 29.99,
                quantity: 1,
                sku: 'RPG-003'
              },
              {
                id: '4',
                name: 'Advanced Camera Module',
                image: '/api/placeholder/100/100',
                price: 129.99,
                quantity: 1,
                sku: 'ACM-004'
              }
            ],
            shippingAddress: {
              name: 'John Doe',
              address: '123 Tech Street',
              city: 'New York',
              zipCode: '10001',
              country: 'USA'
            }
          },
          {
            id: '3',
            orderNumber: 'ORD-2024-003',
            date: '2024-01-22T09:45:00Z',
            status: 'processing',
            total: 89.99,
            subtotal: 79.99,
            shipping: 10.00,
            tax: 0.00,
            paymentMethod: 'Credit Card ****5678',
            orderProgress: {
              ordered: true,
              confirmed: true,
              shipped: false,
              delivered: false
            },
            items: [
              {
                id: '5',
                name: 'Servo Motor Pack',
                image: '/api/placeholder/100/100',
                price: 79.99,
                quantity: 1,
                sku: 'SMP-005'
              }
            ],
            shippingAddress: {
              name: 'John Doe',
              address: '123 Tech Street',
              city: 'New York',
              zipCode: '10001',
              country: 'USA'
            }
          },
          {
            id: '4',
            orderNumber: 'ORD-2024-004',
            date: '2024-01-10T16:20:00Z',
            status: 'cancelled',
            total: 199.99,
            subtotal: 179.99,
            shipping: 20.00,
            tax: 0.00,
            paymentMethod: 'Credit Card ****9012',
            orderProgress: {
              ordered: true,
              confirmed: false,
              shipped: false,
              delivered: false
            },
            items: [
              {
                id: '6',
                name: 'Robotic Arm Assembly',
                image: '/api/placeholder/100/100',
                price: 179.99,
                quantity: 1,
                sku: 'RAA-006'
              }
            ],
            shippingAddress: {
              name: 'John Doe',
              address: '123 Tech Street',
              city: 'New York',
              zipCode: '10001',
              country: 'USA'
            }
          }
        ];

        setOrders(mockOrders);
        setLoading(false);
      }, 1500);
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon />;
      case 'shipped':
        return <ShippingIcon />;
      case 'processing':
        return <ScheduleIcon />;
      case 'pending':
        return <PendingIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
    setAnchorEl(null);
  };

  const handleDownloadInvoice = (order: Order) => {
    // Implement invoice download
    console.log('Download invoice for order:', order.orderNumber);
    setAnchorEl(null);
  };

  const handleContactSupport = (order: Order) => {
    navigate(`/customer/support`, { state: { orderId: order.id } });
    setAnchorEl(null);
  };

  const handleReorder = (order: Order) => {
    // Add items to cart and navigate to cart
    console.log('Reorder items from:', order.orderNumber);
    setAnchorEl(null);
  };

  const handleTrackOrder = (order: Order) => {
    if (order.trackingNumber) {
      // Open tracking in new window
      window.open(`https://tracking.example.com/${order.trackingNumber}`, '_blank');
    }
    setAnchorEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, orderId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActionOrderId(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionOrderId('');
  };

  const getOrderSteps = (order: Order) => {
    const steps = [
      { label: 'Order Placed', completed: order.orderProgress.ordered },
      { label: 'Confirmed', completed: order.orderProgress.confirmed },
      { label: 'Shipped', completed: order.orderProgress.shipped },
      { label: 'Delivered', completed: order.orderProgress.delivered }
    ];
    return steps;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            My Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your orders
          </Typography>
        </Box>
        
        {/* Loading Skeletons */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
              <Grid item xs={12} md={2}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              My Orders
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and manage your orders ({filteredOrders.length} orders)
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ mb: 3, overflow: 'visible' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search orders or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Filter by Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  <MenuItem value="all">All Orders</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  sx={{ height: 56, borderRadius: 2 }}
                >
                  More Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Orders List */}
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <ReceiptIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No orders found
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'You haven\'t placed any orders yet'
                    }
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/products')}
                    sx={{ borderRadius: 2 }}
                  >
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Grid container spacing={3}>
              {paginatedOrders.map((order, index) => (
                <Grid item xs={12} key={order.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <StyledCard onClick={() => handleViewOrder(order)}>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={3}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {order.orderNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(order.date), 'MMM dd, yyyy')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.paymentMethod}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={2}>
                            <StatusChip
                              icon={getStatusIcon(order.status)}
                              label={order.status}
                              status={order.status}
                              size="small"
                            />
                            {order.trackingNumber && (
                              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                Track: {order.trackingNumber}
                              </Typography>
                            )}
                          </Grid>
                          
                          <Grid item xs={12} md={2}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              ${order.total.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', gap: 1, overflow: 'auto' }}>
                              {order.items.slice(0, 3).map((item) => (
                                <Avatar
                                  key={item.id}
                                  src={item.image}
                                  variant="rounded"
                                  sx={{ width: 40, height: 40 }}
                                />
                              ))}
                              {order.items.length > 3 && (
                                <Avatar
                                  variant="rounded"
                                  sx={{ 
                                    width: 40, 
                                    height: 40, 
                                    bgcolor: 'grey.200', 
                                    color: 'text.secondary',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  +{order.items.length - 3}
                                </Avatar>
                              )}
                            </Box>
                            {order.estimatedDelivery && (
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                Est. delivery: {format(new Date(order.estimatedDelivery), 'MMM dd')}
                              </Typography>
                            )}
                          </Grid>
                          
                          <Grid item xs={12} md={2}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ViewIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOrder(order);
                                }}
                                sx={{ borderRadius: 2 }}
                              >
                                View
                              </Button>
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuClick(e, order.id)}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Order Progress Bar */}
                        {order.status !== 'cancelled' && (
                          <Box sx={{ mt: 2 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={
                                order.status === 'delivered' ? 100 :
                                order.status === 'shipped' ? 75 :
                                order.status === 'processing' ? 50 :
                                order.status === 'pending' ? 25 : 0
                              }
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 3,
                                }
                              }}
                            />
                          </Box>
                        )}
                      </CardContent>
                    </StyledCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {filteredOrders.length > ordersPerPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(filteredOrders.length / ordersPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => {
            const order = orders.find(o => o.id === actionOrderId);
            if (order) handleDownloadInvoice(order);
          }}>
            <DownloadIcon sx={{ mr: 1 }} />
            Download Invoice
          </MenuItem>
          <MenuItem onClick={() => {
            const order = orders.find(o => o.id === actionOrderId);
            if (order?.trackingNumber) handleTrackOrder(order);
          }} disabled={!orders.find(o => o.id === actionOrderId)?.trackingNumber}>
            <TrackIcon sx={{ mr: 1 }} />
            Track Order
          </MenuItem>
          <MenuItem onClick={() => {
            const order = orders.find(o => o.id === actionOrderId);
            if (order) handleReorder(order);
          }}>
            <ReorderIcon sx={{ mr: 1 }} />
            Reorder Items
          </MenuItem>
          <MenuItem onClick={() => {
            const order = orders.find(o => o.id === actionOrderId);
            if (order) handleContactSupport(order);
          }}>
            <SupportIcon sx={{ mr: 1 }} />
            Contact Support
          </MenuItem>
        </Menu>

        {/* Order Detail Dialog */}
        <Dialog
          open={orderDetailOpen}
          onClose={() => setOrderDetailOpen(false)}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          {selectedOrder && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Order Details - {selectedOrder.orderNumber}
                  </Typography>
                  <StatusChip
                    icon={getStatusIcon(selectedOrder.status)}
                    label={selectedOrder.status}
                    status={selectedOrder.status}
                    size="small"
                  />
                </Box>
              </DialogTitle>
              <DialogContent>
                {/* Order Progress */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Order Progress
                  </Typography>
                  <OrderProgressStepper activeStep={
                    selectedOrder.orderProgress.delivered ? 3 :
                    selectedOrder.orderProgress.shipped ? 2 :
                    selectedOrder.orderProgress.confirmed ? 1 : 0
                  } alternativeLabel>
                    {getOrderSteps(selectedOrder).map((step, index) => (
                      <Step key={step.label} completed={step.completed}>
                        <StepLabel>{step.label}</StepLabel>
                      </Step>
                    ))}
                  </OrderProgressStepper>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Order Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {format(new Date(selectedOrder.date), 'PPP')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Payment: {selectedOrder.paymentMethod}
                    </Typography>
                    {selectedOrder.trackingNumber && (
                      <Typography variant="body2" color="text.secondary">
                        Tracking: {selectedOrder.trackingNumber}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Shipping Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.shippingAddress.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.shippingAddress.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.shippingAddress.country}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Order Items
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">SKU</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                src={item.image}
                                variant="rounded"
                                sx={{ width: 50, height: 50 }}
                              />
                              <Typography variant="body2">{item.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="caption" color="text.secondary">
                              {item.sku}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} sx={{ fontWeight: 500 }}>
                          Subtotal
                        </TableCell>
                        <TableCell align="right">${selectedOrder.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} sx={{ fontWeight: 500 }}>
                          Shipping
                        </TableCell>
                        <TableCell align="right">${selectedOrder.shipping.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} sx={{ fontWeight: 500 }}>
                          Tax
                        </TableCell>
                        <TableCell align="right">${selectedOrder.tax.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                          Total
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                          ${selectedOrder.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOrderDetailOpen(false)} color="inherit">
                  Close
                </Button>
                {selectedOrder.trackingNumber && (
                  <Button
                    variant="outlined"
                    startIcon={<TrackIcon />}
                    onClick={() => handleTrackOrder(selectedOrder)}
                  >
                    Track Order
                  </Button>
                )}
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                >
                  Download Invoice
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default CustomerOrders;