"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
} from "@mui/material";
import {
  Today as TodayIcon,
  AccessTime,
  Business,
  LocationOn as LocationIcon,
  InfoOutlined,
  EventAvailable,
} from "@mui/icons-material";

export interface Event {
  eventId: string;
  title: string;
  eventDate: string;
  startTime: string;
  reportingTime: string;
  eventVenue: string;
  address: string;
  city: string;
  district: string;
  description?: string;
  locationInstructions?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventRequests?: any[];
}

interface EventDetailContentProps {
  event: Event | null;
}

export const EventDetailContent = ({ event }: EventDetailContentProps) => {
  if (!event) return null;

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {/* Event Banner */}
      <Grid size={{ xs: 12, md: 12 }}>
        <Box
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            position: "relative",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                boxShadow: `0 4px 12px rgba(var(--primary-rgb), 0.3)`,
              }}
            >
              <EventAvailable fontSize="small" />
            </Box>
            <Chip
              label="Upcoming Event"
              size="small"
              color="primary"
              sx={{ fontWeight: 600, borderRadius: 1.5 }}
            />
          </Stack>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              color: "text.primary",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            {event.title}
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Event Details
          </Typography>
          <List disablePadding>
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <TodayIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Date" secondary={event.eventDate} />
            </ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <AccessTime fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Time"
                secondary={`${event.startTime} (Reporting: ${event.reportingTime})`}
              />
            </ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Business fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Venue" secondary={event.eventVenue} />
            </ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <LocationIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Address"
                secondary={`${event.address}, ${event.city}, ${event.district}`}
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Description
          </Typography>
          <Typography variant="body2">
            {event.description || "No description provided."}
          </Typography>
        </Box>

      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Location
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              {event.address}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {event.city}, {event.district}
            </Typography>
          </Box>
        </Box>
        {event.locationInstructions && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              gutterBottom
            >
              <InfoOutlined fontSize="inherit" /> Instructions
            </Typography>
            <Typography variant="body2" fontStyle="italic">
              {event.locationInstructions}
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};
