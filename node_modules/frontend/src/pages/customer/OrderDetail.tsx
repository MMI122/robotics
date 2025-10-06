import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: 16,
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  color: 'white',
  fontWeight: 600,
  backgroundColor: 
    status === 'delivered' ? theme.palette.success.main :
    status === 'shipped' ? theme.palette.info.main :
    status === 'processing' ? theme.palette.warning.main :
    status === 'cancelled' ? theme.palette.error.main :
    theme.palette.grey[500]
}));

const CustomerOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock order data
  const order = {
    id: 1,
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 299.99,
    subtotal: 269.97,
    shipping: 15.00,
    tax: 15.02,
    discount: 0,
    shippingAddress: {
      name: 'John Doe',
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States',
      phone: '+1 (555) 123-4567'
    },
    billingAddress: {
      name: 'John Doe',
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States'
    },
    paymentMethod: {
      type: 'Credit Card',
      last4: '4242',
      brand: 'Visa'
    },
    items: [
      {
        id: 1,
        name: 'Advanced AI Robot Kit',
        image: '/api/placeholder/80/80',
        price: 199.99,
        quantity: 1,
        total: 199.99
      },
      {
        id: 2,
        name: 'Smart Sensor Module',
        image: '/api/placeholder/80/80',
        price: 49.99,
        quantity: 1,
        total: 49.99
      },
      {
        id: 3,
        name: 'Programming Guide',
        image: '/api/placeholder/80/80',
        price: 19.99,
        quantity: 1,
        total: 19.99
      }
    ],
    tracking: {
      carrier: 'FedEx',
      trackingNumber: 'FX123456789',
      estimatedDelivery: '2024-01-20'
    },
    timeline: [
      {
        label: 'Order Placed',
        date: '2024-01-15 10:30 AM',
        completed: true,
        description: 'Your order has been received and is being processed'
      },
      {
        label: 'Payment Confirmed',
        date: '2024-01-15 10:35 AM',
        completed: true,
        description: 'Payment has been successfully processed'
      },
      {
        label: 'Processing',
        date: '2024-01-15 2:00 PM',
        completed: true,
        description: 'Your order is being prepared for shipment'
      },
      {
        label: 'Shipped',
        date: '2024-01-16 9:00 AM',
        completed: true,
        description: 'Your order has been shipped via FedEx'
      },
      {
        label: 'Delivered',
        date: '2024-01-18 3:30 PM',
        completed: true,
        description: 'Order delivered successfully'
      }
    ]
  };

  const handleGoBack = () => {
    navigate('/customer/orders');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Order Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Order #{order.orderNumber} • Placed on {new Date(order.date).toLocaleDateString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<PrintIcon />}>
            Print
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Download
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Order Status and Tracking */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Order Status
                </Typography>
                <StatusChip
                  status={order.status}
                  label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                />
              </Box>

              <Stepper orientation="vertical">
                {order.timeline.map((step, index) => (
                  <Step key={index} active={step.completed} completed={step.completed}>
                    <StepLabel>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {step.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.date}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {order.status === 'shipped' && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Tracking Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Carrier: {order.tracking.carrier} • Tracking: {order.tracking.trackingNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estimated Delivery: {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </StyledCard>

          {/* Order Items */}
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Order Items
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={item.image}
                              alt={item.name}
                              variant="rounded"
                              sx={{ width: 60, height: 60, mr: 2 }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          ${item.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Order Summary and Addresses */}
        <Grid item xs={12} md={4}>
          {/* Order Summary */}
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">${order.subtotal.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">${order.shipping.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">${order.tax.toFixed(2)}</Typography>
              </Box>
              
              {order.discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="success.main">Discount</Typography>
                  <Typography variant="body2" color="success.main">-${order.discount.toFixed(2)}</Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>${order.total.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </StyledCard>

          {/* Shipping Address */}
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Shipping Address
              </Typography>
              <Typography variant="body2">{order.shippingAddress.name}</Typography>
              <Typography variant="body2">{order.shippingAddress.street}</Typography>
              <Typography variant="body2">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </Typography>
              <Typography variant="body2">{order.shippingAddress.country}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{order.shippingAddress.phone}</Typography>
            </CardContent>
          </StyledCard>

          {/* Payment Method */}
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Payment Method
              </Typography>
              <Typography variant="body2">
                {order.paymentMethod.brand} ending in {order.paymentMethod.last4}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerOrderDetail;