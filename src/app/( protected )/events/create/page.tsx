import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { EventCreateForm } from "@/components/events/EventCreateForm";

export default function CreateEventPage() {
  return (
    <Container maxWidth="xl">
      <EventCreateForm />
    </Container>
  );
}
