"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { UserDetailsContent } from '@/components/user/UserDetailsContent';
import { initialUsers } from '@/lib/mock/users';

export default function UserViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const user = initialUsers.find(u => u.id === id);

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>User Not Found</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/users')}
          sx={{ mt: 2 }}
        >
          Back to Users
        </Button>
      </Container>
    );
  }

  return (
    <Box id="user-view-page-root" sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      {/* Dynamic Header / Cover Area */}
      {!isMobile ? (
        <Box
          id="desktop-banner-header"
          sx={{
          height: { xs: 150, md: 220 },
          bgcolor: 'primary.main',
          backgroundImage: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          position: 'relative',
          mb: { xs: 8, md: 10 }
        }}>
          <Container maxWidth={false} sx={{ px: { xs: 2, md: 5 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', pt: { xs: 4, md: 6 } }}>
              <Box /> {/* Spacer */}
              <Typography variant="h4" fontWeight={900} color="white" sx={{ letterSpacing: -1 }}>
                User Profile
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  onClick={() => alert('Edit User logic here')}
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
                  onClick={() => router.push('/users')}
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
      ) : (
        /* Lightweight Mobile Top Bar */
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton 
            onClick={() => router.push('/users')}
            sx={{ bgcolor: 'rgba(0,0,0,0.05)', color: 'text.primary' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton 
            onClick={() => alert('Edit User logic here')}
            sx={{ bgcolor: 'rgba(0,0,0,0.05)', color: 'text.primary' }}
          >
            <EditIcon />
          </IconButton>
        </Box>
      )}

      <Container id="user-details-view-container" maxWidth={false} sx={{ mt: { xs: 0, md: -18 }, position: 'relative', px: { xs: 2, md: 4 } }}>
        <UserDetailsContent user={user} />
      </Container>
    </Box>
  );
}
