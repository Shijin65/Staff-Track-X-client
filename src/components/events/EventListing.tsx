"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { EnhancedTable, Column } from "@/components/table/EnhancedTable";
import { useWindowSize } from "@/lib/hooks";
import { ErrorCard } from "@/components/ui";
import { EventPayload, EventRow, Order } from "./event-type";

interface EventListingProps {
  order: "asc" | "desc";
  orderBy: string;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  setOrderBy: React.Dispatch<React.SetStateAction<keyof EventRow>>
  query: string;
}

const columns: Column<EventRow>[] = [
  { id: "title", label: "Event Title" },
  { id: "eventDate", label: "Date" },
  { id: "eventVenue", label: "Venue" },
  { id: "status", label: "Status" },
];

export const EventListing = ({
  order,
  orderBy,
  setOrder,
  setOrderBy,
  query,
}: EventListingProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const router = useRouter();
  const { height } = useWindowSize();
  const limit = height === 0 ? 10 : Math.floor((height - 240) / 41);

  const { data, error, isLoading, mutate } = useSWR(`/api/events?Page=${page}&Limit=${limit}&Search=${encodeURIComponent(query)}&SortBy=${orderBy}&SortOrder=${order}`);

  const parsedData: EventRow[] = data?.payload?.map((item: EventPayload) => ({
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
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <ErrorCard
      message={error?.response?.data?.message || "We encountered an error while fetching the events. Please try again."}
      onRetry={() => mutate()}
    />
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <EnhancedTable
          rows={parsedData}
          columns={columns}
          idField="id"
          selected={selected}
          setSelected={setSelected}
          page={page}
          setPage={setPage}
          handleViewDetails={handleViewDetails}
          mainCol="title"
          limit={limit}
          totalPages={data?.metaData?.totalPages || 1}
          totalItems={data?.metaData?.totalCount || 0}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          hasSelection={true}
          orderBy={orderBy as keyof EventRow}
          order={order}
        />
      </Paper>
    </Box>
  );
};
