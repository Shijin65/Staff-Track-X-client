import React from 'react';
import { Box, Typography } from '@mui/material';

interface ModuleTitleProps {
  title: string;
  icon: React.ReactNode;
}

export const ModuleTitle: React.FC<ModuleTitleProps> = ({ title, icon }) => {
  return (
    <Box sx={{display: 'flex', alignItems: 'center',alignSelf:"center", gap: { xs: 1.5, md: 2 } }}>
      <Box sx={{ 
        p: { xs: 1.25, md: 1.5 }, 
        borderRadius: 2, 
        bgcolor: "rgba(var(--primary-rgb), 0.1)", 
        color: "primary.main", 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </Box>
      <Typography 

        fontWeight={700}
        sx={{ 
          fontSize: { xs: '1rem',sm:'1.6rem', md: '2rem' },
          color: 'text.primary',
          letterSpacing: '-0.02em'
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};
