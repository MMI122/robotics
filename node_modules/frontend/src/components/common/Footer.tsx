import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  Security,
  LocalShipping,
  CreditCard,
  Support,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/story' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Size Guide', href: '/size-guide' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Refund Policy', href: '/refund' },
      { label: 'Security', href: '/security' },
    ],
    categories: [
      { label: 'Robots & Kits', href: '/products?category=robots' },
      { label: 'Sensors', href: '/products?category=sensors' },
      { label: 'Motors & Servos', href: '/products?category=motors' },
      { label: 'Controllers', href: '/products?category=controllers' },
      { label: 'Tools & Parts', href: '/products?category=tools' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <LinkedIn />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <YouTube />, href: 'https://youtube.com', label: 'YouTube' },
  ];

  const trustFeatures = [
    {
      icon: <Security sx={{ fontSize: 40, color: '#4caf50' }} />,
      title: 'Secure Payments',
      description: '100% secure payment processing',
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: '#2196f3' }} />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $500',
    },
    {
      icon: <CreditCard sx={{ fontSize: 40, color: '#ff9800' }} />,
      title: 'Easy Returns',
      description: '30-day hassle-free returns',
    },
    {
      icon: <Support sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support',
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/images/footer-pattern.png) repeat',
          opacity: 0.05,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Trust Features */}
        <Box sx={{ py: 4 }}>
          <Grid container spacing={4}>
            {trustFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      background: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {feature.icon}
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, mb: 0.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Main Footer Content */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={3}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      R
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    RoboticsShop
                  </Typography>
                </Box>
                <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 3 }}>
                  Your trusted partner for robotics components, kits, and educational materials. 
                  Building the future, one robot at a time.
                </Typography>
                
                {/* Contact Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1, fontSize: 18 }} />
                  <Typography variant="body2">support@roboticsshop.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: 18 }} />
                  <Typography variant="body2">+1 (555) 123-4567</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ mr: 1, fontSize: 18 }} />
                  <Typography variant="body2">123 Tech Street, Silicon Valley, CA</Typography>
                </Box>

                {/* Social Links */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Company
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {footerLinks.company.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'white',
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {footerLinks.support.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'white',
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {footerLinks.categories.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'white',
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {footerLinks.legal.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'white',
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} md={1}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Newsletter
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 2 }}>
                Subscribe to get updates on new products and offers.
              </Typography>
              <Box
                component="form"
                sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Subscribe
                </button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="rgba(255,255,255,0.6)">
            © 2024 RoboticsShop. All rights reserved. Built with ❤️ for robotics enthusiasts.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <img
              src="/images/payment-methods.png"
              alt="Payment Methods"
              style={{ height: '24px', opacity: 0.8 }}
            />
            <Typography variant="body2" color="rgba(255,255,255,0.6)">
              Powered by React & Laravel
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;