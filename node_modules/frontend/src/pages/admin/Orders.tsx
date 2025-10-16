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
  LinearProgress,
  TablePagination,
  Alert,
  Stack,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  LocalShipping as ShippingIcon,
  Assignment as OrderIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CreditCard as PaymentIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { ordersAPI } from '../../services/api';

interface AdminOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

interface AdminOrder {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
  payment_status: 'pending' | 'completed' | 'failed';
  shipping_address: string;
  created_at: string;
  updated_at: string;
  items?: AdminOrderItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const theme = useTheme();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getAdminOrders();
        console.log('API Response:', response.data); // Debug log
        
        // Handle paginated response: response.data.data.data
        const ordersData = response.data?.data?.data || response.data?.data || response.data || [];
        console.log('Orders Data:', ordersData); // Debug log
        
        setOrders(Array.isArray(ordersData) ? (ordersData as unknown) as AdminOrder[] : []);
        setFilteredOrders(Array.isArray(ordersData) ? (ordersData as unknown) as AdminOrder[] : []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter and sort orders
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchQuery) ||
        order.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user_email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(order => 
          new Date(order.created_at) >= filterDate
        );
      }
    }

    // Sort orders
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'amount':
          aValue = a.total_amount;
          bValue = b.total_amount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, dateFilter, sortBy, sortOrder]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, orderId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

  const handleViewOrder = (order: AdminOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus as AdminOrder['status'] } : order
      ));
      
      handleMenuClose();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    // Export functionality
    const csvData = filteredOrders.map(order => ({
      ID: order.id,
      Customer: order.user_name,
      Email: order.user_email,
      Status: order.status,
      Total: order.total_amount,
      Payment: order.payment_method,
      Date: new Date(order.created_at).toLocaleDateString()
    }));
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'refunded':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <PendingIcon />;
      case 'processing':
        return <CheckIcon />;
      case 'shipped':
        return <ShippingIcon />;
      case 'delivered':
        return <CheckIcon />;
      case 'cancelled':
        return <CancelIcon />;
      case 'refunded':
        return <CancelIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const completed = orders.filter(o => o.status === 'delivered').length;
    const revenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const avgOrderValue = total > 0 ? revenue / total : 0;

    return { total, pending, completed, revenue, avgOrderValue };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading orders...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleRefresh} startIcon={<RefreshIcon />}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Order Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage customer orders, track shipments, and update order status
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={filteredOrders.length === 0}
            >
              Export Orders
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Orders
                    </Typography>
                  </Box>
                  <OrderIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.pending}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Pending Orders
                    </Typography>
                  </Box>
                  <PendingIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.completed}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Completed
                    </Typography>
                  </Box>
                  <CheckIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {formatCurrency(stats.revenue)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Revenue
                    </Typography>
                  </Box>
                  <MoneyIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Advanced Filters and Search */}
      <Paper sx={{ p: 3, mb: 3, background: alpha(theme.palette.primary.main, 0.02) }}>
        <Toolbar sx={{ pl: 0, pr: 0 }}>
          <Typography variant="h6" component="div" sx={{ flex: '0 0 auto', mr: 3 }}>
            <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filters & Search
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 250 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                label="Date Range"
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'status')}
                label="Sort By"
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="amount">Amount</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                label="Order"
              >
                <MenuItem value="desc">Newest</MenuItem>
                <MenuItem value="asc">Oldest</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            {filteredOrders.length} of {orders.length} orders
          </Typography>
        </Toolbar>
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.grey[50] }}>
                  Order ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.grey[50] }}>
                  Customer
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.grey[50] }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.grey[50] }}>
                  Total Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.grey[50] }}>
                  Payment
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.grey[50] }}>
                  Date & Time
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.grey[50] }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                <TableRow 
                  key={order.id} 
                  hover 
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.02) 
                    } 
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.main' }}>
                        {order.id}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        #{order.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {order.user_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.user_email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`Order is ${order.status}`}>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        color={getStatusColor(order.status) as any}
                        size="small"
                        sx={{ minWidth: 100 }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                      {formatCurrency(order.total_amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {order.payment_method?.replace('_', ' ')}
                      </Typography>
                      <Chip
                        label={order.payment_status}
                        color={order.payment_status === 'completed' ? 'success' : 
                               order.payment_status === 'failed' ? 'error' : 'warning'}
                        size="small"
                        sx={{ mt: 0.5, fontSize: 10 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {formatDate(order.created_at)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(order.created_at).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Order Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOrder(order)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More Actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, order.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={() => {
          const order = orders.find(o => o.id === selectedOrderId);
          if (order) handleViewOrder(order);
        }}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleStatusUpdate(selectedOrderId!, 'processing')}
          disabled={orders.find(o => o.id === selectedOrderId)?.status === 'processing'}
        >
          <CheckIcon sx={{ mr: 1 }} />
          Mark as Processing
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusUpdate(selectedOrderId!, 'shipped')}
          disabled={orders.find(o => o.id === selectedOrderId)?.status === 'shipped'}
        >
          <ShippingIcon sx={{ mr: 1 }} />
          Mark as Shipped
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusUpdate(selectedOrderId!, 'delivered')}
          disabled={orders.find(o => o.id === selectedOrderId)?.status === 'delivered'}
        >
          <CheckIcon sx={{ mr: 1 }} />
          Mark as Delivered
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleStatusUpdate(selectedOrderId!, 'cancelled')}
          sx={{ color: 'error.main' }}
        >
          <CancelIcon sx={{ mr: 1 }} />
          Cancel Order
        </MenuItem>
      </Menu>

      {/* Order Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: '60vh' }
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ 
              pb: 1, 
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Order #{selectedOrder.id}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {formatDate(selectedOrder.created_at)}
                  </Typography>
                </Box>
                <Chip
                  icon={getStatusIcon(selectedOrder.status)}
                  label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    '& .MuiSvgIcon-root': { color: 'white' }
                  }}
                />
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant="fullWidth">
                <Tab label="Order Summary" icon={<OrderIcon />} />
                <Tab label="Customer Info" icon={<PeopleIcon />} />
                <Tab label="Payment Details" icon={<PaymentIcon />} />
              </Tabs>

              {/* Order Summary Tab */}
              {tabValue === 0 && (
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom color="primary">
                            Order Information
                          </Typography>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                              <Typography variant="body1">#{selectedOrder.id}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Order Date</Typography>
                              <Typography variant="body1">{formatDate(selectedOrder.created_at)}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                {formatCurrency(selectedOrder.total_amount)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Current Status</Typography>
                              <Chip
                                icon={getStatusIcon(selectedOrder.status)}
                                label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                color={getStatusColor(selectedOrder.status) as any}
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom color="primary">
                            Shipping Information
                          </Typography>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                <LocationIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                Shipping Address
                              </Typography>
                              <Typography variant="body1">{selectedOrder.shipping_address}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Estimated Delivery</Typography>
                              <Typography variant="body1">
                                {selectedOrder.status === 'delivered' ? 'Delivered' :
                                 selectedOrder.status === 'shipped' ? '2-3 business days' :
                                 selectedOrder.status === 'processing' ? '3-5 business days' :
                                 'Pending confirmation'}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <Card variant="outlined" sx={{ mt: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                          Order Items
                        </Typography>
                        <List>
                          {selectedOrder.items.map((item, index) => (
                            <React.Fragment key={item.id}>
                              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                <ListItemAvatar>
                                  <Avatar
                                    src={item.product_image}
                                    alt={item.product_name}
                                    sx={{ width: 60, height: 60 }}
                                    variant="rounded"
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography variant="subtitle1" fontWeight="medium">
                                      {item.product_name}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box sx={{ mt: 1 }}>
                                      <Typography variant="body2" color="text.secondary">
                                        Quantity: {item.quantity} × {formatCurrency(item.price)}
                                      </Typography>
                                      <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                        Subtotal: {formatCurrency(item.quantity * item.price)}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </ListItem>
                              {index < selectedOrder.items!.length - 1 && <Divider />}
                            </React.Fragment>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              )}

              {/* Customer Info Tab */}
              {tabValue === 1 && (
                <Box sx={{ p: 3 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Customer Details
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                <PeopleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                Customer Name
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedOrder.user_name}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                Email Address
                              </Typography>
                              <Typography variant="body1">{selectedOrder.user_email}</Typography>
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Customer ID</Typography>
                              <Typography variant="body1">#{selectedOrder.user_id}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Order History</Typography>
                              <Typography variant="body1">
                                {orders.filter(o => o.user_id === selectedOrder.user_id).length} orders
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              )}

              {/* Payment Details Tab */}
              {tabValue === 2 && (
                <Box sx={{ p: 3 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Payment Information
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                <PaymentIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                                Payment Method
                              </Typography>
                              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                                {selectedOrder.payment_method?.replace('_', ' ')}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Payment Status</Typography>
                              <Chip
                                label={selectedOrder.payment_status}
                                color={
                                  selectedOrder.payment_status === 'completed' ? 'success' :
                                  selectedOrder.payment_status === 'failed' ? 'error' : 'warning'
                                }
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                              <Typography variant="h5" color="primary" fontWeight="bold">
                                {formatCurrency(selectedOrder.total_amount)}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Payment Date</Typography>
                              <Typography variant="body1">
                                {selectedOrder.payment_status === 'completed' ? 
                                  formatDate(selectedOrder.created_at) : 'Pending'}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              <Button variant="outlined" startIcon={<PrintIcon />}>
                Print Order
              </Button>
              <Button variant="contained" startIcon={<EditIcon />}>
                Update Status
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Orders;
