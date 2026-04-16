"use client";

import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { navItems } from "@/lib/utils/constance";
import Link from "next/link";
import { usePathname } from "next/navigation";


export const Sidebar = () => {
  const pathname = usePathname();

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
            background: "var(--primary-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 900,
            fontSize: "1.4rem",
            boxShadow: "var(--primary-shadow)",
          }}
        >
          S
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0.5, color: "text.primary" }}>
          Caters Hub
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1, overflowY: "auto" }}>
        {navItems.slice(0, -1).map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                sx={{
                  borderRadius: 3,
                  bgcolor: isActive ? "rgba(37, 99, 235, 0.08)" : "transparent",
                  color: isActive ? "primary.main" : "inherit",
                  "& .MuiListItemIcon-root": {
                    color: isActive ? "primary.main" : "text.secondary",
                  },
                  "&:hover": {
                    bgcolor: "rgba(37, 99, 235, 0.08)",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive ? 700 : 600, fontSize: "0.95rem" }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Box sx={{ px: 2, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href={navItems[navItems.length - 1].path}
            sx={{
              borderRadius: 3,
              bgcolor: pathname === navItems[navItems.length - 1].path ? "rgba(37, 99, 235, 0.08)" : "transparent",
              color: pathname === navItems[navItems.length - 1].path ? "primary.main" : "inherit",
              "& .MuiListItemIcon-root": {
                color: pathname === navItems[navItems.length - 1].path ? "primary.main" : "text.secondary",
              },
              "&:hover": {
                bgcolor: "rgba(37, 99, 235, 0.08)",
                color: "primary.main",
                "& .MuiListItemIcon-root": {
                  color: "primary.main",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {navItems[navItems.length - 1].icon}
            </ListItemIcon>
            <ListItemText
              primary={navItems[navItems.length - 1].label}
              primaryTypographyProps={{ fontWeight: pathname === navItems[navItems.length - 1].path ? 700 : 600, fontSize: "0.95rem" }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;
