"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthContext } from "@/context/auth-provider";

const navLinks = ["Home", "About", "Market", "Services"];

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const auth = useAuthContext();
  const theme = useTheme();

  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleUserMenuClose();
    if (auth?.logout) auth.logout();
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto", px: { xs: 2, sm: 3 } }}>
          {/* User Account Icon */}
          <IconButton
            onClick={handleUserMenuOpen}
            color="inherit"
            aria-label="Account menu"
            sx={{ mr: 1 }}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            PaperProps={{ sx: { mt: 1, minWidth: 150 } }}
          >
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon sx={{ color: "error.main", minWidth: 32 }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>

          {/* Desktop Nav */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            {navLinks.slice(0, 2).map((link) => (
              <Typography
                key={link}
                component="a"
                href="#"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                {link}
              </Typography>
            ))}

            {/* Logo center */}
            <Image src="/next.svg" alt="Logo" width={45} height={45} />

            {navLinks.slice(2).map((link) => (
              <Typography
                key={link}
                component="a"
                href="#"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                {link}
              </Typography>
            ))}
          </Box>

          {/* Mobile: spacer */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />

          {/* Right: Hamburger */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              color="inherit"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Menu
          </Typography>
        </Box>
        <Divider />
        <List>
          {navLinks.map((link) => (
            <ListItemButton key={link} onClick={() => setDrawerOpen(false)}>
              <ListItemText primary={link} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
