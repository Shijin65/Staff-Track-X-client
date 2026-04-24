"use client";

import React, { use } from "react";
import { Container } from "@mui/material";
import { EventCreateForm } from "@/app/( protected )/events/components/EventCreateForm";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <Container maxWidth="xl" sx={{ py: 0 }}>
      <EventCreateForm eId={id as string} />
    </Container>
  );
}
