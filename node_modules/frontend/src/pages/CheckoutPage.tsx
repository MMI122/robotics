import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Alert,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  Collapse,
} from '@mui/material';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PayPalPayment } from '../components';
import {
  ShoppingCart,
  LocalShipping,
  Payment,
  CheckCircle,
  Edit,
  DeleteOutline,
  Add,
  Remove,
  CreditCard,
  AccountBalanceWallet,
  Apple,
  Google,
  Security,
  Verified,
  ExpandMore,
  ExpandLess,
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/ordersSlice';
import { getProductImageUrl } from '../utils/imageUtils';

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  inStock: boolean;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: cartItemsData, loading, totalPrice, totalItems, error } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [activeStep, setActiveStep] = useState(0);

  // Transform Redux cart items to match the expected format
  const cartItems = cartItemsData.map(item => ({
    id: item.id,
    name: item.product?.name || 'Unknown Product',
    image: getProductImageUrl(item.product?.featured_image || ''),
    price: parseFloat(String(item.product?.sale_price || item.product?.price || 0)) || 0,
    quantity: parseInt(String(item.quantity)) || 1,
    inStock: item.product?.in_stock || false,
  }));

  useEffect(() => {
    if (isAuthenticated && cartItemsData.length === 0) {
      dispatch(fetchCart());
    }
  }, [dispatch, cartItemsData.length, isAuthenticated]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { from: '/checkout', message: 'Please login to proceed with checkout' }
      });
    }
  }, [isAuthenticated, navigate]);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const steps = ['Cart Review', 'Shipping', 'Payment', 'Confirmation'];

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + tax - discount;

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ id, quantity: newQuantity }));
  };

  const removeItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const createOrderHandler = async () => {
    try {
      const orderData = {
        shipping_address: {
          first_name: shippingAddress.firstName,
          last_name: shippingAddress.lastName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          address_line_1: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zipCode,
          country: shippingAddress.country,
        },
        billing_address: {
          first_name: shippingAddress.firstName,
          last_name: shippingAddress.lastName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          address_line_1: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zipCode,
          country: shippingAddress.country,
        },
        payment_method: paymentMethod === 'apple' ? 'apple_pay' : 
                       paymentMethod === 'google' ? 'google_pay' : 
                       paymentMethod,
        billing_same_as_shipping: sameAsBilling,
      };

      const resultAction = await dispatch(createOrder(orderData));
      if (createOrder.fulfilled.match(resultAction)) {
        setCreatedOrder(resultAction.payload);
        handleNext(); // Advance to confirmation step
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload as string);
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  };

  return (
    <PayPalScriptProvider 
      options={{ 
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "AfIRJm_4l0QFrJRdTcZ9B3Eid4AV1_z5F7P_7TE3HjUXUQCNJ4zF8Ot_KH_BbV3f5SThKgUuBF0U1X9M",
        currency: "USD",
        components: "buttons"
      }}
    >
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Progress Stepper */}
        <Card sx={{ mb: 4, borderRadius: '16px' }}>
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: 600,
                        '&.Mui-active': {
                          color: theme.palette.primary.main,
                        },
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card sx={{ borderRadius: '16px', textAlign: 'center', py: 6 }}>
            <CardContent>
              <Typography>Loading your cart...</Typography>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card sx={{ borderRadius: '16px', textAlign: 'center', py: 6 }}>
            <CardContent>
              <Alert severity="error" sx={{ mb: 3 }}>
                Failed to load cart: {error}
              </Alert>
              <Button 
                variant="contained" 
                onClick={() => dispatch(fetchCart())}
                sx={{ borderRadius: '12px', mr: 2 }}
              >
                Retry
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/products')}
                sx={{ borderRadius: '12px' }}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty Cart State */}
        {!loading && !error && cartItems.length === 0 && (
          <Card sx={{ borderRadius: '16px', textAlign: 'center', py: 6 }}>
            <CardContent>
              <ShoppingCart sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Your cart is empty</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Add some products to your cart to continue with checkout
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/products')}
                sx={{ borderRadius: '12px' }}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content - Only show if cart has items and no error */}
        {!loading && !error && cartItems.length > 0 && (
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            {/* Step 1: Cart Review */}
            {activeStep === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ borderRadius: '16px', mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <ShoppingCart sx={{ mr: 2, color: theme.palette.primary.main }} />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Review Your Cart ({cartItems.length} items)
                      </Typography>
                    </Box>

                    {cartItems.map((item) => (
                      <Box key={item.id} sx={{ mb: 3, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={2}>
                            <Box
                              component="img"
                              src={item.image}
                              alt={item.name}
                              sx={{
                                width: '100%',
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: '8px',
                              }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                              ✓ In Stock
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                sx={{ border: '1px solid', borderColor: 'divider' }}
                              >
                                <Remove />
                              </IconButton>
                              <Typography sx={{ mx: 2, minWidth: 20, textAlign: 'center' }}>
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                sx={{ border: '1px solid', borderColor: 'divider' }}
                              >
                                <Add />
                              </IconButton>
                            </Box>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                              ${item.price.toFixed(2)} each
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              onClick={() => removeItem(item.id)}
                              sx={{
                                color: 'error.main',
                                '&:hover': { bgcolor: alpha('#ef4444', 0.1) },
                              }}
                            >
                              <DeleteOutline />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/products')}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
                      >
                        Continue Shopping
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={cartItems.length === 0}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                        }}
                      >
                        Proceed to Shipping
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Shipping Information */}
            {activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ borderRadius: '16px', mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <LocalShipping sx={{ mr: 2, color: theme.palette.primary.main }} />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Shipping Information
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={shippingAddress.lastName}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={shippingAddress.email}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Street Address"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="City"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="State"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="ZIP Code"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                          sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Shipping Options */}
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Shipping Method
                      </Typography>
                      <RadioGroup defaultValue="standard">
                        <Card sx={{ mb: 2, borderRadius: '12px' }}>
                          <CardContent sx={{ p: 2 }}>
                            <FormControlLabel
                              value="standard"
                              control={<Radio />}
                              label={
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Standard Shipping (5-7 business days)
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {subtotal > 50 ? 'FREE' : '$9.99'}
                                  </Typography>
                                </Box>
                              }
                            />
                          </CardContent>
                        </Card>
                        <Card sx={{ mb: 2, borderRadius: '12px' }}>
                          <CardContent sx={{ p: 2 }}>
                            <FormControlLabel
                              value="express"
                              control={<Radio />}
                              label={
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Express Shipping (2-3 business days)
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    $19.99
                                  </Typography>
                                </Box>
                              }
                            />
                          </CardContent>
                        </Card>
                        <Card sx={{ borderRadius: '12px' }}>
                          <CardContent sx={{ p: 2 }}>
                            <FormControlLabel
                              value="overnight"
                              control={<Radio />}
                              label={
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Overnight Shipping (1 business day)
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    $39.99
                                  </Typography>
                                </Box>
                              }
                            />
                          </CardContent>
                        </Card>
                      </RadioGroup>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
                      >
                        Back to Cart
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                        }}
                      >
                        Continue to Payment
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ borderRadius: '16px', mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Payment sx={{ mr: 2, color: theme.palette.primary.main }} />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Payment Method
                      </Typography>
                    </Box>

                    <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <Card sx={{ mb: 2, borderRadius: '12px', border: paymentMethod === 'card' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'card' ? theme.palette.primary.main : 'divider' }}>
                        <CardContent sx={{ p: 3 }}>
                          <FormControlLabel
                            value="card"
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CreditCard sx={{ mr: 2 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  Credit/Debit Card
                                </Typography>
                              </Box>
                            }
                          />
                          <Collapse in={paymentMethod === 'card'}>
                            <Box sx={{ mt: 3, pl: 4 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Card Number"
                                    placeholder="1234 5678 9012 3456"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    fullWidth
                                    label="Expiry Date"
                                    placeholder="MM/YY"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    fullWidth
                                    label="CVV"
                                    placeholder="123"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Cardholder Name"
                                    placeholder="John Doe"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>

                      <Card sx={{ mb: 2, borderRadius: '12px', border: paymentMethod === 'paypal' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'paypal' ? theme.palette.primary.main : 'divider' }}>
                        <CardContent sx={{ p: 3 }}>
                          <FormControlLabel
                            value="paypal"
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountBalanceWallet sx={{ mr: 2 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  PayPal
                                </Typography>
                              </Box>
                            }
                          />
                          <Collapse in={paymentMethod === 'paypal'}>
                            <Box sx={{ mt: 3, pl: 4 }}>
                              <PayPalPayment
                                amount={cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
                                onSuccess={async (details: any) => {
                                  console.log('PayPal payment successful:', details);
                                  try {
                                    const order = await createOrderHandler();
                                    console.log('Order created:', order);
                                    handleNext(); // Proceed to confirmation step
                                  } catch (error) {
                                    console.error('Failed to create order:', error);
                                    // Handle error - maybe show an error message
                                  }
                                }}
                                onError={(error: any) => {
                                  console.error('PayPal payment error:', error);
                                }}
                              />
                            </Box>
                          </Collapse>
                        </CardContent>
                      </Card>

                      <Card sx={{ mb: 2, borderRadius: '12px', border: paymentMethod === 'apple' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'apple' ? theme.palette.primary.main : 'divider' }}>
                        <CardContent sx={{ p: 3 }}>
                          <FormControlLabel
                            value="apple"
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Apple sx={{ mr: 2 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  Apple Pay
                                </Typography>
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>

                      <Card sx={{ borderRadius: '12px', border: paymentMethod === 'google' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'google' ? theme.palette.primary.main : 'divider' }}>
                        <CardContent sx={{ p: 3 }}>
                          <FormControlLabel
                            value="google"
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Google sx={{ mr: 2 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  Google Pay
                                </Typography>
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>
                    </RadioGroup>

                    {/* Security Indicators */}
                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: '12px',
                        bgcolor: alpha('#10b981', 0.05),
                        border: '1px solid',
                        borderColor: alpha('#10b981', 0.2),
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Security sx={{ color: '#10b981', mr: 1 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#10b981' }}>
                          Your payment is secure
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        We use industry-standard encryption to protect your payment information.
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
                      >
                        Back to Shipping
                      </Button>
                      <Button
                        variant="contained"
                        onClick={createOrderHandler}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                        }}
                      >
                        Place Order
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {activeStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ borderRadius: '16px', textAlign: 'center' }}>
                  <CardContent sx={{ p: 6 }}>
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 3,
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <CheckCircle sx={{ fontSize: '4rem', color: 'white' }} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#10b981' }}>
                      Order Confirmed!
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Order #{createdOrder?.order_number || 'Processing...'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                      Thank you for your purchase! We've sent a confirmation email to {shippingAddress.email}
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item>
                        <Button
                          variant="contained"
                          onClick={() => navigate('/orders')}
                          sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                          }}
                        >
                          Track Your Order
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          onClick={() => navigate('/products')}
                          sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                          }}
                        >
                          Continue Shopping
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Grid>

          {/* Order Summary Sidebar */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: '16px', position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Order Summary
                </Typography>

                {/* Collapsible Cart Items */}
                <Box
                  onClick={() => toggleSection('items')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">
                    {cartItems.length} items in cart
                  </Typography>
                  {expandedSection === 'items' ? <ExpandLess /> : <ExpandMore />}
                </Box>

                <Collapse in={expandedSection === 'items'}>
                  <Box sx={{ mb: 3 }}>
                    {cartItems.map((item) => (
                      <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={item.image}
                          variant="rounded"
                          sx={{ width: 50, height: 50, mr: 2 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Qty: {item.quantity}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Collapse>

                <Divider sx={{ my: 2 }} />

                {/* Promo Code */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      size="small"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={applyPromoCode}
                      disabled={promoApplied}
                      sx={{ borderRadius: '8px', textTransform: 'none' }}
                    >
                      Apply
                    </Button>
                  </Box>
                  {promoApplied && (
                    <Alert severity="success" sx={{ borderRadius: '8px' }}>
                      Promo code applied! 10% discount
                    </Alert>
                  )}
                </Box>

                {/* Price Breakdown */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2" color={shipping === 0 ? 'success.main' : 'text.primary'}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tax</Typography>
                    <Typography variant="body2">${tax.toFixed(2)}</Typography>
                  </Box>
                  {discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">Discount</Typography>
                      <Typography variant="body2" color="success.main">-${discount.toFixed(2)}</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                {/* Trust Indicators */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: alpha('#10b981', 0.05),
                    border: '1px solid',
                    borderColor: alpha('#10b981', 0.2),
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Verified sx={{ color: '#10b981', mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      100% Secure Checkout
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    SSL encrypted • Secure payment processing
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        )}
      </Container>
      </Box>
    </PayPalScriptProvider>
  );
};

export default CheckoutPage;