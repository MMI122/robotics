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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  AccessTime,
  Send,
  Support,
  Business,
  School,
  ExpandMore,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    category: 'general',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const contactInfo = [
    {
      icon: <Email />,
      title: 'Email Us',
      details: ['support@roboticsshop.com', 'sales@roboticsshop.com'],
      description: 'Get in touch via email for any inquiries',
      color: '#667eea',
    },
    {
      icon: <Phone />,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Speak directly with our support team',
      color: '#10b981',
    },
    {
      icon: <LocationOn />,
      title: 'Visit Us',
      details: ['123 Innovation Drive', 'Tech Valley, CA 94301'],
      description: 'Come see our showroom and warehouse',
      color: '#f59e0b',
    },
    {
      icon: <AccessTime />,
      title: 'Business Hours',
      details: ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
      description: 'Pacific Standard Time (PST)',
      color: '#ef4444',
    },
  ];

  const departments = [
    {
      title: 'Technical Support',
      icon: <Support />,
      description: 'Get help with product selection, troubleshooting, and technical questions.',
      email: 'support@roboticsshop.com',
      color: '#667eea',
    },
    {
      title: 'Sales & Partnerships',
      icon: <Business />,
      description: 'Bulk orders, corporate partnerships, and business inquiries.',
      email: 'sales@roboticsshop.com',
      color: '#10b981',
    },
    {
      title: 'Education Programs',
      icon: <School />,
      description: 'Educational discounts, curriculum support, and STEM programs.',
      email: 'education@roboticsshop.com',
      color: '#f59e0b',
    },
  ];

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for large orders.',
    },
    {
      question: 'How fast is your shipping?',
      answer: 'We offer standard shipping (5-7 business days), express shipping (2-3 business days), and overnight shipping. Orders over $50 qualify for free standard shipping.',
    },
    {
      question: 'Do you offer technical support?',
      answer: 'Yes! Our technical support team consists of experienced engineers who can help with product selection, troubleshooting, and project guidance.',
    },
    {
      question: 'Can I return products if they don\'t work for my project?',
      answer: 'We offer a 30-day return policy for unused items in original packaging. Custom or programmed items may have different return conditions.',
    },
    {
      question: 'Do you offer educational discounts?',
      answer: 'Yes, we provide special pricing for educational institutions, students, and STEM programs. Contact our education team for more information.',
    },
    {
      question: 'Can you help with custom solutions?',
      answer: 'Absolutely! Our engineering team can work with you to develop custom robotics solutions for your specific needs. Contact us to discuss your requirements.',
    },
  ];

  if (isSubmitted) {
    return (
      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ borderRadius: '24px', textAlign: 'center', p: 6 }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
                }}
              >
                <CheckCircle sx={{ fontSize: '4rem', color: 'white' }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#10b981' }}>
                Message Sent Successfully!
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                Thank you for contacting us. We'll get back to you within 24 hours.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setIsSubmitted(false)}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                }}
              >
                Send Another Message
              </Button>
            </Card>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Get in Touch
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, maxWidth: 600, mx: 'auto', opacity: 0.9 }}>
                Have questions about our products? Need technical support? Want to discuss a custom solution? 
                We're here to help you succeed in your robotics and electronics projects.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card sx={{ borderRadius: '24px', p: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                  Send us a Message
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company (Optional)"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
                          Inquiry Category
                        </FormLabel>
                        <RadioGroup
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          row
                        >
                          <FormControlLabel value="general" control={<Radio />} label="General Inquiry" />
                          <FormControlLabel value="support" control={<Radio />} label="Technical Support" />
                          <FormControlLabel value="sales" control={<Radio />} label="Sales & Orders" />
                          <FormControlLabel value="partnership" control={<Radio />} label="Partnership" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                        placeholder="Tell us about your project, questions, or how we can help you..."
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? null : <Send />}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5a6fd8, #6b42a5)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </motion.div>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Grid container spacing={3}>
                {contactInfo.map((info, index) => (
                  <Grid item xs={12} key={index}>
                    <Card
                      sx={{
                        borderRadius: '16px',
                        p: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            mr: 2,
                            background: `linear-gradient(45deg, ${info.color}, ${alpha(info.color, 0.7)})`,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            flexShrink: 0,
                          }}
                        >
                          {info.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            {info.title}
                          </Typography>
                          {info.details.map((detail, idx) => (
                            <Typography key={idx} variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {detail}
                            </Typography>
                          ))}
                          <Typography variant="body2" color="text.secondary">
                            {info.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>
        </Grid>

        {/* Departments Section */}
        <Box sx={{ mt: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 6,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Contact Our Departments
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {departments.map((dept, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      borderRadius: '20px',
                      p: 4,
                      height: '100%',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        background: `linear-gradient(45deg, ${dept.color}, ${alpha(dept.color, 0.7)})`,
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      {dept.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      {dept.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {dept.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: dept.color,
                        fontWeight: 600,
                        bgcolor: alpha(dept.color, 0.1),
                        py: 1,
                        px: 2,
                        borderRadius: '8px',
                      }}
                    >
                      {dept.email}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mt: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                mb: 6,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Frequently Asked Questions
            </Typography>
          </motion.div>

          <Card sx={{ borderRadius: '20px', p: 2 }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  '&:before': { display: 'none' },
                  borderRadius: '12px !important',
                  mb: 1,
                  '&.Mui-expanded': {
                    mb: 1,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    borderRadius: '12px',
                    '&.Mui-expanded': {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;