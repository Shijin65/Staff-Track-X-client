"use client";

import React from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/lib/theme/muiTheme";
import { GlobalLoader, GlobalToast } from "@/components/ui";
import { useLoader } from "../store";
import { useToast } from "../store/useToastStore";

export default function AppProvider({ children }: { children: React.ReactNode }) {
    const { loading } = useLoader();
  const { toast, closeToast } = useToast()
  return (
    <MuiThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <GlobalLoader loading={loading} />
      {children}
      <GlobalToast open={toast.open} handleClose={closeToast} message={toast.message} type={toast.type} />
    </MuiThemeProvider>
  );
}
