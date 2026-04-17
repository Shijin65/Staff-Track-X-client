"use client";

import React from "react";
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from "@mui/material";
import { navItems } from "@/lib/utils/constance";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const availableAccess = useUserStore((state) => state.user?.availableAccess) as unknown as string[] | undefined;

  const hasPermission = (path: string) => {
    if (!availableAccess) return false;
    if (path === "/") return true;
    if (path === "/settings") return true;
    if (path === "/events") return availableAccess.includes("view_event");
    if (path === "/events/create") return availableAccess.includes("create_event");
    if (path === "/users") return availableAccess.includes("view_user");
    return false;
  };

  const filteredItems = navItems.filter((item) => hasPermission(item.path));

  // Determine active value
  const activeIndex = filteredItems.findIndex(item => item.path === pathname);
  const value = activeIndex === -1 ? 0 : activeIndex;

  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: "25px",
        backdropFilter: "blur(12px)",
        background: "rgba(255,255,255,0.7)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        display: { xs: "block", md: "none" },
        zIndex: (theme) => theme.zIndex.appBar,
        pb: "env(safe-area-inset-bottom)",
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          if (filteredItems[newValue]) {
            router.push(filteredItems[newValue].path);
          }
        }}
        sx={{
          height: 70,
          background: "transparent",
        }}
      >
        {filteredItems.map((item, index) => {
          const isSelected = pathname === item.path;

          return (
            <BottomNavigationAction
              key={item.label}
              label={item.label}
              disableRipple
              icon={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isSelected ? 42 : 32,
                    height: isSelected ? 42 : 32,
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    background: isSelected
                      ? "var(--primary-gradient)"
                      : "transparent",
                    color: isSelected ? "#fff" : "text.secondary",
                  }}
                >
                  {item.icon}
                </Box>
              }
              sx={{
                minWidth: "auto",
                color: "text.secondary",
                "& .MuiBottomNavigationAction-label": {
                  fontSize: 11,
                  transition: "0.3s",
                  opacity: isSelected ? 1 : 0.6,
                },
              }}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;