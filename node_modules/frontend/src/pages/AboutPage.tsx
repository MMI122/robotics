import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  useTheme,
  alpha,
  LinearProgress,
} from '@mui/material';
import {
  Rocket,
  TrendingUp,
  Security,
  Support,
  Engineering,
  School,
  Public,
  EmojiEvents,
  Timeline,
  Speed,
  VerifiedUser,
  AutoAwesome,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const stats = [
    { label: 'Happy Customers', value: '50,000+', icon: <EmojiEvents /> },
    { label: 'Products Available', value: '10,000+', icon: <Engineering /> },
    { label: 'Countries Served', value: '75+', icon: <Public /> },
    { label: 'Years of Experience', value: '15+', icon: <Timeline /> },
  ];

  const values = [
    {
      icon: <AutoAwesome />,
      title: 'Innovation First',
      description: 'We constantly seek cutting-edge robotics and electronics solutions to empower creators and innovators worldwide.',
      color: '#667eea',
    },
    {
      icon: <VerifiedUser />,
      title: 'Quality Assurance',
      description: 'Every product undergoes rigorous testing to ensure it meets our high standards for performance and reliability.',
      color: '#10b981',
    },
    {
      icon: <Support />,
      title: 'Expert Support',
      description: 'Our technical team provides comprehensive support to help you succeed in your robotics and electronics projects.',
      color: '#f59e0b',
    },
    {
      icon: <Speed />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping ensures you get your components when you need them for your projects.',
      color: '#ef4444',
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      image: '/api/placeholder/120/120',
      bio: 'Robotics engineer with 15+ years experience building autonomous systems.',
    },
    {
      name: 'Dr. Michael Rodriguez',
      role: 'CTO',
      image: '/api/placeholder/120/120',
      bio: 'Former NASA engineer specializing in embedded systems and IoT solutions.',
    },
    {
      name: 'Emma Thompson',
      role: 'Head of Product',
      image: '/api/placeholder/120/120',
      bio: 'Product strategist focused on emerging technologies and maker education.',
    },
    {
      name: 'James Liu',
      role: 'VP Engineering',
      image: '/api/placeholder/120/120',
      bio: 'Hardware design expert with expertise in PCB development and testing.',
    },
  ];

  const milestones = [
    {
      year: '2010',
      title: 'Company Founded',
      description: 'Started as a small electronics distributor serving local makers and hobbyists.',
    },
    {
      year: '2013',
      title: 'Online Platform Launch',
      description: 'Launched our e-commerce platform, expanding reach to customers worldwide.',
    },
    {
      year: '2016',
      title: 'Educational Partnerships',
      description: 'Partnered with universities and schools to support STEM education programs.',
    },
    {
      year: '2019',
      title: 'Innovation Lab',
      description: 'Opened our R&D facility to develop custom robotics solutions for enterprises.',
    },
    {
      year: '2022',
      title: 'Global Expansion',
      description: 'Expanded operations to serve customers in over 75 countries worldwide.',
    },
    {
      year: '2025',
      title: 'AI Integration',
      description: 'Leading the integration of AI technologies in robotics education and development.',
    },
  ];

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
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(/api/placeholder/1920/800) center/cover',
            opacity: 0.1,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
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
                  Building the Future of Robotics
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, lineHeight: 1.6, opacity: 0.9 }}>
                  Since 2010, we've been empowering makers, engineers, and innovators with 
                  cutting-edge robotics and electronics components. From Arduino boards to 
                  advanced AI modules, we're your trusted partner in bringing ideas to life.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/products')}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Explore Products
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/contact')}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      color: 'white',
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Contact Us
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 400,
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Box
                      sx={{
                        width: 300,
                        height: 300,
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <Rocket sx={{ fontSize: '8rem', opacity: 0.8 }} />
                    </Box>
                  </motion.div>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#1a202c' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#4a5568' }}>
                    {stat.label}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Our Values Section */}
      <Box sx={{ py: 8, bgcolor: alpha('#667eea', 0.03) }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Our Core Values
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                The principles that drive everything we do and guide our commitment to excellence
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      borderRadius: '16px',
                      p: 3,
                      height: '100%',
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
                          width: 60,
                          height: 60,
                          mr: 3,
                          background: `linear-gradient(45deg, ${value.color}, ${alpha(value.color, 0.7)})`,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          flexShrink: 0,
                        }}
                      >
                        {value.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                          {value.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {value.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Meet Our Team
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Passionate experts dedicated to advancing robotics and electronics innovation
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    borderRadius: '20px',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Avatar
                    src={member.image}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 3,
                      border: '4px solid',
                      borderColor: alpha('#667eea', 0.2),
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: '#667eea',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {member.bio}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Company Timeline */}
      <Box sx={{ py: 8, bgcolor: alpha('#667eea', 0.03) }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Our Journey
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                Key milestones in our mission to democratize robotics and electronics
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ position: 'relative' }}>
            {/* Timeline Line */}
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 4,
                background: 'linear-gradient(to bottom, #667eea, #764ba2)',
                borderRadius: 2,
                transform: 'translateX(-50%)',
                display: { xs: 'none', md: 'block' },
              }}
            />

            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 6,
                    flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      textAlign: { xs: 'center', md: index % 2 === 0 ? 'right' : 'left' },
                      pr: { md: index % 2 === 0 ? 4 : 0 },
                      pl: { md: index % 2 === 1 ? 4 : 0 },
                    }}
                  >
                    <Card
                      sx={{
                        borderRadius: '16px',
                        p: 3,
                        maxWidth: 400,
                        mx: { xs: 'auto', md: index % 2 === 0 ? 'unset' : 'auto' },
                        ml: { md: index % 2 === 1 ? 'auto' : 'unset' },
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: '#667eea',
                          mb: 1,
                        }}
                      >
                        {milestone.year}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        {milestone.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {milestone.description}
                      </Typography>
                    </Card>
                  </Box>

                  {/* Timeline Dot */}
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      border: '4px solid white',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      zIndex: 1,
                      display: { xs: 'none', md: 'block' },
                    }}
                  />

                  <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                Ready to Build Something Amazing?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                Join thousands of makers, engineers, and innovators who trust us for their 
                robotics and electronics projects. Let's create the future together.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Start Shopping
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/contact')}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get in Touch
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;