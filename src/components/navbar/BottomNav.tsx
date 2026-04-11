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

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
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
        value={navItems.findIndex(item => item.path === pathname)}
        onChange={(event, newValue) => {
          router.push(navItems[newValue].path);
        }}
        sx={{
          height: 70,
          background: "transparent",
        }}
      >
        {navItems.map((item, index) => {
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