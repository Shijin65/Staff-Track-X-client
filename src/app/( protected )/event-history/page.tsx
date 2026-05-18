"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  Divider,
} from "@mui/material";
import {
  LocationOn,
  HistoryOutlined,
  Star,
  EventAvailable,
} from "@mui/icons-material";
import useSWR from "swr";
import { MainLoader, ErrorCard, ModuleHeader, EmptyState, DateBadge } from "@/components/ui";
import { useRouter } from "next/navigation";
export default function EventHistoryPage() {
  const theme = useTheme();
  const { data, error, isLoading } = useSWR("/api/events/history/me");
  const router = useRouter()
  if (isLoading) return <MainLoader />;
  if (error) return <Box sx={{ py: 10 }}><ErrorCard message="Failed to load your event history." /></Box>;

  const history = data?.payload || [];

  interface EventHistoryItem {
  confirmationId: string;
  event: {
    title: string;
    eventType: string;
    eventDate: string;
    eventVenue: string;
    district: string;
    city: string
  };
  attendanceStatus: string;
  rating: number;
  roleId:number;
  comment:string;
}


  return (
    <Box sx={{ width: "100%", maxWidth: 1536, px: { xs: 2, xl: 4 }, margin: "0 auto", pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <ModuleHeader
          title={"Event History"}
          onBack={() => router.back()}
        />
      </Box>

      {history.length === 0 ? (
        <EmptyState
          icon={<HistoryOutlined />}
          title="No Event History"
          description="We'll let you know when there will be completed events to show here."
        />
      ) : (
        <Grid container spacing={3}>
          {history.map((work: EventHistoryItem) => (
            <Grid size={{ xs: 12 }} key={work.confirmationId}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 5,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  overflow: 'hidden',
                  position: 'relative',
                  "&:hover": {
                    transform: "translateX(8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    borderColor: "primary.main"
                  }
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 6,
                  height: '100%',
                  bgcolor: 'primary.main',
                  opacity: 0.8
                }} />

                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid size="auto">
                     <DateBadge dateStr={work.event?.eventDate}/>
                    </Grid>

                    <Grid >
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                          {work.event?.title}
                        </Typography>
                        <Chip
                          label={work.event?.eventType || "Event"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: 1.5,
                            bgcolor: 'rgba(0,0,0,0.05)',
                            color: 'text.primary'
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <LocationOn sx={{ fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={600}>
                            {work.event?.eventVenue || work.event?.city}, {work.event?.district}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
                          <EventAvailable sx={{ fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={700}>
                            {work.attendanceStatus === 'reported' ? 'Participated' : 'Confirmed'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: "auto" }}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'row', md: 'column' },
                        alignItems: { xs: 'center', md: 'flex-end' },
                        gap: 2,
                        p: 2,
                        borderRadius: 3,
                        bgcolor: 'rgba(0,0,0,0.02)',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ display: 'block', textTransform: 'uppercase', mb: 0.5 }}>
                            Rating
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star sx={{ color: '#FFD700', fontSize: 20 }} />
                            <Typography variant="h6" fontWeight={900}>
                              {work.rating ? work.rating.toFixed(1) : "N/A"}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'block', md: 'none' } }} />

                        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ display: 'block', textTransform: 'uppercase', mb: 0.5 }}>
                            Role
                          </Typography>
                          <Typography variant="body2" fontWeight={800} color="primary.main">
                            {work.roleId ? (work.roleId === 1 ? 'Supervisor' : 'Staff') : 'Staff'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {work.comment && (
                    <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(var(--primary-rgb), 0.03)', border: '1px dashed rgba(var(--primary-rgb), 0.1)' }}>
                      <Typography variant="caption" color="primary.main" fontWeight={800} sx={{ display: 'block', textTransform: 'uppercase', mb: 0.5 }}>
                        Feedback
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        `{work.comment}`
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
