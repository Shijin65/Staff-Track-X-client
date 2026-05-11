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
      {/* Background Glow */}
      <Box sx={{
        position: "fixed",
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(var(--primary-rgb), 0.08) 0%, transparent 70%)",
        zIndex: -1,
        pointerEvents: "none"
      }} />

      <ModuleHeader
        title="Event Details"
        onBack={() => router.back()}
        onEdit={() => router.push(`/events/${eventId}/edit`)}
        updatePermission={canEditEvent}
      />

      <Box
        sx={{
          mt: 2,
          mb: 5,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
          gap: 3,
        }}
      >

        {/* Title */}
        <Box><Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.8rem", md: "2.4rem" },
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {event.title}
        </Typography>
          {/* Chips */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={event.eventType || "General Event"}
              size="small"
              sx={{
                bgcolor: "rgba(var(--primary-rgb), 0.12)",
                color: "primary.main",
                fontWeight: 600,
                borderRadius: "6px",
              }}
            />

            <Chip
              label={event.status || "Pending"}
              color={getStatusColor(event.status) as any}
              size="small"
              sx={{
                fontWeight: 600,
                borderRadius: "6px",
              }}
            />
          </Box>
        </Box>

        {/* Action Button */}
        {canEditEvent && (
          <Button
            variant="contained"
            onClick={() => setIsManageModalOpen(true)}
            size="small"
            startIcon={<Assignment />}
            sx={{
              borderRadius: "999px",
              px: 1.5,
              textTransform: "none",
              fontWeight: 700,
              alignSelf: "center",
              boxShadow: "0 8px 18px rgba(var(--primary-rgb), 0.25)",

              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 24px rgba(var(--primary-rgb), 0.35)",
              },

              transition: "all 0.2s ease",
            }}
          >
          Applications
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Main Details Column */}
        <Grid size={{ xs: 12, lg: canViewClientInfo || canViewUsers ? 8 : 12 }}>
          <Stack spacing={4}>
            {/* Core Info Card */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                overflow: "hidden",
                position: "relative"
              }}
            >
              <Typography variant="h6" fontWeight={800} sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "rgba(var(--primary-rgb), 0.1)", display: "flex" }}>
                  <EventIcon sx={{ color: "primary.main" }} />
                </Box>
                Event Details
              </Typography>

              <Grid container spacing={2} >
                {[
                  { label: "Date", value: event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "Not Set", icon: <EventIcon fontSize="small" /> },
                  { 
                    label: "Schedule", 
                    isSchedule: true,
                    icon: <AccessTime fontSize="small" /> 
                  },
                  { label: "Event Type", value: event.eventType, icon: <Assignment fontSize="small" /> },
                  { label: "Status", value: event.status, icon: <InfoOutlined fontSize="small" /> },
                  { label: "City", value: event.city, icon: <Business fontSize="small" /> },
                  { label: "District", value: event.district, icon: <LocationOn fontSize="small" /> },
                  { label: "State", value: event.state, icon: <Public fontSize="small" /> },
                ].map((item: any, idx) => (
                  <Grid size={{ sm: 6, md: item.isSchedule ? 4 : 2.66 }} sx={{ width: "100%" }} key={idx}>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(var(--primary-rgb), 0.03)", height: "100%", border: "1px solid", borderColor: "rgba(var(--primary-rgb), 0.05)" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary", mb: 0.5 }}>
                        <Box sx={{ color: "primary.main", display: "flex" }}>{item.icon}</Box>
                        <Typography variant="caption" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {item.label}
                        </Typography>
                      </Box>
                      
                      {item.isSchedule ? (
                        <Box sx={{ display: "flex", gap: 3, alignItems: "center" , mt:1}}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Reporting</Typography>
                            <Typography variant="body2" fontWeight={700}>{event.reportingTime || "N/A"}</Typography>
                          </Box>
                          <Box sx={{ borderLeft: "1px solid", borderColor: "divider", height: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">Starting</Typography>
                            <Typography variant="body2" fontWeight={700}>{event.startTime || "N/A"}</Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" fontWeight={700} sx={{mt:1, color: item.value ? "text.primary" : "text.disabled" }}>
                          {item.value || "Not Set"}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {event.description && (
                <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid", borderColor: "divider" }}>
                  <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    <InfoOutlined fontSize="small" /> Description
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                    {event.description}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Client Info (Conditional) */}
            {canViewClientInfo && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 4 },
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  background: "background.paper"
                }}
              >
                <Typography variant="h6" fontWeight={800} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "rgba(var(--primary-rgb), 0.1)", display: "flex" }}>
                    <Person sx={{ color: "primary.main" }} />
                  </Box>
                  Client Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>
                        Client Name
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>{event.clientName || "N/A"}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase" }}>
                        Contact Number
                      </Typography>
                      <Typography variant="body1" fontWeight={700} sx={{ color: "primary.main" }}>
                        {event.clientPhone || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Staffing Section (Conditional) */}
            {canViewUsers && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: "1px solid", borderColor: "divider", height: "100%" }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                      <Group color="primary" /> Requirements
                    </Typography>
                    <List disablePadding>
                      {requirementsResponse?.payload?.length > 0 ? (
                        requirementsResponse.payload.map((req: any) => {
                          const roleObj = roles.find((r: any) => String(r.roleId) === String(req.roleId));
                          const roleName = roleObj ? (roleObj.name.charAt(0).toUpperCase() + roleObj.name.slice(1).replace(/_/g, " ")) : `Role ${req.roleId}`;
                          const confirmedCount = req.confirmedCount || 0;
                          const progress = Math.min((confirmedCount / req.count) * 100, 100);

                          return (
                            <Box key={req.requirementId} sx={{ mb: 2.5 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" fontWeight={700}>{roleName}</Typography>
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                  {confirmedCount} / {req.count}
                                </Typography>
                              </Box>
                              <Box sx={{ width: "100%", height: 6, bgcolor: "rgba(0,0,0,0.05)", borderRadius: 3, overflow: "hidden" }}>
                                <Box sx={{
                                  width: `${progress}%`,
                                  height: "100%",
                                  bgcolor: progress === 100 ? "success.main" : "primary.main",
                                  transition: "width 0.5s ease"
                                }} />
                              </Box>
                            </Box>
                          );
                        })
                      ) : (
                        <Typography variant="body2" color="text.secondary">No requirements.</Typography>
                      )}
                    </List>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: "1px solid", borderColor: "divider", height: "100%" }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                      <Assignment color="primary" /> Recent Applications
                    </Typography>
                    <List disablePadding>
                      {event.eventRequests?.length > 0 ? (
                        event.eventRequests.slice(0, 3).map((req: any) => (
                          <ListItem key={req.requestId} sx={{ px: 0, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <ListItemText
                              primary={`${req.user?.firstName || "-"} ${req.user?.lastName || ""}`}
                              primaryTypographyProps={{ fontWeight: 700, variant: "body2" }}
                              secondary={roles.find((r: any) => String(r.roleId) === String(req.roleId))?.name?.replace(/_/g, " ")?.toUpperCase() || "No Role"}
                              secondaryTypographyProps={{ variant: "caption" }}
                            />
                            <Chip
                              label={req.status}
                              size="small"
                              color={getStatusColor(req.status) as any}
                              variant="outlined"
                              sx={{ fontWeight: 700, fontSize: "0.65rem", height: 20 }}
                            />
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">No applications.</Typography>
                      )}
                    </List>
                    {event.totalApplications > 3 && (
                      <Button
                        fullWidth
                        size="small"
                        sx={{ mt: 2, textTransform: "none", fontWeight: 700 }}
                        onClick={() => setIsManageModalOpen(true)}
                      >
                        View all {event.totalApplications}
                      </Button>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Stack>
        </Grid>

        {/* Sidebar: Location & Map */}
        <Grid size={{ xs: 12, lg: canViewClientInfo || canViewUsers ? 4 : 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              height: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "rgba(var(--primary-rgb), 0.1)", display: "flex" }}>
                <LocationOn sx={{ color: "primary.main" }} />
              </Box>
              Location
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", display: "block", mb: 1 }}>
                Venue Address
              </Typography>
              <Typography variant="body1" fontWeight={700} gutterBottom>
                {event.address || "Address not provided"}
              </Typography>
              {(event.city || event.district) && (
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {event.city}{event.city && event.district ? ", " : ""}{event.district}
                </Typography>
              )}
            </Box>

            

            <Box sx={{ flexGrow: 1,  borderRadius: 3, overflow: "hidden", position: "relative", border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleOpenGoogleMaps}
                  sx={{
                    bgcolor: "background.paper",
                    color: "text.primary",
                    "&:hover": { bgcolor: "background.default" },
                    boxShadow: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700
                  }}
                >
                  Open Maps
                </Button>
              </Box>
              {(event.latitude && event.longitude) ? (
                <EventLocationPickerWrapper
                  readOnly
                  location={{ lat: event.latitude, lng: event.longitude, name: event.address }}
                />
              ) : (
                <iframe
                  title="Event Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                />
              )}
              
            </Box>{event.locationInstructions && (
              <Box sx={{ mt: 4, p: 2, bgcolor: "rgba(var(--primary-rgb), 0.05)", borderRadius: 3, border: "1px dashed", borderColor: "primary.light" }}>
                <Typography variant="caption" color="primary.main" fontWeight={800} sx={{ display: "flex", gap: 0.5, alignItems: "center", mb: 1, textTransform: "uppercase" }}>
                  <InfoOutlined fontSize="inherit" /> Arrival Instructions
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ color: "text.primary" }}>
                  {event.locationInstructions}
                </Typography>
              </Box>
            )}
          </Paper>
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
