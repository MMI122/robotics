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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CardMedia,
  Badge
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Inventory as PackageIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
  Timeline as TimelineIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Cancel as CancelIcon,
  Autorenew as ReturnIcon,
  Star as StarIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  const colors = {
    pending: { bg: '#ff9800', color: 'white' },
    confirmed: { bg: '#2196f3', color: 'white' },
    processing: { bg: '#9c27b0', color: 'white' },
    shipped: { bg: '#4caf50', color: 'white' },
    delivered: { bg: '#4caf50', color: 'white' },
    cancelled: { bg: '#f44336', color: 'white' },
    returned: { bg: '#795548', color: 'white' }
  };
  
  const statusColor = colors[status as keyof typeof colors] || colors.pending;
  
  return {
    backgroundColor: statusColor.bg,
    color: statusColor.color,
    fontWeight: 600,
    fontSize: '0.875rem',
  };
});

const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: theme.palette.divider,
  },
}));

const TimelineItem = styled(Box)<{ completed?: boolean }>(({ theme, completed }) => ({
  position: 'relative',
  paddingBottom: theme.spacing(3),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: -23,
    top: 4,
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: completed ? theme.palette.success.main : theme.palette.grey[300],
    border: `3px solid ${theme.palette.background.paper}`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
}));

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
  sku?: string;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  timeline: Array<{
    id: string;
    status: string;
    description: string;
    timestamp: string;
    location?: string;
  }>;
}

const CustomerOrderDetail: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<OrderItem | null>(null);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);

  // Mock data - replace with real API call
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      
      setTimeout(() => {
        const mockOrder: OrderDetails = {
          id: id || 'ord-123',
          orderNumber: 'RB-2024-001234',
          status: 'shipped',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-17T14:22:00Z',
          items: [
            {
              id: 'item1',
              productId: 'prod1',
              name: 'Arduino Uno R3 Microcontroller Board',
              image: '/api/placeholder/150/150',
              price: 29.99,
              quantity: 2,
              total: 59.98,
              sku: 'ARD-UNO-R3'
            },
            {
              id: 'item2',
              productId: 'prod2',
              name: 'Servo Motor SG90 9g',
              image: '/api/placeholder/150/150',
              price: 12.99,
              quantity: 4,
              total: 51.96,
              sku: 'SRV-SG90'
            },
            {
              id: 'item3',
              productId: 'prod3',
              name: 'Ultrasonic Sensor HC-SR04',
              image: '/api/placeholder/150/150',
              price: 8.99,
              quantity: 3,
              total: 26.97,
              sku: 'SNS-HCSR04'
            }
          ],
          subtotal: 138.91,
          tax: 11.11,
          shipping: 9.99,
          total: 160.01,
          shippingAddress: {
            name: 'John Doe',
            street: '123 Tech Street, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            phone: '+1 (555) 123-4567'
          },
          billingAddress: {
            name: 'John Doe',
            street: '123 Tech Street, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            phone: '+1 (555) 123-4567'
          },
          paymentMethod: 'Visa ending in 1234',
          trackingNumber: 'UPS1Z9999999999999999',
          estimatedDelivery: '2024-01-19T18:00:00Z',
          notes: 'Please leave package at front door if no answer.',
          timeline: [
            {
              id: 'tl1',
              status: 'Order Placed',
              description: 'Your order has been successfully placed and payment confirmed.',
              timestamp: '2024-01-15T10:30:00Z',
              location: 'Online'
            },
            {
              id: 'tl2',
              status: 'Order Confirmed',
              description: 'Your order has been confirmed and is being prepared.',
              timestamp: '2024-01-15T11:45:00Z',
              location: 'RoboticsShop Warehouse'
            },
            {
              id: 'tl3',
              status: 'Processing',
              description: 'Items are being picked and packed for shipment.',
              timestamp: '2024-01-16T09:15:00Z',
              location: 'RoboticsShop Warehouse'
            },
            {
              id: 'tl4',
              status: 'Shipped',
              description: 'Your order has been shipped via UPS.',
              timestamp: '2024-01-17T14:22:00Z',
              location: 'New York Distribution Center'
            },
            {
              id: 'tl5',
              status: 'In Transit',
              description: 'Package is on its way to your delivery address.',
              timestamp: '2024-01-18T08:30:00Z',
              location: 'In Transit to New York, NY'
            }
          ]
        };
        
        setOrder(mockOrder);
        setLoading(false);
      }, 1000);
    };

    fetchOrderDetails();
  }, [id]);

  const handleCancelOrder = () => {
    // Handle order cancellation
    console.log('Cancelling order:', order?.id);
    setCancelDialogOpen(false);
  };

  const handleReturnItem = () => {
    // Handle return request
    console.log('Requesting return for:', selectedProduct?.name);
    setReturnDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleWriteReview = () => {
    // Handle review writing
    console.log('Writing review for:', selectedProduct?.name);
    setReviewDialogOpen(false);
    setSelectedProduct(null);
  };

  const getStatusProgress = (status: string) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    return ((statusOrder.indexOf(status) + 1) / statusOrder.length) * 100;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>Loading Order Details...</Typography>
        </Box>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Order Not Found</Typography>
        <Button variant="contained" onClick={() => navigate('/customer/orders')}>
          Back to Orders
        </Button>
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
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => navigate('/customer/orders')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Order Details
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Order #{order.orderNumber}
          </Typography>
        </Box>

        {/* Order Status Card */}
        <StyledCard sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StatusChip status={order.status} label={order.status.toUpperCase()} />
                  <Typography variant="h6" sx={{ color: 'white', ml: 2, fontWeight: 600 }}>
                    {order.status === 'shipped' ? 'On its way!' :
                     order.status === 'delivered' ? 'Delivered!' :
                     order.status === 'processing' ? 'Being prepared' :
                     'Order received'}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                  {order.estimatedDelivery && order.status !== 'delivered' && (
                    `Expected delivery: ${format(new Date(order.estimatedDelivery), 'EEEE, MMMM dd')}`
                  )}
                  {order.status === 'delivered' && 'Your order has been delivered!'}
                  {order.status === 'processing' && 'Your items are being carefully prepared for shipment.'}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={getStatusProgress(order.status)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: 'white',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  {order.trackingNumber && (
                    <Button
                      variant="outlined"
                      sx={{ color: 'white', borderColor: 'white' }}
                      startIcon={<ShippingIcon />}
                      onClick={() => setTrackingDialogOpen(true)}
                    >
                      Track Package
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white' }}
                    startIcon={<DownloadIcon />}
                  >
                    Invoice
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>

        <Grid container spacing={3}>
          {/* Order Items */}
          <Grid item xs={12} md={8}>
            <StyledCard sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Items ({order.items.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {order.items.map((item) => (
                  <Box key={item.id}>
                    <Grid container spacing={2} alignItems="center" sx={{ py: 2 }}>
                      <Grid item xs={12} sm={2}>
                        <CardMedia
                          component="img"
                          sx={{ width: 80, height: 80, borderRadius: 2 }}
                          image={item.image}
                          alt={item.name}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          SKU: {item.sku}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          ${item.total.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${item.price.toFixed(2)} each
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {order.status === 'delivered' && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<StarIcon />}
                              onClick={() => {
                                setSelectedProduct(item);
                                setReviewDialogOpen(true);
                              }}
                            >
                              Review
                            </Button>
                          )}
                          {(order.status === 'delivered' || order.status === 'shipped') && (
                            <Button
                              size="small"
                              variant="text"
                              startIcon={<ReturnIcon />}
                              onClick={() => {
                                setSelectedProduct(item);
                                setReturnDialogOpen(true);
                              }}
                            >
                              Return
                            </Button>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                    {item.id !== order.items[order.items.length - 1].id && <Divider />}
                  </Box>
                ))}
              </CardContent>
            </StyledCard>

            {/* Order Timeline */}
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Order Timeline
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <TimelineContainer>
                  {order.timeline.map((event, index) => (
                    <TimelineItem key={event.id} completed={true}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {event.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {event.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                        {event.location && ` • ${event.location}`}
                      </Typography>
                    </TimelineItem>
                  ))}
                </TimelineContainer>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Order Summary & Actions */}
          <Grid item xs={12} md={4}>
            {/* Order Summary */}
            <StyledCard sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">${order.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax:</Typography>
                  <Typography variant="body2">${order.tax.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Shipping:</Typography>
                  <Typography variant="body2">${order.shipping.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Total:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>${order.total.toFixed(2)}</Typography>
                </Box>
              </CardContent>
            </StyledCard>

            {/* Shipping Address */}
            <StyledCard sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Shipping Address
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2">
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                  {order.shippingAddress.country}
                  {order.shippingAddress.phone && (
                    <>
                      <br />
                      <PhoneIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      {order.shippingAddress.phone}
                    </>
                  )}
                </Typography>
              </CardContent>
            </StyledCard>

            {/* Payment Method */}
            <StyledCard sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Payment Method
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2">
                  {order.paymentMethod}
                </Typography>
              </CardContent>
            </StyledCard>

            {/* Order Actions */}
            {(order.status === 'pending' || order.status === 'confirmed') && (
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Order Actions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => setCancelDialogOpen(true)}
                    >
                      Cancel Order
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<MessageIcon />}
                    >
                      Contact Support
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            )}
          </Grid>
        </Grid>

        {/* Dialogs */}
        
        {/* Cancel Order Dialog */}
        <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to cancel this order? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialogOpen(false)}>Keep Order</Button>
            <Button onClick={handleCancelOrder} color="error" variant="contained">
              Cancel Order
            </Button>
          </DialogActions>
        </Dialog>

        {/* Return Item Dialog */}
        <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Return Item</DialogTitle>
          <DialogContent>
            {selectedProduct && (
              <Box>
                <Typography gutterBottom>
                  Request return for: <strong>{selectedProduct.name}</strong>
                </Typography>
                <TextField
                  fullWidth
                  label="Reason for return"
                  multiline
                  rows={3}
                  placeholder="Please describe why you'd like to return this item..."
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReturnDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReturnItem} variant="contained">
              Submit Return Request
            </Button>
          </DialogActions>
        </Dialog>

        {/* Write Review Dialog */}
        <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogContent>
            {selectedProduct && (
              <Box>
                <Typography gutterBottom>
                  Review: <strong>{selectedProduct.name}</strong>
                </Typography>
                <TextField
                  fullWidth
                  label="Review Title"
                  placeholder="Summarize your experience"
                  sx={{ mt: 2, mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Your Review"
                  multiline
                  rows={4}
                  placeholder="Share your thoughts about this product..."
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleWriteReview} variant="contained">
              Submit Review
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tracking Dialog */}
        <Dialog open={trackingDialogOpen} onClose={() => setTrackingDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Package Tracking</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              Tracking Number: {order.trackingNumber}
            </Alert>
            <Typography variant="h6" gutterBottom>
              Shipping Progress
            </Typography>
            {/* Add tracking timeline here */}
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Package shipped from facility"
                  secondary="Jan 17, 2024 at 2:22 PM"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ShippingIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="In transit to destination"
                  secondary="Jan 18, 2024 at 8:30 AM"
                />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTrackingDialogOpen(false)}>Close</Button>
            <Button variant="contained" href={`https://www.ups.com/track?tracknum=${order.trackingNumber}`} target="_blank">
              View on UPS
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default CustomerOrderDetail;