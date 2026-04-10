"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { UserListing } from "../../../components/user/UserListing";


type Order = "asc" | "desc";

type UserRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: string;
  verification: string;
}; 

export default function UserPage() {
  
    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<keyof UserRow>("firstName");
  return (
    <Box sx={{ mt: 2 }}>
      <UserListing  order={order} orderBy={orderBy} setOrder={setOrder} setOrderBy={setOrderBy}/>
    </Box>
  );
}
