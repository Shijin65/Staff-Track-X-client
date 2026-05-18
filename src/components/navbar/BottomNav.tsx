"use client";

import {
  Paper,
  Box,
  ButtonBase,
} from "@mui/material";
import { navItems } from "@/lib/utils/constance";
import { usePathname, useRouter } from "next/navigation";
import { useAuthUser } from "@/lib/hooks";
import { MoreHorizOutlined } from "@mui/icons-material";
import MoreMenuDrawer from "./MoreMenuDrawer";
import { useState } from "react";

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthUser()
  const availableAccess = user?.availableAccess || {};
  const roleName = user?.user?.role?.name;

  const hasPermission = (path: string) => {
    if (path === "/") return true;
    if (path === "/profile") return true;
    if (path === "/my-events") return !["supervisor", "super_admin"].includes(roleName as string);
    if (path === "/events") return availableAccess?.ViewEvent;
    if (path === "/users") return availableAccess?.ViewUser;
    if (path === "/mark-attendance") return availableAccess?.MarkAttendance || availableAccess?.ViewAttendance || ["supervisor", "super_admin"].includes(roleName as string);
    return false;
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredItems = navItems.filter((item) => hasPermission(item.path));

  let mainLabels = ["Overview", "My Event", "Profile"];
  if (roleName === "supervisor" || roleName === "super_admin") {
    mainLabels = ["Overview", "Event", "Users"];
  }
  const displayItems = filteredItems.filter(item => mainLabels.includes(item.label));
  const drawerItems = filteredItems.filter(item => !mainLabels.includes(item.label));

  const getActiveIndex = () => {

    const mainIndex = displayItems.findIndex(item =>
      item.path === "/"
        ? pathname === "/"
        : pathname.startsWith(item.path)
    );

    if (mainIndex !== -1) return mainIndex;

    const isInDrawer = drawerItems.some(item =>
      item.path === "/"
        ? pathname === "/"
        : pathname.startsWith(item.path)
    );
    
    if (isInDrawer) return displayItems.length;

    return 0;
  };

  const value = getActiveIndex();
  const isMoreButton = value === displayItems.length;
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
        boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
        display: { xs: "block", md: "none" },
        zIndex: (theme) => theme.zIndex.appBar,
        pb: "env(safe-area-inset-bottom)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: 70,
          background: "transparent",
          width: "100%",
        }}
      >
        {displayItems.map((item, index) => {
          const isSelected =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);

          return (
            <ButtonBase
              key={item.label}
              disableRipple
              onClick={() => router.push(item.path)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "auto",
                color: "text.secondary",
                height: "100%",
                flex: 1,
                maxWidth: 80,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width:  30,
                  height: 30,
                  borderRadius: "12px",
                  color: isSelected ? "var(--primary)" : "inherit",
                  mb: 0.5,
                }}
              >
                {item.icon}
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: 11,
                  transition: "0.3s",
                  opacity: isSelected ? 1 : 0.6,
                  lineHeight: 1,
                }}
              >
                {item.label}
              </Box>
            </ButtonBase>
          );
        })}

        {drawerItems.length > 0 && (
          <ButtonBase
            disableRipple
            onClick={() => setIsDrawerOpen(true)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "auto",
              color: "text.secondary",
              height: "100%",
              flex: 1,
              maxWidth: 80,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: "12px",
                color: isMoreButton ? "var(--primary)" : "inherit",
                mb: 0.5,
              }}
            >
              <MoreHorizOutlined />
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: 11,
                transition: "0.3s",
                opacity: isMoreButton ? 1 : 0.6,
                lineHeight: 1,
              }}
            >
              More
            </Box>
          </ButtonBase>
        )}

      </Box>
      {drawerItems.length > 0 && <MoreMenuDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
        items={drawerItems}
        onItemClick={(path) => router.push(path)}
        pathname={pathname}
      />}
    </Paper>
  );
};

export default BottomNav;