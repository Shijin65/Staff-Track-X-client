import React from "react";
import { Container } from "@mui/material";
import { EventForm } from "@/components/events/EventForm";

export default function CreateEventPage() {
  return (
    <Container maxWidth="xl">
      <EventForm />
    </Container>
  );
}
