"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  useTheme,
  Paper,
} from "@mui/material";
import {
  Event as EventIcon,
  LocationOn,
  AccessTime,
  CalendarMonth,
  ChevronRight,
  HelpOutline,
} from "@mui/icons-material";
import useSWR from "swr";
import { MainLoader } from "@/components/ui/main-loader";
import { ErrorCard } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function MyEventsPage() {
  const theme = useTheme();
  const router = useRouter();
  const { data, error, isLoading } = useSWR("/api/events/my-requests");

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return "success";
      case "pending": return "warning";
      case "rejected": return "error";
      case "applied": return "info";
      default: return "default";
    }
  };

  if (isLoading) return <MainLoader />;
  if (error) return <Box sx={{ py: 10 }}><ErrorCard message="Failed to load your event requests." /></Box>;

  const requests = data?.payload || [];

  return (
    <Box sx={{ width: "100%", maxWidth: 1536, px: { xs: 1, sm: 2, xl: 4 }, margin: "0 auto", pb: 10 }}>

      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', alignItems: 'flex-start', gap: { xs: 1.5, md: 2 } }}>
        <Box sx={{ p: { xs: 1.25, md: 1.5 }, borderRadius: 2, bgcolor: "rgba(var(--primary-rgb), 0.1)", color: "primary.main", display: 'flex' }}>
             <EventIcon sx={{ fontSize: { xs: 28, md: 35 } }} />
        </Box>
        <Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
             My Events
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4, maxWidth: { xs: '260px', sm: '100%'} }}>
             Track and manage the events you&apos;ve applied for.
            </Typography>
        </Box>
      </Box>

      {/* Events Grid */}
      {requests.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 6, md: 10 }, 
            textAlign: 'center', 
            borderRadius: 4, 
            border: `1px dashed ${theme.palette.divider}`,
            bgcolor: 'rgba(0,0,0,0.01)'
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <HelpOutline sx={{ fontSize: 60, color: 'text.disabled' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>No Applications Found</Typography>
          <Typography variant="body2" color="text.secondary">
            You haven&apos;t applied for any events yet. Check out the dashboard to find upcoming opportunities.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 1.5, sm: 3 }}>
          {requests.map((request: any) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={request.requestId}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: { xs: 2, sm: 4 }, 
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                    borderColor: "primary.main"
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Chip 
                      label={request.event?.eventType || "Event"} 
                      size="small" 
                      sx={{ bgcolor: "rgba(var(--primary-rgb), 0.08)", color: "primary.main", fontWeight: 700, borderRadius: 1.5 }} 
                    />
                    <Chip 
                      label={request.status} 
                      color={getStatusColor(request.status) as any} 
                      size="small" 
                      variant="filled"
                      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                    />
                  </Box>

                  <Typography variant="h6" fontWeight={800} gutterBottom noWrap>
                    {request.event?.title}
                  </Typography>

                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <CalendarMonth fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">{request.event?.eventDate}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {request.event?.startTime} (Reporting: {request.event?.reportingTime})
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {request.event?.eventVenue || request.event?.city}, {request.event?.district}
                      </Typography>
                    </Box>
                  </Stack>

                  <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={() => router.push(`/events/${request.event?.eventId}/view`)}
                    endIcon={<ChevronRight />}
                    sx={{ mt: 3, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
