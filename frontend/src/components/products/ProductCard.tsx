import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Rating,
  Badge,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  FavoriteBorder as WishlistIcon,
  Favorite as WishlistFilledIcon,
  Visibility as ViewIcon,
  LocalOffer as OfferIcon,
  Star as StarIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { openQuickView } from '../../store/slices/uiSlice';
import { Product } from '../../types';
import { getProductImageUrl } from '../../utils/imageUtils';

interface ProductCardProps {
  product: Product;
  elevation?: number;
  showQuickActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  elevation = 2,
  showQuickActions = true,
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const isInWishlist = Array.isArray(wishlistItems) && wishlistItems.some((item) => item.product?.id === product.id);
  
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const salePrice = product.sale_price 
    ? (typeof product.sale_price === 'string' ? parseFloat(product.sale_price) : product.sale_price)
    : null;

  const discountPercentage = salePrice 
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  const finalPrice = salePrice || price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product.id));
    }
  };

  return (
    <Card
      elevation={elevation}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8],
          '& .product-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          },
          '& .product-image': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Product Badges */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
        {!product.in_stock && (
          <Chip
            label="Out of Stock"
            size="small"
            sx={{
              backgroundColor: '#f44336',
              color: 'white',
              fontWeight: 'bold',
              mb: 1,
              display: 'block',
            }}
          />
        )}
        {product.is_featured && (
          <Chip
            label="Featured"
            size="small"
            icon={<StarIcon sx={{ fontSize: 16 }} />}
            sx={{
              backgroundColor: '#ff9800',
              color: 'white',
              fontWeight: 'bold',
              mb: 1,
              display: 'block',
            }}
          />
        )}
        {discountPercentage > 0 && (
          <Chip
            label={`-${discountPercentage}%`}
            size="small"
            icon={<OfferIcon sx={{ fontSize: 16 }} />}
            sx={{
              backgroundColor: '#4caf50',
              color: 'white',
              fontWeight: 'bold',
              display: 'block',
            }}
          />
        )}
      </Box>

      {/* Wishlist Button */}
      <IconButton
        onClick={handleWishlistToggle}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          backgroundColor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,1)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {isInWishlist ? (
          <WishlistFilledIcon sx={{ color: '#f44336' }} />
        ) : (
          <WishlistIcon />
        )}
      </IconButton>

      {/* Product Image */}
      <Box
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `/products/${product.slug}`;
        }}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          color: 'inherit',
        }}
      >
        <CardMedia
          component="img"
          height="240"
          image={getProductImageUrl(product.featured_image)}
          alt={product.name}
          className="product-image"
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />
        
        {/* Quick Actions Overlay */}
        {showQuickActions && (
          <Box
            className="product-actions"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              p: 2,
              opacity: 0,
              transform: 'translateY(10px)',
              transition: 'all 0.3s ease',
            }}
          >
            <Tooltip title="Quick View">
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dispatch(openQuickView(product));
                }}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'white',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
            
            {product.in_stock && (
              <Tooltip title="Add to Cart">
                <IconButton
                  onClick={handleAddToCart}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <CartIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ mb: 1 }}>
          <Chip
            label={product.category?.name || 'Uncategorized'}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              height: 24,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            }}
          />
        </Box>

        <Typography
          variant="h6"
          component={Link}
          to={`/products/${product.slug}`}
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.3,
            textDecoration: 'none',
            color: 'inherit',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
            '&:hover': {
              color: theme.palette.primary.main,
            },
            transition: 'color 0.3s ease',
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            lineHeight: 1.4,
          }}
        >
          {product.short_description || product.description}
        </Typography>

        {/* Rating & Reviews */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Rating
            value={product.avg_rating || 0}
            precision={0.5}
            size="small"
            readOnly
            sx={{ color: '#ffa726' }}
          />
          <Typography variant="caption" color="text.secondary">
            ({product.review_count || 0} reviews)
          </Typography>
          {product.is_verified && (
            <Tooltip title="Verified Product">
              <VerifiedIcon sx={{ fontSize: 16, color: '#4caf50' }} />
            </Tooltip>
          )}
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            ${finalPrice.toFixed(2)}
          </Typography>
          {salePrice && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary',
              }}
            >
              ${price.toFixed(2)}
            </Typography>
          )}
        </Box>

        {/* Stock Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: product.in_stock ? '#4caf50' : '#f44336',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {product.in_stock
              ? `${product.stock_quantity} in stock`
              : 'Out of stock'
            }
          </Typography>
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          startIcon={<CartIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1,
            background: product.in_stock
              ? 'linear-gradient(45deg, #2196f3, #1976d2)'
              : undefined,
            '&:hover': {
              background: product.in_stock
                ? 'linear-gradient(45deg, #1976d2, #1565c0)'
                : undefined,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;