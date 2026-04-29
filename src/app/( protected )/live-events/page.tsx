"use client";

import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { LiveEventsList } from "@/components/live-events/LiveEventsList";

export default function LiveEventsPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Live Events
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage today&apos;s events and staff attendance.
        </Typography>
      </Box>
      <LiveEventsList />
    </Container>
  );
}
