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
} from "@mui/material";
import {
  Event as EventIcon,
  LocationOn,
  AccessTime,
  CalendarMonth,
  ChevronRight,
} from "@mui/icons-material";

// Dummy data for applied events
const DUMMY_EVENTS = [
  {
    id: "1",
    title: "Grand Wedding Banquet",
    date: "Dec 15, 2023",
    time: "10:00 AM",
    location: "Royal Garden Hall, Kochi",
    type: "Wedding",
    status: "Approved",
  },
  {
    id: "2",
    title: "Corporate Gala Dinner",
    date: "Dec 22, 2023",
    time: "06:00 PM",
    location: "Grand Hyatt, Bolgatty",
    type: "Corporate",
    status: "Pending",
  },
  {
    id: "3",
    title: "Birthday Celebration",
    date: "Jan 05, 2024",
    time: "04:30 PM",
    location: "Marine Drive, Kochi",
    type: "Personal",
    status: "Applied",
  },
];

export default function MyEventsPage() {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved": return "success";
      case "pending": return "warning";
      case "applied": return "info";
      default: return "default";
    }
  };

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
      <Grid container spacing={{ xs: 1.5, sm: 3 }}>
        {DUMMY_EVENTS.map((event) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={event.id}>
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
                    label={event.type} 
                    size="small" 
                    sx={{ bgcolor: "rgba(var(--primary-rgb), 0.08)", color: "primary.main", fontWeight: 700, borderRadius: 1.5 }} 
                  />
                  <Chip 
                    label={event.status} 
                    color={getStatusColor(event.status) as any} 
                    size="small" 
                    variant="filled"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Typography variant="h6" fontWeight={800} gutterBottom noWrap>
                  {event.title}
                </Typography>

                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CalendarMonth fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{event.date}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{event.time}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" noWrap>{event.location}</Typography>
                  </Box>
                </Stack>

                <Button 
                  fullWidth 
                  variant="outlined" 
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
    </Box>
  );
}
