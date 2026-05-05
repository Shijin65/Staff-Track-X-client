"use client";

import React, { use } from "react";
import { Box, Typography, Container, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { EventCheckIn } from "@/components/live-events/EventCheckIn";

export default function EventCheckInPage({
  params
}: {
  params: Promise<{ eventId: string }>
}) {

  const eventId = use(params).eventId;
  const router = useRouter();

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 1, md: 3 }, mb: 4, px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Mark Attendance
          </Typography>
        </Box>
      </Box>

      <EventCheckIn eventId={eventId} />
    </Container>
  );
}
