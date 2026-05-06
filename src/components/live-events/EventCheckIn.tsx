"use client";

import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Container,
  Chip,
} from "@mui/material";
import { ErrorCard, SearchInput } from "@/components/ui";
import {
  LocationOn,
  Schedule,
} from "@mui/icons-material";
import useSWR, { mutate } from "swr";
import { StaffCheckInList } from "./StaffCheckInList";
import { useState } from "react";
import { formatTime } from "@/lib/utils/formateDate";


export const EventCheckIn = ({ eventId }: { eventId: string }) => {
  const [statusFilter, setStatusFilter] = useState<"all" | "reported" | "not_reported">("all");
  const [search, setSearch] = useState("");

  // Fetch event data for the header
  const { data: summaryData, isLoading, error , mutate} = useSWR(`/api/events/${eventId}/summary`);

  const event = summaryData?.payload;

  const counts = summaryData?.metaData;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <ErrorCard
          message={error?.response?.data?.message || "Failed to load event details."}
          onRetry={() => mutate(`/api/events/${eventId}/attendance`)}
        />
      </Container>
    );
  }

  return (
    <Box>
      {/* Event Details Card */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" fontWeight={800} gutterBottom>
          {event?.title || "Event Details"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOn /> {event?.eventVenue || "Location not set"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Schedule /> {event?.startTime ? `${event.startTime} Onwards` : "Time not set"}
        </Typography>
      </Card>

      {/* Summary Bar */}
      <Box sx={{ display: "flex", gap: 1.5, overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { display: "none" } }}>
        <Card sx={{ flex: "1 0 auto", px: 1.5, py: 1, borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <Typography variant="caption" color="text.secondary" fontWeight={500} display="block">Total Staff</Typography>
          <Typography variant="subtitle1" fontWeight={700} color="primary.main" sx={{ lineHeight: 1 }}>{counts.total}</Typography>
        </Card>
        <Card sx={{ flex: "1 0 auto", px: 1.5, py: 1, borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <Typography variant="caption" color="success.dark" fontWeight={500} display="block">Reported</Typography>
          <Typography variant="subtitle1" fontWeight={700} color="success.main" sx={{ lineHeight: 1 }}>{counts.reported}</Typography>
        </Card>
        <Card sx={{ flex: "1 0 auto", px: 1.5, py: 1, borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <Typography variant="caption" color="warning.dark" fontWeight={500} display="block">Not Reported</Typography>
          <Typography variant="subtitle1" fontWeight={700} color="warning.main" sx={{ lineHeight: 1 }}>{counts.notReported}</Typography>
        </Card>
      </Box>

      {/* Staff Check-In Section (New Component) */}
      <Box sx={{ position: "sticky", top: { xs: 56, md: 64 }, zIndex: 10, bgcolor: "background.default", py: 2, mb: 1, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "center" }}>
          <Box sx={{ flexGrow: 1, width: { xs: "100%", sm: "70%" } }}>
            <SearchInput value={search} setValue={setSearch} placeholder="Search staff name" fullWidth />
          </Box>
          <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" }, overflowX: "auto", pb: { xs: 1, sm: 0 }, "&::-webkit-scrollbar": { display: "none" } }}>
            <Chip
              label="All"
              onClick={() => setStatusFilter("all")}
              color={statusFilter === "all" ? "primary" : "default"}
              variant={statusFilter === "all" ? "filled" : "outlined"}
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Reported"
              onClick={() => setStatusFilter("reported")}
              color={statusFilter === "reported" ? "success" : "default"}
              variant={statusFilter === "reported" ? "filled" : "outlined"}
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label="Not Reported"
              onClick={() => setStatusFilter("not_reported")}
              color={statusFilter === "not_reported" ? "warning" : "default"}
              variant={statusFilter === "not_reported" ? "filled" : "outlined"}
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>
      </Box>
      <StaffCheckInList eventId={eventId} search={search} statusFilter={statusFilter}  mutateEvents={mutate}/>
    </Box>
  );
};
