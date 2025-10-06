import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Container,
  TextField,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  FavoriteBorder as WishlistIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const { items: cartItems } = useSelector((state: any) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleUserMenuClose();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Bar - Contact Info */}
      <Box sx={{ backgroundColor: '#1f2937', color: 'white', py: 1 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">+880 1783 007 004</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">ask@roboticsshop.com</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">Welcome, {isAuthenticated ? user?.name : 'Guest'}</Typography>
              {!isAuthenticated ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => navigate('/login')}
                    sx={{ color: '#10b981' }}
                  >
                    Sign In
                  </Button>
                  <Typography variant="body2">or</Typography>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => navigate('/register')}
                    sx={{ color: '#10b981' }}
                  >
                    Create an account
                  </Button>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Header */}
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    R
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ 
                      color: '#1f2937', 
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    ROBOTICSSHOP
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 'medium' }}>
                    DISCOVER YOURSELF
                  </Typography>
                </Box>
              </Box>
            </Link>

            {/* Search Bar */}
            <Box sx={{ flexGrow: 1, mx: 4 }}>
              <form onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search our catalog"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" sx={{ color: '#f97316' }}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </Box>

            {/* Right Side Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Wishlist */}
              <IconButton
                onClick={() => navigate('/wishlist')}
                sx={{ color: '#6b7280' }}
              >
                <Badge badgeContent={wishlistItems?.length || 0} color="error">
                  <WishlistIcon />
                </Badge>
              </IconButton>

              {/* Cart */}
              <Button
                onClick={() => navigate('/cart')}
                sx={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: '#059669',
                  },
                }}
                startIcon={
                  <Badge badgeContent={cartItems?.length || 0} color="error">
                    <CartIcon />
                  </Badge>
                }
              >
                Cart: 0 Products - BDT 0
              </Button>

              {/* User Menu */}
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={handleUserMenuOpen} sx={{ ml: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, backgroundColor: '#f97316' }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleUserMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/orders'); handleUserMenuClose(); }}>
                      My Orders
                    </MenuItem>
                    {user?.role === 'admin' && (
                      <MenuItem onClick={() => { navigate('/admin'); handleUserMenuClose(); }}>
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </Box>
              ) : (
                <IconButton onClick={() => navigate('/login')} sx={{ color: '#6b7280' }}>
                  <PersonIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </motion.div>
  );
};

export default Header;