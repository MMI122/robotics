import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  ArrowBack,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  SendOutlined,
  RefreshOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPasswordPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendTimer, setResendTimer] = useState(0);

  const steps = ['Enter Email', 'Verify Code', 'Reset Password'];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    };
  };

  const handleSendCode = async () => {
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setActiveStep(1);
      setResendTimer(60);
      
      // Start countdown timer
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setErrors({ email: 'Failed to send verification code. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setErrors({ code: 'Please enter a valid 6-digit verification code' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setActiveStep(2);
    } catch (error) {
      setErrors({ code: 'Invalid verification code. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const passwordValidation = validatePassword(newPassword);
    const newErrors: Record<string, string> = {};

    if (!passwordValidation.isValid) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Show success and redirect
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful! Please log in with your new password.' } });
      }, 2000);
    } catch (error) {
      setErrors({ password: 'Failed to reset password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendTimer(60);
      
      // Start countdown timer
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setErrors({ code: 'Failed to resend code. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(newPassword);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            sx={{
              borderRadius: '24px',
              backdropFilter: 'blur(20px)',
              background: alpha('#ffffff', 0.95),
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              border: '1px solid',
              borderColor: alpha('#ffffff', 0.2),
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton
                  onClick={() => navigate('/login')}
                  sx={{
                    mr: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'translateX(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a202c' }}>
                  Reset Password
                </Typography>
              </Box>

              {/* Progress Stepper */}
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step 1: Enter Email */}
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                      }}
                    >
                      <Email sx={{ fontSize: '2.5rem', color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Enter Your Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mx: 'auto' }}>
                      We'll send you a verification code to reset your password
                    </Typography>
                  </Box>

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSendCode}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SendOutlined />}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8, #6b42a5)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isLoading ? 'Sending...' : 'Send Verification Code'}
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Verify Code */}
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <Email sx={{ fontSize: '2.5rem', color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Check Your Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 350, mx: 'auto' }}>
                      We sent a 6-digit verification code to{' '}
                      <strong>{email}</strong>
                    </Typography>
                  </Box>

                  <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
                    Please check your spam folder if you don't see the email in your inbox.
                  </Alert>

                  <TextField
                    fullWidth
                    label="Verification Code"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerificationCode(value);
                    }}
                    error={!!errors.code}
                    helperText={errors.code}
                    placeholder="Enter 6-digit code"
                    inputProps={{
                      style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' },
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleVerifyCode}
                    disabled={isLoading || verificationCode.length !== 6}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircle />}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      mb: 2,
                      background: 'linear-gradient(45deg, #10b981, #059669)',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #0f9f75, #047857)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    onClick={handleResendCode}
                    disabled={resendTimer > 0 || isLoading}
                    startIcon={<RefreshOutlined />}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                  </Button>
                </motion.div>
              )}

              {/* Step 3: Reset Password */}
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <Lock sx={{ fontSize: '2.5rem', color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Create New Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mx: 'auto' }}>
                      Your new password must be strong and secure
                    </Typography>
                  </Box>

                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: alpha('#f3f4f6', 0.8), borderRadius: '12px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Password Requirements:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {[
                          { label: 'At least 8 characters', met: passwordValidation.minLength },
                          { label: 'One uppercase letter', met: passwordValidation.hasUpperCase },
                          { label: 'One lowercase letter', met: passwordValidation.hasLowerCase },
                          { label: 'One number', met: passwordValidation.hasNumbers },
                          { label: 'One special character', met: passwordValidation.hasSpecialChar },
                        ].map((req, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: req.met ? '#10b981' : '#d1d5db',
                                mr: 1,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: req.met ? '#10b981' : '#6b7280',
                              }}
                            >
                              {req.label}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleResetPassword}
                    disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircle />}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #e08e0b, #c7730a)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;