"use client";

import { UserForm } from "../../../../components/users/UserForm";
import { useAuthContext } from "@/context/auth-provider";
import { Box } from "@mui/material";
import { GroupSkeleton } from "@/components/ui";

export default function ProfileEditPage() {
  const { user } = useAuthContext();
  const userId = user?.user?.userId;

  if (!userId) {
    return (
      <GroupSkeleton rowsNum={2} />
    );
  }

  return (
    <Box>
      <UserForm uid={userId} isProfile={true} />
    </Box>
  );
}
