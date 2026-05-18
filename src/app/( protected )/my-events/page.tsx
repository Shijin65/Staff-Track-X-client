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
  useTheme,
} from "@mui/material";
import {
  LocationOn,
  AccessTime,
  EventOutlined,
} from "@mui/icons-material";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { MainLoader, ErrorCard, ModuleTitle, EmptyState, DateBadge } from "@/components/ui";

export default function MyEventsPage() {
  const theme = useTheme();
  const router = useRouter();
  const { data, error, isLoading } = useSWR("/api/events/applications/me");

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

  if (requests.length === 0) {
    return <EmptyState icon={<EventOutlined />} title="No Applications Found" description="You haven't applied for any events yet. Check out the dashboard to find upcoming opportunities." />
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1536, px: { xs: 2, xl: 4 }, margin: "0 auto", pb: 10 }}>

      <Box sx={{ mb: 2 }}>
        <ModuleTitle title="My Events" icon={<EventOutlined />} />
      </Box>


      <Grid container spacing={{ xs: 1.5, sm: 3 }}>
        {requests.map((request: any) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={request.requestId}>
            <Card
              elevation={0}
              sx={{
                borderRadius: { xs: 3, sm: 4 },
                border: `1px solid ${theme.palette.divider}`,
                transition: "all 0.3s ease",
                overflow: 'hidden',
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                  borderColor: "primary.main"
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: { xs: 2, sm: 2.5 }, borderBottom: `1px dashed ${theme.palette.divider}` }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Chip
                      label={request.event?.eventType || "Event"}
                      size="small"
                      sx={{ bgcolor: "rgba(var(--primary-rgb), 0.08)", color: "primary.main", fontWeight: 700, borderRadius: 1.5 }}
                    />
                    <Chip
                      label={request.status}
                      color={getStatusColor(request.status)}
                      size="small"
                      variant="filled"
                      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <DateBadge dateStr={request.event?.eventDate} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="h6" fontWeight={800} noWrap sx={{ mb: 0.5 }}>
                        {request.event?.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <LocationOn sx={{ fontSize: 16 }} />
                        <Typography variant="caption" fontWeight={600} noWrap sx={{ maxWidth: '100%' }}>
                          {request.event?.eventVenue || request.event?.city}, {request.event?.district}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: 'rgba(0,0,0,0.01)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', display: 'flex' }}>
                        <AccessTime fontSize="small" color="primary" />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', lineHeight: 1, mb: 0.5, textTransform: 'uppercase' }}>
                          Reporting
                        </Typography>
                        <Typography variant="body2" fontWeight={800}>
                          {request.event?.reportingTime || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', lineHeight: 1, mb: 0.5, textTransform: 'uppercase' }}>
                        Start Time
                      </Typography>
                      <Typography variant="body2" fontWeight={800} color="primary.main">
                        {request.event?.startTime || "N/A"}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => router.push(`/events/${request.event?.eventId}/view`)}
                    sx={{
                      mt: 2.5,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: 800,
                      boxShadow: 'none',
                      py: 1
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
