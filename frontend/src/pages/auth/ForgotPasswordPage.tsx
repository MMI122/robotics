import React, { useState } from 'react';
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
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AuthContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
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

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});

interface FormValues {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real app, this would call the forgot password API
        console.log('Password reset requested for:', values.email);
        
        setSuccess(true);
        setStep(1);
      } catch (err: any) {
        setError(err.message || 'Failed to send reset email. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const steps = [
    {
      label: 'Enter Email',
      description: 'Provide your email address to receive reset instructions'
    },
    {
      label: 'Check Email',
      description: 'We\'ve sent password reset instructions to your email'
    }
  ];

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      // Simulate resending email
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Reset email resent to:', formik.values.email);
    } catch (err) {
      setError('Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Forgot Password?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Don't worry! Enter your email and we'll send you reset instructions.
              </Typography>
            </Box>

            {/* Progress Stepper */}
            <Box sx={{ mb: 4 }}>
              <Stepper activeStep={step} orientation="vertical">
                {steps.map((stepData, index) => (
                  <Step key={stepData.label}>
                    <StepLabel>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {stepData.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {stepData.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
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
                    Email Sent Successfully!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    We've sent password reset instructions to:
                  </Typography>
                  <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 600 }}>
                    {formik.values.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Please check your email and follow the instructions to reset your password. 
                    The link will expire in 1 hour for security reasons.
                  </Typography>
                  
                  <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleResendEmail}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                    >
                      {loading ? 'Resending...' : 'Resend Email'}
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => navigate('/login')}
                      startIcon={<ArrowBackIcon />}
                    >
                      Back to Login
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            ) : (
              /* Email Form */
              <form onSubmit={formik.handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !formik.values.email}
                  startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  sx={{ mb: 3, py: 1.5 }}
                >
                  {loading ? 'Sending Reset Email...' : 'Send Reset Email'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    <ArrowBackIcon fontSize="small" />
                    Back to Login
                  </Link>
                </Box>
              </form>
            )}

            {/* Additional Help */}
            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Need More Help?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                If you're still having trouble accessing your account, our support team is here to help.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/contact')}
                >
                  Contact Support
                </Button>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/faq')}
                >
                  View FAQ
                </Button>
              </Box>
            </Box>

            {/* Security Notice */}
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Security Notice:</strong> For your protection, password reset links expire after 1 hour. 
                If you didn't request this reset, you can safely ignore this email.
              </Typography>
            </Alert>
          </AuthCard>
        </motion.div>
      </Container>
    </AuthContainer>
  );
};

export default ForgotPasswordPage;