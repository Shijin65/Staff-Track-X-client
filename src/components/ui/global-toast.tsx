import React from "react";
import {
  CheckCircle,
  Error as ErrorIcon,
  Info,
  Warning,
  Close,
} from "@mui/icons-material";
import { Box, IconButton, Portal, Snackbar, Typography } from "@mui/material";

/* -------------------- TYPES -------------------- */

export type ToastType = "success" | "info" | "error" | "warning";

type GlobalToastProps = {
  open: boolean;
  type: ToastType;
  message: string;
  handleClose: () => void;
};

/* -------------------- CONSTANTS -------------------- */

const colors: Record<ToastType, string> = {
  success: "#2e7d32", // Green 800
  info: "#0277bd",    // Blue 800
  warning: "#e65100", // Orange 900
  error: "#c62828",   // Red 800
};

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle fontSize="small" />,
  info: <Info fontSize="small" />,
  error: <ErrorIcon fontSize="small" />,
  warning: <Warning fontSize="small" />,
};

/* -------------------- COMPONENT -------------------- */

export const GlobalToast: React.FC<GlobalToastProps> = ({
  open,
  type,
  message,
  handleClose,
}) => {
  return (
    <Portal>
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mb: 2, mr: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            bgcolor: colors[type],   // ← dynamic color applied here
            color: "#fff",
            px: 2,
            py: 1.25,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            minWidth: 280,
            maxWidth: 480,
          }}
        >
          <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            {icons[type]}
          </Box>

          <Typography
            variant="body2"
            sx={{ flex: 1, fontWeight: 500, lineHeight: 1.4 }}
          >
            {message}
          </Typography>

          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: "rgba(255,255,255,0.8)", "&:hover": { color: "#fff" } }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
    </Portal>
  );
};