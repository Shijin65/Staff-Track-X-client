"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Toolbar,
  Tooltip,
  Button,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { EnhancedTable } from "@/components/table/EnhancedTable";
import { useWindowSize } from "@/lib/hooks";

interface Event {
  eventId: string;
  title: string;
  eventDate: string;
  eventVenue: string;
  status: string;
}

export const EventListing = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/events");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { height } = useWindowSize();
  const limit = height === 0 ? 10 : Math.floor((height - 240) / 41);

  const router = useRouter();

  const columns = [
    { id: "title", label: "Event Title" },
    { id: "eventDate", label: "Date" },
    { id: "eventVenue", label: "Venue" },
    { id: "status", label: "Status" },
  ];

  const parsedData = data?.payload?.map((item: Event) => ({
    id: item.eventId,
    title: item.title,
    eventDate: item.eventDate,
    eventVenue: item.eventVenue,
    status: item.status,
  })) || [];


  const handleViewDetails = (eventId: string) => {
    router.push(`/events/${eventId}/view`);
  };

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Toolbar sx={{ pl: { sm: 2 }, p: { xs: 2, sm: 2 } }}>
          <Typography sx={{ flex: "1 1 100%", fontWeight: 600 }} variant="h6">
            Events Management
          </Typography>
          <Tooltip title="Add Event">
            <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => router.push('/events/create')}
                sx={{ borderRadius: 2 }}
            >
              Add 
            </Button>
          </Tooltip>
        </Toolbar>

        <EnhancedTable
          rows={parsedData}
          columns={columns}
          idField="title"
          selected={selected}
          setSelected={setSelected}
          page={page}
          setPage={setPage}
          handleViewDetails={handleViewDetails}
          mainCol="title"
          limit={limit}
          totalPages={data?.metaData?.totalPages || 1}
          totalItems={data?.metaData?.totalCount || 0}
          setOrder={() => {}}
          setOrderBy={() => {}}
          hasSelection={false}
        />
      </Paper>
    </Box>
  );
};
