"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Toolbar,
  Tooltip,
  Button,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { EnhancedTable } from "@/components/table/EnhancedTable";

import { CustomModal as Modal } from "@/components/ui/modal";
import UserDelete from "./UserDelete";
import { UserRow } from "./user-type";

type Order = "asc" | "desc";

type ApiUser = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  updatedAt: string;
};

type Column<T> = {
  id: keyof T;
  label: string;
};

type UserListingProps = {
  order: Order;
  orderBy: keyof UserRow;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  setOrderBy: React.Dispatch<React.SetStateAction<keyof UserRow>>;
}

export const UserListing = ({ order, orderBy, setOrder, setOrderBy }: UserListingProps) => {
  const { data, error, isLoading, mutate } = useSWR("/api/users");


  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<{ id: string; type: string }>({ id: "", type: "" });


  const router = useRouter();

  const columns: Column<UserRow>[] = [
    { id: "fullName", label: "Full Name" },
    { id: "email", label: "Email" },
    { id: "isActive", label: "Status", },
    { id: "verification", label: "Verification", },
  ];

  const parsedData: UserRow[] = data?.payload?.map((item: ApiUser) => {
    return {
      id: item.userId,
      fullName: `${item.firstName} ${item.lastName}`,
      email: item.email,
      isActive: item.isActive,
      verification: item.isSuperAdmin,
    };
  });

  const handleOpen = (_event: React.MouseEvent<HTMLButtonElement>, type: string, uid: string) => {
    setOpen(true);
    setModalInfo({ id: uid, type: type });
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleMutate = () => {
    mutate();
  };


  const handleViewDetails = (userId: string) => {
    router.push(`/users/${userId}/view`);
  };

  if (isLoading) return (
    <Box id="user-listing-loading" sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box id="user-listing-error" sx={{ p: 4 }}>
      <Typography color="error">Error loading users. Please check if the server is running.</Typography>
    </Box>
  );

  return (
    <Box id="user-listing-container" sx={{ width: "100%" }}>
      <Paper id="main-table-paper" sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Toolbar
          id="user-listing-toolbar"
          sx={{
            pl: { sm: 2 },
            p: { xs: 2, sm: 2 },
            ...(selected.length > 0 && {
              bgcolor: (theme) => `rgba(var(--primary-rgb), ${theme.palette.action.activatedOpacity})`,
            }),
          }}
        >
          <Typography sx={{ flex: "1 1 100%", fontWeight: 600, marginLeft: 1 }} variant="h6" component="div">
            Users Management
          </Typography>

          <Tooltip title="Add">
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => router.push('/users/create')} sx={{ borderRadius: 2 }}>
              Add
            </Button>
          </Tooltip>
        </Toolbar>

        <EnhancedTable
          rows={parsedData}
          columns={columns}
          idField="id"
          selected={selected}
          setSelected={setSelected}
          page={page}
          setPage={setPage}
          order={order}
          orderBy={orderBy}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          handleOpen={handleOpen}
          handleViewDetails={handleViewDetails}
          mainCol="fullName"
        />
      </Paper>
      {modalInfo?.type === "delete" && (
        <Modal
          isOpen={open}
          handleClose={handleClose}
          title="Delete User"
        >
          <UserDelete
            handleClose={handleClose}
            uid={[modalInfo.id]}
            mutate={handleMutate}
          />
        </Modal>
      )}
    </Box>
  );
};
