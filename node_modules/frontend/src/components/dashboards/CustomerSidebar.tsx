import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ShoppingBag as OrdersIcon,
  RateReview as ReviewIcon,
  Support as SupportIcon,
  Favorite as WishlistIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    '& .MuiListItemIcon-root': {
      color: 'white',
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface CustomerSidebarProps {
  open: boolean;
  onClose: () => void;
  mobileOpen?: boolean;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  open,
  onClose,
  mobileOpen = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Mock user data - replace with real user data from Redux
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/api/placeholder/100/100'
  };

  const menuItems: MenuItem[] = [
    {
      path: '/customer/dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />
    },
    {
      path: '/customer/profile',
      label: 'My Profile',
      icon: <PersonIcon />
    },
    {
      path: '/customer/orders',
      label: 'My Orders',
      icon: <OrdersIcon />,
      badge: 3
    },
    {
      path: '/customer/reviews',
      label: 'My Reviews',
      icon: <ReviewIcon />
    },
    {
      path: '/customer/support',
      label: 'Support Tickets',
      icon: <SupportIcon />,
      badge: 1
    },
    {
      path: '/wishlist',
      label: 'Wishlist',
      icon: <WishlistIcon />,
      badge: 5
    },
    {
      path: '/customer/payment-methods',
      label: 'Payment Methods',
      icon: <PaymentIcon />
    },
    {
      path: '/customer/security',
      label: 'Security',
      icon: <SecurityIcon />
    },
    {
      path: '/customer/notifications',
      label: 'Notifications',
      icon: <NotificationsIcon />
    }
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    navigate('/');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Profile Section */}
      <ProfileSection>
        <Avatar
          src={user.avatar}
          alt={user.name}
          sx={{ 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 2,
            border: '3px solid rgba(255,255,255,0.3)'
          }}
        />
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {user.name}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {user.email}
        </Typography>
      </ProfileSection>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <StyledListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleMenuClick(item.path)}
              >
                <ListItemIcon>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: location.pathname === item.path ? 600 : 400
                  }}
                />
              </StyledListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout Section */}
      <Box sx={{ p: 1 }}>
        <Divider sx={{ mb: 1 }} />
        <ListItem disablePadding>
          <StyledListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: 400
              }}
            />
          </StyledListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <StyledDrawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
    >
      {drawer}
    </StyledDrawer>
  );
};

export default CustomerSidebar;