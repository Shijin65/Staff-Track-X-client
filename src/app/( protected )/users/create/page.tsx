"use client";

import { useRouter } from "next/navigation";
import { UserForm } from "@/components/user/UserForm";
import { Box } from "@mui/material";


export default function UserCreatePage() {
  const router = useRouter();

  return (
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh' }}>
      <UserForm />
    </Box>);
}
