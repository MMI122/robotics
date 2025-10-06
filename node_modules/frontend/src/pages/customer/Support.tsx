import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Support as SupportIcon,
  Chat as ChatIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  HelpOutline as HelpIcon,
  Send as SendIcon,
  Attachment as AttachmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Star as StarIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

const SupportOptionCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
  },
}));

const ChatBubble = styled(Box)<{ isAgent?: boolean }>(({ theme, isAgent }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 16,
  marginBottom: theme.spacing(1),
  maxWidth: '70%',
  alignSelf: isAgent ? 'flex-start' : 'flex-end',
  backgroundColor: isAgent ? theme.palette.grey[100] : theme.palette.primary.main,
  color: isAgent ? theme.palette.text.primary : 'white',
}));

const TicketStatusChip = styled(Chip)<{ status: 'open' | 'in-progress' | 'resolved' | 'closed' }>(
  ({ theme, status }) => {
    const colors = {
      open: { bg: '#f44336', color: 'white' },
      'in-progress': { bg: '#ff9800', color: 'white' },
      resolved: { bg: '#4caf50', color: 'white' },
      closed: { bg: '#9e9e9e', color: 'white' }
    };
    
    return {
      backgroundColor: colors[status].bg,
      color: colors[status].color,
      fontWeight: 600,
    };
  }
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`support-tabpanel-${index}`}
      aria-labelledby={`support-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedAgent?: string;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  content: string;
  isAgent: boolean;
  agentName?: string;
  timestamp: string;
  attachments?: string[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  views: number;
}

const CustomerSupport: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  // Mock data
  useEffect(() => {
    const mockTickets: SupportTicket[] = [
      {
        id: 'TK-001',
        subject: 'Issue with robot servo motor',
        description: 'The servo motor on my Arduino robot arm is not responding correctly.',
        status: 'in-progress',
        priority: 'high',
        category: 'Technical',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-16T14:22:00Z',
        assignedAgent: 'Sarah Johnson',
        messages: [
          {
            id: 'msg1',
            content: 'Hello! I see you\'re having issues with your servo motor. Can you tell me more about the specific symptoms?',
            isAgent: true,
            agentName: 'Sarah Johnson',
            timestamp: '2024-01-15T10:35:00Z'
          },
          {
            id: 'msg2',
            content: 'The servo is making strange noises and doesn\'t move to the correct positions.',
            isAgent: false,
            timestamp: '2024-01-15T10:45:00Z'
          }
        ]
      },
      {
        id: 'TK-002',
        subject: 'Order delivery delay',
        description: 'My order #12345 was supposed to arrive yesterday but hasn\'t shipped yet.',
        status: 'resolved',
        priority: 'medium',
        category: 'Shipping',
        createdAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-12T16:30:00Z',
        assignedAgent: 'Mike Chen',
        messages: []
      }
    ];

    const mockFaqs: FAQ[] = [
      {
        id: 'faq1',
        question: 'How do I program my Arduino robot?',
        answer: 'To program your Arduino robot, you\'ll need the Arduino IDE software. Download it from arduino.cc, connect your robot via USB, and upload your code. We provide starter code examples with each robot kit.',
        category: 'Programming',
        helpful: 45,
        views: 234
      },
      {
        id: 'faq2',
        question: 'What batteries do I need for my robot?',
        answer: 'Most of our robots use either 9V batteries or rechargeable Li-ion battery packs. Check your robot\'s specifications or manual for the exact requirements.',
        category: 'Hardware',
        helpful: 38,
        views: 189
      },
      {
        id: 'faq3',
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days within the US. Express shipping is available for 1-2 day delivery. International shipping times vary by location.',
        category: 'Shipping',
        helpful: 52,
        views: 312
      }
    ];

    setTickets(mockTickets);
    setFaqs(mockFaqs);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateTicket = async (data: any) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
        subject: data.subject,
        description: data.description,
        status: 'open',
        priority: data.priority,
        category: data.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
      
      setTickets(prev => [newTicket, ...prev]);
      setNewTicketOpen(false);
      reset();
      setLoading(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const message: ChatMessage = {
      id: `msg${Date.now()}`,
      content: newMessage,
      isAgent: false,
      timestamp: new Date().toISOString()
    };

    setTickets(prev => prev.map(ticket => 
      ticket.id === selectedTicket.id 
        ? { ...ticket, messages: [...ticket.messages, message] }
        : ticket
    ));

    setNewMessage('');
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: <ChatIcon sx={{ fontSize: 48 }} />,
      action: () => setChatOpen(true),
      availability: 'Available now'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: <EmailIcon sx={{ fontSize: 48 }} />,
      action: () => setNewTicketOpen(true),
      availability: '24/7'
    },
    {
      title: 'Phone Support',
      description: 'Call our expert team',
      icon: <PhoneIcon sx={{ fontSize: 48 }} />,
      action: () => {},
      availability: 'Mon-Fri 9AM-6PM'
    },
    {
      title: 'Video Call',
      description: 'Schedule a video session',
      icon: <VideoCallIcon sx={{ fontSize: 48 }} />,
      action: () => {},
      availability: 'By appointment'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Customer Support
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We're here to help you with any questions or issues
          </Typography>
          
          {/* Quick Support Options */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {supportOptions.map((option, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <SupportOptionCard onClick={option.action}>
                  <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {option.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {option.description}
                    </Typography>
                    <Chip 
                      label={option.availability} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </CardContent>
                </SupportOptionCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontSize: '1rem'
              }
            }}
          >
            <Tab icon={<SupportIcon />} label="My Tickets" />
            <Tab icon={<HelpIcon />} label="FAQ" />
            <Tab icon={<ChatIcon />} label="Live Chat" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* Support Tickets */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              My Support Tickets
            </Typography>
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={() => setNewTicketOpen(true)}
            >
              Create New Ticket
            </Button>
          </Box>

          <Grid container spacing={3}>
            {tickets.map((ticket) => (
              <Grid item xs={12} key={ticket.id}>
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {ticket.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {ticket.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <TicketStatusChip status={ticket.status} label={ticket.status.replace('-', ' ')} size="small" />
                          <Chip label={ticket.priority} size="small" variant="outlined" />
                          <Chip label={ticket.category} size="small" variant="outlined" />
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {ticket.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
                        </Typography>
                        {ticket.assignedAgent && (
                          <Typography variant="body2" color="primary">
                            Agent: {ticket.assignedAgent}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button size="small" variant="outlined" onClick={() => setSelectedTicket(ticket)}>
                        View Details
                      </Button>
                      {ticket.status !== 'closed' && (
                        <Button size="small" variant="contained">
                          Reply
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* FAQ */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          <Grid container spacing={3}>
            {filteredFaqs.map((faq) => (
              <Grid item xs={12} key={faq.id}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mr: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {faq.question}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label={faq.category} size="small" variant="outlined" />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2">{faq.helpful}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {faq.answer}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Was this helpful?
                      </Typography>
                      <Box>
                        <Button size="small">Yes</Button>
                        <Button size="small">No</Button>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Live Chat */}
          <StyledCard>
            <CardContent sx={{ height: 500 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Avatar sx={{ mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Support Agent
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Online - Usually responds in a few minutes
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                    <ChatBubble isAgent>
                      <Typography variant="body2">
                        Hello! How can I help you today?
                      </Typography>
                    </ChatBubble>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      size="small"
                    />
                    <IconButton onClick={handleSendMessage} color="primary">
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </TabPanel>

        {/* New Ticket Dialog */}
        <Dialog open={newTicketOpen} onClose={() => setNewTicketOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <form onSubmit={handleSubmit(handleCreateTicket)}>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Controller
                    name="subject"
                    control={control}
                    rules={{ required: 'Subject is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Subject"
                        error={!!errors.subject}
                        helperText={errors.subject?.message as string}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.category}>
                        <InputLabel>Category</InputLabel>
                        <Select {...field} label="Category">
                          <MenuItem value="technical">Technical</MenuItem>
                          <MenuItem value="shipping">Shipping</MenuItem>
                          <MenuItem value="billing">Billing</MenuItem>
                          <MenuItem value="general">General</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="priority"
                    control={control}
                    rules={{ required: 'Priority is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.priority}>
                        <InputLabel>Priority</InputLabel>
                        <Select {...field} label="Priority">
                          <MenuItem value="low">Low</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                          <MenuItem value="urgent">Urgent</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'Description is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        error={!!errors.description}
                        helperText={errors.description?.message as string}
                        placeholder="Please describe your issue in detail..."
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setNewTicketOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Creating...' : 'Create Ticket'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Ticket Details Dialog */}
        <Dialog 
          open={!!selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
          maxWidth="md" 
          fullWidth
        >
          {selectedTicket && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">{selectedTicket.subject}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ticket ID: {selectedTicket.id}
                    </Typography>
                  </Box>
                  <TicketStatusChip 
                    status={selectedTicket.status} 
                    label={selectedTicket.status.replace('-', ' ')} 
                  />
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    {selectedTicket.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Chip label={selectedTicket.priority} size="small" variant="outlined" />
                    <Chip label={selectedTicket.category} size="small" variant="outlined" />
                  </Box>
                </Box>

                {selectedTicket.messages.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Messages</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {selectedTicket.messages.map((message) => (
                        <ChatBubble key={message.id} isAgent={message.isAgent}>
                          {message.isAgent && (
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {message.agentName}
                            </Typography>
                          )}
                          <Typography variant="body2">
                            {message.content}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, mt: 0.5, display: 'block' }}>
                            {format(new Date(message.timestamp), 'MMM dd, HH:mm')}
                          </Typography>
                        </ChatBubble>
                      ))}
                    </Box>
                  </Box>
                )}

                {selectedTicket.status !== 'closed' && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Type your reply..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      multiline
                      rows={2}
                    />
                    <IconButton onClick={handleSendMessage} color="primary">
                      <SendIcon />
                    </IconButton>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedTicket(null)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default CustomerSupport;