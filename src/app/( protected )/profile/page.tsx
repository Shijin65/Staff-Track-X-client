"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Container, CircularProgress, Paper } from "@mui/material";
import { UserForm } from "@/components/user/UserForm";
import { useAxios } from "@/lib/hooks";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const api = useAxios();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/profile/me");
        setUserData(res.data.payload);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [api]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information and account settings
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <UserForm/>
      </Paper>
    </Container>
  );
}
