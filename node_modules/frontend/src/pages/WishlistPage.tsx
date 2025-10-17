import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Rating,
  Chip,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  ShoppingCart as CartIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  SelectAll as SelectAllIcon,
  Clear as ClearIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Compare as CompareIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { getProductImageUrl } from '../utils/imageUtils';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  },
}));

const WishlistHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(4, 0),
  marginBottom: theme.spacing(4),
}));

const ProductActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

interface WishlistStats {
  totalItems: number;
  totalValue: number;
  onSaleItems: number;
  averageRating: number;
}

const WishlistPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get auth state
  const { isAuthenticated, user } = useAppSelector((state: any) => state.auth);
  
  // Get wishlist data from Redux store
  const { items: wishlistItems, loading, error } = useAppSelector((state) => state.wishlist);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [createListDialogOpen, setCreateListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Fetch wishlist data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Fetching wishlist...');
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Add error handling
  useEffect(() => {
    if (error) {
      console.error('Wishlist error:', error);
    }
  }, [error]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Please log in to view your wishlist
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  // Calculate stats based on real wishlist data
  const stats = React.useMemo(() => {
    if (!wishlistItems.length) return null;

    const totalItems = wishlistItems.length;
    const totalValue = wishlistItems.reduce((sum, item) => {
      const price = Number(item.product?.sale_price) || Number(item.product?.price) || 0;
      return sum + price;
    }, 0);
    const onSaleItems = wishlistItems.filter(item => 
      item.product?.sale_price && Number(item.product.sale_price) < Number(item.product.price)
    ).length;
    const averageRating = wishlistItems.length > 0 
      ? wishlistItems.reduce((sum, item) => 
          sum + (item.product?.avg_rating || 0), 0
        ) / totalItems 
      : 0;

    return {
      totalItems,
      totalValue: Number(totalValue),
      onSaleItems,
      averageRating: Number(averageRating),
    };
  }, [wishlistItems]);

  // Helper functions
  const handleSelectItem = (itemId: number, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.id));
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromWishlist(productId));
    setSelectedItems(prev => prev.filter(id => id !== productId));
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(productId => {
      // Find the wishlist item to get the product ID
      const wishlistItem = wishlistItems.find(item => item.id === productId);
      if (wishlistItem?.product?.id) {
        dispatch(removeFromWishlist(wishlistItem.product.id));
      }
    });
    setSelectedItems([]);
  };

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({ 
      productId: item.product.id, 
      quantity: 1 
    }));
  };

  const handleAddSelectedToCart = () => {
    const selectedProducts = wishlistItems.filter(item => 
      selectedItems.includes(item.id) && item.product?.in_stock
    );
    selectedProducts.forEach(item => handleAddToCart(item));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedItem(null);
  };

  const handleShare = () => {
    setShareDialogOpen(true);
    handleMenuClose();
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      // Create new wishlist logic
      console.log('Creating new list:', newListName);
      setCreateListDialogOpen(false);
      setNewListName('');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 4, borderRadius: 2 }} />
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Failed to load wishlist
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => dispatch(fetchWishlist())}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      {/* Wishlist Header */}
      <WishlistHeader>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  <FavoriteIcon sx={{ mr: 2, fontSize: 'inherit', verticalAlign: 'middle' }} />
                  My Wishlist
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
                  Keep track of products you love and get notified about price drops
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {stats && (
                    <>
                      <Chip 
                        label={`${stats.totalItems} Items`} 
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                      <Chip 
                        label={`$${stats.totalValue.toFixed(2)} Total Value`} 
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                      <Chip 
                        label={`${stats.onSaleItems} On Sale`} 
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                      <Chip 
                        label={`${stats.averageRating.toFixed(1)} ⭐ Avg. Rating`} 
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                      />
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white' }}
                    startIcon={<AddIcon />}
                    onClick={() => setCreateListDialogOpen(true)}
                  >
                    Create List
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                    startIcon={<ShareIcon />}
                    onClick={() => setShareDialogOpen(true)}
                  >
                    Share Wishlist
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </WishlistHeader>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {wishlistItems.length === 0 ? (
            // Empty Wishlist
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <FavoriteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                Your wishlist is empty
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                Start adding products you love to your wishlist. You'll get notified about price drops and special offers.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/products')}
                startIcon={<AddIcon />}
              >
                Start Shopping
              </Button>
            </Box>
          ) : (
            <>
              {/* Bulk Actions */}
              <Box sx={{ mb: 4 }}>
                <Paper sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedItems.length === wishlistItems.length}
                            indeterminate={selectedItems.length > 0 && selectedItems.length < wishlistItems.length}
                            onChange={handleSelectAll}
                          />
                        }
                        label={`Select All (${selectedItems.length}/${wishlistItems.length})`}
                      />
                    </Grid>
                    <Grid item xs>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedItems.length > 0 && (
                          <>
                            <Button
                              variant="contained"
                              startIcon={<CartIcon />}
                              onClick={handleAddSelectedToCart}
                              disabled={!wishlistItems.some(item => selectedItems.includes(item.id) && item.product?.in_stock)}
                            >
                              Add Selected to Cart
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={handleRemoveSelected}
                            >
                              Remove Selected
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<CompareIcon />}
                              disabled={selectedItems.length < 2}
                            >
                              Compare
                            </Button>
                          </>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Price Drop Alerts */}
              {wishlistItems.some(item => 
                item.product?.sale_price && Number(item.product.sale_price) < Number(item.product.price)
              ) && (
                <Alert severity="success" sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    🎉 Price Drops Alert!
                  </Typography>
                  <Typography variant="body2">
                    {wishlistItems.filter(item => 
                      item.product?.sale_price && Number(item.product.sale_price) < Number(item.product.price)
                    ).length} items in your wishlist have price drops. 
                    Don't miss out on these deals!
                  </Typography>
                </Alert>
              )}

              {/* Wishlist Items */}
              <AnimatePresence>
                <Grid container spacing={3}>
                  {wishlistItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    
                    const hasDiscount = product.sale_price && Number(product.sale_price) < Number(product.price);
                    const discountPercentage = hasDiscount 
                      ? Math.round((1 - Number(product.sale_price) / Number(product.price)) * 100)
                      : 0;

                    return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StyledCard>
                          <ProductActions>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedItems.includes(item.id)}
                                  onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                                  sx={{ 
                                    bgcolor: 'background.paper', 
                                    borderRadius: 1,
                                    '&:hover': { bgcolor: 'grey.100' }
                                  }}
                                />
                              }
                              label=""
                              sx={{ m: 0 }}
                            />
                            <IconButton
                              size="small"
                              sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'grey.100' } }}
                              onClick={(e) => handleMenuOpen(e, item)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </ProductActions>

                          {/* Price Drop Badge */}
                          {hasDiscount && (
                            <Chip
                              label={`${discountPercentage}% OFF`}
                              color="error"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                zIndex: 1,
                                fontWeight: 600
                              }}
                            />
                          )}

                          <CardMedia
                            component="img"
                            height="200"
                            image={getProductImageUrl(product.featured_image)}
                            alt={product.name}
                            onClick={() => navigate(`/products/${product.slug}`)}
                            sx={{ cursor: 'pointer' }}
                          />

                          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography 
                                gutterBottom 
                                variant="h6" 
                                component="h2" 
                                sx={{ 
                                  fontWeight: 600,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/products/${product.slug}`)}
                              >
                                {product.name}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Rating value={product.avg_rating || 0} readOnly size="small" precision={0.1} />
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                  ({product.review_count || 0})
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                  ${(Number(product.sale_price) || Number(product.price) || 0).toFixed(2)}
                                </Typography>
                                {hasDiscount && (
                                  <Typography 
                                    variant="body2" 
                                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                  >
                                    ${(Number(product.price) || 0).toFixed(2)}
                                  </Typography>
                                )}
                                {hasDiscount && (
                                  <Chip label="Sale" size="small" color="error" />
                                )}
                              </Box>

                              {/* Stock Status */}
                              {!product.in_stock && (
                                <Chip 
                                  label="Out of Stock" 
                                  size="small" 
                                  color="error" 
                                  variant="outlined"
                                  sx={{ mb: 2 }}
                                />
                              )}
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<CartIcon />}
                                disabled={!product.in_stock}
                                onClick={() => handleAddToCart(item)}
                              >
                                {product.in_stock ? 'Add to Cart' : 'Notify Me'}
                              </Button>
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveItem(product.id)}
                                sx={{ borderRadius: 1 }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </StyledCard>
                      </motion.div>
                    </Grid>
                    );
                  })}
                </Grid>
              </AnimatePresence>
            </>
          )}

          {/* Action Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleShare}>
              <ShareIcon sx={{ mr: 1 }} />
              Share Product
            </MenuItem>
            <MenuItem onClick={() => {
              if (selectedItem) navigate(`/products/${selectedItem.product.slug}`);
              handleMenuClose();
            }}>
              <LinkIcon sx={{ mr: 1 }} />
              View Product
            </MenuItem>
            <MenuItem onClick={() => {
              if (selectedItem?.product?.id) handleRemoveItem(selectedItem.product.id);
              handleMenuClose();
            }}>
              <DeleteIcon sx={{ mr: 1 }} />
              Remove from Wishlist
            </MenuItem>
          </Menu>

          {/* Share Dialog */}
          <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Share Your Wishlist</DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                Share your wishlist with friends and family
              </Typography>
              <TextField
                fullWidth
                label="Wishlist URL"
                value="https://roboticsshop.com/wishlist/abc123"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <Button onClick={() => navigator.clipboard.writeText('https://roboticsshop.com/wishlist/abc123')}>
                      Copy
                    </Button>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="outlined" startIcon={<EmailIcon />}>
                  Email
                </Button>
                <Button variant="outlined" startIcon={<FacebookIcon />}>
                  Facebook
                </Button>
                <Button variant="outlined" startIcon={<TwitterIcon />}>
                  Twitter
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Create List Dialog */}
          <Dialog open={createListDialogOpen} onClose={() => setCreateListDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Wishlist</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="List Name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g., Birthday Wishlist, Robot Parts"
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCreateListDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateList} variant="contained" disabled={!newListName.trim()}>
                Create List
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
};

export default WishlistPage;