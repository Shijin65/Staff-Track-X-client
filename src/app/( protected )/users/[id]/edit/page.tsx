"use client";

import { useParams } from "next/navigation";
import { UserForm } from "@/components/user/UserForm";
import { Box } from "@mui/material";


export default function UserEditPage() {
  const params = useParams();
  const uid = params.id as string;


  return (
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh' }}>
      <UserForm uid={uid} />
    </Box>
  );
}
