"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { EventListing } from "@/app/( protected )/events/components/EventListing";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function EventsPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  return (
    <Box sx={{ mt: 2 }}>
      <EventListing query={debouncedQuery} />
    </Box>
  );
}
