"use client";

import React, { use } from "react";
import { Container } from "@mui/material";
import { EventForm } from "@/components/events/EventForm";

interface EventEditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: EventEditPageProps) {
  const id = use(params).id;

  return (
    <Container maxWidth="xl" sx={{ py: 0 }}>
      <EventForm eId={id} />
    </Container>
  );
}
