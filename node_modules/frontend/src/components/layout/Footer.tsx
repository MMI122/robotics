import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
  Divider,
  useTheme,
  alpha,
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
  Send,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { text: 'About Us', href: '/about' },
        { text: 'Contact Us', href: '/contact' },
        { text: 'FAQ', href: '/faq' },
        { text: 'Terms & Conditions', href: '/terms' },
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Return Policy', href: '/returns' },
      ],
    },
    {
      title: 'Categories',
      links: [
        { text: 'Arduino & Microcontrollers', href: '/category/arduino' },
        { text: 'Sensors & Modules', href: '/category/sensors' },
        { text: 'Motors & Actuators', href: '/category/motors' },
        { text: 'Development Boards', href: '/category/boards' },
        { text: 'Electronic Components', href: '/category/components' },
        { text: 'Robotics Kits', href: '/category/kits' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { text: 'Help Center', href: '/help' },
        { text: 'Track Your Order', href: '/track-order' },
        { text: 'Shipping Info', href: '/shipping' },
        { text: 'Technical Support', href: '/support' },
        { text: 'Bulk Orders', href: '/bulk-orders' },
        { text: 'Educational Discounts', href: '/education' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: '#1877F2' },
    { icon: Twitter, href: '#', color: '#1DA1F2' },
    { icon: Instagram, href: '#', color: '#E4405F' },
    { icon: LinkedIn, href: '#', color: '#0077B5' },
    { icon: YouTube, href: '#', color: '#FF0000' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
        color: 'white',
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
      }}
    >
      {/* Newsletter Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
          py: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h3"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: 'linear-gradient(45deg, #fff 30%, #f0f9ff 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Stay Connected
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Get the latest updates on new products and exclusive offers!
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="form"
                sx={{
                  display: 'flex',
                  gap: 2,
                  maxWidth: 400,
                  ml: { md: 'auto' },
                }}
              >
                <TextField
                  placeholder="Enter your email"
                  variant="outlined"
                  size="medium"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      color: 'white',
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: alpha(theme.palette.common.white, 0.3),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.common.white, 0.5),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.common.white,
                      },
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: alpha(theme.palette.common.white, 0.7),
                    },
                  }}
                />
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<Send />}
                  sx={{
                    background: 'linear-gradient(45deg, #fff 30%, #f0f9ff 90%)',
                    color: theme.palette.primary.main,
                    borderRadius: '12px',
                    px: 3,
                    fontWeight: 600,
                    boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #f8fafc 30%, #e2e8f0 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(255, 255, 255, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={3}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: 'linear-gradient(45deg, #0ea5e9 30%, #06b6d4 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  RoboticsShop
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 3,
                    opacity: 0.8,
                    lineHeight: 1.6,
                  }}
                >
                  Your one-stop destination for premium robotics components, Arduino boards, sensors, and electronic modules. Building the future of innovation.
                </Typography>

                {/* Contact Info */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 1, fontSize: '1.2rem', color: theme.palette.primary.light }} />
                    <Typography variant="body2">+880 1234-567890</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, fontSize: '1.2rem', color: theme.palette.primary.light }} />
                    <Typography variant="body2">info@roboticsshop.com</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <LocationOn sx={{ mr: 1, fontSize: '1.2rem', color: theme.palette.primary.light }} />
                    <Typography variant="body2">
                      123 Tech Street, Innovation District,<br />
                      Dhaka, Bangladesh
                    </Typography>
                  </Box>
                </Box>

                {/* Social Links */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={index}
                      href={social.href}
                      sx={{
                        color: social.color,
                        background: alpha(social.color, 0.1),
                        border: `1px solid ${alpha(social.color, 0.2)}`,
                        '&:hover': {
                          background: alpha(social.color, 0.2),
                          transform: 'translateY(-3px)',
                          boxShadow: `0 6px 20px ${alpha(social.color, 0.3)}`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <social.icon />
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Footer Sections */}
            {footerSections.map((section, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Typography
                  variant="h6"
                  component="h4"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    color: theme.palette.primary.light,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: 30,
                      height: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      borderRadius: 1,
                    },
                  }}
                >
                  {section.title}
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {section.links.map((link, linkIndex) => (
                    <Box component="li" key={linkIndex} sx={{ mb: 1.5 }}>
                      <Link
                        href={link.href}
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          '&:hover': {
                            color: theme.palette.primary.light,
                            transform: 'translateX(5px)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: -15,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 0,
                            height: 2,
                            background: theme.palette.primary.main,
                            transition: 'width 0.3s ease',
                          },
                          '&:hover::before': {
                            width: 10,
                          },
                        }}
                      >
                        {link.text}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.1) }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            py: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              opacity: 0.7,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            © 2025 RoboticsShop. All rights reserved. Built with ❤️ for innovators.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-end' },
            }}
          >
            <Link
              href="/terms"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                '&:hover': { color: theme.palette.primary.light },
                transition: 'color 0.3s ease',
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                '&:hover': { color: theme.palette.primary.light },
                transition: 'color 0.3s ease',
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                '&:hover': { color: theme.palette.primary.light },
                transition: 'color 0.3s ease',
              }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;