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
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          position: { xs: "absolute", md: "relative" },
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: { xs: "100dvh", md: "auto" },
          width: { xs: "100%", md: "50%" },
          zIndex: 0,
          overflow: "hidden",
          order: { xs: 1, md: 2 },
        }}
      >
        <Box sx={{ display: { xs: "block", md: "none" }, position: "absolute", inset: 0 }}>
          <Image
            src="/blue_modern_abstract_background.svg"
            alt="Mobile Background"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </Box>

        <Box sx={{ display: { xs: "none", md: "block" }, position: "absolute", inset: 0 }}>
          <Image
            src="/management_background.svg"
            alt="Desktop Background"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: {
              xs: "linear-gradient(180deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)",
              md: "linear-gradient(225deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
            },
          }}
        />
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
          <Image src="/ch_logo.svg" alt="Logo" width={280} height={80} style={{ marginBottom: 24 }} priority />
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

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: { xs: "flex-end", md: "center" },
          justifyContent: "center",
          zIndex: 5,
          position: "relative",
          height: "100dvh",
          p: { xs: 0, md: 6 },
          order: { xs: 2, md: 1 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 440, p: { xs: 0, md: 0 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}