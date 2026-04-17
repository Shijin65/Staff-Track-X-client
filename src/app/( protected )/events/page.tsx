import React from "react";
import { Box } from "@mui/material";
import { EventListing } from "@/app/( protected )/events/components/EventListing";

export default function EventsPage() {
  return (
    <Box sx={{ mt: 2 }}>
      <EventListing />
    </Box>
  );
}
