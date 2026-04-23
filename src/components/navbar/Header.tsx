"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Divider,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  useTheme,
  Avatar,
} from "@mui/material";
import {
  SettingsOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  ChevronRight,
  LockOutlined,
} from "@mui/icons-material";
import { useAuthContext } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { CustomModal as Modal } from "@/components/ui/modal";
import ChangePassword from "@/app/( protected )/profile/components/ChangePassword";

import { API_URL } from "@/lib/utils/constance";


const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const auth = useAuthContext();
  const user = auth?.user?.user;
  const theme = useTheme();
  const router = useRouter();

  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleUserMenuClose();
    if (auth?.logout) auth.logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "white",
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
      }}
    >
      <Toolbar sx={{ width: "100%", justifyContent: "flex-end", px: { xs: 2, sm: 3 }, minHeight: '64px' }}>
        {/* User Account Icon */}
        <IconButton
          onClick={handleUserMenuOpen}
          sx={{ padding: 0 }}
        >
          <Avatar 
            alt={user?.firstName || ""} 
            src={user?.attachment ? `${API_URL}/api/users/attachment/${user.attachment.picId}` : ""} 
            sx={{ width: 40, height: 40 }} 
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: {
              mt: 1.5,
              width: { xs: 280, sm: 340 },
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: `1px solid ${theme.palette.divider}`,
              overflow: "hidden"
            }
          }}
          MenuListProps={{
            sx: { py: 0 }
          }}
        >
          {/* Accounts Section */}
          <Box sx={{ p: 2, pb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1.5, display: "block" }}>
              Accounts
            </Typography>
            <Box
              onClick={() => { handleUserMenuClose(); router.push('/profile'); }}
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", "&:hover": { opacity: 0.8 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar 
                  alt={user?.firstName || ""} 
                  src={user?.attachment ? `${API_URL}/api/users/attachment/${user.attachment.picId}` : ""} 
                  sx={{ width: 44, height: 44 }} 
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                    {user?.firstName + " " + user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
              <ChevronRight fontSize="small" sx={{ color: "text.secondary" }} />
            </Box>
          </Box>
          <Divider />

          {/* Settings Section */}
          <Box sx={{ py: 1 }}>
            {user?.role?.name !== "supervisor" && (
              <MenuItem sx={{ py: 1.2, px: 2 }} onClick={() => { handleUserMenuClose(); router.push('/my-events'); }}>
                <ListItemIcon><ShoppingCartOutlined fontSize="small" sx={{ color: "text.primary" }} /></ListItemIcon>
                <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>Events history</Typography>
              </MenuItem>
            )}
            <MenuItem sx={{ py: 1.2, px: 2 }} onClick={() => { handleUserMenuClose(); setIsChangePasswordOpen(true); }}>
              <ListItemIcon><LockOutlined fontSize="small" sx={{ color: "text.primary" }} /></ListItemIcon>
              <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>Change password</Typography>
              <ChevronRight fontSize="small" sx={{ color: "text.secondary" }} />
            </MenuItem>
            <MenuItem sx={{ py: 1.2, px: 2 }} onClick={() => { handleUserMenuClose(); router.push('/settings'); }}>
              <ListItemIcon><SettingsOutlined fontSize="small" sx={{ color: "text.primary" }} /></ListItemIcon>
              <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>Settings</Typography>
            </MenuItem>
          </Box>
          <Divider />

          {/* Logout */}
          <Box sx={{ py: 1 }}>
            <MenuItem onClick={handleLogout} sx={{ py: 1.2, px: 2 }}>
              <ListItemIcon><LogoutOutlined fontSize="small" sx={{ color: "text.primary" }} /></ListItemIcon>
              <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>Log out</Typography>
            </MenuItem>
          </Box>
        </Menu>
      </Toolbar>

      <Modal
        isOpen={isChangePasswordOpen}
        handleClose={() => setIsChangePasswordOpen(false)}
        title="Change Password"
        size="small"
      >
        <ChangePassword handleClose={() => setIsChangePasswordOpen(false)} />
      </Modal>
    </AppBar>
  );
};

export default Header;

{/* <MenuItem sx={{ py: 1.2, px: 2 }}>
              <ListItemIcon><BrightnessMediumOutlined fontSize="small" sx={{ color: "text.primary" }} /></ListItemIcon>
              <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>Theme</Typography>
              <ChevronRight fontSize="small" sx={{ color: "text.secondary" }} />
            </MenuItem> 
             <MenuItem sx={{ py: 1.2, px: 2 }}>
              <ListItemIcon><GridViewOutlined fontSize="small" sx={{ color: "text.primary" }} /></ListItemIcon>
              <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}>
                Advanced tools
                <Box component="span" sx={{ bgcolor: "rgba(0,0,0,0.06)", color: "text.primary", px: 0.8, py: 0.2, borderRadius: "6px", fontSize: "0.65rem", fontWeight: 700 }}>
                  Beta
                </Box>
              </Typography>
              <ChevronRight fontSize="small" sx={{ color: "text.secondary" }} />
            </MenuItem> 
            <MenuItem sx={{ py: 1.2, px: 2 }}>
              <ListItemIcon><WorkOutline fontSize="small" sx={{ color: "text.primary" }} /></ListItemIcon>
              <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>Plans and pricing</Typography>
            </MenuItem>
            
            Apps Section
  < Box sx = {{ py: 1 }}>
    <MenuItem sx={{ py: 1.2, px: 2 }}>
      <ListItemIcon><MonitorOutlined fontSize="small" sx={{ color: "text.primary" }} /></ListItemIcon>
      <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>Get the Canva Apps</Typography>
    </MenuItem>
          </Box >
  <Divider /> */}