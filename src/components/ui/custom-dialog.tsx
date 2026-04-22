"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  headerContent?: React.ReactNode;
  subTitle?: string;
}

export const CustomDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "md",
  fullWidth = true,
  headerContent,
  subTitle
}: CustomDialogProps) => {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3 }
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>{title}</Typography>
          {subTitle && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {subTitle}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small" sx={{
          color: 'text.secondary',
          bgcolor: 'rgba(0,0,0,0.04)',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' }
        }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {headerContent && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1, sm: 2 } }}>
          {headerContent}
        </Box>
      )}

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'rgba(0,0,0,0.01)' }}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ p: { xs: 1, sm: 2.5 }, gap: 1 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};
