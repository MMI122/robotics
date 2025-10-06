import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,

  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  ArrowBack,
  Edit,
  LocalShipping,
  Assignment,
  Cancel,
  CheckCircle,
  Print,
  Email,
  Phone,
  LocationOn,
  CreditCard,
  Receipt,
  Update,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/layout/AdminSidebar';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billing_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
  notes: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

interface OrderHistory {
  id: number;
  status: string;
  description: string;
  created_at: string;
  created_by: string;
}

const AdminOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');

  useEffect(() => {
    // Simulated data - replace with actual API call
    setOrder({
      id: parseInt(id || '1'),
      order_number: 'ORD-2025-1001',
      customer_id: 1,
      customer_name: 'John Doe',
      customer_email: 'john.doe@example.com',
      customer_phone: '+1-555-0123',
      status: 'processing',
      payment_status: 'paid',
      payment_method: 'Credit Card',
      subtotal: 299.99,
      tax: 30.00,
      shipping: 15.99,
      total: 345.98,
      shipping_address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
      },
      billing_address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
      },
      items: [
        {
          id: 1,
          product_id: 1,
          product_name: 'Arduino Uno R3',
          product_image: '/images/arduino-uno.jpg',
          quantity: 2,
          price: 149.99,
          total: 299.98,
        },
      ],
      notes: 'Customer requested expedited shipping',
      tracking_number: 'TRK123456789',
      created_at: '2025-10-01T10:00:00Z',
      updated_at: '2025-10-03T14:30:00Z',
    });

    setOrderHistory([
      {
        id: 1,
        status: 'pending',
        description: 'Order placed by customer',
        created_at: '2025-10-01T10:00:00Z',
        created_by: 'System',
      },
      {
        id: 2,
        status: 'processing',
        description: 'Payment confirmed and order processing started',
        created_at: '2025-10-01T11:30:00Z',
        created_by: 'Admin',
      },
    ]);

    setLoading(false);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'refunded': return 'info';
      default: return 'default';
    }
  };

  const handleUpdateOrder = () => {
    // API call to update order
    setUpdateDialogOpen(false);
    // Refresh order data
  };

  const handlePrintOrder = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AdminSidebar open={false} onClose={() => {}} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AdminSidebar open={false} onClose={() => {}} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography>Order not found</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar open={false} onClose={() => {}} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
              <Link color="inherit" href="/admin/dashboard">
                Dashboard
              </Link>
              <Link color="inherit" href="/admin/orders">
                Orders
              </Link>
              <Typography color="text.primary">Order Details</Typography>
            </Breadcrumbs>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate('/admin/orders')}>
                  <ArrowBack />
                </IconButton>
                <Box>
                  <Typography variant="h4" component="h1">
                    Order {order.order_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  onClick={handlePrintOrder}
                >
                  Print
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setUpdateDialogOpen(true)}
                >
                  Update Order
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Order Status Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Order Status
                  </Typography>
                  <Chip
                    label={order.status.toUpperCase()}
                    color={getStatusColor(order.status) as any}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Payment Status
                  </Typography>
                  <Chip
                    label={order.payment_status.toUpperCase()}
                    color={getPaymentStatusColor(order.payment_status) as any}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    ${order.total.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Items Count
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Order Items */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Order Items
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                src={item.product_image}
                                alt={item.product_name}
                                variant="rounded"
                                sx={{ width: 50, height: 50 }}
                              />
                              <Typography variant="body2">
                                {item.product_name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">{item.quantity}</TableCell>
                          <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                          <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 200 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>${order.subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 200 }}>
                    <Typography>Tax:</Typography>
                    <Typography>${order.tax.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 200 }}>
                    <Typography>Shipping:</Typography>
                    <Typography>${order.shipping.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ width: 200 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 200 }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">${order.total.toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Order History */}
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Order History
                </Typography>
                <Timeline>
                  {orderHistory.map((history, index) => (
                    <TimelineItem key={history.id}>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        {index < orderHistory.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="subtitle2">
                          {history.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(history.created_at).toLocaleString()} by {history.created_by}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Paper>
            </Grid>

            {/* Order Details Sidebar */}
            <Grid item xs={12} lg={4}>
              {/* Customer Information */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Customer Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">{order.customer_name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{order.customer_email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{order.customer_phone}</Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Shipping Address */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Shipping Address
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2">
                      {order.shipping_address.street}<br />
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}<br />
                      {order.shipping_address.country}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Payment Information */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Payment Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard fontSize="small" color="action" />
                    <Typography variant="body2">{order.payment_method}</Typography>
                  </Box>
                  <Chip
                    label={order.payment_status.toUpperCase()}
                    color={getPaymentStatusColor(order.payment_status) as any}
                    size="small"
                  />
                </Box>
              </Paper>

              {/* Tracking Information */}
              {order.tracking_number && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Tracking Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalShipping fontSize="small" color="action" />
                    <Typography variant="body2">{order.tracking_number}</Typography>
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>

          {/* Update Order Dialog */}
          <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Update Order</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Order Status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tracking Number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Update Notes"
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateOrder} variant="contained">Update</Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminOrderDetail;