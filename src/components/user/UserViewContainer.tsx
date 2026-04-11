"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserViewHeader } from '@/components/user/UserViewHeader';
import { UserDetailsContent } from '@/components/user/UserDetailsContent';
import { UserData } from '@/lib/mock/users';
import useSWR from 'swr';
import { CircularProgress } from '@mui/material';

export const UserViewContainer = () => {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data, error, isLoading } = useSWR(`/api/users/${id}`);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data?.payload) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {error ? 'Error loading user data' : 'User Not Found'}
        </Typography>
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

  const apiUser = data.payload;

  // Mapping API response to the format expected by UserDetailsContent
  const mappedUser: UserData = {
    id: apiUser.userId,
    roleId: apiUser.role?.roleId || 0,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    mobileNumber: apiUser.phone,
    gender: apiUser.gender,
    role: apiUser.role?.title || 'User',
    isActive: apiUser.isActive,
    bloodGroup: apiUser.address?.bloodGroup || 'N/A',
    city: apiUser.address?.city || 'N/A',
    district: apiUser.address?.district || 'N/A',
    state: apiUser.address?.state || 'N/A',
    permanentAddress: apiUser.address?.address || 'N/A',
    currentAddress: apiUser.address?.address || 'N/A',
    verification: apiUser.isSuperAdmin ? 'Verified' : 'Pending',
    rating: apiUser.rating,
    emergencyContact: apiUser.emergencyContact,
    permissions: apiUser.permissions || [],

    // Fields not in the API response (providing defaults/fallbacks)
    dateOfBirth: 'N/A',
    
    profilePhoto: '', 
    
    totalEvents: 0,
    successRate: 0,
    dateOfJoining: 'N/A',
    recentEvents: []
  };

  return (
    <Box id="user-view-page-root" sx={{ bgcolor: 'background.default', minHeight: '100dvh', pb: 8 }}>
      <UserViewHeader 
        isMobile={isMobile} 
        onEdit={() => alert('Edit User logic here')} 
        onBack={() => router.push('/users')} 
      />

      <Container id="user-details-view-container" maxWidth={false} sx={{ mt: { xs: 0, md: -18 }, position: 'relative', px: { xs: 2, md: 4 } }}>
        <UserDetailsContent user={mappedUser} />
      </Container>
    </Box>
  );
};
