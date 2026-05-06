"use client";

import { useState } from "react";
import { Box, Typography, Button, Tooltip, Paper } from "@mui/material";
import { Add as AddIcon, People } from "@mui/icons-material";
import { UserListing } from "../../../components/users/UserListing";
import { UserRow } from "@/components/users/user-type";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { ModuleTitle, SearchInput } from "@/components/ui";
import { useAuthUser } from "@/lib/hooks";


type Order = "asc" | "desc";

export default function UserPage() {
  const router = useRouter();
  const { user } = useAuthUser();
  const canCreateUser = user?.availableAccess?.CreateUser;

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof UserRow>("fullName");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  return (
    <Box sx={{ px: { xs: 2, xl: 4 } }}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <ModuleTitle title="Users Management" icon={<People />} />

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 250 }}>
              <SearchInput
                value={query}
                setValue={setQuery}
                placeholder="Search users"
                fullWidth
              />
            </Box>
            {canCreateUser && (
              <Tooltip title="Add User">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/users/create')}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Add
                </Button>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 2 }}>
          <SearchInput
            value={query}
            setValue={setQuery}
            placeholder="Search users"
            fullWidth
          />
        </Box>
      </Box>
      <UserListing
        order={order}
        orderBy={orderBy}
        setOrder={setOrder}
        setOrderBy={setOrderBy}
        query={debouncedQuery}
      />
    </Box>

  );
}


