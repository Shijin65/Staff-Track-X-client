import React from "react";
import { Box, Container } from "@mui/material";
import { EventListing } from "@/components/event/EventListing";

export default function EventsPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <EventListing />
    </Container>
  );
}
