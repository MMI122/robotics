import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  InputAdornment,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import {
  ExpandMore,
  Search,
  QuestionAnswer,
  LocalShipping,
  Payment,
  Assignment,
  Security,
  School,
  Support,
  Business,
  Devices,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FAQPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Categories', icon: <QuestionAnswer />, color: '#667eea' },
    { id: 'shipping', label: 'Shipping & Delivery', icon: <LocalShipping />, color: '#10b981' },
    { id: 'payment', label: 'Payment & Billing', icon: <Payment />, color: '#f59e0b' },
    { id: 'orders', label: 'Orders & Returns', icon: <Assignment />, color: '#ef4444' },
    { id: 'technical', label: 'Technical Support', icon: <Support />, color: '#8b5cf6' },
    { id: 'account', label: 'Account & Security', icon: <Security />, color: '#06b6d4' },
    { id: 'education', label: 'Education Programs', icon: <School />, color: '#ec4899' },
    { id: 'business', label: 'Business Solutions', icon: <Business />, color: '#84cc16' },
    { id: 'products', label: 'Products & Compatibility', icon: <Devices />, color: '#f97316' },
  ];

  const faqs = [
    {
      category: 'shipping',
      question: 'What are your shipping options and costs?',
      answer: 'We offer three shipping options: Standard shipping (5-7 business days) is free on orders over $50, otherwise $9.99. Express shipping (2-3 business days) costs $19.99. Overnight shipping (1 business day) costs $39.99. All times are business days and exclude weekends and holidays.',
      tags: ['shipping', 'delivery', 'cost', 'free shipping'],
    },
    {
      category: 'shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 75 countries worldwide. International shipping costs vary by destination and package weight. Delivery times range from 7-21 business days depending on location. Additional customs fees may apply and are the responsibility of the customer.',
      tags: ['international', 'worldwide', 'customs'],
    },
    {
      category: 'shipping',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can track your package on our website under "My Orders" or directly on the carrier\'s website. Tracking updates typically appear within 24 hours of shipment.',
      tags: ['tracking', 'order status', 'shipment'],
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Amazon Pay. For large corporate orders, we also accept bank transfers and purchase orders from approved accounts.',
      tags: ['credit card', 'paypal', 'payment options'],
    },
    {
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use industry-standard SSL encryption and are PCI DSS compliant. We never store your full credit card information on our servers. All payment processing is handled by certified payment processors with bank-level security.',
      tags: ['security', 'ssl', 'pci compliance'],
    },
    {
      category: 'payment',
      question: 'Do you offer financing options?',
      answer: 'Yes, we partner with Affirm to offer financing options for purchases over $500. You can choose 6, 12, or 24-month payment plans with competitive interest rates. Apply at checkout to see your options and get instant approval.',
      tags: ['financing', 'affirm', 'payment plans'],
    },
    {
      category: 'orders',
      question: 'How can I cancel or modify my order?',
      answer: 'Orders can be cancelled or modified within 2 hours of placement if they haven\'t been processed yet. Contact our customer service team immediately at support@roboticsshop.com or call us at (555) 123-4567. Once an order is shipped, it cannot be modified.',
      tags: ['cancel order', 'modify order', 'customer service'],
    },
    {
      category: 'orders',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused items in original packaging. Electronics and components must be unopened unless defective. Custom or programmed items cannot be returned unless defective. Return shipping is free for defective items, otherwise customer pays return shipping.',
      tags: ['returns', 'refund', '30 days'],
    },
    {
      category: 'orders',
      question: 'How do I return a defective product?',
      answer: 'Contact our support team with your order number and description of the defect. We\'ll provide a prepaid return label and replacement or refund. For electronic components, please describe the issue and any troubleshooting steps you\'ve tried.',
      tags: ['defective', 'warranty', 'replacement'],
    },
    {
      category: 'technical',
      question: 'Do you provide technical support for products?',
      answer: 'Yes! Our technical support team includes experienced engineers who can help with product selection, compatibility questions, troubleshooting, and basic project guidance. Support is available via email, chat, and phone during business hours.',
      tags: ['technical support', 'troubleshooting', 'engineers'],
    },
    {
      category: 'technical',
      question: 'Can you help me choose the right components for my project?',
      answer: 'Absolutely! Our technical team can provide recommendations based on your project requirements. Contact us with details about your project goals, experience level, and any specific constraints. We offer free consultation for component selection.',
      tags: ['project help', 'component selection', 'consultation'],
    },
    {
      category: 'technical',
      question: 'Do you offer programming and setup services?',
      answer: 'We offer basic programming consultation and can provide sample code for common applications. For complex custom programming, we can connect you with our network of certified developers and consultants who specialize in robotics projects.',
      tags: ['programming', 'setup', 'custom development'],
    },
    {
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" at the top of any page and fill in your information. You can also create an account during checkout. Account benefits include order tracking, saved addresses, wishlist, and access to educational resources.',
      tags: ['create account', 'registration', 'benefits'],
    },
    {
      category: 'account',
      question: 'I forgot my password. How can I reset it?',
      answer: 'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a secure reset link. If you don\'t receive the email within a few minutes, check your spam folder or contact support.',
      tags: ['password reset', 'forgot password', 'login'],
    },
    {
      category: 'account',
      question: 'How do I update my account information?',
      answer: 'Log in to your account and go to "My Profile" or "Account Settings." You can update your personal information, shipping addresses, payment methods, and communication preferences. Changes are saved automatically.',
      tags: ['update profile', 'account settings', 'personal information'],
    },
    {
      category: 'education',
      question: 'Do you offer educational discounts?',
      answer: 'Yes! We provide special pricing for students, teachers, and educational institutions. Students get 10% off with valid student ID. Schools and universities can receive volume discounts up to 20%. Contact education@roboticsshop.com for details.',
      tags: ['student discount', 'education pricing', 'schools'],
    },
    {
      category: 'education',
      question: 'What educational resources do you provide?',
      answer: 'We offer free tutorials, project guides, curriculum materials, and webinars. Our education portal includes step-by-step projects, video tutorials, and downloadable resources for teachers. All materials are aligned with STEM education standards.',
      tags: ['tutorials', 'curriculum', 'educational resources'],
    },
    {
      category: 'education',
      question: 'Can you help design a robotics curriculum?',
      answer: 'Our education team works with schools to develop custom robotics curricula. We provide recommended component kits, lesson plans, and teacher training. Contact our education specialists to discuss your specific needs and student age groups.',
      tags: ['curriculum design', 'teacher training', 'education consulting'],
    },
    {
      category: 'business',
      question: 'Do you offer bulk pricing for large orders?',
      answer: 'Yes, we provide volume discounts for orders over $1,000. Discounts range from 5-15% depending on order size and product mix. Corporate accounts receive additional benefits including net payment terms and dedicated support.',
      tags: ['bulk pricing', 'volume discount', 'corporate'],
    },
    {
      category: 'business',
      question: 'Can you provide custom robotics solutions?',
      answer: 'Our engineering team can develop custom robotics solutions for business applications. Services include system design, component selection, programming, and integration support. Contact sales@roboticsshop.com to discuss your requirements.',
      tags: ['custom solutions', 'engineering services', 'business'],
    },
    {
      category: 'business',
      question: 'Do you offer technical consultation services?',
      answer: 'Yes, we provide paid consultation services for complex projects. Our certified engineers can help with system architecture, component integration, troubleshooting, and optimization. Rates start at $150/hour with package deals available.',
      tags: ['consultation', 'engineering services', 'technical support'],
    },
    {
      category: 'products',
      question: 'How do I know if components are compatible?',
      answer: 'Product pages include compatibility information and cross-references. Our technical team can verify compatibility for your specific application. We also provide compatibility charts and selection guides for popular platforms like Arduino and Raspberry Pi.',
      tags: ['compatibility', 'arduino', 'raspberry pi'],
    },
    {
      category: 'products',
      question: 'Do you test products before shipping?',
      answer: 'We perform incoming quality control on all products and batch testing on electronic components. While we don\'t test every individual item, our suppliers are certified and we maintain strict quality standards. Defective items are covered by our warranty.',
      tags: ['quality control', 'testing', 'warranty'],
    },
    {
      category: 'products',
      question: 'Can I get samples for evaluation?',
      answer: 'We offer evaluation samples for select products, particularly for corporate and educational customers. Sample availability depends on the product and your intended application. Contact our sales team to request evaluation units.',
      tags: ['samples', 'evaluation', 'testing'],
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

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
                Frequently Asked Questions
              </Typography>
              <Typography variant="h6" sx={{ mb: 6, maxWidth: 600, mx: 'auto', opacity: 0.9 }}>
                Find answers to common questions about our products, services, and policies. 
                Can't find what you're looking for? Contact our support team.
              </Typography>

              {/* Search Bar */}
              <Card
                sx={{
                  maxWidth: 600,
                  mx: 'auto',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Search for answers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                        border: 'none',
                        '& fieldset': { border: 'none' },
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '1.1rem',
                        color: '#1a202c',
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {/* Category Filters */}
          <Grid item xs={12} lg={3}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card sx={{ borderRadius: '20px', position: 'sticky', top: 20 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Categories
                  </Typography>
                  
                  {categories.map((category) => (
                    <Box
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        mb: 1,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        bgcolor: selectedCategory === category.id ? alpha(category.color, 0.1) : 'transparent',
                        border: '1px solid',
                        borderColor: selectedCategory === category.id ? category.color : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: alpha(category.color, 0.05),
                          borderColor: alpha(category.color, 0.3),
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: category.color,
                          mr: 2,
                        }}
                      >
                        {category.icon}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: selectedCategory === category.id ? 600 : 400,
                          color: selectedCategory === category.id ? category.color : 'text.primary',
                        }}
                      >
                        {category.label}
                      </Typography>
                    </Box>
                  ))}

                  <Box sx={{ mt: 4, p: 3, borderRadius: '12px', bgcolor: alpha('#667eea', 0.05) }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Still need help?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Our support team is here to help with any questions not covered in our FAQ.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label="Contact Support"
                        clickable
                        onClick={() => navigate('/contact')}
                        sx={{
                          bgcolor: '#667eea',
                          color: 'white',
                          fontWeight: 600,
                          '&:hover': { bgcolor: '#5a6fd8' },
                        }}
                      />
                      <Chip
                        label="Live Chat"
                        clickable
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* FAQ Content */}
          <Grid item xs={12} lg={9}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  {selectedCategory === 'all' 
                    ? `All Questions (${filteredFAQs.length})` 
                    : `${categories.find(c => c.id === selectedCategory)?.label} (${filteredFAQs.length})`
                  }
                </Typography>
                {searchTerm && (
                  <Typography variant="body2" color="text.secondary">
                    Showing results for "{searchTerm}"
                  </Typography>
                )}
              </Box>

              {filteredFAQs.length === 0 ? (
                <Card sx={{ borderRadius: '16px', textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    No results found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Try adjusting your search terms or browse a different category.
                  </Typography>
                  <Chip
                    label="Clear Search"
                    clickable
                    onClick={() => setSearchTerm('')}
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label="View All"
                    clickable
                    onClick={() => setSelectedCategory('all')}
                    variant="outlined"
                  />
                </Card>
              ) : (
                <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Accordion
                        sx={{
                          '&:before': { display: 'none' },
                          '&:not(:last-child)': {
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          sx={{
                            py: 2,
                            '&:hover': {
                              bgcolor: alpha('#667eea', 0.02),
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: categories.find(c => c.id === faq.category)?.color || '#667eea',
                                mr: 2,
                              }}
                            >
                              {categories.find(c => c.id === faq.category)?.icon || <QuestionAnswer />}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {faq.question}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                {faq.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <Chip
                                    key={tagIndex}
                                    label={tag}
                                    size="small"
                                    sx={{
                                      fontSize: '0.75rem',
                                      height: 24,
                                      bgcolor: alpha('#667eea', 0.1),
                                      color: '#667eea',
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0, pb: 3, pl: 7 }}>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ lineHeight: 1.7 }}
                          >
                            {faq.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </motion.div>
                  ))}
                </Card>
              )}
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FAQPage;