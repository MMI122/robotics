import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

// Layout Components
import Header from '../common/Header';
import Footer from '../common/Footer';
import NavigationBar from './NavigationBar';

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <NavigationBar />
      
      <Box component="main" sx={{ flex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Layout;