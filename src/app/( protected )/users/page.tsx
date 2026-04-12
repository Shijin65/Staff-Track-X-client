"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { UserListing } from "../../../components/user/UserListing";
import { UserRow } from "@/components/user/user-type";
import { useDebounce } from "@/lib/hooks/useDebounce";


type Order = "asc" | "desc";

export default function UserPage() {

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof UserRow>("fullName");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  return (
    <Box sx={{ mt: 2 }}>
      <UserListing order={order} orderBy={orderBy} setOrder={setOrder} setOrderBy={setOrderBy} query={debouncedQuery} />
    </Box>
  );
}
