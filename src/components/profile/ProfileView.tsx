"use client";

import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  useTheme,
  Button,
  Chip,
  Container,
} from "@mui/material";
import {
  EmailOutlined,
  CheckCircleOutline,
  PhoneOutlined,
  ShieldOutlined,
  SettingsOutlined,
  ChevronRight,
  WcOutlined,
  BloodtypeOutlined,
  EmergencyOutlined,
} from "@mui/icons-material";
import { useAuthContext } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { QRCodeSVG } from "qrcode.react";
import { API_URL } from "@/lib/utils/constance";
import { ErrorCard, GroupSkeleton } from "@/components/ui";

export function ProfileView() {
  const { user } = useAuthContext();
  const theme = useTheme();
  const router = useRouter();
  const userId = user?.user?.userId;
  const { data, error, isLoading } = useSWR(userId ? `/api/users/${userId}` : null);

  const profileData = data?.payload;
  const imageId = profileData?.attachment?.picId || profileData?.profilePic;

  const profilePreview = useMemo(() => {
    if (imageId) {
      return `${API_URL}/api/users/attachment/${imageId}`;
    }
    return null;
  }, [imageId]);

  if (isLoading || !user) {
    return (
      <Box>
        <GroupSkeleton rowsNum={3} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <ErrorCard
          message="Failed to load profile data."
          onRetry={() => router.refresh()}
        />
      </Container>
    );
  }

  const qrValue = JSON.stringify({
    id: profileData.userId,
    name: `${profileData.firstName} ${profileData.lastName || ""}`.trim(),
    email: profileData.email,
    role: profileData.role?.name || "User",
  });

  return (
    <Box sx={{ width: "100%", maxWidth: 1536, px: { xs: 2, xl: 4 }, margin: "0 auto", pb: 10 }}>
      <Box
        sx={{
          height: { xs: 160, md: 220 },
          width: "100%",
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          position: "relative",
          mb: { xs: 8, md: 10 },
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          overflow: "visible"
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 4 }}>
          <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ position: 'absolute', bottom: -20, left: '20%', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: { xs: -50, md: -60 },
            left: { xs: "50%", md: 48 },
            transform: { xs: "translateX(-50%)", md: "none" },
            zIndex: 10,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profilePreview || ""}
              sx={{
                width: { xs: 120, md: 160 },
                height: { xs: 120, md: 160 },
                border: "6px solid",
                borderColor: "background.default",
                bgcolor: "primary.light",
                fontSize: "3.5rem",
                boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
              }}
            >
              {profileData.firstName?.[0]}
            </Avatar>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }}>
        <Grid size={{ xs: 12, lg: 8 }} sx={{ order: 1 }}>
          <Box sx={{ mb: { xs: 2.5, md: 4 }, textAlign: { xs: "center", md: "left" }, pl: { md: 2 } }}>
            <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              {profileData.firstName} {profileData.lastName}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: { xs: "center", md: "flex-start" }, flexWrap: "wrap", alignItems: "center" }}>
              <Chip
                icon={<ShieldOutlined sx={{ fontSize: '0.9rem' }} />}
                label={user?.user?.role.name.toUpperCase() || "STAFF"}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                icon={<CheckCircleOutline sx={{ fontSize: '0.9rem' }} />}
                label={profileData.isVerified ? "Verified" : "Not Verified"}
                color={profileData.isVerified ? "success" : "error"}
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }} sx={{ order: { xs: 2, lg: 3 } }}>
          <Box sx={{ position: { lg: "sticky" }, top: 24, mb: { xs: 2, lg: 0 } }}>
            <Paper elevation={0} sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              textAlign: "center",
                // background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <Box>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Digital ID Pass
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>
                  Staff Identity QR
                </Typography>
              </Box>

              <Box sx={{ position: "relative", display: "inline-block", mx: 'auto' }}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "130%", height: "130%", background: `radial-gradient(circle, ${theme.palette.primary.light}22 0%, transparent 70%)`, zIndex: 0, filter: "blur(20px)" }} />

                <Box sx={{ position: "relative", display: "inline-block", p: { xs: 2, md: 2.5 }, bgcolor: "white", borderRadius: 4, boxShadow: "0 15px 35px rgba(0,0,0,0.1)", zIndex: 1, border: "1px solid rgba(0,0,0,0.05)" }}>
                  <QRCodeSVG
                    value={qrValue}
                    size={180}
                    // bgColor={"#ffffff"}
                    // fgColor={"#000000"}
                    level={"H"}
                    includeMargin={false}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ px: 2, lineHeight: 1.6 }}>
                  Present this QR code for rapid event check-ins and identity verification.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }} sx={{ order: { xs: 3, lg: 2 } }}>
          <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, transition: "transform 0.2s, box-shadow 0.2s", "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.06)" } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h6" fontWeight={800}>
                Personal Details
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{ borderRadius: 2 }}
                onClick={() => router.push(`/profile/edit`)}
              >
                Edit Profile
              </Button>
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
                    <WcOutlined fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} noWrap display="block">Gender</Typography>
                    <Typography variant="body2" fontWeight={700}>{profileData.gender || "Not specified"}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: "rgba(var(--primary-rgb), 0.1)", color: "primary.main", display: 'flex', flexShrink: 0 }}>
                    <BloodtypeOutlined fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} noWrap display="block">Blood Group</Typography>
                    <Typography variant="body2" fontWeight={700}>{profileData.bloodGroup || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, xl: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: "rgba(var(--primary-rgb), 0.1)", color: "primary.main", display: 'flex', flexShrink: 0 }}>
                    <EmergencyOutlined fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} noWrap display="block">Emergency Contact</Typography>
                    <Typography variant="body2" fontWeight={700}>{profileData.emergencyContact || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

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
