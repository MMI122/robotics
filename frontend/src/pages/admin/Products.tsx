import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Toolbar,
  alpha,
  useTheme,
  Tooltip,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  Download as ExportIcon,
  Upload as ImportIcon,
  Category as CategoryIcon,
  Inventory as StockIcon,
  TrendingUp as SalesIcon,
  AttachMoney as PriceIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { Product } from '../../types';

const StatsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  '&.secondary': {
    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  },
  '&.success': {
    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
  },
  '&.warning': {
    background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
  },
}));

const SearchToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  minHeight: '64px !important',
}));

interface Filters {
  category: string;
  status: string;
  stock: string;
  featured: boolean | null;
}

const AdminProducts: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    category: '',
    status: '',
    stock: '',
    featured: null
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAdminProducts();
      const productsData = response?.data?.data?.data || []; // Handle pagination response with safe navigation
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and search products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = filters.category === '' || (product.category?.name || '') === filters.category;
      const matchesStatus = filters.status === '' || (product.is_active ? 'active' : 'inactive') === filters.status;
      const matchesFeatured = filters.featured === null || product.is_featured === filters.featured;
      
      let matchesStock = true;
      if (filters.stock === 'in-stock') matchesStock = (product.stock_quantity || 0) > 0;
      if (filters.stock === 'out-of-stock') matchesStock = (product.stock_quantity || 0) === 0;
      if (filters.stock === 'low-stock') matchesStock = (product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= 50;

      return matchesSearch && matchesCategory && matchesStatus && matchesFeatured && matchesStock;
    });

    setFilteredProducts(filtered);
    setPage(0); // Reset to first page when filtering
  }, [searchQuery, filters, products]);

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: <CategoryIcon fontSize="large" />,
      color: 'primary' as const
    },
    {
      title: 'Active Products',
      value: products.filter(p => p.is_active).length,
      icon: <ViewIcon fontSize="large" />,
      color: 'success' as const
    },
    {
      title: 'Out of Stock',
      value: products.filter(p => (p.stock_quantity || 0) === 0).length,
      icon: <StockIcon fontSize="large" />,
      color: 'warning' as const
    },
    {
      title: 'Featured Products',
      value: products.filter(p => p.is_featured).length,
      icon: <SalesIcon fontSize="large" />,
      color: 'secondary' as const
    }
  ];

  const categories = Array.from(new Set(products.map(p => p.category?.name || 'No Category')));

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const currentPageIds = filteredProducts
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map(product => product.id);
      setSelectedProducts(currentPageIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setMenuAnchor(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const handleBulkDelete = () => {
    setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleToggleStatus = (productId: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' as const }
        : product
    ));
  };

  const handleToggleFeatured = (productId: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, is_featured: !product.is_featured }
        : product
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  const currentPageProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isAllSelected = selectedProducts.length === currentPageProducts.length && currentPageProducts.length > 0;
  const isIndeterminate = selectedProducts.length > 0 && selectedProducts.length < currentPageProducts.length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Typography variant="h6">Loading products...</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Products Management
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchProducts}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ImportIcon />}
                  onClick={() => {/* Handle import */}}
                >
                  Import
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ExportIcon />}
                  onClick={() => {/* Handle export */}}
                >
                  Export
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/admin/products/new')}
                >
                  Add Product
                </Button>
              </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StatsCard className={stat.color}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            {stat.value.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {stat.title}
                          </Typography>
                        </Box>
                        <Box sx={{ opacity: 0.8 }}>
                          {stat.icon}
                        </Box>
                      </Box>
                    </CardContent>
                  </StatsCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Search and Filters */}
          <SearchToolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <TextField
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ minWidth: 300 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                >
                  <MenuItem value="">All</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Stock</InputLabel>
                <Select
                  value={filters.stock}
                  onChange={(e) => setFilters(prev => ({ ...prev, stock: e.target.value }))}
                  label="Stock"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="in-stock">In Stock</MenuItem>
                  <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                  <MenuItem value="low-stock">Low Stock</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.featured === true}
                    indeterminate={filters.featured === null}
                    onChange={(e) => {
                      if (filters.featured === null) {
                        setFilters(prev => ({ ...prev, featured: true }));
                      } else if (filters.featured === true) {
                        setFilters(prev => ({ ...prev, featured: false }));
                      } else {
                        setFilters(prev => ({ ...prev, featured: null }));
                      }
                    }}
                  />
                }
                label="Featured"
              />

              <Box sx={{ flexGrow: 1 }} />

              {selectedProducts.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setBulkDeleteDialogOpen(true)}
                >
                  Delete Selected ({selectedProducts.length})
                </Button>
              )}
            </Box>
          </SearchToolbar>

          {/* Products Table */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isIndeterminate}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Sales</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Featured</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {currentPageProducts.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'table-row' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={product.featured_image || '/api/placeholder/50/50'}
                              alt={product.name}
                              variant="rounded"
                              sx={{ width: 50, height: 50 }}
                            />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {product.slug}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {product.sku}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={product.category?.name || 'No Category'} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              ${product.price}
                            </Typography>
                            {product.sale_price && (
                              <Typography variant="caption" color="error.main">
                                Sale: ${product.sale_price}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.stock_quantity || 0}
                            size="small"
                            color={(product.stock_quantity || 0) === 0 ? 'error' : (product.stock_quantity || 0) <= 50 ? 'warning' : 'success'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {/* Note: sales data might not be available in current Product type */}
                            0
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.is_active ? 'active' : 'inactive'}
                            size="small"
                            color={getStatusColor(product.is_active ? 'active' : 'inactive')}
                            onClick={() => handleToggleStatus(product.id)}
                            sx={{ cursor: 'pointer' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={product.is_featured}
                            onChange={() => handleToggleFeatured(product.id)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Actions">
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, product)}
                              size="small"
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              component="div"
              count={filteredProducts.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Paper>

          {/* Actions Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              if (selectedProduct) navigate(`/admin/products/${selectedProduct.id}/edit`);
              handleMenuClose();
            }}>
              <EditIcon sx={{ mr: 1 }} />
              Edit Product
            </MenuItem>
            <MenuItem onClick={() => {
              if (selectedProduct) navigate(`/products/${selectedProduct.slug}`);
              handleMenuClose();
            }}>
              <ViewIcon sx={{ mr: 1 }} />
              View Product
            </MenuItem>
            <MenuItem 
              onClick={() => {
                setDeleteDialogOpen(true);
                handleMenuClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Delete Product
            </MenuItem>
          </Menu>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogContent>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteProduct} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Bulk Delete Confirmation Dialog */}
          <Dialog open={bulkDeleteDialogOpen} onClose={() => setBulkDeleteDialogOpen(false)}>
            <DialogTitle>Delete Selected Products</DialogTitle>
            <DialogContent>
              Are you sure you want to delete {selectedProducts.length} selected products? This action cannot be undone.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleBulkDelete} color="error" variant="contained">
                Delete All
              </Button>
            </DialogActions>
          </Dialog>

          {/* Floating Action Button */}
          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 24, right: 24 }}
            onClick={() => navigate('/admin/products/new')}
          >
            <AddIcon />
          </Fab>
        </motion.div>
  );
};

export default AdminProducts;