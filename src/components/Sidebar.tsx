"use client";

import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import EventIcon from "@mui/icons-material/Event";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon /> },
  { text: "Events", icon: <EventIcon /> },
  { text: "Staff", icon: <PeopleIcon /> },
  { text: "Settings", icon: <SettingsIcon /> },
];

export const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        display: { xs: "none", md: "block" }, // Hide on mobile
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h5" fontWeight={800} color="primary" sx={{ letterSpacing: 1 }}>
          StaffTrack<span style={{ fontStyle: "italic", fontSize: "1.6rem" }}>X</span>
        </Typography>
      </Box>
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              sx={{

                borderRadius: 3,
                "&:hover": {
                  bgcolor: "rgba(37, 99, 235, 0.08)", // Blue transparent background
                  color: "primary.main",
                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem" }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
