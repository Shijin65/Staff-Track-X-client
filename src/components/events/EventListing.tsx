/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
  Checkbox,
  IconButton,
  Button
} from "@mui/material";
import { DeleteOutline as DeleteIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { EnhancedTable, Column } from "@/components/table/EnhancedTable";
import { CustomModal as Modal, GroupSkeleton, ErrorCard } from "@/components/ui";
import { useAuthUser, useWindowSize } from "@/lib/hooks";
import { EventPayload, EventRow, Order } from "./event-type";
import EventDelete from "./EventDelete";

interface EventListingProps {
  order: "asc" | "desc";
  orderBy: string;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  setOrderBy: React.Dispatch<React.SetStateAction<keyof EventRow>>
  query: string;
}

const columns: Column<EventRow>[] = [
  { id: "title", label: "Event Title" },
  { id: "eventDate", label: "Date" },
  { id: "eventVenue", label: "Venue" },
  { id: "status", label: "Status" },
  {
    id: "id" as any,
    label: "Staffing",
    render: (row) => {
      const required = row.staffRequirementCount || 0;
      const confirmed = row.confirmedStaffCount || 0;
      const progress = required > 0 ? (confirmed / required) * 100 : 0;
      return (
        <Box sx={{ width: "100%", minWidth: 100 }}>
          <Typography variant="caption" fontWeight={700} sx={{ mb: 0.5, display: "block" }}>
            {confirmed} / {required}
          </Typography>
          <Box sx={{ width: "100%", height: 4, bgcolor: "divider", borderRadius: 2, overflow: "hidden" }}>
            <Box
              sx={{
                width: `${Math.min(progress, 100)}%`,
                height: "100%",
                bgcolor: progress >= 100 ? "success.main" : "primary.main",
              }}
            />
          </Box>
        </Box>
      );
    }
  },
];

export const EventListing = ({
  order,
  orderBy,
  setOrder,
  setOrderBy,
  query,
}: EventListingProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = useState(1);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  let limit = 12;
  const { height } = useWindowSize();
  limit = height === 0 ? limit : Math.floor((height - 380) / 43);

  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<{ id: string[]; type: string }>({ id: [], type: "" });

  const router = useRouter();
  const { user } = useAuthUser();
  const canDeleteEvent = user?.availableAccess?.DeleteEvent;

  // Desktop Table Data Fetching
  const { data: tableData, error: tableError, isLoading: tableLoading, mutate: tableMutate } = useSWR(
    !isMobile ? `/api/events?Page=${page}&Limit=${limit}&SortOrder=${order}&SortBy=${orderBy}&Search=${encodeURIComponent(query)}` : null
  );

  // Mobile Infinite Scrolling Data Fetching
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!isMobile) return null;
    if (previousPageData && !previousPageData.payload?.length) return null; // Reached the end
    return `/api/events?Page=${pageIndex + 1}&Limit=${limit}&SortOrder=${order}&SortBy=${orderBy}&Search=${encodeURIComponent(query)}`;
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

  const mapEventToRow = (item: EventPayload): EventRow => ({
    id: item.eventId,
    title: item.title,
    eventDate: item.eventDate || "",
    eventVenue: item.eventVenue || "",
    status: item.status || "",
    staffRequirementCount: item.staffRequirementCount,
    confirmedStaffCount: item.confirmedStaffCount,
  });

  const parsedData: EventRow[] = !isMobile
    ? (tableData?.payload?.map(mapEventToRow) || [])
    : (infiniteData ? infiniteData.flatMap(pageData => pageData?.payload?.map(mapEventToRow) || []) : []);

  const handleOpen = async (_event: React.MouseEvent<HTMLButtonElement>, type: string, id: string[]) => {
    if (type === "edit") {
      router.push(`/events/${id[0]}/edit`);
    } else {
      setModalInfo({ id, type });
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

  const handleViewDetails = (eventId: string) => {
    router.push(`/events/${eventId}/view`);
  };

  // Helper function to format the Date badge
  const renderDateBadge = (dateStr: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });

    // Check if event is today or past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);

    let isToday = false;
    let bgcolor = "rgba(var(--primary-rgb), 0.1)";
    let color = "primary.main";
    let border = "1px solid rgba(var(--primary-rgb), 0.2)";

    if (eventDate.getTime() === today.getTime()) {
      isToday = true;
      bgcolor = "primary.main";
      color = "primary.contrastText";
      border = "none";
    } else if (eventDate.getTime() < today.getTime()) {
      bgcolor = "rgba(0,0,0,0.05)";
      color = "text.secondary";
      border = "1px solid rgba(0,0,0,0.1)";
    }

    return (
      <Box sx={{ position: 'relative' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor,
          color,
          border,
          borderRadius: 2,
          minWidth: 50,
          height: 56,
          boxShadow: isToday ? '0 4px 12px rgba(var(--primary-rgb), 0.3)' : 'none',
        }}>
          <Typography variant="h6" fontWeight={800} lineHeight={1}>{day}</Typography>
          <Typography variant="caption" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>{month}</Typography>
        </Box>
        {isToday && (
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 14,
              height: 14,
              bgcolor: 'error.main',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'background.paper',
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
                '70%': { boxShadow: '0 0 0 6px rgba(239, 68, 68, 0)' },
                '100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
              }
            }}
          />
        )}
      </Box>
    );
  };

  // Status mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'upcoming': return 'primary';
      default: return 'default';
    }
  };

  if (isLoading) return (
    <GroupSkeleton rowsNum={3} />
  );

  if (error) return (
    <ErrorCard
      message={error?.response?.data?.message || "We encountered an error while fetching the events. Please try again."}
      onRetry={() => mutate()}
    />
  );

  return (
    <Box id="event-listing-container" sx={{ width: "100%", px: 2 }}>
      {!isMobile ? (
        <EnhancedTable
          rows={parsedData}
          columns={columns}
          idField="id"
          selected={selected}
          setSelected={setSelected}
          page={page}
          setPage={setPage}
          handleViewDetails={handleViewDetails}
          mainCol="title"
          limit={limit}
          totalPages={data?.metaData?.totalPages || 1}
          totalItems={data?.metaData?.totalCount || 0}
          setOrder={setOrder}
          setOrderBy={setOrderBy as any}
          hasSelection={true}
          orderBy={orderBy as keyof EventRow}
          order={order}
        />
      ) : (
        <Box sx={{ width: "100%" }}>
          {/* Mobile Actions Header */}
          {parsedData.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, px: 0.5 }}>
              {!isSelectionMode && <Typography variant="subtitle1" fontWeight={600} color="text.secondary" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
                {data?.metaData?.totalCount || 0} Events Found
              </Typography>}

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
            {parsedData.map((eventRow) => (
              <Card
                key={eventRow.id}
                onClick={() => handleViewDetails(eventRow.id)}
                sx={{
                  p: .80,
                  display: "flex",
                  alignItems: "center",
                  gap: isSelectionMode ? 1 : 2,
                  cursor: "pointer",
                  borderRadius: 3,
                  boxShadow: selected.includes(eventRow.id) ? "0 4px 12px rgba(var(--primary-rgb), 0.15)" : "0 2px 10px rgba(0,0,0,0.04)",
                  border: "1px solid",
                  borderColor: selected.includes(eventRow.id) ? "primary.main" : "divider",
                  bgcolor: selected.includes(eventRow.id) ? "rgba(25, 118, 210, 0.04)" : "background.paper",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: selected.includes(eventRow.id) ? "rgba(25, 118, 210, 0.08)" : "rgba(25, 118, 210, 0.02)",
                  }
                }}
              >
                {canDeleteEvent && isSelectionMode && (
                  <Checkbox
                    size="small"
                    checked={selected.includes(eventRow.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSelected(prev => e.target.checked ? [...prev, eventRow.id] : prev.filter(id => id !== eventRow.id));
                    }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ p: 0.5 }}
                  />
                )}

                {renderDateBadge(eventRow.eventDate)}

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {eventRow.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="flex" alignItems="center" gap={0.5}>
                    {eventRow.eventVenue}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Box sx={{ flexGrow: 1, height: 4, bgcolor: "divider", borderRadius: 2, overflow: "hidden", maxWidth: 100 }}>
                      <Box
                        sx={{
                          width: `${Math.min(((eventRow.confirmedStaffCount || 0) / (eventRow.staffRequirementCount || 1)) * 100, 100)}%`,
                          height: "100%",
                          bgcolor: (eventRow.confirmedStaffCount || 0) >= (eventRow.staffRequirementCount || 0) && (eventRow.staffRequirementCount || 0) > 0 ? "success.main" : "primary.main",
                        }}
                      />
                    </Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary">
                      {eventRow.confirmedStaffCount || 0}/{eventRow.staffRequirementCount || 0}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pr: isSelectionMode ? 2 : 0 }}>
                  {eventRow.status && (
                    <Chip
                      size="small"
                      label={eventRow.status}
                      color={getStatusColor(eventRow.status) as any}
                      sx={{ fontSize: "0.65rem", height: 20, textTransform: 'capitalize' }}
                    />
                  )}
                  {canDeleteEvent && !isSelectionMode && (
                    <IconButton
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen(e as any, "delete", [eventRow.id]);
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
          title="Delete Event"
          size="small"
        >
          <EventDelete
            handleClose={handleClose}
            uid={modalInfo.id}
            mutate={handleMutate}
          />
        </Modal>
      )}
    </Box>
  );
};
