import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  ArrowBack,
  Reply,
  Close,
  CheckCircle,
  Schedule,
  Send,
  Attachment,
  Person,
  Email,
  Phone,
  PriorityHigh,
  Assignment,
  Update,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/layout/AdminSidebar';

interface TicketMessage {
  id: number;
  content: string;
  author: string;
  author_type: 'customer' | 'admin';
  created_at: string;
  attachments?: string[];
}

interface SupportTicket {
  id: number;
  ticket_number: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  assigned_to: string;
  assigned_to_id: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  messages: TicketMessage[];
}

const AdminSupportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [newAssignee, setNewAssignee] = useState('');

  useEffect(() => {
    // Simulated data - replace with actual API call
    setTicket({
      id: parseInt(id || '1'),
      ticket_number: 'TKT-2025-1001',
      subject: 'Product delivery issue',
      description: 'I ordered an Arduino Uno R3 two weeks ago (Order #ORD-2025-1001) but it still hasn\'t arrived. The tracking shows it was shipped but there have been no updates for 5 days. Can you please help me track down my order?',
      status: 'open',
      priority: 'high',
      category: 'Shipping',
      customer_id: 1,
      customer_name: 'John Doe',
      customer_email: 'john.doe@example.com',
      customer_phone: '+1-555-0123',
      assigned_to: 'Sarah Wilson',
      assigned_to_id: 1,
      created_at: '2025-10-03T09:30:00Z',
      updated_at: '2025-10-03T10:15:00Z',
      messages: [
        {
          id: 1,
          content: 'I ordered an Arduino Uno R3 two weeks ago (Order #ORD-2025-1001) but it still hasn\'t arrived. The tracking shows it was shipped but there have been no updates for 5 days. Can you please help me track down my order?',
          author: 'John Doe',
          author_type: 'customer',
          created_at: '2025-10-03T09:30:00Z',
        },
        {
          id: 2,
          content: 'Hi John, thank you for reaching out. I\'ve looked into your order and can see that it was indeed shipped on September 28th. Let me contact our shipping partner to get an update on the tracking. I\'ll get back to you within 24 hours with more information.',
          author: 'Sarah Wilson',
          author_type: 'admin',
          created_at: '2025-10-03T10:15:00Z',
        },
      ],
    });
    setLoading(false);
  }, [id]);

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

  const handleSendReply = () => {
    if (!replyMessage.trim() || !ticket) return;

    const newMessage: TicketMessage = {
      id: ticket.messages.length + 1,
      content: replyMessage,
      author: 'Current Admin User',
      author_type: 'admin',
      created_at: new Date().toISOString(),
    };

    setTicket({
      ...ticket,
      messages: [...ticket.messages, newMessage],
      updated_at: new Date().toISOString(),
    });

    setReplyMessage('');
  };

  const handleUpdateTicket = () => {
    if (!ticket) return;

    // API call to update ticket
    setTicket({
      ...ticket,
      status: newStatus as any || ticket.status,
      priority: newPriority as any || ticket.priority,
      assigned_to: newAssignee || ticket.assigned_to,
      updated_at: new Date().toISOString(),
      resolved_at: newStatus === 'resolved' ? new Date().toISOString() : ticket.resolved_at,
    });

    setUpdateDialogOpen(false);
    setNewStatus('');
    setNewPriority('');
    setNewAssignee('');
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

  if (!ticket) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AdminSidebar open={false} onClose={() => {}} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography>Ticket not found</Typography>
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
              <Link color="inherit" href="/admin/support">
                Support
              </Link>
              <Typography color="text.primary">Ticket Details</Typography>
            </Breadcrumbs>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate('/admin/support')}>
                  <ArrowBack />
                </IconButton>
                <Box>
                  <Typography variant="h4" component="h1">
                    {ticket.ticket_number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mt: 0.5 }}>
                    {ticket.subject}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Chip
                      label={ticket.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(ticket.status) as any}
                      size="small"
                    />
                    <Chip
                      label={ticket.priority.toUpperCase()}
                      color={getPriorityColor(ticket.priority) as any}
                      size="small"
                      variant="outlined"
                      icon={ticket.priority === 'urgent' || ticket.priority === 'high' ? <PriorityHigh /> : undefined}
                    />
                    <Chip label={ticket.category} size="small" variant="outlined" />
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Update />}
                  onClick={() => setUpdateDialogOpen(true)}
                >
                  Update Ticket
                </Button>
                {ticket.status === 'open' && (
                  <Button
                    variant="contained"
                    startIcon={<Schedule />}
                    onClick={() => {
                      setNewStatus('in_progress');
                      handleUpdateTicket();
                    }}
                  >
                    Start Progress
                  </Button>
                )}
                {ticket.status === 'in_progress' && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => {
                      setNewStatus('resolved');
                      handleUpdateTicket();
                    }}
                  >
                    Mark Resolved
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Messages and Reply */}
            <Grid item xs={12} lg={8}>
              {/* Messages */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Conversation
                </Typography>
                
                <List sx={{ mb: 3 }}>
                  {ticket.messages.map((message, index) => (
                    <ListItem
                      key={message.id}
                      alignItems="flex-start"
                      sx={{
                        flexDirection: message.author_type === 'admin' ? 'row-reverse' : 'row',
                        mb: 2,
                      }}
                    >
                      <ListItemAvatar sx={{ 
                        ml: message.author_type === 'admin' ? 1 : 0,
                        mr: message.author_type === 'admin' ? 0 : 1,
                      }}>
                        <Avatar sx={{ 
                          bgcolor: message.author_type === 'admin' ? 'primary.main' : 'secondary.main' 
                        }}>
                          {message.author_type === 'admin' ? <Assignment /> : <Person />}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <Box sx={{ 
                        maxWidth: '70%',
                        backgroundColor: message.author_type === 'admin' ? 'primary.light' : 'grey.100',
                        borderRadius: 2,
                        p: 2,
                        ml: message.author_type === 'admin' ? 'auto' : 0,
                        mr: message.author_type === 'admin' ? 0 : 'auto',
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {message.author}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(message.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {message.content}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ mb: 3 }} />

                {/* Reply Form */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Reply to Customer
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Attachment />}
                    >
                      Attach File
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setReplyMessage('')}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Send />}
                        onClick={handleSendReply}
                        disabled={!replyMessage.trim()}
                      >
                        Send Reply
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Ticket Information Sidebar */}
            <Grid item xs={12} lg={4}>
              {/* Customer Information */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Customer Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {ticket.customer_name}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => navigate(`/admin/customers/${ticket.customer_id}`)}
                      >
                        View Profile
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{ticket.customer_email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{ticket.customer_phone}</Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Ticket Details */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Ticket Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {new Date(ticket.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {new Date(ticket.updated_at).toLocaleString()}
                    </Typography>
                  </Box>
                  {ticket.resolved_at && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Resolved
                      </Typography>
                      <Typography variant="body2">
                        {new Date(ticket.resolved_at).toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Assigned To
                    </Typography>
                    <Typography variant="body2">
                      {ticket.assigned_to}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body2">
                      {ticket.category}
                    </Typography>
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
                    href={`mailto:${ticket.customer_email}`}
                  >
                    Email Customer
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Assignment />}
                    fullWidth
                    onClick={() => navigate(`/admin/orders?customer=${ticket.customer_id}`)}
                  >
                    View Orders
                  </Button>
                  {ticket.status !== 'closed' && (
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<Close />}
                      fullWidth
                      onClick={() => {
                        setNewStatus('closed');
                        handleUpdateTicket();
                      }}
                    >
                      Close Ticket
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Update Ticket Dialog */}
          <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Update Ticket</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={newStatus || ticket.status}
                      label="Status"
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={newPriority || ticket.priority}
                      label="Priority"
                      onChange={(e) => setNewPriority(e.target.value)}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Assign To</InputLabel>
                    <Select
                      value={newAssignee || ticket.assigned_to}
                      label="Assign To"
                      onChange={(e) => setNewAssignee(e.target.value)}
                    >
                      <MenuItem value="Sarah Wilson">Sarah Wilson</MenuItem>
                      <MenuItem value="Mike Johnson">Mike Johnson</MenuItem>
                      <MenuItem value="Emma Davis">Emma Davis</MenuItem>
                      <MenuItem value="Unassigned">Unassigned</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateTicket} variant="contained">Update</Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminSupportDetail;