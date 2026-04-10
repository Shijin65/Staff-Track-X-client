"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { UserListing } from "../../../components/user/UserListing";
import { UserRow } from "@/components/user/user-type";


type Order = "asc" | "desc";

export default function UserPage() {

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof UserRow>("fullName");
  return (
    <Box sx={{ mt: 2 }}>
      <UserListing order={order} orderBy={orderBy} setOrder={setOrder} setOrderBy={setOrderBy} />
    </Box>
  );
}
