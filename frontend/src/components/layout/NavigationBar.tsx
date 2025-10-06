import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import type { RootState } from '../../store';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import type { Category } from '../../types';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Chip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Inventory as InventoryIcon,
  Memory as MemoryIcon,
  Print as PrintIcon,
  Wifi as WifiIcon,
  SmartToy as RobotIcon,
  Sensors as SensorsIcon,
  Build as BuildIcon,
  NewReleases as NewIcon,
  LocalOffer as DiscountIcon,
  FlashOn as FlashIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state: RootState) => state.categories);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, categorySlug: string) => {
    setAnchorEl(event.currentTarget);
    setHoveredCategory(categorySlug);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setHoveredCategory(null);
  };

  const getCategoryIcon = (categorySlug: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'development-boards': <MemoryIcon />,
      'raspberry-pi': <MemoryIcon />,
      '3d-printer': <PrintIcon />,
      'internet-of-things-iot': <WifiIcon />,
      'robotics': <RobotIcon />,
      'sensors': <SensorsIcon />,
      'robot-components': <BuildIcon />,
    };
    return iconMap[categorySlug] || <InventoryIcon />;
  };

  const navigationItems = [
    {
      label: 'Products',
      path: '/products',
      icon: <InventoryIcon />,
      hasDropdown: true,
    },
    {
      label: 'Dev Boards',
      path: '/category/development-boards',
      icon: <MemoryIcon />,
    },
    {
      label: 'Raspberry Pi',
      path: '/category/raspberry-pi',
      icon: <MemoryIcon />,
    },
    {
      label: '3D Printer',
      path: '/category/3d-printer',
      icon: <PrintIcon />,
    },
    {
      label: 'Sensors',
      path: '/category/sensors',
      icon: <SensorsIcon />,
    },
    {
      label: 'Electronics Module',
      path: '/category/electronics-module',
      icon: <BuildIcon />,
    },
    {
      label: 'Back in Stock',
      path: '/products?filter=back-in-stock',
      icon: <FlashIcon />,
      special: true,
    },
    {
      label: 'New Products',
      path: '/products?filter=new',
      icon: <NewIcon />,
      special: true,
    },
    {
      label: 'Discount',
      path: '/products?filter=on-sale',
      icon: <DiscountIcon />,
      special: true,
    },
    {
      label: 'Info',
      path: '/about',
      hasDropdown: true,
    },
    {
      label: 'Contact',
      path: '/contact',
    },
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: '#1f2937',
        borderTop: '1px solid #374151',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 0.5, minHeight: '56px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.hasDropdown ? (
                  <>
                    <Button
                      color="inherit"
                      onClick={(e) => item.label === 'Products' ? handleMenuOpen(e, 'products') : null}
                      endIcon={item.hasDropdown ? <ArrowDownIcon /> : null}
                      startIcon={item.icon}
                      sx={{
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        ...(item.special ? {
                          color: '#10b981',
                          fontWeight: 600,
                        } : {}),
                      }}
                    >
                      {item.label}
                    </Button>
                    
                    {item.label === 'Products' && (
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && hoveredCategory === 'products'}
                        onClose={handleMenuClose}
                        MenuListProps={{
                          sx: { width: 300, py: 2 },
                        }}
                        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                      >
                        <Box sx={{ px: 2, mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                            FEATURED CATEGORIES
                          </Typography>
                        </Box>
                        
                        {categories.slice(0, 6).map((category: Category) => (
                          <MenuItem
                            key={category.id}
                            onClick={() => {
                              navigate(`/category/${category.slug}`);
                              handleMenuClose();
                            }}
                            sx={{ py: 1.5, px: 2 }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              {getCategoryIcon(category.slug)}
                            </ListItemIcon>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {category.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                {category.description?.substring(0, 50)}...
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                        
                        <Box sx={{ px: 2, pt: 2, borderTop: '1px solid #e5e7eb', mt: 1 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                              navigate('/products');
                              handleMenuClose();
                            }}
                          >
                            View All Products
                          </Button>
                        </Box>
                      </Menu>
                    )}
                  </>
                ) : (
                  <Button
                    color="inherit"
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      ...(item.special ? {
                        color: '#10b981',
                        fontWeight: 600,
                      } : {}),
                    }}
                  >
                    {item.label}
                  </Button>
                )}
              </motion.div>
            ))}
            
            {/* Special Badges */}
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Chip
                  label="ON SALE"
                  size="small"
                  sx={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    fontWeight: 'bold',
                    animation: 'pulse 2s infinite',
                  }}
                  icon={<StarIcon sx={{ color: 'white !important' }} />}
                />
              </motion.div>
              
              <Chip
                label="FREE SHIPPING"
                size="small"
                sx={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;