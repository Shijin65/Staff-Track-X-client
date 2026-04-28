"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Tooltip, Paper } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { EventListing } from "@/components/events/EventListing";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/components/ui/search";
import { useAuthUser } from "@/lib/hooks";
import { EventRow } from "../../../components/events/event-type";

type Order = "asc" | "desc";

export default function EventsPage() {
  const router = useRouter();
  const { user } = useAuthUser();
  const canCreateEvent = user?.availableAccess?.CreateEvent;

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof EventRow>("title");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  return (
    <Box sx={{ mt: 2 }}>
      <Paper id="main-table-paper" sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Box sx={{ p: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
            <Typography variant="h5" fontWeight={700}>
              Events Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 250 }}>
                <SearchInput
                  value={query}
                  setValue={setQuery}
                  placeholder="Search Event"
                  fullWidth
                />
              </Box>
              {canCreateEvent && (
                <Tooltip title="Add Event">
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/events/create')}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Add
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 1 }}>
            <SearchInput
              value={query}
              setValue={setQuery}
              placeholder="Search Event"
              fullWidth
            />
          </Box>
        </Box>
        <EventListing order={order} orderBy={orderBy} setOrder={setOrder} setOrderBy={setOrderBy} query={debouncedQuery} />
      </Paper>
    </Box>
  );
}
