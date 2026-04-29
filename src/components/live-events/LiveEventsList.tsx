"use client";

import React from "react";
import { Box, Typography, Grid, Paper, Chip } from "@mui/material";
import { AccessTime, LocationOn, Group } from "@mui/icons-material";
import { useRouter } from "next/navigation";

// Mock Data for Live Events
const MOCK_LIVE_EVENTS = [
  {
    id: "evt_001",
    title: "Grand Wedding Reception",
    location: "Kochi Marriott Hotel, Ernakulam",
    time: "10:00 AM - 4:00 PM",
    totalStaff: 25,
    reportedStaff: 18,
  },
  {
    id: "evt_002",
    title: "Corporate Annual Gala",
    location: "Taj Malabar, Willingdon Island",
    time: "4:00 PM - 11:00 PM",
    totalStaff: 40,
    reportedStaff: 40,
  },
  {
    id: "evt_003",
    title: "Birthday Bash",
    location: "Holiday Inn, Cochin",
    time: "6:00 PM - 10:00 PM",
    totalStaff: 10,
    reportedStaff: 2,
  },
];

export const LiveEventsList = () => {
  const router = useRouter();

  return (
    <Grid container spacing={3}>
      {MOCK_LIVE_EVENTS.map((event) => {
        const progress = (event.reportedStaff / event.totalStaff) * 100;
        const isComplete = event.reportedStaff === event.totalStaff;

        return (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
            <Paper
              elevation={0}
              onClick={() => router.push(`/live-events/${event.id}`)}
              sx={{
                p: 3,
                borderRadius: 4,
                cursor: "pointer",
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  transform: "translateY(-4px)",
                  borderColor: "primary.light",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                  {event.title}
                </Typography>
                <Chip
                  size="small"
                  label={isComplete ? "All Present" : "Active"}
                  color={isComplete ? "success" : "primary"}
                  sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                  <LocationOn sx={{ fontSize: 18, mr: 1 }} />
                  <Typography variant="body2">{event.location}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                  <AccessTime sx={{ fontSize: 18, mr: 1 }} />
                  <Typography variant="body2">{event.time}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "background.default", p: 1.5, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Group sx={{ fontSize: 20, color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2" fontWeight={600}>
                    Staff Attendance
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={700} color={isComplete ? "success.main" : "primary.main"}>
                  {event.reportedStaff} / {event.totalStaff}
                </Typography>
              </Box>
              
              {/* Simple Progress Bar */}
              <Box sx={{ width: "100%", height: 6, bgcolor: "divider", borderRadius: 3, mt: 1, overflow: "hidden" }}>
                <Box
                  sx={{
                    width: `${progress}%`,
                    height: "100%",
                    bgcolor: isComplete ? "success.main" : "primary.main",
                    transition: "width 0.5s ease-in-out",
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};
