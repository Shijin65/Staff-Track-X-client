"use client";

import { useMemo, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { ErrorCard } from "@/components/ui";
import {
  CheckCircle,
  People,
} from "@mui/icons-material";
import useSWRInfinite from "swr/infinite";
import { useAxios } from "@/lib/hooks";
import { formatTime } from "@/lib/utils/formateDate";

interface StaffMember {
  userId: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  mobileNumber?: string;
  attendanceStatus: "reported" | "not_reported";
  reportedAt?: string;
  role: string;
  checkInTime?: string;
}

interface StaffCheckInListProps {
  eventId: string;
  search: string;
  statusFilter: "all" | "reported" | "not_reported";
  mutateEvents: () => void;
}

export const StaffCheckInList = ({ eventId, search, statusFilter, mutateEvents }: StaffCheckInListProps) => {
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const api = useAxios()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.payload?.length) return null;
    return `/api/events/${eventId}/staffs?reportedStatus=${statusFilter}&SearchQuery=${search}&Page=${pageIndex + 1}&Limit=15`;
  };

  const { data, size, setSize, isLoading, error, mutate, isValidating } = useSWRInfinite(getKey);

  const staffList: StaffMember[] = useMemo(() => {
    if (!data) return [];
    return data.flatMap((page) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      page.payload.map((item: any) => ({
        userId: item.user.userId,
        firstName: item.user.firstName,
        lastName: item.user.lastName,
        mobileNumber: item.user.mobileNumber,
        profilePic: item.user.profilePic,
        attendanceStatus:
          item.attendanceStatus === "reported" ? "reported" : "not_reported",
        reportedAt: formatTime(item.checkInTime),
        role: item.roleName,
      }))
    );
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isValidating && !isLoading) {
          const totalPages = data?.[0]?.metaData?.totalPages || 0;
          if (size < totalPages) {
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
  }, [data, size, setSize, isValidating, isLoading]);

  const handleStatusChange = async (staffId: string, newStatus: string) => {
    try {
      await api.put(`/api/events/${eventId}/staffs/${staffId}`, { status: newStatus });
      mutateEvents();
      mutate();
    } catch (err) {
      console.error("Failed to update attendance status:", err);
    }
  };

  if (isLoading && size === 1) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <ErrorCard
        message={error?.response?.data?.message || "Failed to load staff details."}
        onRetry={() => mutate()}
      />
    );
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      service_boys: "hsl(var(--sky))",
      supervisor: "hsl(var(--red))",
      cleaning: "hsl(var(--green))",
      chef: "hsl(var(--yellow))",
      manager: "hsl(var(--ash))",
    };
    return colors[role.toLowerCase()] || "hsl(var(--ash-light))";
  };

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {staffList.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <People sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No staff found matching the criteria.
            </Typography>
          </Box>
        ) : (
          staffList.map((staff) => (
            <Card
              key={staff.userId}
              sx={{
                p: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid",
                borderColor: "divider",
                borderLeft: `5px solid ${getRoleColor(staff.role)}`,
                boxShadow: "none",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* <Avatar
                  src={staff.profilePic}
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: staff.attendanceStatus === "reported" ? "success.light" : "grey.300",
                    color: staff.attendanceStatus === "reported" ? "success.dark" : "grey.700",
                    fontWeight: 700
                  }}
                >
                  {staff.firstName?.charAt(0)}
                </Avatar> */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {staff.firstName} {staff.lastName}
                    </Typography>
                    <Chip label={staff.role?.replace(/_/g, " ")} size="small" sx={{ height: 18, fontSize: "0.65rem", textTransform: "capitalize", bgcolor: "action.hover", fontWeight: 700 }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {staff.mobileNumber || "No phone"}
                  </Typography>

                  {staff.attendanceStatus === "reported" && (
                    <Typography variant="caption" color="success.main" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <CheckCircle fontSize="inherit" /> Reported at {staff.reportedAt || "Just now"}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                {staff.attendanceStatus !== "reported" ? (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleStatusChange(staff.userId, "reported")}
                    sx={{ borderRadius: 2, minWidth: 80, textTransform: "none", fontWeight: 700 }}
                  >
                    Check In
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    onClick={() => handleStatusChange(staff.userId, "not_reported")}
                    sx={{ borderRadius: 2, minWidth: 80, textTransform: "none", color: "text.secondary", borderColor: "divider", fontWeight: 700 }}
                  >
                    Undo
                  </Button>
                )}
              </Box>
            </Card>
          ))
        )}
      </Box>
      <div ref={observerTarget} style={{ height: "20px" }}></div>
      {isValidating && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};
