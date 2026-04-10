"use client";

import React from "react";
import { Container, Paper, Typography, Box, IconButton, Breadcrumbs, Link as MuiLink } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { UserCreateForm } from "@/components/user/UserCreateForm";
import { useAxios } from "@/lib/hooks/useAxios";
import { useSWRConfig } from "swr";
import Link from "next/link";

export default function UserCreatePage() {
  const router = useRouter();
  const api = useAxios();
  const { mutate } = useSWRConfig();

  const handleCreateUser = async (formData: unknown) => {
    try {
      await api.post("/api/users", formData);
      mutate("/api/users");
      router.push("/users");
    } catch (err) {
      console.error("Failed to create user", err);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      {/* Header Section */}
      <Box sx={{ 
        height: 200, 
        bgcolor: 'primary.main',
        backgroundImage: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        pt: 6,
        px: { xs: 2, md: 5 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton 
              onClick={() => router.push('/users')}
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={900} color="white" sx={{ letterSpacing: -1 }}>
              Add New Staff
            </Typography>
          </Box>
          <Breadcrumbs sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <MuiLink component={Link} href="/users" color="inherit" underline="hover">Users</MuiLink>
            <Typography color="white" fontWeight={600}>Create</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Form Section */}
      <Container maxWidth="lg" sx={{ mt: -6 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 6 }, 
            borderRadius: 4, 
            boxShadow: '0 24px 48px rgba(0,0,0,0.08)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <UserCreateForm onSubmit={handleCreateUser} onCancel={() => router.push('/users')} />
        </Paper>
      </Container>
    </Box>
  );
}
