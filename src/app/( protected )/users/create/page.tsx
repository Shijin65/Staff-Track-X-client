"use client";

import React from "react";
import { Container, Typography, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { UserCreateForm } from "@/components/user/UserCreateForm";
import { useAxios } from "@/lib/hooks/useAxios";
import { useSWRConfig } from "swr";


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
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ 
        height: 180, 
        bgcolor: '#f1f5f9', // Light gray background to match image
        pt: 2,
        px: { xs: 0, md: 5 },
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' ,width:"100"}}>
            <IconButton 
              onClick={() => router.push('/users')}
              sx={{ 
                bgcolor: '#e2e8f0', 
                color: '#1e293b', 
                '&:hover': { bgcolor: '#cbd5e1' },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ opacity: 0.8 }}>
              Create Staff Profile
            </Typography>

            <Box sx={{ width: 45 }} /> {/* Spacer to center or balance */}
          </Box>
        </Container>
      </Box>

      {/* Form Section */}
      <Container maxWidth="lg" sx={{ mt: -6, pb: 8 }}>
        <UserCreateForm onSubmit={handleCreateUser} onCancel={() => router.push('/users')} />
      </Container>
    </Box>
  );
}
