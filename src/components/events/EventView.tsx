/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Event as EventIcon,
  LocationOn,
  Person,
  InfoOutlined,
  AccessTime,
  Phone,
  Business,
  Group,
  Assignment,
  Public,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { CustomDialog, ErrorCard, GroupSkeleton, ModuleHeader } from "@/components/ui";
import { EventLocationPickerWrapper } from "./EventLocationWrapper";
import { useAuthUser } from "@/lib/hooks";
import { ApplicationManagementModal } from "./ApplicationManagementModal";
import { useState } from "react";

interface EventViewProps {
  eventId: string;
}

export function EventView({ eventId }: EventViewProps) {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthUser();

  const canEditEvent = user?.availableAccess?.UpdateEvent;
  const canViewUsers = user?.availableAccess?.ViewUser;
  const canViewClientInfo = user?.availableAccess?.ViewClientInfo;
  const { data, isLoading, error } = useSWR(`/api/events/${eventId}`);
  const { data: rolesData } = useSWR("/api/meta/roles");
  const { data: requirementsResponse } = useSWR(canViewUsers ? `/api/events/${eventId}/requirements` : null);

  if (isLoading) {
    return <GroupSkeleton rowsNum={2} />;
  }

  const roles = rolesData?.payload?.roles || [];

  if (error || !data) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <ErrorCard
          message={error?.response?.data?.message || "Failed to load event details."}
          onRetry={() => router.back()}
          retryText="Go Back"
        />
      </Container>
    );
  }

  const event = data.payload || data;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "completed":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // Determine the map query
  let mapQuery = "";
  if (event.latitude && event.longitude) {
    mapQuery = `${event.latitude},${event.longitude}`;
  } else if (event.address || event.city || event.district) {
    mapQuery = `${event.address || ""} ${event.city || ""} ${event.district || ""}`.trim();
  } else {
    mapQuery = "Kerala, India";
  }

  const handleOpenGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}`, "_blank");
  };

  return (
    <Box sx={{
      width: "100%",
      maxWidth: 1536,
      margin: "0 auto",
      pb: 8,
      px: { xs: 2, md: 3, lg: 4 },
      position: "relative"
    }}>


      <ModuleHeader
        title="Event Details"
        onBack={() => router.back()}
        onEdit={() => router.push(`/events/${eventId}/edit`)}
        updatePermission={canEditEvent}
      />

      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {/* Chips at the top */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={event.eventType?.toUpperCase() || "EVENT"}
            size="small"
            sx={{
              bgcolor: "rgba(37, 99, 235, 0.15)",
              color: "#60a5fa",
              fontWeight: 700,
              borderRadius: "6px",
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
            }}
          />

          <Chip
            label={event.status?.toUpperCase() || "PENDING"}
            size="small"
            sx={{
              bgcolor: event.status === 'Cancelled' ? "rgba(239, 68, 68, 0.15)" : "rgba(var(--primary-rgb), 0.12)",
              color: getStatusColor(event.status),
              fontWeight: 700,
              borderRadius: "6px",
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
            }}
          />
        </Box>

        {/* Title below chips */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.8rem", md: "2.4rem" },
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          {event.title}
        </Typography>

        {/* Action Button below title */}
        {canEditEvent && (
          <Box>
            <Button
              variant="outlined"
              onClick={() => setIsManageModalOpen(true)}
              size="medium"
              startIcon={<Assignment />}
              sx={{
                borderRadius: "8px",
                px: 2,
                py: 0.8,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  borderColor: "text.secondary",
                  bgcolor: "rgba(255,255,255,0.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Applications
            </Button>
          </Box>
        )}

        {/* Status Banner if cancelled */}
        {event.status === 'Cancelled' && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#ef4444" }} />
              <Typography variant="body2" sx={{ color: "#f87171", fontWeight: 600 }}>
                This event has been cancelled
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: canViewClientInfo || canViewUsers ? 8 : 12 }}>
          <Stack spacing={4}>

            {/* DATE & SCHEDULE */}
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.5, display: "block" }}>
                Date & Schedule
              </Typography>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "rgba(255, 255, 255, 0.02)" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "rgba(37, 99, 235, 0.1)", display: "flex" }}>
                    <EventIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  </Box>
                  <Typography variant="body2" fontWeight={700} color="text.secondary">Date</Typography>
                </Box>

                <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
                  {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "Not Set"}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 2 }}>
                  {event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long' }) : ""}
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(37, 99, 235, 0.03)", border: "1px solid", borderColor: "rgba(37, 99, 235, 0.1)" }}>
                      <Typography variant="caption" fontWeight={700} sx={{ color: "text.secondary", textTransform: "uppercase", display: "block", mb: 1 }}>Reporting</Typography>
                      <Typography variant="h5" fontWeight={800} color="primary.main">{event.reportingTime || "N/A"}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(34, 197, 94, 0.03)", border: "1px solid", borderColor: "rgba(34, 197, 94, 0.1)" }}>
                      <Typography variant="caption" fontWeight={700} sx={{ color: "text.secondary", textTransform: "uppercase", display: "block", mb: 1 }}>Starting</Typography>
                      <Typography variant="h5" fontWeight={800} sx={{ color: "#22c55e" }}>{event.startTime || "N/A"}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            {/* EVENT INFO */}
            <Box>
              <Typography variant="caption" fontWeight={700} sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.5, display: "block" }}>
                Event Info
              </Typography>
              <Paper elevation={0} sx={{ p: 0, borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "rgba(255, 255, 255, 0.02)", overflow: "hidden" }}>
                <List disablePadding>
                  {[
                    { label: "Event type", value: event.eventType, icon: <Business fontSize="small" /> },
                    { label: "Status", value: event.status, icon: <InfoOutlined fontSize="small" />, color: event.status === 'Cancelled' ? '#f87171' : 'primary.main' },
                    { label: "City", value: event.city, icon: <LocationOn fontSize="small" /> },
                    { label: "District", value: event.district, icon: <Public fontSize="small" /> },
                    { label: "State", value: event.state, icon: <Public fontSize="small" /> },
                  ].map((item, idx) => (
                    <ListItem key={idx} sx={{ py: 1.8, px: 3, borderBottom: idx === 4 ? "none" : "1px solid", borderColor: "divider" }}>
                      <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={600} color="text.secondary">{item.label}</Typography>}
                      />
                      <Typography variant="body2" fontWeight={800} sx={{ color: item.color || "text.primary" }}>
                        {item.value || "N/A"}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
            {/* Sidebar: Location & Map */}
            <Grid size={{ xs: 12, lg: canViewClientInfo || canViewUsers ? 4 : 12 }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="caption" fontWeight={700} sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.5, display: "block" }}>
                    Location
                  </Typography>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "rgba(255, 255, 255, 0.02)" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "rgba(16, 185, 129, 0.1)", display: "flex" }}>
                        <LocationOn sx={{ color: "#10b981", fontSize: 20 }} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={800}>Venue location</Typography>
                    </Box>

                    <Box sx={{ mb: 4, borderRadius: 3, overflow: "hidden", position: "relative", border: "1px solid", borderColor: "divider", height: 240 }}>
                      {mapQuery ? (
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                        />
                      ) : (
                        <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(0,0,0,0.2)" }}>
                          <Typography variant="body2" color="text.disabled">Map unavailable</Typography>
                        </Box>
                      )}
                      {event.eventVenue && (
                        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
                          <Box sx={{ bgcolor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", px: 1.5, py: 0.5, borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", boxShadow: "0 0 10px rgba(var(--primary-rgb), 0.8)" }} />
                            <Typography variant="caption" fontWeight={700} sx={{ color: "white" }}>{event.eventVenue}</Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", display: "block", mb: 1 }}>
                        <Box component="span" sx={{ display: "inline-flex", mr: 1, verticalAlign: "middle" }}><Business fontSize="inherit" /></Box>
                        Venue Address
                      </Typography>
                      <Typography variant="body1" fontWeight={800} gutterBottom>
                        {event.address || event.eventVenue || "Address not provided"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {event.city}{event.city && event.district ? ", " : ""}{event.district}
                      </Typography>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(255, 255, 255, 0.03)", border: "1px solid", borderColor: "divider" }}>
                          <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">LATITUDE</Typography>
                          <Typography variant="body2" fontWeight={800}>{event.latitude ? `${event.latitude}° N` : "N/A"}</Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(255, 255, 255, 0.03)", border: "1px solid", borderColor: "divider" }}>
                          <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">LONGITUDE</Typography>
                          <Typography variant="body2" fontWeight={800}>{event.longitude ? `${event.longitude}° E` : "N/A"}</Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {event.locationInstructions && (
                      <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(16, 185, 129, 0.03)", border: "1px solid", borderColor: "rgba(16, 185, 129, 0.1)", mb: 4 }}>
                        <Typography variant="caption" fontWeight={800} sx={{ color: "#10b981", display: "flex", gap: 1, alignItems: "center", mb: 1, textTransform: "uppercase" }}>
                          <InfoOutlined fontSize="inherit" /> Arrival Instructions
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                          {event.locationInstructions}
                        </Typography>
                      </Box>
                    )}

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<LocationOn />}
                      onClick={handleOpenGoogleMaps}
                      sx={{ borderRadius: 3, textTransform: "none", fontWeight: 700, py: 1, borderColor: "divider", color: "text.primary" }}
                    >
                      Get directions
                    </Button>
                  </Paper>
                </Box>
              </Stack>
            </Grid>
            {/* CLIENT INFORMATION */}
            {canViewClientInfo && (
              <Box>
                <Typography variant="caption" fontWeight={700} sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.5, display: "block" }}>
                  Client Information
                </Typography>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "rgba(255, 255, 255, 0.02)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: "rgba(37, 99, 235, 0.1)", color: "primary.main", fontWeight: 800, fontSize: "1.2rem", border: "1px solid", borderColor: "primary.light" }}>
                      {event.clientName ? event.clientName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : "C"}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={800}>{event.clientName || "N/A"}</Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Event client</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3, borderStyle: "dashed", opacity: 0.3 }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                      <Phone fontSize="small" />
                      <Typography variant="body2" fontWeight={600}>Contact</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={800} color="primary.main">
                      {event.clientPhone || "N/A"}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* REQUIREMENTS & APPLICATIONS */}
            {canViewUsers && (
              <Box>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="caption" fontWeight={700} sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.5, display: "block" }}>
                      Requirements
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "rgba(255, 255, 255, 0.02)" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                        <Box sx={{ p: 0.8, borderRadius: 1.5, bgcolor: "rgba(245, 158, 11, 0.1)", display: "flex" }}>
                          <Group sx={{ color: "#f59e0b", fontSize: 20 }} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={800}>Role assignments</Typography>
                      </Box>

                      <Stack spacing={2}>
                        {requirementsResponse?.payload?.length > 0 ? (
                          requirementsResponse.payload.map((req: any, idx: number) => (
                            <Box key={idx} sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255, 255, 255, 0.03)", border: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="body2" fontWeight={800}>{req.roleName || `Role ${req.roleId}`}</Typography>
                              <Chip
                                label={`${req.confirmedCount || 0} / ${req.count}`}
                                size="small"
                                sx={{ bgcolor: "rgba(255, 255, 255, 0.05)", fontWeight: 800, color: "text.secondary" }}
                              />
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">No requirements defined.</Typography>
                        )}
                      </Stack>
                    </Paper>
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight={700} sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.5, display: "block" }}>
                      Recent Applications
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", bgcolor: "rgba(255, 255, 255, 0.02)" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                        <Box sx={{ p: 0.8, borderRadius: 1.5, bgcolor: "rgba(34, 197, 94, 0.1)", display: "flex" }}>
                          <Assignment sx={{ color: "#22c55e", fontSize: 20 }} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={800}>Applications</Typography>
                      </Box>

                      <Box sx={{ py: 4, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>No applications yet</Typography>
                      </Box>
                    </Paper>
                  </Box>
                </Stack>
              </Box>
            )}
          </Stack>
        </Grid>


      </Grid>

      <CustomDialog
        open={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Applications"
        maxWidth="md"
        actions={
          <Button onClick={() => setIsManageModalOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>Close</Button>
        }
      >
        <ApplicationManagementModal
          eventId={eventId}
          roles={roles}
          canEdit={!!canEditEvent}
        />
      </CustomDialog>
    </Box>
  );
}
