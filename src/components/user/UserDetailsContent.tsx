"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Divider,
  Paper,
  Stack,
  Chip,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Star as StarIcon,
  Person as PersonIcon,
  ContactPage as ContactIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { UserData } from '@/lib/mock/users';

interface UserDetailsContentProps {
  user: UserData;
}

const InfoRow = ({ label, value }: { label: string, value: string | number | undefined }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={600} color="text.primary">
      {value || 'N/A'}
    </Typography>
  </Box>
);

const SectionHeader = ({ title, icon }: { title: string, icon?: React.ReactNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
    {icon}
    <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.85rem' }}>
      {title}
    </Typography>
  </Box>
);

export const UserDetailsContent: React.FC<UserDetailsContentProps> = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderPersonal = () => (
    <Stack id="personal-section-stack" spacing={2.5}>
      <Paper id="personal-info-card" elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <SectionHeader title="Personal Information" icon={<PersonIcon color="primary" fontSize="small" />} />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="First Name" value={user.firstName} />
            <InfoRow label="Gender" value={user.gender} />
            <InfoRow label="Blood Group" value={user.bloodGroup} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="Last Name" value={user.lastName} />
            <InfoRow label="Date of Birth" value={user.dateOfBirth} />
          </Grid>
        </Grid>
      </Paper>

      <Paper id="address-details-card" elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <SectionHeader title="Address Details" />
        <Grid container spacing={2}>
          <Grid size={12}>
            <InfoRow label="Permanent Address" value={user.permanentAddress} />
            <InfoRow label="Current Address" value={user.currentAddress} />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <InfoRow label="City" value={user.city} />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <InfoRow label="District" value={user.district} />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <InfoRow label="State" value={user.state} />
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );

  const renderContacts = () => (
    <Stack id="contact-section-stack" spacing={2.5}>
      <Paper id="contact-info-card" elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <SectionHeader title="Contact Information" icon={<ContactIcon color="primary" fontSize="small" />} />
        <InfoRow label="Mobile Number" value={user.mobileNumber} />
        <InfoRow label="Email Address" value={user.email} />
        <InfoRow label="Emergency Contact" value={user.emergencyContact} />
      </Paper>

      <Paper id="status-badges-card" elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Status & Badges</Typography>
        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
          <Chip 
            label={user.verification} 
            icon={<VerifiedIcon style={{ color: user.verification === 'Verified' ? 'white' : '#cbd5e1' }} />} 
            sx={{ 
              bgcolor: user.verification === 'Verified' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', 
              color: 'white', 
              fontWeight: 700 
            }} 
          />
          <Chip 
            label={user.isActive ? 'Active Member' : 'Inactive'} 
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }} 
          />
        </Stack>
      </Paper>
    </Stack>
  );

  const renderEvents = () => (
    <Paper id="event-participation-card" elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
      <SectionHeader title="Event Participation" icon={<HistoryIcon color="primary" fontSize="small" />} />
      <Grid container spacing={2}>
        {user.recentEvents?.map((event) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                bgcolor: 'background.default',
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } 
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>{event.name}</Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>{event.date}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" fontWeight={700}>{event.rating}</Typography>
                  <StarIcon sx={{ color: '#faaf00', fontSize: '1rem' }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                  {event.comment}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  return (
    <Box id="user-details-content-root">
      {/* Dynamic Profile Header */}
      {isMobile ? (
        <Box id="mobile-profile-header" sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Avatar
              src={user.profilePhoto}
              sx={{
                width: 140,
                height: 140,
                bgcolor: 'primary.main',
                fontSize: '4rem',
                boxShadow: '0 12px 32px rgba(0,85,212,0.15)',
                border: '6px solid white'
              }}
            >
              {user.firstName[0]}
            </Avatar>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: -1, color: theme.palette.text.primary }}>
              {user.firstName} {user.lastName}
            </Typography>
            {user.verification === 'Verified' ? (
              <VerifiedIcon color="primary" sx={{ fontSize: '2rem' }} />
            ) : user.verification === 'Pending' ? (
              <VerifiedIcon sx={{ fontSize: '2rem', color: 'action.disabled' }} />
            ) : null}
          </Stack>
          <Typography variant="h6" color="primary" fontWeight={700} sx={{ mt: 1, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.85rem' }}>
            {user.role}
          </Typography>

          {/* Quick Stats on Mobile */}
          <Stack 
            direction="row" 
            spacing={3} 
            sx={{ mt: 3, mb: 3 }} 
            divider={<Divider orientation="vertical" flexItem sx={{ height: 24, my: 'auto' }} />}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" fontWeight={700}>Rating</Typography>
              <Typography variant="body1" fontWeight={800}>{user.rating}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" fontWeight={700}>Events</Typography>
              <Typography variant="body1" fontWeight={800}>{user.totalEvents}</Typography>
            </Box>
          </Stack>

          {/* Status & Badges - Moved here for Mobile */}
          <Stack direction="row" spacing={1.5}>
            <Chip 
              label={user.verification} 
              icon={<VerifiedIcon style={{ color: user.verification === 'Verified' ? '#0055D4' : '#94a3b8' }} />} 
              sx={{ 
                bgcolor: user.verification === 'Verified' ? 'rgba(0,85,212,0.1)' : 'rgba(0,0,0,0.05)', 
                color: user.verification === 'Verified' ? 'primary.main' : 'text.secondary', 
                fontWeight: 700 
              }} 
            />
            <Chip 
              label={user.isActive ? 'Active Member' : 'Inactive'} 
              sx={{ 
                bgcolor: user.isActive ? 'success.light' : 'error.light', 
                color: 'white', 
                fontWeight: 700 
              }} 
            />
          </Stack>
        </Box>
      ) : (
        <Paper
          id="desktop-profile-header"
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            mb: 4,
            borderRadius: { xs: 5, md: 8 },
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.06)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background element */}
          <Box sx={{ 
            position: 'absolute', 
            top: -50, 
            right: -50, 
            width: 150, 
            height: 150, 
            borderRadius: '50%', 
            bgcolor: 'primary.main', 
            opacity: 0.03 
          }} />

          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user.profilePhoto}
              sx={{
                width: { xs: 130, md: 180 },
                height: { xs: 130, md: 180 },
                bgcolor: 'primary.main',
                fontSize: '4.5rem',
                boxShadow: '0 20px 40px rgba(0,85,212,0.15)',
                border: '8px solid white',
                mb: 1
              }}
            >
              {user.firstName[0]}
            </Avatar>
          </Box>
          
          <Box sx={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <Typography variant={isMobile ? "h4" : "h3"} fontWeight={900} sx={{ letterSpacing: -1, color: 'text.primary' }}>
                {user.firstName} {user.lastName}
              </Typography>
              {user.verification === 'Verified' ? (
                <VerifiedIcon color="primary" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }} />
              ) : user.verification === 'Pending' ? (
                <VerifiedIcon sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, color: 'action.disabled' }} />
              ) : null}
            </Stack>
            
            <Typography variant="h6" color="primary" fontWeight={700} sx={{ mt: 1, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.9rem', opacity: 0.9 }}>
              {user.role}
            </Typography>

            <Divider sx={{ my: 4, width: '60%', mx: 'auto', opacity: 0.6 }} />

            <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={700} sx={{ textTransform: 'uppercase', mb: 0.5 }}>Rating</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                  <StarIcon sx={{ color: '#faaf00', fontSize: '1.4rem' }} />
                  <Typography variant="h5" fontWeight={800}>{user.rating}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={700} sx={{ textTransform: 'uppercase', mb: 0.5 }}>Events</Typography>
                <Typography variant="h5" fontWeight={800}>{user.totalEvents || 0}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={700} sx={{ textTransform: 'uppercase', mb: 0.5 }}>Success</Typography>
                <Typography variant="h5" fontWeight={800} color="success.main">{user.successRate}%</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={700} sx={{ textTransform: 'uppercase', mb: 0.5 }}>Joined</Typography>
                <Typography variant="h5" fontWeight={800}>{user.dateOfJoining?.split(' ')[2] || user.dateOfJoining?.split('-')[2] || '2021'}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      {/* Mobile Tab Navigation */}
      {isMobile ? (
        <Box id="mobile-navigation" sx={{ mb: 3 }}>
          <Paper id="tab-container" elevation={0} sx={{ borderRadius: 3, bgcolor: 'background.paper', p: 0.5, border: '1px solid', borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ 
                minHeight: 44,
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': {
                  borderRadius: 2.5,
                  minHeight: 40,
                  transition: 'all 0.2s',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0,85,212,0.2)'
                  }
                }
              }}
            >
              <Tab label="Personal" />
              <Tab label="Contact" />
              <Tab label="Events" />
            </Tabs>
          </Paper>
          <Box sx={{ mt: 3, animation: 'fadeIn 0.3s ease-in' }}>
            {tabValue === 0 && renderPersonal()}
            {tabValue === 1 && renderContacts()}
            {tabValue === 2 && renderEvents()}
          </Box>
        </Box>
      ) : (
        /* Desktop Grid Layout */
        <Grid id="desktop-grid-layout" container spacing={3}>
          <Grid size={7}>{renderPersonal()}</Grid>
          <Grid size={5}>{renderContacts()}</Grid>
          <Grid size={12}>{renderEvents()}</Grid>
        </Grid>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};
