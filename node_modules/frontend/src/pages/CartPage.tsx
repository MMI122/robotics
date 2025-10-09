import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  Divider,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  FavoriteBorder,
  LocalShipping,
  Security,
  CheckCircle,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import { addToWishlist } from '../store/slices/wishlistSlice';
import { getProductImageUrl } from '../utils/imageUtils';

const CartPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: cartItems, loading, totalPrice, totalItems } = useAppSelector((state) => state.cart);
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.product?.sale_price || item.product?.price || 0);
    return sum + (price * item.quantity);
  }, 0);
  
  const savings = cartItems.reduce((sum, item) => {
    if (item.product?.sale_price && item.product?.price) {
      const originalPrice = Number(item.product.price);
      const salePrice = Number(item.product.sale_price);
      return sum + ((originalPrice - salePrice) * item.quantity);
    }
    return sum;
  }, 0);
  
  const shipping = subtotal > 50 ? 0 : 8.99;
  const tax = subtotal * 0.08;
  const discount = appliedPromo ? subtotal * 0.1 : 0;
  const finalTotal = subtotal + shipping + tax - discount;

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await dispatch(updateCartItem({ id: itemId, quantity: newQuantity })).unwrap();
      setSnackbar({
        open: true,
        message: 'Cart updated successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update cart',
        severity: 'error',
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      setSnackbar({
        open: true,
        message: 'Item removed from cart',
        severity: 'info',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to remove item',
        severity: 'error',
      });
    }
  };

  const handleMoveToWishlist = async (itemId: number) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    if (cartItem) {
      try {
        await dispatch(addToWishlist(cartItem.product_id)).unwrap();
        await dispatch(removeFromCart(itemId)).unwrap();
        setSnackbar({
          open: true,
          message: 'Item moved to wishlist',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to move to wishlist',
          severity: 'error',
        });
      }
    }
  };
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setAppliedPromo(promoCode);
      setSnackbar({
        open: true,
        message: '10% discount applied!',
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Invalid promo code',
        severity: 'error',
      });
    }
    setPromoCode('');
  };

  const steps = ['Shopping Cart', 'Checkout', 'Payment', 'Confirmation'];

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading cart...
        </Typography>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added anything to your cart yet
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/products')}
          sx={{
            borderRadius: '12px',
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{
            mb: 2,
            color: 'text.secondary',
            textTransform: 'none',
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          Continue Shopping
        </Button>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1e293b, #475569)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Shopping Cart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
        </Typography>
      </Box>

      {/* Progress Stepper */}
      <Card sx={{ mb: 4, borderRadius: '16px' }}>
        <CardContent sx={{ py: 3 }}>
          <Stepper activeStep={0} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: '16px', mb: 3 }}>
            <CardContent sx={{ p: 0 }}>
              {cartItems.map((item, index) => (
                <Box key={item.id}>
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      {/* Product Image */}
                      <Grid item xs={12} sm={3}>
                        <Box
                          sx={{
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                          }}
                          onClick={() => navigate(`/products/${item.product?.slug}`)}
                        >
                          <Box
                            component="img"
                            src={getProductImageUrl(item.product?.featured_image)}
                            alt={item.product?.name}
                            sx={{
                              width: '100%',
                              height: 120,
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease',
                              '&:hover': { transform: 'scale(1.05)' },
                            }}
                          />
                          {item.product?.sale_price && item.product?.price && item.product.sale_price < item.product.price && (
                            <Chip
                              label={`-${Math.round(((item.product.price - item.product.sale_price) / item.product.price) * 100)}%`}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                bgcolor: '#ef4444',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          )}
                          {!item.product?.in_stock && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bgcolor: alpha('#000', 0.5),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Chip
                                label="Out of Stock"
                                sx={{
                                  bgcolor: '#ef4444',
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Grid>

                      {/* Product Details */}
                      <Grid item xs={12} sm={9}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={6}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                mb: 1,
                                cursor: 'pointer',
                                '&:hover': { color: theme.palette.primary.main },
                              }}
                              onClick={() => navigate(`/products/${item.product?.slug}`)}
                            >
                              {item.product?.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <Chip label={item.product?.category?.name || 'Electronics'} size="small" variant="outlined" />
                              <Chip label={item.product?.sku} size="small" variant="outlined" />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
                                ${Number(item.product?.sale_price || item.product?.price || 0).toFixed(2)}
                              </Typography>
                              {item.product?.sale_price && item.product?.price && item.product.sale_price < item.product.price && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: 'line-through',
                                    color: 'text.secondary',
                                  }}
                                >
                                  ${Number(item.product.price).toFixed(2)}
                                </Typography>
                              )}
                            </Box>
                            {item.product?.in_stock && (
                              <Typography variant="caption" color="text.secondary">
                                {item.product.stock_quantity} in stock
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              {/* Quantity Controls */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={!item.product?.in_stock || item.quantity <= 1}
                                  sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: '8px',
                                  }}
                                >
                                  <Remove />
                                </IconButton>
                                <TextField
                                  value={item.quantity}
                                  size="small"
                                  sx={{
                                    width: 60,
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '8px',
                                      textAlign: 'center',
                                    },
                                  }}
                                  inputProps={{
                                    style: { textAlign: 'center' },
                                    readOnly: true,
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={!item.product?.in_stock || item.quantity >= (item.product?.stock_quantity || 0)}
                                  sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: '8px',
                                  }}
                                >
                                  <Add />
                                </IconButton>
                              </Box>

                              {/* Action Buttons */}
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleMoveToWishlist(item.id)}
                                  sx={{
                                    color: '#ec4899',
                                    '&:hover': { bgcolor: alpha('#ec4899', 0.1) },
                                  }}
                                >
                                  <FavoriteBorder />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveItem(item.id)}
                                  sx={{
                                    color: '#ef4444',
                                    '&:hover': { bgcolor: alpha('#ef4444', 0.1) },
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </Box>

                            {/* Item Total */}
                            <Box sx={{ textAlign: 'right', mt: 2 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                ${(Number(item.product?.sale_price || item.product?.price || 0) * item.quantity).toFixed(2)}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                  {index < cartItems.length - 1 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Promo Code
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleApplyPromo}
                  disabled={!promoCode}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Apply
                </Button>
              </Box>
              {appliedPromo && (
                <Chip
                  label={`${appliedPromo} - 10% off applied`}
                  color="success"
                  sx={{ mt: 2, fontWeight: 600 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: '16px', position: 'sticky', top: 100 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal ({cartItems.length} items)</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Box>
                {savings > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="success.main">Savings</Typography>
                    <Typography color="success.main">-${savings.toFixed(2)}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax</Typography>
                  <Typography>${tax.toFixed(2)}</Typography>
                </Box>
                {discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="success.main">Discount</Typography>
                    <Typography color="success.main">-${discount.toFixed(2)}</Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
                  ${finalTotal.toFixed(2)}
                </Typography>
              </Box>

              {shipping > 0 && (
                <Box
                  sx={{
                    bgcolor: alpha('#0ea5e9', 0.1),
                    border: '1px solid',
                    borderColor: alpha('#0ea5e9', 0.2),
                    borderRadius: '12px',
                    p: 2,
                    mb: 3,
                  }}
                >
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalShipping sx={{ mr: 1, color: '#0ea5e9' }} />
                    Add ${Number(50 - subtotal).toFixed(2)} more for FREE shipping
                  </Typography>
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/checkout')}
                disabled={cartItems.some(item => !item.product?.in_stock)}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #0ea5e9, #06b6d4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0284c7, #0891b2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Proceed to Checkout
              </Button>

              {/* Security Features */}
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Your order is protected by:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Security sx={{ color: '#10b981', mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">Secure SSL encryption</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle sx={{ color: '#10b981', mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">Money-back guarantee</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShipping sx={{ color: '#10b981', mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">Fast & secure delivery</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CartPage;