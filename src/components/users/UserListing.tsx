/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  Avatar,
  Typography,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
  Checkbox,
  IconButton,
  Button,
  Badge
} from "@mui/material";
import { DeleteOutline as DeleteIcon, Verified as VerifiedIcon } from "@mui/icons-material";
import { API_URL } from "@/lib/utils/constance";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { EnhancedTable } from "@/components/table/EnhancedTable";
import UserDelete from "./UserDelete";

import { CustomModal as Modal, GroupSkeleton, ErrorCard } from "@/components/ui";
import { ApiUser, UserRow } from "./user-type";
import { useAuthUser, useWindowSize } from "@/lib/hooks";
import { useTablePageReset } from "@/lib/hooks/useTablePageReset";


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
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  let limit = 12;
  const { height } = useWindowSize();
  limit = height === 0 ? limit : Math.floor((height - 380) / 48);

  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<{ id: string[]; type: string }>({ id: [], type: "" });

  // Desktop Table Data Fetching
  const { data: tableData, error: tableError, isLoading: tableLoading, mutate: tableMutate } = useSWR(
    !isMobile ? `/api/users?Page=${page}&Limit=${limit}&Order=${order}&OrderBy=${orderBy}&SearchQuery=${encodeURIComponent(query)}` : null
  );

  // Mobile Infinite Scrolling Data Fetching
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!isMobile) return null;
    if (previousPageData && !previousPageData.payload?.length) return null; // Reached the end
    return `/api/users?Page=${pageIndex + 1}&Limit=${limit}&Order=${order}&OrderBy=${orderBy}&SearchQuery=${encodeURIComponent(query)}`;
  };
  const { data: infiniteData, error: infiniteError, size, setSize, isLoading: infiniteLoading, mutate: infiniteMutate, isValidating } = useSWRInfinite(getKey);

  const data = !isMobile ? tableData : infiniteData?.[0]; // Use first page's metadata for counts
  const isLoading = !isMobile ? tableLoading : infiniteLoading;
  const error = !isMobile ? tableError : infiniteError;
  const mutate = !isMobile ? tableMutate : infiniteMutate;

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isMobile) {
          const totalPages = infiniteData?.[0]?.metaData?.totalPages || 1;
          if (size < totalPages && !isValidating) {
            setSize(size + 1);
          }
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [size, infiniteData, isValidating, isMobile, setSize]);

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

  const mapUserToRow = (item: ApiUser): UserRow => ({
    id: item.userId,
    fullName: `${item.firstName} ${item.lastName}`,
    email: item.email,
    isActive: item.isActive,
    isVerified: item.isVerified,
    attachment: item.attachment,
    role: { roleId: item.role?.roleId as string, title: item.role?.title as string },
  });

  const parsedData: UserRow[] = !isMobile
    ? (tableData?.payload?.map(mapUserToRow) || [])
    : (infiniteData ? infiniteData.flatMap(pageData => pageData?.payload?.map(mapUserToRow) || []) : []);

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
    setIsSelectionMode(false);
    setSelected([]);
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
        <Box sx={{ pb: 2, px: 1 }}>
          {canDeleteUser && (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              {isSelectionMode ? (
                <>
                  <Typography variant="subtitle2">{selected.length} selected</Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setIsSelectionMode(false);
                        setSelected([]);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={(e) => handleOpen(e as any, "delete", selected)}
                      disabled={selected.length === 0}
                    >
                      Delete
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setIsSelectionMode(true)}
                  >
                    Select
                  </Button>
                </Box>
              )}
            </Box>
          )}
          <Stack spacing={2} sx={{ mb: 2 }}>
            {parsedData.map((userRow) => (
              <Card
                key={userRow.id}
                onClick={() => handleViewDetails(userRow.id)}
                sx={{
                  p: .80,
                  display: "flex",
                  alignItems: "center",
                  gap: isSelectionMode ? 1 : 2,
                  cursor: "pointer",
                  borderRadius: 3,
                  boxShadow: selected.includes(userRow.id) ? "0 4px 12px rgba(var(--primary-rgb), 0.15)" : "0 2px 10px rgba(0,0,0,0.04)",
                  border: "1px solid",
                  borderColor: selected.includes(userRow.id) ? "primary.main" : "divider",
                  bgcolor: selected.includes(userRow.id) ? "rgba(25, 118, 210, 0.04)" : "background.paper",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: selected.includes(userRow.id) ? "rgba(25, 118, 210, 0.08)" : "rgba(25, 118, 210, 0.02)",
                  }
                }}
              >
                {canDeleteUser && isSelectionMode && (
                  <Checkbox
                    size="small"
                    checked={selected.includes(userRow.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSelected(prev => e.target.checked ? [...prev, userRow.id] : prev.filter(id => id !== userRow.id));
                    }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ p: 0.5 }}
                  />
                )}
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  color={userRow.isActive ? "success" : "error"}
                  sx={{
                    "& .MuiBadge-badge": {
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      border: "2px solid background.paper"
                    }
                  }}
                >
                  <Avatar
                    src={userRow.attachment?.picId ? `${API_URL}/api/users/attachment/${userRow.attachment.picId}` : ""}
                    alt={userRow.fullName}
                    sx={{ width: 40, height: 40 }}
                  >
                    {userRow.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {userRow.fullName}
                    {userRow.isVerified && <VerifiedIcon color="primary" sx={{ fontSize: 16 }} />}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {userRow.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pr: isSelectionMode ? 2 : 0 }}>
                  {userRow.role && (
                    <Chip
                      size="small"
                      label={userRow.role?.title.replace(/_/g, ' ')}
                      sx={{ fontSize: "0.65rem", height: 20, textTransform: 'capitalize' }}
                    />
                  )}
                  {canDeleteUser && !isSelectionMode && (
                    <IconButton
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen(e as any, "delete", [userRow.id]);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Card>
            ))}
          </Stack>
          <div ref={observerTarget} style={{ height: "20px" }}></div>
          {isValidating && size > 1 && (
            <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mt: 1 }}>
              Loading more...
            </Typography>
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
