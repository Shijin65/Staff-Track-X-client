"use client";

import React from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme } from "@/lib/theme/muiTheme";
import { Toaster } from "@/components/ui";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
      <Toaster />
    </MuiThemeProvider>
  );
}
