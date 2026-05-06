"use client";

import { Box, Container } from "@mui/material";
import { ModuleTitle } from "@/components/ui";
import { Schedule } from "@mui/icons-material";
import { LiveEventsList } from "@/components/live-events/LiveEventsList";

export default function LiveEventsPage() {
  return (
    <Box sx={{ px: { xs: 2, xl: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <ModuleTitle title="Events Check-In" icon={<Schedule />} />
      </Box>
      <LiveEventsList />
    </Box>
  );
}
