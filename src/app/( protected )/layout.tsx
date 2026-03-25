"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar visible on tablet and desktop, hidden on mobile */}
      <Sidebar />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}>
          {children}
        </Box>
        <BottomNav />
      </Box>
    </Box>
  );
}