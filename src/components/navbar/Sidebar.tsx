"use client";

import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { navItems } from "@/lib/utils/constance";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store";


export const Sidebar = () => {
  const pathname = usePathname();

  const availableAccess = useUserStore((state) => state.user?.availableAccess) as unknown as string[] | undefined;

  const hasPermission = (path: string) => {
    if (!availableAccess) return false;
    if (path === "/") return true;
    if (path === "/profile") return true;
    if (path === "/my-events") return true;
    if (path === "/events") return availableAccess.includes("view_event");
    if (path === "/events/create") return availableAccess.includes("create_event");
    if (path === "/users") return availableAccess.includes("view_user");
    return false;
  };

  const filteredItems = navItems.filter((item) => hasPermission(item.path));

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
        <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0.5, color: "text.primary" }}>
          Caters Hub
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1, overflowY: "auto" }}>
        {filteredItems.slice(0, -1).map((item) => {
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

      {filteredItems.length > 0 && (
        <Box sx={{ px: 2, pb: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href={filteredItems[filteredItems.length - 1].path}
              sx={{
                borderRadius: 3,
                bgcolor: pathname === filteredItems[filteredItems.length - 1].path ? "rgba(37, 99, 235, 0.08)" : "transparent",
                color: pathname === filteredItems[filteredItems.length - 1].path ? "primary.main" : "inherit",
                "& .MuiListItemIcon-root": {
                  color: pathname === filteredItems[filteredItems.length - 1].path ? "primary.main" : "text.secondary",
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
                {filteredItems[filteredItems.length - 1].icon}
              </ListItemIcon>
              <ListItemText
                primary={filteredItems[filteredItems.length - 1].label}
                primaryTypographyProps={{ fontWeight: pathname === filteredItems[filteredItems.length - 1].path ? 700 : 600, fontSize: "0.95rem" }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
