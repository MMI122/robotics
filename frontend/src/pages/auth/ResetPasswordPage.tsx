import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AuthContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  padding: theme.spacing(2),
}));

const AuthCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
  background: 'rgba(255,255,255,0.95)',
  maxWidth: 500,
  width: '100%',
  margin: '0 auto',
}));

const PasswordStrengthIndicator = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

interface FormValues {
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: 'error' | 'warning' | 'info' | 'success';
  criteria: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const ResetPasswordPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Very Weak',
    color: 'error',
    criteria: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    }
  });

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setError('Invalid or missing reset token.');
        return;
      }

      try {
        // In a real app, this would validate the token with the backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
        setError('This reset link has expired or is invalid.');
      }
    };

    validateToken();
  }, [token]);

  const formik = useFormik<FormValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real app, this would call the reset password API
        console.log('Password reset for token:', token);
        console.log('New password:', values.password);
        
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || 'Failed to reset password. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  // Calculate password strength
  useEffect(() => {
    const password = formik.values.password;
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    const score = Object.values(criteria).filter(Boolean).length;
    let label = 'Very Weak';
    let color: 'error' | 'warning' | 'info' | 'success' = 'error';

    if (score >= 5) {
      label = 'Very Strong';
      color = 'success';
    } else if (score >= 4) {
      label = 'Strong';
      color = 'success';
    } else if (score >= 3) {
      label = 'Medium';
      color = 'info';
    } else if (score >= 2) {
      label = 'Weak';
      color = 'warning';
    }

    setPasswordStrength({ score, label, color, criteria });
  }, [formik.values.password]);

  if (tokenValid === null) {
    return (
      <AuthContainer>
        <Container maxWidth="sm">
          <AuthCard>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Validating reset link...
              </Typography>
            </Box>
          </AuthCard>
        </Container>
      </AuthContainer>
    );
  }

  if (tokenValid === false) {
    return (
      <AuthContainer>
        <Container maxWidth="sm">
          <AuthCard>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CancelIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Invalid Reset Link
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                This password reset link has expired or is invalid. Please request a new one.
              </Typography>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/forgot-password')}
                >
                  Request New Reset Link
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </Box>
            </Box>
          </AuthCard>
        </Container>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AuthCard>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <LockIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Reset Password
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Choose a strong new password for your account
              </Typography>
              {email && (
                <Typography variant="body2" sx={{ mt: 1, color: 'primary.main', fontWeight: 600 }}>
                  Resetting password for: {email}
                </Typography>
              )}
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Success State */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Password Reset Successful!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Your password has been successfully updated. You can now log in with your new password.
                  </Typography>
                  
                  <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/login')}
                      startIcon={<SecurityIcon />}
                    >
                      Go to Login
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/')}
                      startIcon={<HomeIcon />}
                    >
                      Go to Home
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            ) : (
              /* Password Reset Form */
              <form onSubmit={formik.handleSubmit}>
                {/* New Password */}
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />

                {/* Password Strength Indicator */}
                {formik.values.password && (
                  <PasswordStrengthIndicator>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Password Strength:
                      </Typography>
                      <Typography variant="body2" color={`${passwordStrength.color}.main`} sx={{ fontWeight: 600 }}>
                        {passwordStrength.label}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(passwordStrength.score / 5) * 100}
                      color={passwordStrength.color}
                      sx={{ mb: 2 }}
                    />
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          {passwordStrength.criteria.length ? 
                            <CheckCircleIcon color="success" fontSize="small" /> : 
                            <CancelIcon color="error" fontSize="small" />
                          }
                        </ListItemIcon>
                        <ListItemText 
                          primary="At least 8 characters" 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          {passwordStrength.criteria.uppercase ? 
                            <CheckCircleIcon color="success" fontSize="small" /> : 
                            <CancelIcon color="error" fontSize="small" />
                          }
                        </ListItemIcon>
                        <ListItemText 
                          primary="One uppercase letter" 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          {passwordStrength.criteria.lowercase ? 
                            <CheckCircleIcon color="success" fontSize="small" /> : 
                            <CancelIcon color="error" fontSize="small" />
                          }
                        </ListItemIcon>
                        <ListItemText 
                          primary="One lowercase letter" 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          {passwordStrength.criteria.number ? 
                            <CheckCircleIcon color="success" fontSize="small" /> : 
                            <CancelIcon color="error" fontSize="small" />
                          }
                        </ListItemIcon>
                        <ListItemText 
                          primary="One number" 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          {passwordStrength.criteria.special ? 
                            <CheckCircleIcon color="success" fontSize="small" /> : 
                            <CancelIcon color="error" fontSize="small" />
                          }
                        </ListItemIcon>
                        <ListItemText 
                          primary="One special character" 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    </List>
                  </PasswordStrengthIndicator>
                )}

                {/* Confirm Password */}
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || passwordStrength.score < 4}
                  startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
                  sx={{ mb: 3, py: 1.5 }}
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Back to Login
                  </Link>
                </Box>
              </form>
            )}

            {/* Security Notice */}
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Security Tip:</strong> Choose a password that you haven't used before and 
                don't share it with anyone. We recommend using a password manager to generate 
                and store strong passwords.
              </Typography>
            </Alert>
          </AuthCard>
        </motion.div>
      </Container>
    </AuthContainer>
  );
};

export default ResetPasswordPage;