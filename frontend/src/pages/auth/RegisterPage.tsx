import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  Link,
  Checkbox,
  FormControlLabel,
  Alert,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  Google,
  Facebook,
  Apple,
  CheckCircle,
  Security,
  Verified,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';

const RegisterPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [field]: value,
    });

    // Calculate password strength
    if (field === 'password') {
      const password = value as string;
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[a-z]/.test(password)) strength += 25;
      if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      console.log('Registration attempt:', formData);
      navigate('/auth/login?registered=true');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Register with ${provider}`);
    // Implement social registration logic
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return '#ef4444';
    if (passwordStrength < 75) return '#f59e0b';
    return '#10b981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const benefits = [
    { icon: CheckCircle, text: 'Access to 10,000+ premium components' },
    { icon: Security, text: 'Secure checkout and payment protection' },
    { icon: Verified, text: 'Exclusive deals and early access to new products' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" sx={{ minHeight: '80vh' }}>
          {/* Left Side - Registration Form */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
                background: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(20px)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    mb: 1,
                    background: 'linear-gradient(45deg, #1e293b, #475569)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Create Account
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: 'center', mb: 4 }}
                >
                  Join thousands of innovators building the future
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Password Strength
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: getPasswordStrengthColor(), fontWeight: 600 }}
                        >
                          {getPasswordStrengthText()}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: alpha('#000', 0.1),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getPasswordStrengthColor(),
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                  )}

                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    required
                    error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
                    helperText={
                      formData.confirmPassword !== '' && formData.password !== formData.confirmPassword
                        ? 'Passwords do not match'
                        : ''
                    }
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Checkboxes */}
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange('agreeToTerms')}
                          required
                          sx={{
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          I agree to the{' '}
                          <Link
                            href="/terms"
                            target="_blank"
                            sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                          >
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link
                            href="/privacy"
                            target="_blank"
                            sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                          >
                            Privacy Policy
                          </Link>
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.subscribeNewsletter}
                          onChange={handleInputChange('subscribeNewsletter')}
                          sx={{
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      label="Subscribe to newsletter for latest updates and offers"
                    />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(45deg, #0ea5e9, #06b6d4)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0284c7, #0891b2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)',
                      },
                      '&:disabled': {
                        background: alpha(theme.palette.action.disabled, 0.12),
                      },
                      transition: 'all 0.3s ease',
                      mb: 3,
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <Divider sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      or register with
                    </Typography>
                  </Divider>

                  {/* Social Registration Buttons */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleSocialLogin('google')}
                        sx={{
                          borderRadius: '12px',
                          py: 1.5,
                          borderColor: alpha(theme.palette.divider, 0.3),
                          '&:hover': {
                            borderColor: '#db4437',
                            backgroundColor: alpha('#db4437', 0.05),
                          },
                        }}
                      >
                        <Google sx={{ color: '#db4437' }} />
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleSocialLogin('facebook')}
                        sx={{
                          borderRadius: '12px',
                          py: 1.5,
                          borderColor: alpha(theme.palette.divider, 0.3),
                          '&:hover': {
                            borderColor: '#1877f2',
                            backgroundColor: alpha('#1877f2', 0.05),
                          },
                        }}
                      >
                        <Facebook sx={{ color: '#1877f2' }} />
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleSocialLogin('apple')}
                        sx={{
                          borderRadius: '12px',
                          py: 1.5,
                          borderColor: alpha(theme.palette.divider, 0.3),
                          '&:hover': {
                            borderColor: '#000',
                            backgroundColor: alpha('#000', 0.05),
                          },
                        }}
                      >
                        <Apple sx={{ color: '#000' }} />
                      </Button>
                    </Grid>
                  </Grid>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={() => navigate('/auth/login')}
                        sx={{
                          textDecoration: 'none',
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Sign in here
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side - Benefits */}
          <Grid item xs={12} md={5}>
            <Box sx={{ pl: { md: 4 } }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #0ea5e9, #06b6d4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Join Our Community
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 3,
                  lineHeight: 1.4,
                }}
              >
                Unlock exclusive benefits and become part of the robotics revolution
              </Typography>

              {/* Benefits List */}
              <Box sx={{ mb: 4 }}>
                {benefits.map((benefit, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3,
                      p: 2,
                      borderRadius: '12px',
                      background: alpha(theme.palette.primary.main, 0.05),
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '10px',
                        background: alpha(theme.palette.primary.main, 0.1),
                        mr: 3,
                      }}
                    >
                      <benefit.icon sx={{ color: theme.palette.primary.main, fontSize: '1.8rem' }} />
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.5 }}>
                      {benefit.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Trust Indicators */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: alpha(theme.palette.success.main, 0.05),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.success.main, 0.2),
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.success.main }}>
                  Trusted by 50,000+ Engineers
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Join Arduino enthusiasts, robotics engineers, and makers from around the world who trust RoboticsShop for their projects.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegisterPage;