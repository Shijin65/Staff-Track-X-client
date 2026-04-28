"use client";

import React, { useState } from "react";
import {

  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person,
  Star,
} from "@mui/icons-material";
import { useToast } from "@/lib/store/useToastStore";
import { useLoader } from "@/lib/store";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { useAxios } from "@/lib/hooks";
import { handleAxiosError } from "@/lib/utils/axiosError";
import { GroupSkeleton } from "@/components/ui";

interface ApplicationManagementModalProps {
  eventId: string;
  roles: { roleId: string; name: string }[];
  canEdit: boolean;
}

export function ApplicationManagementModal({
  eventId,
  roles,
  canEdit,
}: ApplicationManagementModalProps) {
  const { setToast } = useToast();
  const { setLoading } = useLoader();
  const [activeTab, setActiveTab] = useState(0);
  const axios = useAxios();
  const router = useRouter();

  const { data: applicationsData, isLoading, mutate: mutateApps } = useSWR(
    eventId ? `/api/events/${eventId}/applications` : null
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      case "cancelled":
        return "default";
      default:
        return "default";
    }
  };

  const filteredApplications = apps.filter((app: { status: string }) => {
    if (activeTab === 0) return app.status === "pending";
    if (activeTab === 1) return app.status === "confirmed";
    if (activeTab === 2) return app.status === "rejected";
    return true;
  });

  return (
    <List disablePadding>
      <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} aria-label="application status tabs">
        <Tab label={`Pending (${apps.filter((a: { status: string }) => a.status === 'pending').length})`} />
        <Tab label={`Confirmed (${apps.filter((a: { status: string }) => a.status === 'confirmed').length})`} />
        <Tab label={`Rejected (${apps.filter((a: { status: string }) => a.status === 'rejected').length})`} />
      </Tabs>
      {isLoading ? <GroupSkeleton rowsNum={3} /> : filteredApplications.length > 0 ? (
        filteredApplications.map((req: { requestId: string; status: string; user: { userId: string; firstName: string; lastName: string; mobileNumber: string; rating?: number }; roleId: string }) => {
          const role = roles.find(
            (r: { roleId: string; name: string }) =>
              String(r.roleId) === String(req.roleId)
          );
          console.log(req.roleId)
          return <ListItem
            key={req.requestId}
            sx={{
              px: 1,
              py: 2,
              borderBottom: '1px solid #f0f0f0',
              '&:last-child': { borderBottom: 'none' }
            }}
          >
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <Box sx={{ mr: 2, p: 1, bgcolor: 'rgba(0,0,0,0.04)', borderRadius: '50%', display: 'flex' }}>
                <Person color="action" />
              </Box>
              <ListItemText
                primary={
                  <Typography
                    fontWeight={700}
                    component="span"
                    onClick={() => router.push(`/users/${req.user?.userId}/view`)}
                    sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
                  >
                    {`${req.user?.firstName || "-"} ${req.user?.lastName || ""}`}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography component="span" color="primary" sx={{ display: 'block', fontSize: 13, fontWeight: 600, mb: 0.5 }}>
                      {roles.find((r: { roleId: string; name: string }) => String(r.roleId) === String(req.roleId))?.name?.replace(/_/g, " ")?.toUpperCase() || "No Role"}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ color: '#faaf00', fontSize: '1rem', mr: 0.5 }} />
                        <Typography variant="caption" fontWeight={700} color="text.primary">
                          {req.user?.rating?.toFixed(1) || "0.0"}
                        </Typography>
                      </Box>
                      <Typography component="span" sx={{ fontSize: 13 }} color="text.secondary">
                        • Contact: {req.user?.mobileNumber || "N/A"}
                      </Typography>
                    </Box>
                  </React.Fragment>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={req.status}
                  size="small"
                  color={getStatusColor(req.status)}
                  variant="outlined"
                  sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                />
                {canEdit && (
                  <Stack direction="row" spacing={0.5}>
                    {req.status !== 'confirmed' && (
                      <Tooltip title="Approve">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleUpdateStatus(req.requestId, 'confirmed')}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {req.status !== 'rejected' && (
                      <Tooltip title="Reject">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleUpdateStatus(req.requestId, 'rejected')}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                )}
              </Box>
            </Box>
          </ListItem>

        })) : (
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography color="text.secondary">No applications found in this category.</Typography>
        </Box>
      )}
    </List>
  );
}
