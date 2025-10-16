import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';

const SimpleCheckoutPage: React.FC = () => {
  const theme = useTheme();

  // Mock cart data
  const cartItems = [
    { id: 1, name: 'Arduino Uno R3', price: 25.99, quantity: 2 },
    { id: 2, name: 'Raspberry Pi 4', price: 75.00, quantity: 1 },
    { id: 3, name: 'ESP32 DevKit', price: 12.50, quantity: 3 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Mock order ID - in real app this would come from order creation
  const mockOrderId = 123;

  const handlePaymentSuccess = (paymentDetails: any) => {
    console.log('Payment successful:', paymentDetails);
    alert(`Payment successful! Order ID: ${mockOrderId}`);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Checkout - PayPal Demo
        </Typography>

        <Grid container spacing={4}>
          {/* Order Summary */}
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: '16px', height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Order Summary
                </Typography>

                <List sx={{ mb: 2 }}>
                  {cartItems.map((item) => (
                    <ListItem key={item.id} sx={{ px: 0, py: 1 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={`Qty: ${item.quantity}`}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">${shipping.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">${tax.toFixed(2)}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    ${total.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Section */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: '16px' }}>
              <CardContent sx={{ p: 4 }}>
                <PaymentMethodSelector
                  orderId={mockOrderId}
                  amount={total}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SimpleCheckoutPage;