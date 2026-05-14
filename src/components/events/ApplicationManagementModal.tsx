import React, { useState, useMemo } from "react";
import {
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  Grid,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Star,
  Call,
} from "@mui/icons-material";
import { useToast } from "@/lib/store/useToastStore";
import { useLoader } from "@/lib/store";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { useAxios, useDebounce } from "@/lib/hooks";
import { handleAxiosError } from "@/lib/utils/axiosError";
import { GroupSkeleton, SearchInput } from "@/components/ui";

interface ApplicationManagementModalProps {
  eventId: string;
  roles: { roleId: string; name: string }[];
  canEdit: boolean;
}

export function ApplicationManagementModal({
  eventId,
  canEdit,
}: ApplicationManagementModalProps) {
  const { setToast } = useToast();
  const { setLoading } = useLoader();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const axios = useAxios();
  const router = useRouter();

  const { data: applicationsData, isLoading, mutate: mutateApps } = useSWR(
    eventId ? `/api/events/${eventId}/applications?SearchQuery=${encodeURIComponent(debouncedSearch)}` : null
  );

  const apps = applicationsData?.payload || [];

  const handleUpdateStatus = async (requestId: string, status: string) => {
    try {
      setLoading(true);
      await axios.put(`/api/events/applications/${requestId}`, { status });
      setToast({
        open: true,
        message: `Application ${status} successfully`,
        type: "success",
      });
      mutate(`/api/events/${eventId}/requirements`);
      mutateApps();
    } catch (error: unknown) {
      const err = handleAxiosError(error)
      setToast({
        open: true,
        message: err || "Failed to update status",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = useMemo(() => {
    return apps.filter((app: any) => {
      if (activeTab === "all") return true;
      return app.status === activeTab;
    });
  }, [apps, activeTab]);

  const getPillStyles = (type: string) => {
    const isActive = activeTab === type;
    const baseStyles = {
      px: 2,
      py: 0.5,
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "0.85rem",
      display: "flex",
      alignItems: "center",
      gap: 1,
      transition: "all 0.2s ease",
      border: "1px solid transparent",
      "&:hover": {
        bgcolor: isActive ? "" : "rgba(255, 255, 255, 0.05)",
      }
    };

    switch (type) {
      case "all":
        return {
          ...baseStyles,
          bgcolor: isActive ? "rgba(37, 99, 235, 0.15)" : "transparent",
          color: isActive ? "#60a5fa" : "text.secondary",
          borderColor: isActive ? "rgba(37, 99, 235, 0.3)" : "transparent",
        };
      case "pending":
        return {
          ...baseStyles,
          bgcolor: isActive ? "rgba(245, 158, 11, 0.15)" : "transparent",
          color: isActive ? "#fbbf24" : "text.secondary",
          borderColor: isActive ? "rgba(245, 158, 11, 0.3)" : "transparent",
        };
      case "confirmed":
        return {
          ...baseStyles,
          bgcolor: isActive ? "rgba(34, 197, 94, 0.15)" : "transparent",
          color: isActive ? "#4ade80" : "text.secondary",
          borderColor: isActive ? "rgba(34, 197, 94, 0.3)" : "transparent",
        };
      case "rejected":
        return {
          ...baseStyles,
          bgcolor: isActive ? "rgba(239, 68, 68, 0.15)" : "transparent",
          color: isActive ? "#f87171" : "text.secondary",
          borderColor: isActive ? "rgba(239, 68, 68, 0.3)" : "transparent",
        };
      default:
        return baseStyles;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Search and Filter Section */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        <SearchInput
          placeholder="Search application by name..."
          value={searchQuery}
          setValue={setSearchQuery}
          fullWidth
        />
        <Box sx={{ display: "flex" }}>
          <Box onClick={() => setActiveTab("all")} sx={getPillStyles("all")}>
            All
          </Box>
          <Box onClick={() => setActiveTab("pending")} sx={getPillStyles("pending")}>
            Pending
          </Box>
          <Box onClick={() => setActiveTab("confirmed")} sx={getPillStyles("confirmed")}>
            Confirmed
          </Box>
          <Box onClick={() => setActiveTab("rejected")} sx={getPillStyles("rejected")}>
            Rejected
          </Box>
        </Box>
      </Stack>

      {/* Applications List */}
      <Stack spacing={2.5}>
        {isLoading ? (
          <GroupSkeleton rowsNum={3} />
        ) : filteredApplications.length > 0 ? (
          filteredApplications.map((req: any) => (
            <Box
              key={req.requestId}
              sx={{
                p: 2.5,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "rgba(255, 255, 255, 0.02)",
                position: "relative",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  borderColor: "rgba(37, 99, 235, 0.2)",
                  bgcolor: "rgba(255, 255, 255, 0.04)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.3)"
                }
              }}
            >
              {/* Card Header: User Info & Status */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      onClick={() => router.push(`/users/${req.user?.userId}/view`)}
                      sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' }, mb: 0.2 }}
                    >
                      {req.user?.firstName} {req.user?.lastName}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1.5, color: "text.secondary" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Call sx={{ fontSize: "1rem" }} />
                        <Typography variant="body2" fontWeight={700}>{req.user?.mobileNumber || "N/A"}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={800} sx={{ color: "primary.main", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                        • {req.roleName?.replace(/_/g, " ").toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                  <Chip
                    label={req.status}
                    size="small"
                    sx={{
                      bgcolor: req.status === "confirmed" ? "rgba(34, 197, 94, 0.1)" : req.status === "rejected" ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)",
                      color: req.status === "confirmed" ? "#4ade80" : req.status === "rejected" ? "#f87171" : "#fbbf24",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                      textTransform: "capitalize",
                      borderRadius: 1.5,
                      px: 0.5
                    }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Star sx={{ color: "#fbbf24", fontSize: "1.1rem" }} />
                    <Typography variant="body2" fontWeight={800}>{req.user?.rating?.toFixed(1) || "0.0"}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Actions */}
              {canEdit && (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleUpdateStatus(req.requestId, "confirmed")}
                      disabled={req.status === "confirmed"}
                      sx={{
                        borderRadius: 3,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 800,
                        borderColor: "divider",
                        color: "text.primary",
                        transition: "all 0.2s ease",
                        "&:hover": { 
                          borderColor: "primary.main", 
                          bgcolor: "rgba(37, 99, 235, 0.08)",
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
                          transform: "translateY(-1px)"
                        }
                      }}
                    >
                      Approve
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => handleUpdateStatus(req.requestId, "rejected")}
                      disabled={req.status === "rejected"}
                      sx={{
                        borderRadius: 3,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 800,
                        borderColor: "divider",
                        color: "text.",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Reject
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          ))
        ) : (
          <Box sx={{ py: 8, textAlign: 'center', borderRadius: 4, bgcolor: "rgba(255,255,255,0.01)", border: "1px dashed", borderColor: "divider" }}>
            <Typography color="text.secondary" fontWeight={600}>No applications found</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
