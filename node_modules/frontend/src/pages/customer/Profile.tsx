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
  Switch,
  FormControlLabel,
  Divider,
  Alert,
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
  LinearProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Payment as PaymentIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CreditCard as CreditCardIcon,
  AccountBalanceWallet as WalletIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
}));

const UploadButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  minWidth: 40,
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  memberSince: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'wallet';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string;
  isDefault: boolean;
}

const CustomerProfile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteAddressOpen, setDeleteAddressOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    security: true
  });

  const { control, handleSubmit, setValue, formState: { errors } } = useForm();

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      
      setTimeout(() => {
        const mockProfile: UserProfile = {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          avatar: '/api/placeholder/120/120',
          dateOfBirth: '1990-05-15',
          gender: 'male',
          bio: 'Robotics enthusiast and AI researcher',
          isEmailVerified: true,
          isPhoneVerified: false,
          memberSince: '2023-01-15',
          totalOrders: 12,
          totalSpent: 2849.97,
          loyaltyPoints: 1250
        };

        const mockAddresses: Address[] = [
          {
            id: '1',
            type: 'home',
            name: 'Home Address',
            street: '123 Tech Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            isDefault: true
          },
          {
            id: '2',
            type: 'work',
            name: 'Office Address',
            street: '456 Business Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            country: 'USA',
            isDefault: false
          }
        ];

        const mockPaymentMethods: PaymentMethod[] = [
          {
            id: '1',
            type: 'card',
            last4: '1234',
            brand: 'Visa',
            expiryMonth: 12,
            expiryYear: 2026,
            isDefault: true
          },
          {
            id: '2',
            type: 'paypal',
            email: 'john.doe@example.com',
            isDefault: false
          }
        ];

        setProfile(mockProfile);
        setAddresses(mockAddresses);
        setPaymentMethods(mockPaymentMethods);

        // Set form values
        setValue('firstName', mockProfile.firstName);
        setValue('lastName', mockProfile.lastName);
        setValue('email', mockProfile.email);
        setValue('phone', mockProfile.phone);
        setValue('dateOfBirth', mockProfile.dateOfBirth);
        setValue('gender', mockProfile.gender);
        setValue('bio', mockProfile.bio);

        setLoading(false);
      }, 1000);
    };

    fetchProfileData();
  }, [setValue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveProfile = async (data: any) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Saving profile:', data);
      setEditMode(false);
      setLoading(false);
    }, 1500);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle avatar upload
      console.log('Uploading avatar:', file);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    setDeleteAddressOpen(true);
  };

  const confirmDeleteAddress = () => {
    setAddresses(prev => prev.filter(addr => addr.id !== selectedAddressId));
    setDeleteAddressOpen(false);
    setSelectedAddressId('');
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  const handleSetDefaultPayment = (paymentId: string) => {
    setPaymentMethods(prev => prev.map(payment => ({
      ...payment,
      isDefault: payment.id === paymentId
    })));
  };

  if (loading && !profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>Loading Profile...</Typography>
        </Box>
      </Container>
    );
  }

  if (!profile) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>

        {/* Profile Summary Card */}
        <StyledCard sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Box sx={{ position: 'relative' }}>
                  <ProfileAvatar src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`}>
                    {!profile.avatar && `${profile.firstName[0]}${profile.lastName[0]}`}
                  </ProfileAvatar>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarUpload}
                  />
                  <label htmlFor="avatar-upload">
                    <UploadButton>
                      <PhotoCameraIcon fontSize="small" />
                    </UploadButton>
                  </label>
                </Box>
              </Grid>
              <Grid item xs>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                  {profile.firstName} {profile.lastName}
                  {profile.isEmailVerified && (
                    <VerifiedIcon sx={{ ml: 1, color: 'lightblue' }} />
                  )}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  {profile.email}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${profile.totalOrders} Orders`} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip 
                    label={`$${profile.totalSpent.toFixed(2)} Spent`} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip 
                    label={`${profile.loyaltyPoints} Points`} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>

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
            <Tab icon={<PersonIcon />} label="Personal Info" />
            <Tab icon={<LocationIcon />} label="Addresses" />
            <Tab icon={<PaymentIcon />} label="Payment Methods" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<SecurityIcon />} label="Security" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* Personal Information */}
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Personal Information
                </Typography>
                <Button
                  variant={editMode ? "outlined" : "contained"}
                  startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>

              <form onSubmit={handleSubmit(handleSaveProfile)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{ required: 'First name is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="First Name"
                          disabled={!editMode}
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message as string}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{ required: 'Last name is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Last Name"
                          disabled={!editMode}
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message as string}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: 'Email is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email Address"
                          type="email"
                          disabled={!editMode}
                          error={!!errors.email}
                          helperText={errors.email?.message as string}
                          InputProps={{
                            endAdornment: profile.isEmailVerified ? (
                              <VerifiedIcon color="success" />
                            ) : (
                              <Button size="small" variant="text">Verify</Button>
                            )
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone Number"
                          disabled={!editMode}
                          InputProps={{
                            endAdornment: profile.isPhoneVerified ? (
                              <VerifiedIcon color="success" />
                            ) : (
                              <Button size="small" variant="text">Verify</Button>
                            )
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Date of Birth"
                          type="date"
                          disabled={!editMode}
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Gender"
                          disabled={!editMode}
                          SelectProps={{ native: true }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        >
                          <option value=""></option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="bio"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Bio"
                          multiline
                          rows={3}
                          disabled={!editMode}
                          placeholder="Tell us a bit about yourself..."
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                )}
              </form>
            </CardContent>
          </StyledCard>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Addresses */}
          <Grid container spacing={3}>
            {addresses.map((address) => (
              <Grid item xs={12} md={6} key={address.id}>
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {address.name}
                          {address.isDefault && (
                            <Chip label="Default" size="small" color="primary" sx={{ ml: 1 }} />
                          )}
                        </Typography>
                        <Chip 
                          label={address.type} 
                          size="small" 
                          variant="outlined" 
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      <IconButton size="small" onClick={() => handleDeleteAddress(address.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {address.street}<br />
                      {address.city}, {address.state} {address.zipCode}<br />
                      {address.country}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">
                        Edit
                      </Button>
                      {!address.isDefault && (
                        <Button 
                          size="small" 
                          variant="text"
                          onClick={() => handleSetDefaultAddress(address.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <AddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Add New Address
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Payment Methods */}
          <Grid container spacing={3}>
            {paymentMethods.map((payment) => (
              <Grid item xs={12} md={6} key={payment.id}>
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {payment.type === 'card' ? (
                          <CreditCardIcon color="primary" />
                        ) : payment.type === 'paypal' ? (
                          <WalletIcon color="primary" />
                        ) : (
                          <PaymentIcon color="primary" />
                        )}
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {payment.type === 'card' 
                              ? `${payment.brand} ••••${payment.last4}`
                              : payment.type === 'paypal'
                              ? 'PayPal'
                              : 'Digital Wallet'
                            }
                            {payment.isDefault && (
                              <Chip label="Default" size="small" color="primary" sx={{ ml: 1 }} />
                            )}
                          </Typography>
                          {payment.type === 'card' && (
                            <Typography variant="body2" color="text.secondary">
                              Expires {payment.expiryMonth}/{payment.expiryYear}
                            </Typography>
                          )}
                          {payment.type === 'paypal' && (
                            <Typography variant="body2" color="text.secondary">
                              {payment.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">
                        Edit
                      </Button>
                      {!payment.isDefault && (
                        <Button 
                          size="small" 
                          variant="text"
                          onClick={() => handleSetDefaultPayment(payment.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <AddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Add Payment Method
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {/* Notifications */}
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Notification Preferences
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Order Updates"
                    secondary="Get notified about order status changes"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.orderUpdates}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        orderUpdates: e.target.checked
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Promotions & Deals"
                    secondary="Receive notifications about special offers"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.promotions}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        promotions: e.target.checked
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Newsletter"
                    secondary="Stay updated with our latest news and products"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.newsletter}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        newsletter: e.target.checked
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Security Alerts"
                    secondary="Important security notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.security}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        security: e.target.checked
                      }))}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </StyledCard>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          {/* Security */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Password & Security
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Change Password"
                        secondary="Last changed 3 months ago"
                      />
                      <ListItemSecondaryAction>
                        <Button variant="outlined" size="small">
                          Change
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Two-Factor Authentication"
                        secondary={profile.isPhoneVerified ? "Enabled" : "Disabled"}
                      />
                      <ListItemSecondaryAction>
                        <Switch checked={profile.isPhoneVerified} />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Account Verification
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon color={profile.isEmailVerified ? "success" : "disabled"} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email Verification"
                        secondary={profile.isEmailVerified ? "Verified" : "Not verified"}
                      />
                      {!profile.isEmailVerified && (
                        <ListItemSecondaryAction>
                          <Button variant="outlined" size="small">
                            Verify
                          </Button>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon color={profile.isPhoneVerified ? "success" : "disabled"} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone Verification"
                        secondary={profile.isPhoneVerified ? "Verified" : "Not verified"}
                      />
                      {!profile.isPhoneVerified && (
                        <ListItemSecondaryAction>
                          <Button variant="outlined" size="small">
                            Verify
                          </Button>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  </List>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Delete Address Dialog */}
        <Dialog open={deleteAddressOpen} onClose={() => setDeleteAddressOpen(false)}>
          <DialogTitle>Delete Address</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this address? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteAddressOpen(false)}>Cancel</Button>
            <Button onClick={confirmDeleteAddress} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default CustomerProfile;