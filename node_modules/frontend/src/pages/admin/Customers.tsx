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
import AdminSidebar from '../../components/dashboards/AdminSidebar';

const AdminContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50],
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: 280,
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
  },
}));

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
  isActive: boolean;
  isVerified: boolean;
  isVip: boolean;
  registrationDate: string;
  lastLoginDate: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  preferences: {
    newsletter: boolean;
    promotions: boolean;
    smsNotifications: boolean;
  };
  recentOrders: {
    id: string;
    date: string;
    total: number;
    status: string;
  }[];
}

const AdminCustomers: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  // Mock data
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-0123',
        avatar: '/api/placeholder/40/40',
        isActive: true,
        isVerified: true,
        isVip: true,
        registrationDate: '2023-06-15T10:30:00Z',
        lastLoginDate: '2024-01-20T15:45:00Z',
        totalOrders: 12,
        totalSpent: 2485.50,
        averageOrderValue: 207.13,
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          postalCode: '10001'
        },
        preferences: {
          newsletter: true,
          promotions: true,
          smsNotifications: false
        },
        recentOrders: [
          { id: 'ORD-001', date: '2024-01-20', total: 299.99, status: 'delivered' },
          { id: 'ORD-045', date: '2024-01-15', total: 149.50, status: 'shipped' }
        ]
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1-555-0456',
        isActive: true,
        isVerified: true,
        isVip: false,
        registrationDate: '2023-08-22T14:20:00Z',
        lastLoginDate: '2024-01-19T09:30:00Z',
        totalOrders: 8,
        totalSpent: 1240.75,
        averageOrderValue: 155.09,
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          postalCode: '90210'
        },
        preferences: {
          newsletter: true,
          promotions: false,
          smsNotifications: true
        },
        recentOrders: [
          { id: 'ORD-002', date: '2024-01-19', total: 149.50, status: 'processing' }
        ]
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1-555-0789',
        isActive: false,
        isVerified: false,
        isVip: false,
        registrationDate: '2023-12-10T08:15:00Z',
        lastLoginDate: '2023-12-25T16:20:00Z',
        totalOrders: 2,
        totalSpent: 189.98,
        averageOrderValue: 94.99,
        address: {
          street: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          country: 'USA',
          postalCode: '60601'
        },
        preferences: {
          newsletter: false,
          promotions: false,
          smsNotifications: false
        },
        recentOrders: [
          { id: 'ORD-003', date: '2023-12-20', total: 89.99, status: 'delivered' }
        ]
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+1-555-0321',
        isActive: true,
        isVerified: true,
        isVip: true,
        registrationDate: '2023-03-05T11:45:00Z',
        lastLoginDate: '2024-01-18T12:10:00Z',
        totalOrders: 25,
        totalSpent: 4750.25,
        averageOrderValue: 190.01,
        address: {
          street: '321 Elm St',
          city: 'Miami',
          state: 'FL',
          country: 'USA',
          postalCode: '33101'
        },
        preferences: {
          newsletter: true,
          promotions: true,
          smsNotifications: true
        },
        recentOrders: [
          { id: 'ORD-004', date: '2024-01-18', total: 234.75, status: 'delivered' },
          { id: 'ORD-038', date: '2024-01-10', total: 456.20, status: 'delivered' }
        ]
      },
      {
        id: 5,
        name: 'David Brown',
        email: 'david@example.com',
        phone: '+1-555-0654',
        isActive: true,
        isVerified: false,
        isVip: false,
        registrationDate: '2024-01-01T09:00:00Z',
        lastLoginDate: '2024-01-15T14:30:00Z',
        totalOrders: 1,
        totalSpent: 45.99,
        averageOrderValue: 45.99,
        address: {
          street: '654 Maple Ave',
          city: 'Seattle',
          state: 'WA',
          country: 'USA',
          postalCode: '98101'
        },
        preferences: {
          newsletter: true,
          promotions: true,
          smsNotifications: false
        },
        recentOrders: [
          { id: 'ORD-005', date: '2024-01-14', total: 45.99, status: 'cancelled' }
        ]
      }
    ];

    setTimeout(() => {
      setCustomers(mockCustomers);
      setFilteredCustomers(mockCustomers);
      setLoading(false);
    }, 1000);
  }, []);

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
        statusFilter === 'active' ? customer.isActive : !customer.isActive
      );
    }

    if (vipFilter !== 'all') {
      filtered = filtered.filter(customer => 
        vipFilter === 'vip' ? customer.isVip : !customer.isVip
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
      value: customers.filter(c => c.isActive).length,
      icon: <ActiveIcon fontSize="large" />,
      color: 'success' as const,
      change: '+8%'
    },
    {
      title: 'VIP Customers',
      value: customers.filter(c => c.isVip).length,
      icon: <StarIcon fontSize="large" />,
      color: 'warning' as const,
      change: '+15%'
    },
    {
      title: 'Total Revenue',
      value: `$${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}`,
      icon: <MoneyIcon fontSize="large" />,
      color: 'secondary' as const,
      change: '+22%'
    }
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCustomer(null);
  };

  const handleToggleStatus = (customerId: number) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { ...customer, isActive: !customer.isActive }
        : customer
    ));
    handleMenuClose();
  };

  const handleToggleVIP = (customerId: number) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { ...customer, isVip: !customer.isVip }
        : customer
    ));
    handleMenuClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 2000) return { label: 'Platinum', color: 'primary' as const };
    if (totalSpent >= 1000) return { label: 'Gold', color: 'warning' as const };
    if (totalSpent >= 500) return { label: 'Silver', color: 'default' as const };
    return { label: 'Bronze', color: 'default' as const };
  };

  if (loading) {
    return (
      <AdminContainer>
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <MainContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Typography variant="h6">Loading customers...</Typography>
          </Box>
        </MainContent>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <MainContent>
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
                <Button variant="outlined" startIcon={<RefreshIcon />}>
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
                      const tier = getCustomerTier(customer.totalSpent);
                      return (
                        <TableRow key={customer.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                  customer.isVip ? (
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
                                  {customer.isVerified && (
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
                              label={customer.isActive ? 'Active' : 'Inactive'}
                              size="small"
                              color={customer.isActive ? 'success' : 'error'}
                              icon={customer.isActive ? <ActiveIcon /> : <BlockIcon />}
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
                                {customer.totalOrders}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              ${customer.totalSpent.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              ${customer.averageOrderValue.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(customer.registrationDate)}
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
            <MenuItem onClick={() => handleToggleVIP(selectedCustomer?.id || 0)}>
              <StarIcon sx={{ mr: 1 }} />
              {selectedCustomer?.isVip ? 'Remove VIP' : 'Make VIP'}
            </MenuItem>
            <MenuItem onClick={() => handleToggleStatus(selectedCustomer?.id || 0)}>
              {selectedCustomer?.isActive ? <BlockIcon sx={{ mr: 1 }} /> : <ActiveIcon sx={{ mr: 1 }} />}
              {selectedCustomer?.isActive ? 'Deactivate' : 'Activate'}
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
                    <Tab label="Preferences" />
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
                          <Typography>Status: {selectedCustomer.isActive ? 'Active' : 'Inactive'}</Typography>
                          <Typography>Verified: {selectedCustomer.isVerified ? 'Yes' : 'No'}</Typography>
                          <Typography>VIP: {selectedCustomer.isVip ? 'Yes' : 'No'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>Statistics</Typography>
                          <Typography>Total Orders: {selectedCustomer.totalOrders}</Typography>
                          <Typography>Total Spent: ${selectedCustomer.totalSpent.toFixed(2)}</Typography>
                          <Typography>Average Order: ${selectedCustomer.averageOrderValue.toFixed(2)}</Typography>
                          <Typography>Joined: {formatDate(selectedCustomer.registrationDate)}</Typography>
                          <Typography>Last Login: {formatDate(selectedCustomer.lastLoginDate)}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 1 && (
                    <Box sx={{ py: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>Recent Orders</Typography>
                      <List>
                        {selectedCustomer.recentOrders.map((order) => (
                          <ListItem key={order.id}>
                            <ListItemText
                              primary={`Order ${order.id}`}
                              secondary={`${order.date} • ${order.status}`}
                            />
                            <Typography variant="subtitle2">
                              ${order.total.toFixed(2)}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Address Tab */}
                  {activeTab === 2 && (
                    <Box sx={{ py: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>Shipping Address</Typography>
                      <Typography>{selectedCustomer.address.street}</Typography>
                      <Typography>
                        {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.postalCode}
                      </Typography>
                      <Typography>{selectedCustomer.address.country}</Typography>
                    </Box>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === 3 && (
                    <Box sx={{ py: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>Communication Preferences</Typography>
                      <FormControlLabel
                        control={<Switch checked={selectedCustomer.preferences.newsletter} />}
                        label="Newsletter Subscription"
                        disabled
                      />
                      <FormControlLabel
                        control={<Switch checked={selectedCustomer.preferences.promotions} />}
                        label="Promotional Emails"
                        disabled
                      />
                      <FormControlLabel
                        control={<Switch checked={selectedCustomer.preferences.smsNotifications} />}
                        label="SMS Notifications"
                        disabled
                      />
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
      </MainContent>
    </AdminContainer>
  );
};

export default AdminCustomers;