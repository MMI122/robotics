import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as ProfileIcon,
  ShoppingBag as OrdersIcon,
  Favorite as WishlistIcon,
  RateReview as ReviewsIcon,
  Support as SupportIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  LocationOn as AddressIcon,
  Security as SecurityIcon,
  Menu as MenuIcon,
  Help as HelpIcon,
  ContactSupport as ContactIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

const drawerWidth = 280;

interface CustomerSidebarProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state: any) => state.auth);
  const { items: cartItems } = useAppSelector((state: any) => state.cart);
  
  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/customer/dashboard',
    },
    {
      title: 'My Profile',
      icon: <ProfileIcon />,
      path: '/customer/profile',
    },
    {
      title: 'My Orders',
      icon: <OrdersIcon />,
      path: '/customer/orders',
    },
    {
      title: 'Wishlist',
      icon: <WishlistIcon />,
      path: '/customer/wishlist',
    },
    {
      title: 'My Reviews',
      icon: <ReviewsIcon />,
      path: '/customer/reviews',
    },
    {
      title: 'Addresses',
      icon: <AddressIcon />,
      path: '/customer/addresses',
    },
    {
      title: 'Payment Methods',
      icon: <PaymentIcon />,
      path: '/customer/payment-methods',
    },
    {
      title: 'Notifications',
      icon: <NotificationsIcon />,
      path: '/customer/notifications',
      badge: 3, // Example notification count
    },
    {
      title: 'Support Tickets',
      icon: <SupportIcon />,
      path: '/customer/support',
    },
    {
      title: 'Help Center',
      icon: <HelpIcon />,
      path: '/customer/help',
    },
    {
      title: 'Contact Us',
      icon: <ContactIcon />,
      path: '/customer/contact',
    },
    {
      title: 'Account Settings',
      icon: <SettingsIcon />,
      path: '/customer/settings',
    },
    {
      title: 'Security',
      icon: <SecurityIcon />,
      path: '/customer/security',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const renderMenuItem = (item: MenuItem) => {
    const isActive = isActiveRoute(item.path);

    return (
      <ListItemButton
        key={item.title}
        onClick={() => handleNavigation(item.path)}
        sx={{
          borderRadius: '12px',
          mx: 1,
          mb: 0.5,
          backgroundColor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
          borderLeft: isActive ? `4px solid ${theme.palette.primary.main}` : 'none',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            transform: 'translateX(4px)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
            minWidth: 40,
          }}
        >
          {item.badge ? (
            <Badge badgeContent={item.badge} color="error">
              {item.icon}
            </Badge>
          ) : (
            item.icon
          )}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          sx={{
            '& .MuiListItemText-primary': {
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
            },
          }}
        />
      </ListItemButton>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Avatar
          src={user?.avatar}
          sx={{
            width: 56,
            height: 56,
            border: '3px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
        <Box sx={{ flex: 1, zIndex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {user?.name || 'Customer'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
            {user?.email || 'customer@example.com'}
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} sx={{ color: 'white', zIndex: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Quick Stats */}
      <Box sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Total Orders
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            12
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Wishlist Items
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            5
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Reward Points
          </Typography>
          <Typography variant="body2" fontWeight={600} color="primary">
            1,250
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2, overflowY: 'auto' }}>
        <List component="nav" disablePadding>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box
          sx={{
            p: 2,
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.light}20)`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block">
            Need Help?
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', fontWeight: 600 }}
            onClick={() => handleNavigation('/customer/support')}
          >
            Contact Support
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        },
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default CustomerSidebar;