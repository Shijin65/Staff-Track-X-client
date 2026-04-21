"use client";
import React from 'react';
import {
  Box,
  IconButton,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

interface ModuleHeaderProps {
  onEdit?: () => void;
  onBack: () => void;
  title: string;
  updatePermission?: boolean | undefined;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  onEdit,
  onBack,
  title,
  updatePermission
}) => {

  return (
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
      
      {/* Left */}
      <IconButton
        onClick={onBack}
        sx={{ bgcolor: 'rgba(0,0,0,0.05)', color: 'text.primary' }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Center */}
      <Box sx={{ flex: 1, textAlign: 'center', px: 2 }}>
        <Typography 
          variant="h6" 
          fontWeight={800} 
          sx={{ 
            color: 'text.secondary',
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            textTransform: 'capitalize'
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Right */}
      {updatePermission ? (
        <IconButton
          onClick={onEdit}
          sx={{ bgcolor: 'rgba(0,0,0,0.05)', color: 'text.primary' }}
        >
          <EditIcon />
        </IconButton>
      ) : (
        // Placeholder to maintain spacing
        <Box sx={{ width: 40 }} />
      )}

    </Box>
  );
};