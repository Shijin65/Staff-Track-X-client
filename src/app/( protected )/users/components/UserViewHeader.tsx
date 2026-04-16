"use client";

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

interface UserViewHeaderProps {
  isMobile: boolean;
  onEdit: () => void;
  onBack: () => void;
}

export const UserViewHeader: React.FC<UserViewHeaderProps> = ({ isMobile, onEdit, onBack }) => {
  if (!isMobile) {
    return (
      <Box
        id="desktop-banner-header"
        sx={{
          height: { xs: 150, md: 220 },
          bgcolor: 'primary.main',
          backgroundImage: 'var(--primary-gradient)',
          position: 'relative',
          mb: { xs: 8, md: 10 }
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 5 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', pt: { xs: 4, md: 6 } }}>
            <Box /> {/* Spacer */}
            <Typography variant="h4" fontWeight={900} color="white" sx={{ letterSpacing: -1 }}>
              User Profile
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                onClick={onEdit}
                startIcon={<EditIcon sx={{ fontSize: '1.2rem' }} />}
                sx={{
                  minWidth: 44,
                  width: 100,
                  height: 44,
                  borderRadius: 22,
                  color: 'white',
                  textTransform: 'none',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  px: 1.2,
                  justifyContent: 'center',
                  '&:hover': {
                    width: 100,
                    bgcolor: 'rgba(255,255,255,0.25)',
                    px: 2,
                  },
                  '& .label': {
                    display: 'inline',
                    opacity: 1,
                    fontWeight: 600,
                    ml: 1
                  }
                }}
              >
                <span className="label">Edit</span>
              </Button>

              <Button
                onClick={onBack}
                startIcon={<ArrowBackIcon sx={{ fontSize: '1.2rem' }} />}
                sx={{
                  minWidth: 44,
                  width: 110,
                  height: 44,
                  borderRadius: 22,
                  color: 'white',
                  textTransform: 'none',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  px: 1.2,
                  justifyContent: 'center',
                  '&:hover': {
                    width: 110,
                    bgcolor: 'rgba(255,255,255,0.25)',
                    px: 2,
                  },
                  '& .label': {
                    display: 'inline',
                    opacity: 1,
                    fontWeight: 600,
                    ml: 1
                  }
                }}
              >
                <span className="label">Back</span>
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <IconButton 
        onClick={onBack}
        sx={{ bgcolor: 'rgba(0,0,0,0.05)', color: 'text.primary' }}
      >
        <ArrowBackIcon />
      </IconButton>
      <IconButton 
        onClick={onEdit}
        sx={{ bgcolor: 'rgba(0,0,0,0.05)', color: 'text.primary' }}
      >
        <EditIcon />
      </IconButton>
    </Box>
  );
};
