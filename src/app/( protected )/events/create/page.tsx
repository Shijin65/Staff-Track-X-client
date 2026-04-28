import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { EventCreateForm } from "@/components/events/EventCreateForm";

export default function CreateEventPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>Create New Event</Typography>
        <Typography variant="body1" color="text.secondary">Enter details to organize a new catering event</Typography>
      </Box>
      <EventCreateForm />
    </Container>
  );
}
