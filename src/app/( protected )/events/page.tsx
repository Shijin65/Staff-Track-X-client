"use client";

import React, { useState } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import { Add as AddIcon, EventOutlined } from "@mui/icons-material";
import { EventListing } from "@/components/events/EventListing";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { SearchInput, ModuleTitle } from "@/components/ui";
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
    <Box sx={{px: { xs: 2, xl: 4 }}}>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}
        >
          <ModuleTitle
            title="Events Management"
            icon={<EventOutlined />}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center"
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 250 }}>
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
                size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => router.push("/events/create")}
                  sx={{ borderRadius: 2 }}
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
    </Box>
  );
}
