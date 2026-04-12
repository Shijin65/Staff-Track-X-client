"use client";

import React, { use, useEffect, useState } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { EventCreateForm } from "@/components/event/EventCreateForm";
import { useAxios } from "@/lib/hooks";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const api = useAxios();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        setEventData(res.data.payload);
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [api, id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>Edit Event</Typography>
        <Typography variant="body1" color="text.secondary">Update details for this catering event</Typography>
      </Box>
      <EventCreateForm initialData={eventData} />
    </Container>
  );
}
