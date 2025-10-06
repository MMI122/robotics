import React, { useState, useEffect } from 'react';
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
  useTheme,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  Facebook,
  Apple,
  Security,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { login } from '../../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error: authError, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      console.log('Login attempt:', formData);
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password,
      }));

      if (login.fulfilled.match(result)) {
        // Check if user is admin and redirect accordingly
        const user = result.payload.user;
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(result.payload as string || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic
  };

  const features = [
    { icon: Security, text: 'Bank-level security' },
    { icon: CheckCircle, text: 'Verified sellers only' },
    { icon: CheckCircle, text: 'Fast & secure checkout' },
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
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pr: { md: 4 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #0ea5e9, #06b6d4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                RoboticsShop
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 3,
                  lineHeight: 1.3,
                }}
              >
                Welcome back to the future of robotics
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Access thousands of premium robotics components, Arduino boards, sensors, and cutting-edge technology solutions.
              </Typography>

              {/* Features */}
              <Box sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '8px',
                        background: alpha(theme.palette.primary.main, 0.1),
                        mr: 2,
                      }}
                    >
                      <feature.icon sx={{ color: theme.palette.primary.main, fontSize: '1.5rem' }} />
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {feature.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Stats */}
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    10K+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    50K+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customers
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    99.9%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Uptime
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
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
                  Sign In
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: 'center', mb: 4 }}
                >
                  Enter your credentials to access your account
                </Typography>

                {(error || authError) && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {error || authError}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
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
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
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

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.rememberMe}
                          onChange={handleInputChange('rememberMe')}
                          sx={{
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      label="Remember me"
                    />
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      onClick={() => navigate('/auth/forgot-password')}
                      sx={{
                        textDecoration: 'none',
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Forgot password?
                    </Link>
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
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  <Divider sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      or continue with
                    </Typography>
                  </Divider>

                  {/* Social Login Buttons */}
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
                      Don't have an account?{' '}
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={() => navigate('/auth/register')}
                        sx={{
                          textDecoration: 'none',
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Sign up here
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;