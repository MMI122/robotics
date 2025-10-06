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
  Collapse,
  useTheme,
  useMediaQuery,
  Badge,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Category as CategoriesIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Support as SupportIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  List as ListIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon
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
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  color: 'white',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  '&.Mui-selected': {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    '& .MuiListItemIcon-root': {
      color: 'white',
    },
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  mobileOpen?: boolean;
}

interface MenuItem {
  path?: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  children?: MenuItem[];
  status?: 'new' | 'updated';
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  open,
  onClose,
  mobileOpen = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>(['products', 'orders']);

  // Mock admin user data
  const admin = {
    name: 'Admin User',
    email: 'admin@roboticsshop.com',
    avatar: '/api/placeholder/100/100',
    role: 'Super Admin'
  };

  const menuItems: MenuItem[] = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />
    },
    {
      label: 'Products',
      icon: <ProductsIcon />,
      children: [
        {
          path: '/admin/products',
          label: 'All Products',
          icon: <ListIcon />,
          badge: 156
        },
        {
          path: '/admin/products/add',
          label: 'Add Product',
          icon: <AddIcon />,
          status: 'new'
        }
      ]
    },
    {
      label: 'Categories',
      icon: <CategoriesIcon />,
      children: [
        {
          path: '/admin/categories',
          label: 'All Categories',
          icon: <ListIcon />,
          badge: 12
        },
        {
          path: '/admin/categories/add',
          label: 'Add Category',
          icon: <AddIcon />
        }
      ]
    },
    {
      label: 'Orders',
      icon: <OrdersIcon />,
      badge: 28,
      children: [
        {
          path: '/admin/orders',
          label: 'All Orders',
          icon: <ListIcon />,
          badge: 28
        },
        {
          path: '/admin/orders/pending',
          label: 'Pending Orders',
          icon: <ListIcon />,
          badge: 5
        }
      ]
    },
    {
      label: 'Customers',
      icon: <CustomersIcon />,
      children: [
        {
          path: '/admin/customers',
          label: 'All Customers',
          icon: <ListIcon />,
          badge: 2341
        }
      ]
    },
    {
      path: '/admin/support',
      label: 'Support',
      icon: <SupportIcon />,
      badge: 12
    },
    {
      path: '/admin/analytics',
      label: 'Analytics',
      icon: <AnalyticsIcon />,
      status: 'updated'
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      icon: <SettingsIcon />
    }
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleMenuToggle = (menuLabel: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuLabel) 
        ? prev.filter(item => item !== menuLabel)
        : [...prev, menuLabel]
    );
  };

  const handleLogout = () => {
    console.log('Logging out admin...');
    navigate('/');
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isSelected = item.path ? location.pathname === item.path : false;
    const isExpanded = expandedMenus.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.label}>
        <ListItem disablePadding>
          <StyledListItemButton
            selected={isSelected}
            onClick={() => {
              if (hasChildren) {
                handleMenuToggle(item.label);
              } else if (item.path) {
                handleMenuClick(item.path);
              }
            }}
            sx={{ 
              pl: 2 + depth * 2,
              ml: depth > 0 ? 1 : 0,
              mr: depth > 0 ? 1 : 0
            }}
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
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.95rem',
                      fontWeight: isSelected ? 600 : 400
                    }}
                  >
                    {item.label}
                  </Typography>
                  {item.status === 'new' && (
                    <Chip label="New" size="small" color="success" sx={{ height: 18, fontSize: '0.7rem' }} />
                  )}
                  {item.status === 'updated' && (
                    <Chip label="Updated" size="small" color="info" sx={{ height: 18, fontSize: '0.7rem' }} />
                  )}
                </Box>
              }
            />
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </StyledListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map(child => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Profile Section */}
      <ProfileSection>
        <Avatar
          src={admin.avatar}
          alt={admin.name}
          sx={{ 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 2,
            border: '3px solid rgba(255,255,255,0.3)'
          }}
        />
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {admin.name}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
          {admin.email}
        </Typography>
        <Chip 
          icon={<AdminIcon fontSize="small" />}
          label={admin.role}
          size="small"
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        />
      </ProfileSection>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 1, overflowY: 'auto' }}>
        <List>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Today's Overview
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            New Orders
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            23
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Revenue
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
            $3,456
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            New Users
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            12
          </Typography>
        </Box>
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
        keepMounted: true,
      }}
    >
      {drawer}
    </StyledDrawer>
  );
};

export default AdminSidebar;