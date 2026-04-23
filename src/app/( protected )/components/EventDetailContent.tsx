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
} from "@mui/material";
import {
  Today as TodayIcon,
  AccessTime,
  Business,
  LocationOn as LocationIcon,
  InfoOutlined,
} from "@mui/icons-material";

interface EventDetailContentProps {
  event: any;
}

export const EventDetailContent = ({ event }: EventDetailContentProps) => {
  if (!event) return null;

  return (
    <Grid container spacing={3}>
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
