"use client";

import React from "react";
import {
  Box,
  Typography,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import { grey } from "@mui/material/colors";

const Puller = styled(Box)(({ theme }) => ({
  width: 36,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[700],
  borderRadius: 3,
  position: "absolute",
  top: 12,
  left: "calc(50% - 18px)",
}));

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface MoreMenuDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  items: NavItem[];
  onItemClick: (path: string) => void;
  pathname: string;
}

export const MoreMenuDrawer: React.FC<MoreMenuDrawerProps> = ({
  open,
  onClose,
  onOpen,
  items,
  onItemClick,
  pathname,
}) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          height: "auto",
          maxHeight: "70vh",
          overflow: "visible",
          borderTopLeftRadius: "28px",
          borderTopRightRadius: "28px",
          bgcolor: "background.paper",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.12)",
          padding: "env(safe-area-inset-bottom)",
        },
      }}
    >
      <Box sx={{ px: 3, pb: 4, pt: 4, position: "relative" }}>
        <Puller />
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            px: 1, 
            fontWeight: 700,
            color: "text.primary",
            fontSize: "1.1rem"
          }}
        >
          More Options
        </Typography>
        <List sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          {items.map((item) => {
            const isSelected = pathname.startsWith(item.path) && item.path !== "/";
            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => {
                    onItemClick(item.path);
                    onClose();
                  }}
                  sx={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 2.5,
                    px: 1,
                    borderRadius: "20px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: isSelected 
                      ? "var(--primary-gradient)" 
                      : "rgba(0, 0, 0, 0.02)",
                    "&:hover": {
                      background: isSelected 
                        ? "var(--primary-gradient)" 
                        : "rgba(0, 0, 0, 0.05)",
                      transform: "translateY(-2px)",
                    },
                    boxShadow: isSelected ? "0 8px 16px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mb: 1,
                      color: isSelected ? "#fff" : "text.secondary",
                      "& svg": { fontSize: 28 }
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textAlign: "center",
                      color: isSelected ? "#fff" : "text.primary",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </SwipeableDrawer>
  );
};

export default MoreMenuDrawer;
