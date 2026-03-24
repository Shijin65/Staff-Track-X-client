"use client";

import React from "react";
import Image from "next/image";
import { Box, Typography } from "@mui/material";

export default function AuthLayout({ children }: { children: React.ReactNode }) {

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Header / Background Background (Fixed/Absolute on mobile, Side panel on desktop) */}
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          position: { xs: "absolute", md: "relative" },
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: { xs: "100vh", md: "auto" },
          width: { xs: "100%", md: "50%" },
          zIndex: 0,
          overflow: "hidden",
          order: { xs: 1, md: 2 }, // Last on desktop
        }}
      >
        {/* Mobile Background Image (Controlled via CSS) */}
        <Box sx={{ display: { xs: "block", md: "none" }, position: "absolute", inset: 0 }}>
          <Image
            src="/blue_modern_abstract_background.svg"
            alt="Mobile Background"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </Box>

        {/* Desktop Background Image (Controlled via CSS) */}
        <Box sx={{ display: { xs: "none", md: "block" }, position: "absolute", inset: 0 }}>
          <Image
            src="/management_background.svg"
            alt="Desktop Background"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </Box>

        {/* Gradient overlays based on screen size */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: {
              xs: "linear-gradient(180deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)",
              md: "linear-gradient(225deg, rgba(0,0,0,0.5) 0%, transparent 100%)", // Slant gradient towards the right side
            },
          }}
        />
        {/* Desktop Specific Content Panel */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            position: "relative",
            zIndex: 10,
            p: 5,
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
            width: "100%",
          }}
        >
          <Image src="/next.svg" alt="Logo" width={180} height={80} style={{ marginBottom: 24 }} priority />
          <Typography variant="h3" fontWeight={700} color="white" lineHeight={1.2}>
            Elevate Your Business
            <br />
            Management Experience
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.8)" sx={{ mt: 2, maxWidth: 420 }}>
            Powerful, simple, and built to scale your organization with ease.
          </Typography>
        </Box>
      </Box>

      {/* Login form content area (layered on top) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: { xs: "flex-end", md: "center" }, // Bottom align on mobile
          justifyContent: "center",
          zIndex: 5,
          position: "relative",
          minHeight: "100vh",
          p: { xs: 0, md: 6 },
          order: { xs: 2, md: 1 }, // First on desktop
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 440, p: { xs: 0, md: 0 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}