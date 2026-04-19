"use client";

import React, { use } from "react";
import { Box, Container, Typography } from "@mui/material";
import { EventCreateForm } from "@/app/( protected )/events/components/EventCreateForm";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>Edit Event</Typography>
        <Typography variant="body1" color="text.secondary">Update details for this catering event</Typography>
      </Box>
      <EventCreateForm eId={id as string} />
    </Container>
  );
}
