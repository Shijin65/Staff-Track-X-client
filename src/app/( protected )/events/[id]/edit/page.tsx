"use client";

import React, { use } from "react";
import { Container } from "@mui/material";
import { EventCreateForm } from "@/components/events/EventCreateForm";

interface EventEditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: EventEditPageProps) {
  const id = use(params).id;

  return (
    <Container maxWidth="xl" sx={{ py: 0 }}>
      <EventCreateForm eId={id} />
    </Container>
  );
}
