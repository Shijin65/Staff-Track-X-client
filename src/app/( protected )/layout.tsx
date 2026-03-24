"use client";

import Header from "@/components/Header";
import { useAuthUser } from "@/lib/hooks/useAuthUser";
import { Box, Backdrop, CircularProgress } from "@mui/material";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthUser({
    redirectIfFound: true,
    isLandingPage: true,
  });

  if (!user) {
    return (
      <Backdrop open sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      {children}
    </Box>
  );
}