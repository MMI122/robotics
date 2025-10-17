import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Button,
  Box,
  IconButton,
  Rating,
  Chip,
  Divider,
  CardMedia,
  useTheme,
  useMediaQuery,
  Fade,
  Backdrop,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  FavoriteBorder as WishlistIcon,
  Favorite as WishlistFilledIcon,
  Share as ShareIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { closeQuickView } from '../../store/slices/uiSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { Product } from '../../types';
import { getProductImageUrl } from '../../utils/imageUtils';

const ProductQuickView: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  
  const { quickView } = useAppSelector((state: any) => state.ui);
  const { items: wishlistItems } = useAppSelector((state: any) => state.wishlist);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product: Product = quickView.product;
  const isOpen = quickView.isOpen && product;

  const isInWishlist = product ? wishlistItems.some((item: any) => item.product?.id === product.id) : false;

  const handleClose = () => {
    dispatch(closeQuickView());
    setQuantity(1);
    setSelectedImage(0);
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        productId: product.id,
        quantity,
      }));
      // Could show success notification here
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product.id));
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (!product) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Fade}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
      }}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          maxHeight: '90vh',
          overflow: 'hidden',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Quick View
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', height: { xs: '300px', md: '500px' } }}>
              <CardMedia
                component="img"
                image={getProductImageUrl(product.featured_image)}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              
              {/* Image zoom button */}
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
                onClick={() => window.open(getProductImageUrl(product.featured_image), '_blank')}
              >
                <ZoomInIcon />
              </IconButton>

              {/* Discount badge */}
              {product.sale_price && product.sale_price < product.price && (
                <Chip
                  label={`-${Math.round((1 - product.sale_price / product.price) * 100)}%`}
                  color="error"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontWeight: 'bold',
                  }}
                />
              )}
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
              {/* Category */}
              <Chip
                label={product.category?.name || 'Uncategorized'}
                size="small"
                variant="outlined"
                sx={{ mb: 2 }}
              />

              {/* Product Name */}
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                {product.name}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating
                  value={product.avg_rating || 0}
                  precision={0.5}
                  size="small"
                  readOnly
                />
                <Typography variant="body2" color="text.secondary">
                  ({product.review_count || 0} reviews)
                </Typography>
              </Box>

              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatPrice(product.sale_price || product.price)}
                  </Typography>
                  {product.sale_price && product.sale_price < product.price && (
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                      }}
                    >
                      {formatPrice(product.price)}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Stock Status */}
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={product.in_stock ? 'In Stock' : 'Out of Stock'}
                  color={product.in_stock ? 'success' : 'error'}
                  size="small"
                />
              </Box>

              {/* Description */}
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {product.short_description || product.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Quantity Selector */}
              {product.in_stock && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Quantity:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ px: 2, minWidth: 40, textAlign: 'center' }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {product.in_stock && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CartIcon />}
                    onClick={handleAddToCart}
                    sx={{ flex: 1 }}
                  >
                    Add to Cart
                  </Button>
                )}
                <IconButton
                  onClick={handleWishlistToggle}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    color: isInWishlist ? 'error.main' : 'inherit',
                  }}
                >
                  {isInWishlist ? <WishlistFilledIcon /> : <WishlistIcon />}
                </IconButton>
                <IconButton
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        url: window.location.origin + `/products/${product.slug}`,
                      });
                    }
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>

              {/* View Full Details Link */}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  handleClose();
                  window.location.href = `/products/${product.slug}`;
                }}
              >
                View Full Details
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;