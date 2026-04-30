import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Chip, Skeleton } from "@mui/material";
import { AccessTime, LocationOn, Group } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { SearchInput } from "@/components/ui/search";


export const LiveEventsList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useSWR(`/api/events?type=today&SearchQuery=${debouncedQuery}`);
  const events = data?.payload || [];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ width: { xs: '100%', md: 320 } }}>
          <SearchInput
            value={searchQuery}
            setValue={setSearchQuery}
            placeholder="Search today's events..."
          />
        </Box>
      </Box>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 4 }} animation="wave" />
            </Grid>
          ))}
        </Grid>
      ) : events.length === 0 ? (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">No events scheduled for today.</Typography>
          <Typography variant="body2" color="text.secondary">Check the main event list for upcoming events.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event: any) => {
            const totalRequired = event.staffRequirements?.reduce((sum: number, req: any) => sum + req.count, 0) || 0;
            const reportedStaff = event.eventRequests?.filter((r: any) => r.status === "Approved").length || 0;
            const progress = totalRequired > 0 ? (reportedStaff / totalRequired) * 100 : 0;
            const isComplete = reportedStaff === totalRequired && totalRequired > 0;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.eventId}>
                <Paper
                  elevation={0}
                  onClick={() => router.push(`/live-events/${event.eventId}`)}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                      transform: "translateY(-4px)",
                      borderColor: "primary.light",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1, minHeight: 30 }} className="line-clamp-2">
                      {event.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={isComplete ? "All Present" : "Active"}
                      color={isComplete ? "success" : "primary"}
                      sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                      <LocationOn sx={{ fontSize: 18, mr: 1 }} />
                      <Typography variant="body2" noWrap>{event.eventVenue || event.city}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                      <AccessTime sx={{ fontSize: 18, mr: 1 }} />
                      <Typography variant="body2">{event.reportingTime || "N/A"}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "background.default", p: 1.5, borderRadius: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Group sx={{ fontSize: 20, color: "text.secondary", mr: 1 }} />
                      <Typography variant="body2" fontWeight={600}>
                        Staff Attendance
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700} color={isComplete ? "success.main" : "primary.main"}>
                      {reportedStaff} / {totalRequired}
                    </Typography>
                  </Box>

                  {/* Simple Progress Bar */}
                  <Box sx={{ width: "100%", height: 6, bgcolor: "divider", borderRadius: 3, mt: 1, overflow: "hidden" }}>
                    <Box
                      sx={{
                        width: `${Math.min(progress, 100)}%`,
                        height: "100%",
                        bgcolor: isComplete ? "success.main" : "primary.main",
                        transition: "width 0.5s ease-in-out",
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};
