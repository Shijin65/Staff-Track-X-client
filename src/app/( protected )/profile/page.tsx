"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  useTheme,
  Button,
  Chip,
} from "@mui/material";
import {
  EmailOutlined,
  CheckCircleOutline,
  PhoneOutlined,
  ShieldOutlined,
  BadgeOutlined,
  SettingsOutlined,
  ChevronRight,
} from "@mui/icons-material";
import { useAuthContext } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { QRCodeSVG } from "qrcode.react";
import { MainLoader } from "@/components/ui/main-loader";

export default function ProfilePage() {
  const { user } = useAuthContext();
  const theme = useTheme();
  const router = useRouter();

  const userId = user?.user?.userId;
  const { data, error, isLoading } = useSWR(userId ? `/api/users/${userId}` : null);

  if (isLoading || !user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <MainLoader />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center", mt: 10 }}>
        <Typography color="error">Failed to load profile data.</Typography>
      </Box>
    );
  }

  const profileData = data?.payload || user.user;
  const qrValue = JSON.stringify({
    id: profileData.userId,
    name: `${profileData.firstName} ${profileData.lastName || ""}`.trim(),
    email: profileData.email,
    role: profileData.role?.name || "User",
  });

  return (
    <Box sx={{ width: "100%", maxWidth: 1536, px: { xs: 2, xl: 4 }, margin: "0 auto", pb: 10 }}>
      {/* Banner Section */}
      <Box
        sx={{
          height: { xs: 180, md: 240 },
          width: "100%",
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          position: "relative",
          mb: { xs: 8, md: 10 },
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          overflow: "hidden"
        }}
      >
        {/* Decorative elements behind banner */}
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ position: 'absolute', bottom: -20, left: '20%', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Profile Avatar overlapping banner */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: -50, md: -60 },
            left: { xs: "50%", md: 40 },
            transform: { xs: "translateX(-50%)", md: "none" },
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            zIndex: 10,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profileData.profilePic || ""}
              sx={{
                width: { xs: 120, md: 150 },
                height: { xs: 120, md: 150 },
                border: "6px solid",
                borderColor: "background.default",
                bgcolor: "primary.main",
                fontSize: "3.5rem",
                boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
              }}
            >
              {profileData.firstName[0]}
            </Avatar>
          </Box>
        </Box>
      </Box>
      {/* Main Content Grid */}
      <Grid container spacing={{ xs: 3, md: 4 }}>
        {/* User Identity - Order 1 on all screens */}
        <Grid size={{ xs: 12, lg: 8 }} sx={{ order: 1 }}>
          <Box sx={{ mb: { xs: 2.5, md: 4 }, textAlign: { xs: "center", md: "left" }, pl: { md: 2 } }}>
            <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              {profileData.firstName} {profileData.lastName}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: { xs: "center", md: "flex-start" }, flexWrap: "wrap", alignItems: "center" }}>
              <Chip
                icon={<ShieldOutlined sx={{ fontSize: '0.9rem' }} />}
                label={profileData.role?.name ? profileData.role.name.replace(/_/g, " ").toUpperCase() : "STAFF"}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                icon={<CheckCircleOutline sx={{ fontSize: '0.9rem' }} />}
                label={profileData.isActive ? "Verified" : "Inactive"}
                color={profileData.isActive ? "success" : "default"}
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
        </Grid>

        {/* QR Code Section - Order 2 on mobile, sits on right on desktop */}
        <Grid size={{ xs: 12, lg: 4 }} sx={{ order: { xs: 2, lg: 3 } }}>
          <Box sx={{ position: { lg: "sticky" }, top: 24, mb: { xs: 2, lg: 0 } }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, textAlign: "center", background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)", boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                Digital ID Pass
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Present this QR code for rapid event check-ins and verification.
              </Typography>

              <Box sx={{ position: "relative", display: "inline-block", mx: 'auto' }}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "120%", height: "120%", background: `radial-gradient(circle, ${theme.palette.primary.light}33 0%, transparent 70%)`, zIndex: 0, filter: "blur(20px)" }} />
                
                <Box sx={{ position: "relative", display: "inline-block", p: { xs: 2, md: 3 }, bgcolor: "white", borderRadius: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.1)", zIndex: 1, border: "1px solid rgba(0,0,0,0.05)" }}>
                  <QRCodeSVG
                    value={qrValue}
                    size={200} // Reduced size slightly for better fit
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"H"}
                    includeMargin={false}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 4, p: 2, borderRadius: 3, bgcolor: "rgba(0,0,0,0.03)" }}>
                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
                  Official Staff ID
                </Typography>
                <Typography variant="h6" fontWeight={800} letterSpacing={2} color="primary.main">
                  {profileData.staffId || "PENDING"}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Personal Details - Order 3 on mobile, sits under name on desktop */}
        <Grid size={{ xs: 12, lg: 8 }} sx={{ order: { xs: 3, lg: 2 } }}>
          <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, transition: "transform 0.2s, box-shadow 0.2s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)" } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h6" fontWeight={800}>
                Personal Details
              </Typography>
              <Button variant="contained" size="small" sx={{ borderRadius: 2 }}>Edit Profile</Button>
            </Box>
            
            <Grid container spacing={{ xs: 2, md: 3 }}>
              <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: "rgba(var(--primary-rgb), 0.1)", color: "primary.main", display: 'flex', flexShrink: 0 }}>
                    <EmailOutlined fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} noWrap display="block">Email Address</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ wordBreak: 'break-all' }}>{profileData.email}</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: "rgba(var(--primary-rgb), 0.1)", color: "primary.main", display: 'flex', flexShrink: 0 }}>
                    <PhoneOutlined fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} noWrap display="block">Mobile Number</Typography>
                    <Typography variant="body2" fontWeight={700}>{profileData.mobileNumber || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: "rgba(var(--primary-rgb), 0.1)", color: "primary.main", display: 'flex', flexShrink: 0 }}>
                    <BadgeOutlined fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} noWrap display="block">Staff ID</Typography>
                    <Typography variant="body2" fontWeight={700}>{profileData.staffId || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Account Settings Redirect */}
          <Paper 
            elevation={0} 
            onClick={() => router.push('/settings')}
            sx={{ 
              p: 3, 
              mt: 3,
              borderRadius: 4, 
              border: `1px solid ${theme.palette.divider}`,
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": { 
                bgcolor: "rgba(var(--primary-rgb), 0.04)",
                borderColor: "primary.main",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(var(--primary-rgb), 0.1)", color: "primary.main" }}>
                <SettingsOutlined />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={800}>Account Settings</Typography>
                <Typography variant="body2" color="text.secondary">Manage your preferences and help resources</Typography>
              </Box>
            </Box>
            <ChevronRight color="action" />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
