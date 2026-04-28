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
    <Box sx={{ width: "100%", maxWidth: 1536, margin: "0 auto", pb: 6, px: { xs: 2, xl: 4 } }}>
      <ModuleHeader
        title="Event Details"
        onBack={() => router.back()}
        onEdit={() => router.push(`/events/${eventId}/edit`)}
        updatePermission={canEditEvent}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {event.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip label={event.eventType || "Event"} color="primary" variant="outlined" size="small" />
            <Chip
              label={event.status || "Pending"}
              color={getStatusColor(event.status) as any}
              size="small"
            />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Event Details & Client Info */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>

          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", mb: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <EventIcon color="primary" /> Event Schedule & Details
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <List disablePadding>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><EventIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Date" secondary={event.eventDate || "Not Set"} />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><AccessTime fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Reporting Time" secondary={event.reportingTime || "Not Set"} />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><AccessTime fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Start Time" secondary={event.startTime || "Not Set"} />
                  </ListItem>
                </List>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <List disablePadding>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><Business fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Venue" secondary={event.eventVenue || "Not Set"} />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><InfoOutlined fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Description" secondary={event.description || "No description provided."} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column: Location & Map */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn color="primary" /> Location
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Address
              </Typography>
              <Typography variant="body1" fontWeight={500} gutterBottom>
                {event.address || "Address not provided"}
              </Typography>
              {(event.city || event.district) && (
                <Typography variant="body2" color="text.secondary">
                  {event.city}{event.city && event.district ? ", " : ""}{event.district}
                </Typography>
              )}
            </Box>

            {event.locationInstructions && (
              <Box sx={{ mb: 4, p: 2, bgcolor: "rgba(var(--primary-rgb), 0.05)", borderRadius: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <InfoOutlined fontSize="small" /> Instructions
                </Typography>
                <Typography variant="body2">
                  {event.locationInstructions}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                Map View
              </Typography>
              <Button size="small" variant="outlined" onClick={handleOpenGoogleMaps}>
                Open in Google Maps
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, minHeight: 300, borderRadius: 2, overflow: "hidden", position: "relative" }}>
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
                  style={{ border: 0, position: "absolute", top: 0, left: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12 }}>
          {canViewClientInfo && <Paper elevation={0} sx={{ mb: 4, p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <Person color="primary" /> Client Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <List disablePadding>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><Person fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Client Name" secondary={event.clientName || "Not Set"} />
                  </ListItem>
                </List>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <List disablePadding>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><Phone fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Client Phone" secondary={event.clientPhone || "Not Set"} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>}

          {/* Staff Requirements & Applications */}
          {canViewUsers && <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                  <Group color="primary" /> Requirements
                </Typography>
                <List disablePadding>
                  {requirementsResponse?.payload && requirementsResponse.payload.length > 0 ? (
                    requirementsResponse.payload.map((req: any) => {
                      const roleObj = roles.find((r: any) => String(r.roleId) === String(req.roleId));
                      const roleName = roleObj ? (roleObj.name.charAt(0).toUpperCase() + roleObj.name.slice(1).replace(/_/g, " ")) : `Role ${req.roleId}`;

                      const confirmedCount = req.confirmedCount || 0;

                      return (
                        <ListItem key={req.requirementId} sx={{ px: 0, py: 1, borderBottom: '1px solid #f0f0f0' }}>
                          <ListItemText
                            primary={roleName}
                            secondary={`Required: ${req.count} | Confirmed: ${confirmedCount}`}
                          />
                          <Box>
                            <Chip
                              label={confirmedCount >= req.count ? "Filled" : "Pending"}
                              size="small"
                              color={confirmedCount >= req.count ? "success" : "warning"}
                              variant="outlined"
                            />
                          </Box>
                        </ListItem>
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary">No staff requirements specified.</Typography>
                  )}
                </List>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Assignment color="primary" /> Applications ({event.totalApplications || 0})
                  </Typography>
                  {canEditEvent && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setIsManageModalOpen(true)}
                      startIcon={<Assignment fontSize="small" />}
                    >
                      Manage
                    </Button>
                  )}
                </Box>

                <List disablePadding>
                  {event.eventRequests && event.eventRequests.length > 0 ? (
                    event.eventRequests.slice(0, 3).map((req: any) => (
                      <ListItem key={req.requestId} sx={{ px: 0, py: 1, borderBottom: '1px solid #f0f0f0' }}>
                        <ListItemText
                          primary={`${req.user?.firstName || "-"} ${req.user?.lastName || ""}`}
                          secondary={roles.find((r: any) => String(r.roleId) === String(req.roleId))?.name?.replace(/_/g, " ")?.toUpperCase() || "No Role"}
                        />
                        <Chip
                          label={req.status}
                          size="small"
                          color={getStatusColor(req.status) as any}
                          variant="outlined"
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No staff have applied yet.</Typography>
                  )}
                  {event.totalApplications > (event.eventRequests?.length || 0) && (
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                        borderColor: 'primary.light',
                        '&:hover': {
                          bgcolor: 'rgba(var(--primary-rgb), 0.04)',
                          borderColor: 'primary.main'
                        }
                      }}
                      onClick={() => setIsManageModalOpen(true)}
                    >
                      View {event.totalApplications - event.eventRequests.length} more applications
                    </Button>
                  )}
                </List>
              </Paper>
            </Grid>
          </Grid>}
        </Grid>
      </Grid>

      <CustomDialog
        open={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Manage Applications"
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
