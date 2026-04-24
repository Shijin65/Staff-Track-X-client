"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { UserDetailsContent } from '@/app/( protected )/users/components/UserDetailsContent';
import { UserData } from '@/lib/mock/users';
import useSWR from 'swr';
import { CircularProgress } from '@mui/material';
import { ErrorCard, ModuleHeader } from '@/components/ui';
import { useAuthUser } from '@/lib/hooks';

export const UserViewContainer = () => {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuthUser();
  const canUpdateUser = user?.availableAccess?.UpdateUser;
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
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <ErrorCard
          title={!data?.payload ? 'User Not Found' : 'Error loading user data'}
          message={error?.response?.data?.message || (!data?.payload ? "The requested user could not be found." : "We encountered an error while fetching the user data.")}
          onRetry={() => router.push('/users')}
          retryText="Back to Users"
        />
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
    mobileNumber: apiUser.mobileNumber,
    gender: apiUser.gender,
    role: apiUser.role?.title || 'User',
    isActive: apiUser.isActive,
    bloodGroup: apiUser.bloodGroup || 'N/A',
    city: apiUser.city || 'N/A',
    district: apiUser.district || 'N/A',
    state: apiUser.state || 'N/A',
    permanentAddress: apiUser.address || 'N/A',
    currentAddress: apiUser.address || 'N/A',
    isVerified: apiUser.isVerified,
    rating: apiUser.rating || 0.0,
    emergencyContact: apiUser.emergencyContact,
    permissions: apiUser.permissions || [],
    dateOfBirth: apiUser.dateOfBirth || 'N/A',
    whiteShirt: apiUser.uniform?.whiteShirt || false,
    blackPant: apiUser.uniform?.blackPant || false,
    executiveBlackShoe: apiUser.uniform?.executiveBlackShoe || false,
    grooming: apiUser.uniform?.grooming || false,

    profilePhoto: '',
    totalEvents: 0,
    successRate: 0,
    dateOfJoining: 'N/A',
    recentEvents: [],
    attachment: apiUser.attachment
  };

  return (
    <Box id="user-view-page-root" sx={{ bgcolor: 'background.default', minHeight: '100dvh', pb: 8 }}>
      <ModuleHeader
        title="User Details"
        onEdit={() => router.push(`/users/${id}/edit`)}
        onBack={() => router.push('/users')}
        updatePermission={canUpdateUser}
      />
      <Container id="user-details-view-container" maxWidth={false} sx={{ mt: { xs: 0 }, px: { xs: 2, md: 4 } }}>
        <UserDetailsContent user={mappedUser} />
      </Container>
    </Box>
  );
};
