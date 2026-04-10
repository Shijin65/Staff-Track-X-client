"use client";

import { SWRConfig } from "swr";
import Header from "@/components/navbar/Header";
import Sidebar from "@/components/navbar/Sidebar";
import BottomNav from "@/components/navbar/BottomNav";
import { useAuthUser } from "@/lib/hooks/useAuthUser";
import { useAxios } from "@/lib/hooks/useAxios";
import { Box, Backdrop, CircularProgress } from "@mui/material";


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const api = useAxios();
  const fetcher = (url: string) => api.get(url).then((res) => res.data);

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
    <SWRConfig value={{ fetcher }}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, md: 2 }, pb: { xs: 10, md: 4 } }}>
            {children}
          </Box>
          <BottomNav />
        </Box>
      </Box>
    </SWRConfig>
  );
}