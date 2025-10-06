import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Rating,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Block,
  Email,
  Phone,
  LocationOn,
  CreditCard,
  ShoppingBag,
  Star,
  Assignment,
  ContactSupport,
  History,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/layout/AdminSidebar';

interface CustomerOrder {
  id: number;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

interface CustomerReview {
  id: number;
  product_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface CustomerTicket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive' | 'blocked';
  verified: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  orders_count: number;
  total_spent: number;
  avg_order_value: number;
  last_order_date: string;
  created_at: string;
  last_login: string;
  orders: CustomerOrder[];
  reviews: CustomerReview[];
  support_tickets: CustomerTicket[];
}

const AdminCustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    // Simulated data - replace with actual API call
    setCustomer({
      id: parseInt(id || '1'),
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      avatar: '/images/avatars/john-doe.jpg',
      status: 'active',
      verified: true,
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
      },
      orders_count: 15,
      total_spent: 2459.87,
      avg_order_value: 163.99,
      last_order_date: '2025-09-28T10:00:00Z',
      created_at: '2024-01-15T08:30:00Z',
      last_login: '2025-10-02T14:45:00Z',
      orders: [
        {
          id: 1,
          order_number: 'ORD-2025-1001',
          status: 'delivered',
          total: 345.98,
          created_at: '2025-09-28T10:00:00Z',
        },
        {
          id: 2,
          order_number: 'ORD-2025-0987',
          status: 'shipped',
          total: 189.99,
          created_at: '2025-09-15T14:30:00Z',
        },
        {
          id: 3,
          order_number: 'ORD-2025-0876',
          status: 'delivered',
          total: 299.50,
          created_at: '2025-08-30T09:15:00Z',
        },
      ],
      reviews: [
        {
          id: 1,
          product_name: 'Arduino Uno R3',
          rating: 5,
          comment: 'Excellent product, works perfectly!',
          created_at: '2025-09-30T16:20:00Z',
        },
        {
          id: 2,
          product_name: 'Raspberry Pi 4',
          rating: 4,
          comment: 'Good quality, fast shipping.',
          created_at: '2025-09-18T11:45:00Z',
        },
      ],
      support_tickets: [
        {
          id: 1,
          subject: 'Order delivery question',
          status: 'resolved',
          priority: 'medium',
          created_at: '2025-09-25T13:20:00Z',
        },
        {
          id: 2,
          subject: 'Product compatibility issue',
          status: 'open',
          priority: 'high',
          created_at: '2025-10-01T09:30:00Z',
        },
      ],
    });

    setLoading(false);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'warning';
      case 'in_progress': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const handleUpdateCustomer = () => {
    // API call to update customer
    setEditDialogOpen(false);
    // Refresh customer data
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AdminSidebar open={false} onClose={() => {}} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AdminSidebar open={false} onClose={() => {}} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography>Customer not found</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar open={false} onClose={() => {}} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs sx={{ mb: 2 }}>
              <Link color="inherit" href="/admin/dashboard">
                Dashboard
              </Link>
              <Link color="inherit" href="/admin/customers">
                Customers
              </Link>
              <Typography color="text.primary">Customer Details</Typography>
            </Breadcrumbs>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate('/admin/customers')}>
                  <ArrowBack />
                </IconButton>
                <Avatar
                  src={customer.avatar}
                  alt={customer.name}
                  sx={{ width: 60, height: 60 }}
                />
                <Box>
                  <Typography variant="h4" component="h1">
                    {customer.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Chip
                      label={customer.status.toUpperCase()}
                      color={getStatusColor(customer.status) as any}
                      size="small"
                    />
                    {customer.verified && (
                      <Chip label="VERIFIED" color="info" size="small" />
                    )}
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Email />}
                  href={`mailto:${customer.email}`}
                >
                  Email
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditDialogOpen(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Block />}
                  disabled={customer.status === 'blocked'}
                >
                  Block
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Customer Stats */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {customer.orders_count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    ${customer.total_spent.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Avg Order Value
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    ${customer.avg_order_value.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Last Order
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {new Date(customer.last_order_date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Main Content */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                  <Tab label="Orders" icon={<ShoppingBag />} />
                  <Tab label="Reviews" icon={<Star />} />
                  <Tab label="Support Tickets" icon={<ContactSupport />} />
                  <Tab label="Activity" icon={<History />} />
                </Tabs>

                {/* Orders Tab */}
                {tabValue === 0 && (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Order Number</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="right">Date</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {customer.orders.map((order) => (
                          <TableRow key={order.id} hover>
                            <TableCell>{order.order_number}</TableCell>
                            <TableCell>
                              <Chip
                                label={order.status.toUpperCase()}
                                color={getOrderStatusColor(order.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                            <TableCell align="right">
                              {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Reviews Tab */}
                {tabValue === 1 && (
                  <List>
                    {customer.reviews.map((review) => (
                      <ListItem key={review.id} divider>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="subtitle1">
                                {review.product_name}
                              </Typography>
                              <Rating value={review.rating} readOnly size="small" />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {review.comment}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                {new Date(review.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                {/* Support Tickets Tab */}
                {tabValue === 2 && (
                  <List>
                    {customer.support_tickets.map((ticket) => (
                      <ListItem key={ticket.id} divider>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="subtitle1">
                                {ticket.subject}
                              </Typography>
                              <Chip
                                label={ticket.status.toUpperCase()}
                                color={getTicketStatusColor(ticket.status) as any}
                                size="small"
                              />
                              <Chip
                                label={ticket.priority.toUpperCase()}
                                color={getPriorityColor(ticket.priority) as any}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                {/* Activity Tab */}
                {tabValue === 3 && (
                  <Box>
                    <Typography variant="body1" color="text.secondary">
                      Activity timeline will be displayed here...
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Customer Details Sidebar */}
            <Grid item xs={12} lg={4}>
              {/* Contact Information */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{customer.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{customer.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2">
                        {customer.address.street}<br />
                        {customer.address.city}, {customer.address.state} {customer.address.zip}<br />
                        {customer.address.country}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Account Information */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Account Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Member Since
                    </Typography>
                    <Typography variant="body2">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body2">
                      {new Date(customer.last_login).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Account Status
                    </Typography>
                    <Chip
                      label={customer.status.toUpperCase()}
                      color={getStatusColor(customer.status) as any}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Quick Actions */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Email />}
                    fullWidth
                    href={`mailto:${customer.email}`}
                  >
                    Send Email
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Assignment />}
                    fullWidth
                    onClick={() => navigate(`/admin/orders?customer=${customer.id}`)}
                  >
                    View All Orders
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ContactSupport />}
                    fullWidth
                    onClick={() => navigate(`/admin/support?customer=${customer.id}`)}
                  >
                    Create Support Ticket
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Edit Customer Dialog */}
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Customer Name"
                    defaultValue={customer.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    defaultValue={customer.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    defaultValue={customer.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    value={newStatus || customer.status}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="blocked">Blocked</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateCustomer} variant="contained">Update</Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminCustomerDetail;