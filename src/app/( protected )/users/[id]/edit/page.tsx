"use client";

import { use } from "react";
import { UserForm } from "@/components/users/UserForm";
import { Box } from "@mui/material";


export default function UserEditPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const uid = use(params).id;

  return (
    <Box>
      <UserForm uid={uid} />
    </Box>
  );
}
