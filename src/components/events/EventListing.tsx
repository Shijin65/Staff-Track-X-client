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
import { EventCard } from "./EventCard";

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
    !isMobile ? `/api/events?Page=${page}&Limit=${limit}&SortOrder=${order}&SortBy=${orderBy}&SearchQuery=${encodeURIComponent(query)}` : null
  );

  // Mobile Infinite Scrolling Data Fetching
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!isMobile) return null;
    if (previousPageData && !previousPageData.payload?.length) return null; // Reached the end
    return `/api/events?Page=${pageIndex + 1}&Limit=${limit}&SortOrder=${order}&SortBy=${orderBy}&SearchQuery=${encodeURIComponent(query)}`;
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
    eventType: item.eventType,
    staffRequirementCount: item.staffRequirementCount,
    confirmedStaffCount: item.confirmedStaffCount,
  });

  const parsedData: EventRow[] = !isMobile
    ? (tableData?.payload?.map(mapEventToRow) || [])
    : (infiniteData ? infiniteData.flatMap(pageData => pageData?.payload?.map(mapEventToRow) || []) : []);

  const handleOpen = (_event: React.MouseEvent<HTMLButtonElement>, type: string, id: string[]) => {
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
    <Box id="event-listing-container" sx={{ width: "100%" }}>
      {isMobile ? (
        <Box sx={{ width: "100%" }}>
          {parsedData.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
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
            {parsedData.length === 0 && !isValidating && (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography color="text.secondary" fontWeight={500}>
                  No events found.
                </Typography>
              </Box>
            )}
            {parsedData.map((eventRow) => (
              <EventCard
                key={eventRow.id}
                eventRow={eventRow}
                isSelectionMode={isSelectionMode}
                selected={selected}
                onSelect={(id, checked) => {
                  setSelected(prev => checked ? [...prev, id] : prev.filter(item => item !== id));
                }}
                onViewDetails={handleViewDetails}
                onOpenModal={handleOpen}
                canDeleteEvent={canDeleteEvent}
              />
            ))}
          </Stack>
          <div ref={observerTarget} style={{ height: "20px" }}></div>
          {isValidating && size > 1 && (
            <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mt: 1 }}>
              Loading more...
            </Typography>
          )}
        </Box>
      ) : (
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
