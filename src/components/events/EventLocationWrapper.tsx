"use client";

import dynamic from "next/dynamic";
import { CircularProgress, Box } from "@mui/material";

export const EventLocationPickerWrapper = dynamic(
  () => import("@/components/ui/EventLocationPicker"),
  { 
    ssr: false, 
    loading: () => (
      <Box sx={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
        <CircularProgress />
      </Box>
    )
  }
);
