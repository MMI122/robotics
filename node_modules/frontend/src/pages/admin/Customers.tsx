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
  Toolbar,
  alpha,
  useTheme,
  Tooltip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Badge,
  TablePagination,
  LinearProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ShoppingCart as OrdersIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  PersonAdd as AddPersonIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  VerifiedUser as VerifiedIcon,
  Star as StarIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { customersAPI } from '../../services/api';

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
  '&.error': {
    background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
  },
}));

const SearchToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  minHeight: '64px !important',
}));

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  is_active: boolean;
  is_verified: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip';
  joined_date: string;
  last_login?: string;
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  last_order_date?: string;
}

const AdminCustomers: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vipFilter, setVipFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch customers data
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      
      const customersData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setCustomers(customersData as Customer[]);
      setFilteredCustomers(customersData as Customer[]);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      // Set empty array on error
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchCustomers();
  };

  const handleTierUpdate = async (customerId: number, newTier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip') => {
    try {
      await customersAPI.updateTier(customerId, newTier);
      
      // Update local state
      const updatedCustomers = customers.map(customer => 
        customer.id === customerId 
          ? { ...customer, tier: newTier }
          : customer
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      setMenuAnchor(null);
      
    } catch (error) {
      console.error('Failed to update customer tier:', error);
    }
  };

  const handleStatusUpdate = async (customerId: number, isActive: boolean) => {
    try {
      await customersAPI.updateStatus(customerId, isActive);
      
      // Update local state
      const updatedCustomers = customers.map(customer => 
        customer.id === customerId 
          ? { ...customer, is_active: isActive }
          : customer
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      
    } catch (error) {
      console.error('Failed to update customer status:', error);
    }
  };

  const handleToggleStatus = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      handleStatusUpdate(customerId, !customer.is_active);
    }
    setMenuAnchor(null);
  };

  const handleToggleVIP = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const newTier = customer.tier === 'platinum' ? 'bronze' : 'platinum';
      handleTierUpdate(customerId, newTier);
    }
    setMenuAnchor(null);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCustomer(null);
  };

  // Filter customers
  useEffect(() => {
    let filtered = customers;

    if (searchQuery) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => 
        statusFilter === 'active' ? customer.is_active : !customer.is_active
      );
    }

    if (vipFilter !== 'all') {
      filtered = filtered.filter(customer => 
        vipFilter === 'vip' ? customer.tier === 'vip' : customer.tier !== 'vip'
      );
    }

    setFilteredCustomers(filtered);
    setPage(0);
  }, [searchQuery, statusFilter, vipFilter, customers]);

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length,
      icon: <GroupIcon fontSize="large" />,
      color: 'primary' as const,
      change: '+12%'
    },
    {
      title: 'Active Customers',
      value: customers.filter(c => c.is_active).length,
      icon: <ActiveIcon fontSize="large" />,
      color: 'success' as const,
      change: '+8%'
    },
    {
      title: 'VIP Customers',
      value: customers.filter(c => c.tier === 'vip').length,
      icon: <StarIcon fontSize="large" />,
      color: 'warning' as const,
      change: '+15%'
    },
    {
      title: 'Total Revenue',
      value: `$${customers.reduce((sum, c) => sum + c.total_spent, 0).toFixed(2)}`,
      icon: <MoneyIcon fontSize="large" />,
      color: 'secondary' as const,
      change: '+22%'
    }
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCustomer(customer);
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'vip': return { label: 'VIP', color: 'error' as const };
      case 'platinum': return { label: 'Platinum', color: 'primary' as const };
      case 'gold': return { label: 'Gold', color: 'warning' as const };
      case 'silver': return { label: 'Silver', color: 'default' as const };
      case 'bronze': return { label: 'Bronze', color: 'default' as const };
      default: return { label: 'Bronze', color: 'default' as const };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Typography variant="h6">Loading customers...</Typography>
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
                Customers Management
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                  Export
                </Button>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
                  Refresh
                </Button>
                <Button variant="contained" startIcon={<AddPersonIcon />}>
                  Add Customer
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
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                            {stat.title}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {stat.change} from last month
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ minWidth: 300 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Customer Type</InputLabel>
                <Select
                  value={vipFilter}
                  label="Customer Type"
                  onChange={(e) => setVipFilter(e.target.value)}
                >
                  <MenuItem value="all">All Customers</MenuItem>
                  <MenuItem value="vip">VIP Customers</MenuItem>
                  <MenuItem value="regular">Regular Customers</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ flexGrow: 1 }} />
              
              <Tooltip title="Filter Options">
                <IconButton>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </SearchToolbar>

          {/* Customers Table */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tier</TableCell>
                    <TableCell>Orders</TableCell>
                    <TableCell>Total Spent</TableCell>
                    <TableCell>Avg Order</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((customer) => {
                      const tier = getTierInfo(customer.tier);
                      return (
                        <TableRow key={customer.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                  customer.tier === 'vip' ? (
                                    <StarIcon sx={{ color: 'gold', fontSize: 16 }} />
                                  ) : null
                                }
                              >
                                <Avatar
                                  src={customer.avatar}
                                  sx={{ width: 40, height: 40, mr: 2 }}
                                >
                                  {customer.name.charAt(0)}
                                </Avatar>
                              </Badge>
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {customer.name}
                                  </Typography>
                                  {customer.is_verified && (
                                    <VerifiedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                  )}
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {customer.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={customer.is_active ? 'Active' : 'Inactive'}
                              size="small"
                              color={customer.is_active ? 'success' : 'error'}
                              icon={customer.is_active ? <ActiveIcon /> : <BlockIcon />}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={tier.label}
                              size="small"
                              color={tier.color}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <OrdersIcon fontSize="small" color="primary" />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {customer.total_orders}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              ${customer.total_spent.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              ${customer.avg_order_value.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(customer.joined_date)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, customer)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCustomers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>

          {/* Actions Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              setCustomerDetailsOpen(true);
              handleMenuClose();
            }}>
              <ViewIcon sx={{ mr: 1 }} />
              View Details
            </MenuItem>
            <MenuItem onClick={() => handleMenuClose()}>
              <EditIcon sx={{ mr: 1 }} />
              Edit Customer
            </MenuItem>
            <MenuItem onClick={() => handleMenuClose()}>
              <EmailIcon sx={{ mr: 1 }} />
              Send Email
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleTierUpdate(selectedCustomer?.id || 0, 'bronze')}>
              <StarIcon sx={{ mr: 1 }} />
              Set Bronze Tier
            </MenuItem>
            <MenuItem onClick={() => handleTierUpdate(selectedCustomer?.id || 0, 'silver')}>
              <StarIcon sx={{ mr: 1 }} />
              Set Silver Tier
            </MenuItem>
            <MenuItem onClick={() => handleTierUpdate(selectedCustomer?.id || 0, 'gold')}>
              <StarIcon sx={{ mr: 1 }} />
              Set Gold Tier
            </MenuItem>
            <MenuItem onClick={() => handleTierUpdate(selectedCustomer?.id || 0, 'platinum')}>
              <StarIcon sx={{ mr: 1 }} />
              Set Platinum Tier
            </MenuItem>
            <MenuItem onClick={() => handleTierUpdate(selectedCustomer?.id || 0, 'vip')}>
              <StarIcon sx={{ mr: 1, color: 'red' }} />
              Set VIP Tier
            </MenuItem>
            <MenuItem onClick={() => handleToggleStatus(selectedCustomer?.id || 0)}>
              {selectedCustomer?.is_active ? <BlockIcon sx={{ mr: 1 }} /> : <ActiveIcon sx={{ mr: 1 }} />}
              {selectedCustomer?.is_active ? 'Deactivate' : 'Activate'}
            </MenuItem>
          </Menu>

          {/* Customer Details Dialog */}
          <Dialog
            open={customerDetailsOpen}
            onClose={() => setCustomerDetailsOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedCustomer?.avatar} sx={{ width: 50, height: 50 }}>
                  {selectedCustomer?.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedCustomer?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCustomer?.email}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedCustomer && (
                <Box>
                  <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                    <Tab label="Overview" />
                    <Tab label="Orders" />
                    <Tab label="Address" />
                    <Tab label="Settings" />
                  </Tabs>

                  {/* Overview Tab */}
                  {activeTab === 0 && (
                    <Box sx={{ py: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>Customer Information</Typography>
                          <Typography>Name: {selectedCustomer.name}</Typography>
                          <Typography>Email: {selectedCustomer.email}</Typography>
                          <Typography>Phone: {selectedCustomer.phone || 'Not provided'}</Typography>
                          <Typography>Status: {selectedCustomer.is_active ? 'Active' : 'Inactive'}</Typography>
                          <Typography>Verified: {selectedCustomer.is_verified ? 'Yes' : 'No'}</Typography>
                          <Typography>Tier: {getTierInfo(selectedCustomer.tier).label}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>Statistics</Typography>
                          <Typography>Total Orders: {selectedCustomer.total_orders}</Typography>
                          <Typography>Total Spent: ${selectedCustomer.total_spent.toFixed(2)}</Typography>
                          <Typography>Average Order: ${selectedCustomer.avg_order_value.toFixed(2)}</Typography>
                          <Typography>Joined: {formatDate(selectedCustomer.joined_date)}</Typography>
                          <Typography>Last Login: {selectedCustomer.last_login ? formatDate(selectedCustomer.last_login) : 'Never'}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 1 && (
                    <Box sx={{ py: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>Order Information</Typography>
                      <Typography>Total Orders: {selectedCustomer.total_orders}</Typography>
                      <Typography>Total Spent: ${selectedCustomer.total_spent.toFixed(2)}</Typography>
                      <Typography>Average Order Value: ${selectedCustomer.avg_order_value.toFixed(2)}</Typography>
                    </Box>
                  )}

                  {/* Address Tab */}
                  {activeTab === 2 && (
                    <Box sx={{ py: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
                      <Typography>Email: {selectedCustomer.email}</Typography>
                      <Typography>Phone: {selectedCustomer.phone || 'Not provided'}</Typography>
                    </Box>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 3 && (
                    <Box sx={{ py: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>Account Settings</Typography>
                      <Typography>Account Status: {selectedCustomer.is_active ? 'Active' : 'Inactive'}</Typography>
                      <Typography>Email Verified: {selectedCustomer.is_verified ? 'Yes' : 'No'}</Typography>
                      <Typography>Customer Tier: {getTierInfo(selectedCustomer.tier).label}</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCustomerDetailsOpen(false)}>Close</Button>
              <Button variant="contained" startIcon={<EditIcon />}>
                Edit Customer
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
  );
};

export default AdminCustomers;