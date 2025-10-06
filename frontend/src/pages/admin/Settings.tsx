import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Edit,
  Delete,
  Add,
  Save,
  Security,
  Notifications,
  Payment,
  LocalShipping as ShippingIcon,
  Store,
  Email,
  Backup,
  Person,
  VpnKey,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/layout/AdminSidebar';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  last_login: string;
  avatar: string;
}

const AdminSettings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    // General Settings
    site_name: 'RoboticsShop',
    site_description: 'Your one-stop shop for robotics and electronics',
    site_url: 'https://roboticsshop.com',
    contact_email: 'support@roboticsshop.com',
    contact_phone: '+1-555-0123',
    
    // Email Settings
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_username: 'noreply@roboticsshop.com',
    smtp_password: '',
    email_from_name: 'RoboticsShop',
    email_from_address: 'noreply@roboticsshop.com',
    
    // Payment Settings
    stripe_public_key: '',
    stripe_secret_key: '',
    paypal_client_id: '',
    paypal_secret: '',
    payment_currency: 'USD',
    
    // Shipping Settings
    default_shipping_cost: '15.99',
    free_shipping_threshold: '100.00',
    shipping_zones: ['USA', 'Canada', 'Europe'],
    
    // Notification Settings
    email_notifications: true,
    sms_notifications: false,
    order_notifications: true,
    inventory_alerts: true,
    low_stock_threshold: '10',
    
    // Security Settings
    enable_2fa: false,
    session_timeout: '30',
    password_min_length: '8',
    max_login_attempts: '5',
    
    // Backup Settings
    auto_backup: true,
    backup_frequency: 'daily',
    backup_retention: '30',
  });

  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@roboticsshop.com',
      role: 'Super Admin',
      status: 'active',
      last_login: '2025-10-03T10:30:00Z',
      avatar: '/images/avatars/admin.jpg',
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@roboticsshop.com',
      role: 'Admin',
      status: 'active',
      last_login: '2025-10-03T09:15:00Z',
      avatar: '/images/avatars/sarah.jpg',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@roboticsshop.com',
      role: 'Support',
      status: 'active',
      last_login: '2025-10-02T16:45:00Z',
      avatar: '/images/avatars/mike.jpg',
    },
  ]);

  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // API call to save settings
    console.log('Saving settings:', settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleEditUser = (user: SystemUser) => {
    setEditingUser(user);
    setUserDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      if (editingUser.id === 0) {
        // Add new user
        setUsers(prev => [...prev, { ...editingUser, id: Date.now() }]);
      } else {
        // Update existing user
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id ? editingUser : user
        ));
      }
    }
    setUserDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'error';
      case 'Admin': return 'primary';
      case 'Support': return 'info';
      case 'Manager': return 'warning';
      default: return 'default';
    }
  };

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
            <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon />
              System Settings
            </Typography>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveSettings}
            >
              Save All Changes
            </Button>
          </Box>

          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Settings saved successfully!
            </Alert>
          )}

          <Paper sx={{ width: '100%' }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="General" icon={<Store />} />
              <Tab label="Email" icon={<Email />} />
              <Tab label="Payment" icon={<Payment />} />
              <Tab label="Shipping" icon={<ShippingIcon />} />
              <Tab label="Notifications" icon={<Notifications />} />
              <Tab label="Security" icon={<Security />} />
              <Tab label="Users" icon={<Person />} />
              <Tab label="Backup" icon={<Backup />} />
            </Tabs>

            {/* General Settings */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Site Name"
                    value={settings.site_name}
                    onChange={(e) => handleSettingChange('site_name', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Site Description"
                    multiline
                    rows={3}
                    value={settings.site_description}
                    onChange={(e) => handleSettingChange('site_description', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Site URL"
                    value={settings.site_url}
                    onChange={(e) => handleSettingChange('site_url', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleSettingChange('contact_email', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={settings.contact_phone}
                    onChange={(e) => handleSettingChange('contact_phone', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Email Settings */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="SMTP Host"
                    value={settings.smtp_host}
                    onChange={(e) => handleSettingChange('smtp_host', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="SMTP Port"
                    value={settings.smtp_port}
                    onChange={(e) => handleSettingChange('smtp_port', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="SMTP Username"
                    value={settings.smtp_username}
                    onChange={(e) => handleSettingChange('smtp_username', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="SMTP Password"
                    type="password"
                    value={settings.smtp_password}
                    onChange={(e) => handleSettingChange('smtp_password', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email From Name"
                    value={settings.email_from_name}
                    onChange={(e) => handleSettingChange('email_from_name', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email From Address"
                    type="email"
                    value={settings.email_from_address}
                    onChange={(e) => handleSettingChange('email_from_address', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Payment Settings */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Stripe Settings</Typography>
                  <TextField
                    fullWidth
                    label="Stripe Public Key"
                    value={settings.stripe_public_key}
                    onChange={(e) => handleSettingChange('stripe_public_key', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Stripe Secret Key"
                    type="password"
                    value={settings.stripe_secret_key}
                    onChange={(e) => handleSettingChange('stripe_secret_key', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>PayPal Settings</Typography>
                  <TextField
                    fullWidth
                    label="PayPal Client ID"
                    value={settings.paypal_client_id}
                    onChange={(e) => handleSettingChange('paypal_client_id', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="PayPal Secret"
                    type="password"
                    value={settings.paypal_secret}
                    onChange={(e) => handleSettingChange('paypal_secret', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Payment Currency"
                    value={settings.payment_currency}
                    onChange={(e) => handleSettingChange('payment_currency', e.target.value)}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Shipping Settings */}
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Default Shipping Cost ($)"
                    type="number"
                    value={settings.default_shipping_cost}
                    onChange={(e) => handleSettingChange('default_shipping_cost', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Free Shipping Threshold ($)"
                    type="number"
                    value={settings.free_shipping_threshold}
                    onChange={(e) => handleSettingChange('free_shipping_threshold', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Shipping Zones
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {settings.shipping_zones.map((zone, index) => (
                      <Chip
                        key={index}
                        label={zone}
                        onDelete={() => {
                          const newZones = settings.shipping_zones.filter((_, i) => i !== index);
                          handleSettingChange('shipping_zones', newZones);
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Notification Settings */}
            <TabPanel value={tabValue} index={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Email Notifications" 
                        secondary="Send notifications via email"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.email_notifications}
                          onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="SMS Notifications" 
                        secondary="Send notifications via SMS"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.sms_notifications}
                          onChange={(e) => handleSettingChange('sms_notifications', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Order Notifications" 
                        secondary="Notify about new orders"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.order_notifications}
                          onChange={(e) => handleSettingChange('order_notifications', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Inventory Alerts" 
                        secondary="Alert when stock is low"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.inventory_alerts}
                          onChange={(e) => handleSettingChange('inventory_alerts', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Low Stock Threshold"
                    type="number"
                    value={settings.low_stock_threshold}
                    onChange={(e) => handleSettingChange('low_stock_threshold', e.target.value)}
                    helperText="Alert when product stock falls below this number"
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Security Settings */}
            <TabPanel value={tabValue} index={5}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Enable Two-Factor Authentication" 
                        secondary="Require 2FA for admin accounts"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.enable_2fa}
                          onChange={(e) => handleSettingChange('enable_2fa', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.session_timeout}
                    onChange={(e) => handleSettingChange('session_timeout', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Password Minimum Length"
                    type="number"
                    value={settings.password_min_length}
                    onChange={(e) => handleSettingChange('password_min_length', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Max Login Attempts"
                    type="number"
                    value={settings.max_login_attempts}
                    onChange={(e) => handleSettingChange('max_login_attempts', e.target.value)}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Users Management */}
            <TabPanel value={tabValue} index={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">System Users</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    setEditingUser({
                      id: 0,
                      name: '',
                      email: '',
                      role: 'Support',
                      status: 'active',
                      last_login: '',
                      avatar: '',
                    });
                    setUserDialogOpen(true);
                  }}
                >
                  Add User
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={user.avatar} alt={user.name}>
                              {user.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">{user.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={getRoleColor(user.role) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.status.toUpperCase()}
                            color={user.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleEditUser(user)}>
                            <Edit />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.role === 'Super Admin'}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Backup Settings */}
            <TabPanel value={tabValue} index={7}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Automatic Backup" 
                        secondary="Enable automatic database backups"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.auto_backup}
                          onChange={(e) => handleSettingChange('auto_backup', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Backup Frequency"
                    value={settings.backup_frequency}
                    onChange={(e) => handleSettingChange('backup_frequency', e.target.value)}
                    sx={{ mb: 2 }}
                    SelectProps={{ native: true }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Backup Retention (days)"
                    type="number"
                    value={settings.backup_retention}
                    onChange={(e) => handleSettingChange('backup_retention', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button variant="outlined" fullWidth>
                    Create Backup Now
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>

          {/* User Edit Dialog */}
          <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editingUser?.id === 0 ? 'Add New User' : 'Edit User'}
            </DialogTitle>
            <DialogContent>
              {editingUser && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Role"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      SelectProps={{ native: true }}
                    >
                      <option value="Support">Support</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Super Admin">Super Admin</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                      SelectProps={{ native: true }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </TextField>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveUser} variant="contained">
                {editingUser?.id === 0 ? 'Add User' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminSettings;