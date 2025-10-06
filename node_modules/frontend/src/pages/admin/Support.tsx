import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Reply,
  Close,
  CheckCircle,
  Schedule,
  PriorityHigh,
  Person,
  Email,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';

interface SupportTicket {
  id: number;
  ticket_number: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customer_name: string;
  customer_email: string;
  created_at: string;
  updated_at: string;
  assigned_to: string;
  category: string;
}

const AdminSupport: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);

  useEffect(() => {
    // Simulated data - replace with actual API call
    setTickets([
      {
        id: 1,
        ticket_number: 'TKT-2025-1001',
        subject: 'Product delivery issue',
        status: 'open',
        priority: 'high',
        customer_name: 'John Doe',
        customer_email: 'john.doe@example.com',
        created_at: '2025-10-03T09:30:00Z',
        updated_at: '2025-10-03T10:15:00Z',
        assigned_to: 'Sarah Wilson',
        category: 'Shipping',
      },
      {
        id: 2,
        ticket_number: 'TKT-2025-1002',
        subject: 'Arduino compatibility question',
        status: 'in_progress',
        priority: 'medium',
        customer_name: 'Jane Smith',
        customer_email: 'jane.smith@example.com',
        created_at: '2025-10-02T14:20:00Z',
        updated_at: '2025-10-03T08:45:00Z',
        assigned_to: 'Mike Johnson',
        category: 'Technical',
      },
      {
        id: 3,
        ticket_number: 'TKT-2025-1003',
        subject: 'Refund request',
        status: 'resolved',
        priority: 'low',
        customer_name: 'Bob Wilson',
        customer_email: 'bob.wilson@example.com',
        created_at: '2025-10-01T11:00:00Z',
        updated_at: '2025-10-02T16:30:00Z',
        assigned_to: 'Sarah Wilson',
        category: 'Billing',
      },
      {
        id: 4,
        ticket_number: 'TKT-2025-1004',
        subject: 'Website login problems',
        status: 'open',
        priority: 'urgent',
        customer_name: 'Alice Brown',
        customer_email: 'alice.brown@example.com',
        created_at: '2025-10-03T11:45:00Z',
        updated_at: '2025-10-03T11:45:00Z',
        assigned_to: 'Unassigned',
        category: 'Account',
      },
    ]);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
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
      case 'urgent': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <PriorityHigh fontSize="small" />;
      default:
        return null;
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, ticket: SupportTicket) => {
    setAnchorEl(event.currentTarget);
    setSelectedTicket(ticket);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTicket(null);
  };

  const handleViewTicket = () => {
    if (selectedTicket) {
      navigate(`/admin/support/${selectedTicket.id}`);
    }
    handleMenuClose();
  };

  const handleStatusChange = (newStatus: string) => {
    if (selectedTicket) {
      // API call to update ticket status
      setTickets(tickets.map(ticket =>
        ticket.id === selectedTicket.id
          ? { ...ticket, status: newStatus as any }
          : ticket
      ));
    }
    handleMenuClose();
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const paginatedTickets = filteredTickets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Support Tickets
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setNewTicketDialogOpen(true)}
            >
              New Ticket
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Open Tickets
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {tickets.filter(t => t.status === 'open').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {tickets.filter(t => t.status === 'in_progress').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Resolved Today
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {tickets.filter(t => t.status === 'resolved' && 
                      new Date(t.updated_at).toDateString() === new Date().toDateString()).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Urgent Tickets
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 1, color: 'error.main' }}>
                    {tickets.filter(t => t.priority === 'urgent').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3 }}>
            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
              
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="all">All Priority</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Tickets Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ticket</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/support/${ticket.id}`)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {ticket.ticket_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {ticket.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ticket.category}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {ticket.customer_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ticket.customer_email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(ticket.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getPriorityIcon(ticket.priority)}
                          <Chip
                            label={ticket.priority.toUpperCase()}
                            color={getPriorityColor(ticket.priority) as any}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {ticket.assigned_to}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(ticket.created_at).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuOpen(e, ticket);
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredTickets.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>

          {/* Action Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleViewTicket}>
              <Reply sx={{ mr: 1 }} />
              View Details
            </MenuItem>
            <MenuItem onClick={() => handleStatusChange('in_progress')}>
              <Schedule sx={{ mr: 1 }} />
              Mark In Progress
            </MenuItem>
            <MenuItem onClick={() => handleStatusChange('resolved')}>
              <CheckCircle sx={{ mr: 1 }} />
              Mark Resolved
            </MenuItem>
            <MenuItem onClick={() => handleStatusChange('closed')}>
              <Close sx={{ mr: 1 }} />
              Close Ticket
            </MenuItem>
          </Menu>

          {/* New Ticket Dialog */}
          <Dialog open={newTicketDialogOpen} onClose={() => setNewTicketDialogOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Create New Support Ticket</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Customer Name"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Customer Email"
                    type="email"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select label="Category">
                      <MenuItem value="technical">Technical</MenuItem>
                      <MenuItem value="billing">Billing</MenuItem>
                      <MenuItem value="shipping">Shipping</MenuItem>
                      <MenuItem value="account">Account</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select label="Priority">
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setNewTicketDialogOpen(false)}>Cancel</Button>
              <Button variant="contained">Create Ticket</Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminSupport;