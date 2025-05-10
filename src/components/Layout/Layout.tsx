import React from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      pb: isMobile ? '56px' : 0 // Espaço para o bottom navigation em mobile
    }}>
      <Navbar />
      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          py: 2,
          px: isMobile ? 1 : 2,
          '& > *': {
            width: '100%'
          }
        }}
      >
        {children}
      </Container>
      {isMobile && <BottomNav />}
    </Box>
  );
} 