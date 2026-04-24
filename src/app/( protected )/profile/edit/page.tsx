"use client";

import React from "react";
import { UserForm } from "../../users/components/UserForm";
import { useAuthContext } from "@/context/auth-provider";
import { Box, Container, Skeleton } from "@mui/material";

export default function ProfileEditPage() {
  const { user } = useAuthContext();
  const userId = user?.user?.userId;

  if (!userId) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
      </Container>
    );
  }

  return (
    <Box>
      <UserForm uid={userId} isProfile={true} />
    </Box>
  );
}
