"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Toolbar,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Add as AddIcon,
} from "@mui/icons-material";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { EnhancedTable } from "@/components/table/EnhancedTable";

import { CustomModal as Modal } from "@/components/ui/modal";
import UserDelete from "./UserDelete";
import { ApiUser, UserRow } from "./user-type";
import { useAuthUser, useWindowSize } from "@/lib/hooks";
import { useTablePageReset } from "@/lib/hooks/useTablePageReset";
import { TableLoaderSkeleton, ErrorCard } from "@/components/ui";


type Order = "asc" | "desc";



type Column<T> = {
  id: keyof T;
  label: string;
};

type UserListingProps = {
  order: Order;
  orderBy: keyof UserRow;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  setOrderBy: React.Dispatch<React.SetStateAction<keyof UserRow>>;
  query: string;
}

export const UserListing = ({ order, orderBy, setOrder, setOrderBy, query }: UserListingProps) => {
  const [page, setPage] = useState(1);

  let limit = 17;
  const { height } = useWindowSize();
  limit = height === 0 ? limit : Math.floor((height - 380) / 43);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/users?Page=${page}&Limit=${limit}&Order=${order}&OrderBy=${orderBy}&Search=${encodeURIComponent(
      query
    )}`
  );

  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<{ id: string[]; type: string }>({ id: [], type: "" });

  const router = useRouter();
  const {user} = useAuthUser();
  console.log(user);
  const canCreateUser = user?.availableAccess?.CreateUser;
  const canDeleteUser = user?.availableAccess?.DeleteUser;
  const canUpdateUser = user?.availableAccess?.UpdateUser;
  const canViewUser = user?.availableAccess?.ViewUser;

  const columns: Column<UserRow>[] = [
    { id: "fullName", label: "Full Name" },
    { id: "email", label: "Email" },
    { id: "isActive", label: "Status", },
    { id: "isVerified", label: "Verification", },
  ];

  const parsedData: UserRow[] = data?.payload?.map((item: ApiUser) => {
    return {
      id: item.userId,
      fullName: `${item.firstName} ${item.lastName}`,
      email: item.email,
      isActive: item.isActive,
      isVerified: item.isVerified,
    };
  });

  const handleOpen = async (_event: React.MouseEvent<HTMLButtonElement>, type: string, uid: string[]) => {
    if (type === "edit") {
      router.push(`/users/${uid}/edit`);
    } else {
      setModalInfo({ id: uid, type });
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setModalInfo({ id: [], type: "" });
  };


  const handleMutate = () => {
    mutate();
  };


  const handleViewDetails = (userId: string) => {
    router.push(`/users/${userId}/view`);
  };


  useTablePageReset(data?.metaData?.itemCount, query, setPage, page, [query]);

  if (isLoading) return (
    <TableLoaderSkeleton rowsNum={3} />
  );

  if (error) return (
    <ErrorCard
      message={error?.response?.data?.message || "We encountered an error while fetching the user list. Please try again."}
      onRetry={() => mutate()}
    />
  );



  return (
    <Box id="user-listing-container" sx={{ width: "100%" }}>
      <Paper id="main-table-paper" sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Toolbar
          id="user-listing-toolbar"
          sx={{
            pl: { sm: 2 },
            p: { xs: 2, sm: 2 },
          }}
        >
          <Typography sx={{ flex: "1 1 100%", fontWeight: 600, marginLeft: 1 }} variant="h6" component="div">
            Users Management
          </Typography>

          {canCreateUser && <Tooltip title="Add">
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => router.push('/users/create')} sx={{ borderRadius: 2 }}>
              Add
            </Button>
          </Tooltip>}
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
          limit={limit}
          totalPages={data?.metaData?.totalPages || 1}
          totalItems={data?.metaData.totalCount || 0}
          canDelete={canDeleteUser}
          canView={canViewUser}
        />
      </Paper>
      {modalInfo?.type === "delete" && (
        <Modal
          isOpen={open}
          handleClose={handleClose}
          title="Delete User"
          size="small"
        >
          <UserDelete
            handleClose={handleClose}
            uid={modalInfo.id}
            mutate={handleMutate}
          />
        </Modal>
      )}
    </Box>
  );
};
