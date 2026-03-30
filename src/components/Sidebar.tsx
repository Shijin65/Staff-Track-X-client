"use client";

import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { navItems } from "@/lib/utils/constance";


export const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        display: { xs: "none", md: "flex" },
        flexDirection: "column", 
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <Box sx={{ p: 3, pb: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 900,
            fontSize: "1.4rem",
            boxShadow: "0 8px 16px rgba(25, 118, 210, 0.25)",
          }}
        >
          S
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0.5, color: "text.primary" }}>
          StaffTrack<Box component="span" sx={{ color: "#1976d2", fontStyle: "italic", fontSize: "1.4rem", ml: 0.2 }}>X</Box>
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1, overflowY: "auto" }}>
        {navItems.slice(0, -1).map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              sx={{
                borderRadius: 3,
                "&:hover": {
                  bgcolor: "rgba(37, 99, 235, 0.08)",
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
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ px: 2, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 3,
              "&:hover": {
                bgcolor: "rgba(37, 99, 235, 0.08)",
                color: "primary.main",
                "& .MuiListItemIcon-root": {
                  color: "primary.main",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
              {navItems[navItems.length - 1].icon}
            </ListItemIcon>
            <ListItemText
              primary={navItems[navItems.length - 1].label}
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem" }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;
