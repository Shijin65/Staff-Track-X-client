"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 10, md: 15 },
        textAlign: "center",
        px: 3,
      }}
    >
      <Box
        sx={{
          mb: 3,
          color: "text.disabled",
          opacity: 0.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& svg": { fontSize: 40 },
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{ mb: 1, color: "text.primary", letterSpacing: "-0.01em" }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 320, mx: "auto", lineHeight: 1.6, fontWeight: 500 }}
      >
        {description}
      </Typography>
    </Box>
  );
};
