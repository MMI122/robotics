import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Category as CategoryIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Support as SupportIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Store as StoreIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Campaign as CampaignIcon,
  Notifications as NotificationsIcon,
  Assessment as ReportsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

const drawerWidth = 280;

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/admin/dashboard',
  },
  {
    title: 'Products',
    icon: <ProductsIcon />,
    children: [
      { title: 'All Products', icon: <ProductsIcon />, path: '/admin/products' },
      { title: 'Add Product', icon: <ProductsIcon />, path: '/admin/products/create' },
      { title: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
      { title: 'Add Category', icon: <CategoryIcon />, path: '/admin/categories/create' },
      { title: 'Inventory', icon: <StoreIcon />, path: '/admin/inventory' },
    ],
  },
  {
    title: 'Orders',
    icon: <OrdersIcon />,
    children: [
      { title: 'All Orders', icon: <OrdersIcon />, path: '/admin/orders' },
      { title: 'Pending Orders', icon: <OrdersIcon />, path: '/admin/orders?status=pending' },
      { title: 'Processing', icon: <ShippingIcon />, path: '/admin/orders?status=processing' },
      { title: 'Shipped', icon: <ShippingIcon />, path: '/admin/orders?status=shipped' },
      { title: 'Delivered', icon: <ShippingIcon />, path: '/admin/orders?status=delivered' },
    ],
  },
  {
    title: 'Customers',
    icon: <CustomersIcon />,
    children: [
      { title: 'All Customers', icon: <CustomersIcon />, path: '/admin/customers' },
      { title: 'Customer Reviews', icon: <CustomersIcon />, path: '/admin/reviews' },
      { title: 'Customer Support', icon: <SupportIcon />, path: '/admin/support' },
    ],
  },
  {
    title: 'Marketing',
    icon: <CampaignIcon />,
    children: [
      { title: 'Campaigns', icon: <CampaignIcon />, path: '/admin/campaigns' },
      { title: 'Discounts', icon: <PaymentIcon />, path: '/admin/discounts' },
      { title: 'Newsletters', icon: <NotificationsIcon />, path: '/admin/newsletters' },
    ],
  },
  {
    title: 'Analytics',
    icon: <AnalyticsIcon />,
    children: [
      { title: 'Overview', icon: <AnalyticsIcon />, path: '/admin/analytics' },
      { title: 'Sales Reports', icon: <ReportsIcon />, path: '/admin/reports/sales' },
      { title: 'Product Reports', icon: <ReportsIcon />, path: '/admin/reports/products' },
      { title: 'Customer Reports', icon: <ReportsIcon />, path: '/admin/reports/customers' },
    ],
  },
  {
    title: 'Settings',
    icon: <SettingsIcon />,
    children: [
      { title: 'General Settings', icon: <SettingsIcon />, path: '/admin/settings' },
      { title: 'Payment Settings', icon: <PaymentIcon />, path: '/admin/settings/payment' },
      { title: 'Shipping Settings', icon: <ShippingIcon />, path: '/admin/settings/shipping' },
      { title: 'Security', icon: <SecurityIcon />, path: '/admin/settings/security' },
    ],
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state: any) => state.auth);
  
  const [expandedItems, setExpandedItems] = useState<string[]>(['Products', 'Orders']);

  const handleExpandClick = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const isActive = item.path ? isActiveRoute(item.path) : false;

    if (hasChildren) {
      return (
        <React.Fragment key={item.title}>
          <ListItemButton
            onClick={() => handleExpandClick(item.title)}
            sx={{
              pl: 2 + depth * 2,
              borderRadius: '8px',
              mx: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: theme.palette.primary.main,
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                },
              }}
            />
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map(child => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return (
      <ListItemButton
        key={item.title}
        onClick={() => item.path && handleNavigation(item.path)}
        sx={{
          pl: 2 + depth * 2,
          borderRadius: '8px',
          mx: 1,
          mb: 0.5,
          backgroundColor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
          borderLeft: isActive ? `3px solid ${theme.palette.primary.main}` : 'none',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
            minWidth: 40,
          }}
        >
          {item.icon}
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
        }}
      >
        <Avatar
          src={user?.avatar}
          sx={{
            width: 48,
            height: 48,
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          {user?.name?.charAt(0) || 'A'}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            {user?.name || 'Admin User'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
            Administrator
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
        )}
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
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
            display: 'block',
          }}
        >
          RoboticsShop Admin v1.0
        </Typography>
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

export default AdminSidebar;