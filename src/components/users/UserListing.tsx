"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Card,
  Avatar,
  Typography,
  Stack,
  Chip,
  Pagination,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { API_URL } from "@/lib/utils/constance";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { EnhancedTable } from "@/components/table/EnhancedTable";

import { CustomModal as Modal } from "@/components/ui/modal";
import UserDelete from "./UserDelete";
import { ApiUser, UserRow } from "./user-type";
import { useAuthUser, useWindowSize } from "@/lib/hooks";
import { useTablePageReset } from "@/lib/hooks/useTablePageReset";
import { GroupSkeleton, ErrorCard } from "@/components/ui";


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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = useState(1);

  let limit = 17;
  const { height } = useWindowSize();
  limit = height === 0 ? limit : Math.floor((height - 380) / 43);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/users?Page=${page}&Limit=${limit}&Order=${order}&OrderBy=${orderBy}&SearchQuery=${encodeURIComponent(
      query
    )}`
  );

  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<{ id: string[]; type: string }>({ id: [], type: "" });

  const router = useRouter();
  const { user } = useAuthUser();
  const canDeleteUser = user?.availableAccess?.DeleteUser;
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
      attachment: item.attachment,
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
    <GroupSkeleton rowsNum={3} />
  );

  if (error) return (
    <ErrorCard
      message={error?.response?.data?.message || "We encountered an error while fetching the user list. Please try again."}
      onRetry={() => mutate()}
    />
  );

  return (
    <Box id="user-listing-container" sx={{ width: "100%" }}>
      {!isMobile ? (
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
      ) : (
        <Box sx={{ pb: 2 ,px:1 }}>
          <Stack spacing={2} sx={{ mb: 2 }}>
            {parsedData.map((userRow) => (
              <Card
                key={userRow.id}
                onClick={() => handleViewDetails(userRow.id)}
                sx={{
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                  borderRadius: 3,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Avatar
                  src={userRow.attachment?.picId ? `${API_URL}/api/users/attachment/${userRow.attachment.picId}` : ""}
                  alt={userRow.fullName}
                  sx={{ width: 48, height: 48 }}
                >
                  {userRow.fullName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>
                    {userRow.fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {userRow.email}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip
                      size="small"
                      label={userRow.isActive ? "Active" : "Inactive"}
                      color={userRow.isActive ? "success" : "default"}
                      sx={{ fontSize: "0.65rem", height: 18 }}
                    />
                    <Chip
                      size="small"
                      label={userRow.isVerified ? "Verified" : "Unverified"}
                      color={userRow.isVerified ? "primary" : "warning"}
                      sx={{ fontSize: "0.65rem", height: 18 }}
                    />
                  </Stack>
                </Box>
              </Card>
            ))}
          </Stack>
          {data?.metaData?.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={data.metaData.totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
                size="small"
              />
            </Box>
          )}
        </Box>
      )}

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
