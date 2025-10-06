import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  Link,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Gavel as GavelIcon,
  Security as SecurityIcon,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  AccountCircle as AccountIcon,
  Copyright as CopyrightIcon,
  Policy as PolicyIcon,
  ContactSupport as ContactIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TermsHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(6, 0),
  marginBottom: theme.spacing(4),
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `0 0 ${theme.spacing(2)}px 0`,
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  border: `1px solid ${theme.palette.divider}`,
}));

interface TermsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
  subsections?: {
    title: string;
    content: string[];
  }[];
  important?: boolean;
}

const TermsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState<string | false>('general');
  const [printDialogOpen, setPrintDialogOpen] = useState(false);

  const lastUpdated = '2024-01-15';
  const effectiveDate = '2024-01-01';

  const termsData: TermsSection[] = [
    {
      id: 'general',
      title: 'General Terms',
      icon: <GavelIcon />,
      important: true,
      content: [
        'By accessing and using RoboticsShop.com (the "Service"), you accept and agree to be bound by the terms and provision of this agreement.',
        'RoboticsShop is operated by RoboticsShop Inc., a company registered in the United States.',
        'These Terms of Service apply to all users of the service, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.',
        'Please read these Terms of Service carefully before accessing or using our website.',
        'If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.'
      ]
    },
    {
      id: 'accounts',
      title: 'User Accounts',
      icon: <AccountIcon />,
      content: [
        'To access certain features of our Service, you may be required to create an account.',
        'You are responsible for maintaining the confidentiality of your account and password.',
        'You are responsible for all activities that occur under your account.',
        'You must notify us immediately of any unauthorized use of your account.',
        'We reserve the right to refuse service, terminate accounts, or remove content in our sole discretion.'
      ],
      subsections: [
        {
          title: 'Account Requirements',
          content: [
            'You must be at least 18 years old to create an account',
            'You must provide accurate and complete information',
            'You must not use the account for illegal purposes',
            'One person or entity may only maintain one account'
          ]
        },
        {
          title: 'Account Security',
          content: [
            'Use strong passwords and enable two-factor authentication when available',
            'Do not share your account credentials with others',
            'Report any suspicious activity immediately',
            'We are not liable for losses resulting from unauthorized account use'
          ]
        }
      ]
    },
    {
      id: 'purchases',
      title: 'Orders and Purchases',
      icon: <CartIcon />,
      content: [
        'All orders are subject to availability and confirmation of the order price.',
        'We reserve the right to refuse or cancel your order for any reason.',
        'Prices are subject to change without notice.',
        'We strive to display accurate pricing but errors may occur.',
        'If we discover an error in the price, we will inform you as soon as possible.'
      ],
      subsections: [
        {
          title: 'Order Process',
          content: [
            'Add items to your cart and proceed to checkout',
            'Provide accurate shipping and billing information',
            'Review your order before confirming purchase',
            'You will receive an order confirmation email'
          ]
        },
        {
          title: 'Pricing and Availability',
          content: [
            'All prices are in USD unless otherwise specified',
            'Prices include applicable taxes where required',
            'Product availability is subject to stock levels',
            'We reserve the right to limit quantities'
          ]
        }
      ]
    },
    {
      id: 'payment',
      title: 'Payment Terms',
      icon: <PaymentIcon />,
      important: true,
      content: [
        'Payment is due at the time of purchase unless otherwise arranged.',
        'We accept major credit cards, PayPal, and other payment methods as displayed.',
        'Your payment information is processed securely by our payment processors.',
        'You authorize us to charge your payment method for the total amount of your order.',
        'If payment is declined, we may cancel or suspend your order.'
      ],
      subsections: [
        {
          title: 'Accepted Payment Methods',
          content: [
            'Visa, MasterCard, American Express, Discover',
            'PayPal and PayPal Credit',
            'Apple Pay and Google Pay',
            'Bank transfers for large orders (contact us)'
          ]
        },
        {
          title: 'Payment Security',
          content: [
            'All transactions are encrypted using SSL technology',
            'We do not store your payment information on our servers',
            'Payment processing is handled by certified PCI DSS compliant providers',
            'Report any unauthorized charges immediately'
          ]
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping and Delivery',
      icon: <ShippingIcon />,
      content: [
        'We ship to addresses within the United States and select international locations.',
        'Shipping costs are calculated at checkout based on weight and destination.',
        'Delivery times are estimates and not guaranteed.',
        'Risk of loss passes to you upon delivery to the carrier.',
        'You are responsible for providing accurate shipping information.'
      ],
      subsections: [
        {
          title: 'Shipping Options',
          content: [
            'Standard shipping (5-7 business days)',
            'Expedited shipping (2-3 business days)',
            'Overnight shipping (next business day)',
            'Free shipping on orders over $75'
          ]
        },
        {
          title: 'International Shipping',
          content: [
            'Available to select countries only',
            'Additional customs duties and taxes may apply',
            'Delivery times may be longer due to customs processing',
            'Customer is responsible for import duties and taxes'
          ]
        }
      ]
    },
    {
      id: 'returns',
      title: 'Returns and Refunds',
      icon: <SecurityIcon />,
      content: [
        'We offer a 30-day return policy for most items.',
        'Items must be in original condition and packaging.',
        'Return shipping costs are the responsibility of the customer unless the item is defective.',
        'Refunds will be processed to the original payment method.',
        'Some items may not be eligible for return due to hygiene or safety reasons.'
      ],
      subsections: [
        {
          title: 'Return Process',
          content: [
            'Contact customer service to initiate a return',
            'Receive a Return Merchandise Authorization (RMA) number',
            'Package the item securely with all original accessories',
            'Ship the item to our returns center'
          ]
        },
        {
          title: 'Non-Returnable Items',
          content: [
            'Custom or personalized products',
            'Software downloads and digital products',
            'Items damaged by misuse or normal wear',
            'Products opened or used beyond testing'
          ]
        }
      ]
    },
    {
      id: 'warranty',
      title: 'Product Warranties',
      icon: <SecurityIcon />,
      content: [
        'Products are covered by manufacturer warranties as specified.',
        'We are not responsible for manufacturer warranty claims.',
        'Warranty coverage varies by product and manufacturer.',
        'Some products may include additional service plans.',
        'Contact the manufacturer directly for warranty service.'
      ]
    },
    {
      id: 'intellectual',
      title: 'Intellectual Property',
      icon: <CopyrightIcon />,
      content: [
        'All content on this website is protected by copyright and other intellectual property laws.',
        'You may not reproduce, distribute, or create derivative works without permission.',
        'Product names and logos are trademarks of their respective owners.',
        'User-generated content may be used by us for promotional purposes.',
        'Report any copyright infringement to our designated agent.'
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy and Data Protection',
      icon: <PolicyIcon />,
      important: true,
      content: [
        'Your privacy is important to us. Please review our Privacy Policy.',
        'We collect and use personal information as described in our Privacy Policy.',
        'You have rights regarding your personal data under applicable laws.',
        'We implement appropriate security measures to protect your information.',
        'Contact us with any privacy concerns or data requests.'
      ]
    },
    {
      id: 'limitation',
      title: 'Limitation of Liability',
      icon: <GavelIcon />,
      important: true,
      content: [
        'Our liability is limited to the maximum extent permitted by law.',
        'We are not liable for indirect, incidental, or consequential damages.',
        'Our total liability shall not exceed the amount you paid for the product or service.',
        'Some jurisdictions do not allow limitation of liability, so these limits may not apply to you.',
        'You agree to indemnify us against claims arising from your use of our services.'
      ]
    },
    {
      id: 'modifications',
      title: 'Modifications to Terms',
      icon: <PolicyIcon />,
      content: [
        'We reserve the right to modify these terms at any time.',
        'Changes will be effective immediately upon posting.',
        'Your continued use constitutes acceptance of modified terms.',
        'Material changes will be communicated via email or website notice.',
        'You should review these terms periodically for updates.'
      ]
    }
  ];

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handlePrint = () => {
    window.print();
    setPrintDialogOpen(false);
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
    setPrintDialogOpen(false);
  };

  return (
    <Box>
      {/* Header */}
      <TermsHeader>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Breadcrumbs sx={{ color: 'white', mb: 3 }}>
              <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
                Home
              </Link>
              <Typography color="inherit">Terms of Service</Typography>
            </Breadcrumbs>
            
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              <GavelIcon sx={{ mr: 2, fontSize: 'inherit', verticalAlign: 'middle' }} />
              Terms of Service
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
              Please read these terms carefully before using our services
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip 
                label={`Last Updated: ${lastUpdated}`} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip 
                label={`Effective: ${effectiveDate}`} 
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Button
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                startIcon={<PrintIcon />}
                onClick={() => setPrintDialogOpen(true)}
              >
                Print / Download
              </Button>
            </Box>
          </motion.div>
        </Container>
      </TermsHeader>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Important Notice */}
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Important Legal Information
            </Typography>
            <Typography variant="body2">
              These Terms of Service constitute a legally binding agreement between you and RoboticsShop Inc. 
              By using our website and services, you agree to be bound by these terms. If you have any questions, 
              please contact our legal team at legal@roboticsshop.com.
            </Typography>
          </Alert>

          {/* Quick Navigation */}
          <SectionCard sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Navigation
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {termsData.map((section) => (
                <Chip
                  key={section.id}
                  label={section.title}
                  onClick={() => setExpanded(section.id)}
                  variant={expanded === section.id ? 'filled' : 'outlined'}
                  color={section.important ? 'error' : 'primary'}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          </SectionCard>

          {/* Terms Sections */}
          {termsData.map((section) => (
            <StyledAccordion
              key={section.id}
              expanded={expanded === section.id}
              onChange={handleChange(section.id)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: section.important ? 'error.main' : 'primary.main' }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                  {section.important && (
                    <Chip label="Important" size="small" color="error" />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <List sx={{ mb: section.subsections ? 3 : 0 }}>
                    {section.content.map((item, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemText 
                          primary={item}
                          sx={{
                            '& .MuiListItemText-primary': {
                              lineHeight: 1.6,
                              color: 'text.primary'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {section.subsections && (
                    <Box>
                      {section.subsections.map((subsection, subIndex) => (
                        <Box key={subIndex} sx={{ mb: 3 }}>
                          <Divider sx={{ mb: 2 }} />
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {subsection.title}
                          </Typography>
                          <List>
                            {subsection.content.map((item, itemIndex) => (
                              <ListItem key={itemIndex} sx={{ pl: 2 }}>
                                <ListItemText 
                                  primary={`• ${item}`}
                                  sx={{
                                    '& .MuiListItemText-primary': {
                                      lineHeight: 1.6,
                                      color: 'text.secondary'
                                    }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </StyledAccordion>
          ))}

          {/* Contact Information */}
          <SectionCard sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <ContactIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Questions About These Terms?
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              If you have any questions about these Terms of Service, please contact us:
            </Typography>
            <List>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText primary="Email: legal@roboticsshop.com" />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText primary="Phone: 1-800-ROBOTICS (1-800-762-6842)" />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText primary="Address: 123 Innovation Drive, Tech City, TC 12345" />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemText primary="Business Hours: Monday-Friday 9AM-6PM EST" />
              </ListItem>
            </List>
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                startIcon={<ContactIcon />}
                onClick={() => navigate('/contact')}
                sx={{ mr: 2 }}
              >
                Contact Us
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/privacy')}
              >
                Privacy Policy
              </Button>
            </Box>
          </SectionCard>

          {/* Print/Download Dialog */}
          <Dialog open={printDialogOpen} onClose={() => setPrintDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Print or Download Terms</DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                Choose how you'd like to save or print these Terms of Service:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                  fullWidth
                >
                  Print Terms
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadPDF}
                  fullWidth
                >
                  Download PDF
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPrintDialogOpen(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TermsPage;