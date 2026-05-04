"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  Chip,
  Collapse,
  CircularProgress,
  Container,
} from "@mui/material";
import { SearchInput, ErrorCard } from "@/components/ui";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckCircle,
  People,
  LocationOn,
  Schedule,
} from "@mui/icons-material";
import useSWR, { mutate } from "swr";
import axios from "axios";

export const EventCheckIn = ({ eventId }: { eventId: string }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "reported" | "not_reported">("all");
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({});

  // Fetch attendance data
  const { data: attendanceData, isLoading, error } = useSWR(
    `/api/events/${eventId}/attendance?status=${statusFilter}&search=${search}`
  );

  const event = attendanceData?.payload?.event;
  const staffList = attendanceData?.payload?.staff || [];
  const counts = attendanceData?.payload?.counts || { total: 0, reported: 0, notReported: 0 };

  // Initialize expanded roles when data loads
  useEffect(() => {
    if (staffList.length > 0) {
      const roles = Array.from(new Set(staffList.map((s: any) => s.role)));
      const initialExpanded: Record<string, boolean> = {};
      roles.forEach((role: any) => {
        if (expandedRoles[role] === undefined) {
          initialExpanded[role] = true;
        }
      });
      if (Object.keys(initialExpanded).length > 0) {
        setExpandedRoles(prev => ({ ...prev, ...initialExpanded }));
      }
    }
  }, [staffList]);

  const toggleRole = (role: string) => {
    setExpandedRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const handleStatusChange = async (staffId: string, newStatus: string) => {
    try {
      await axios.put(`/api/events/${eventId}/${staffId}`, { status: newStatus });
      mutate(`/api/events/${eventId}/attendance?status=${statusFilter}&search=${search}`);
    } catch (err) {
      console.error("Failed to update attendance status:", err);
    }
  };

  const markAllRoleReported = async (role: string) => {
    try {
      await axios.post(`/api/events/${eventId}/report-all`, { role });
      mutate(`/api/events/${eventId}/attendance?status=${statusFilter}&search=${search}`);
    } catch (err) {
      console.error("Failed to mark all as reported:", err);
    }
  };

  const groupedStaff = useMemo(() => {
    return staffList.reduce((acc: any, curr: any) => {
      if (!acc[curr.role]) acc[curr.role] = [];
      acc[curr.role].push(curr);
      return acc;
    }, {} as Record<string, any[]>);
  }, [staffList]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <ErrorCard
          message={error?.response?.data?.message || "Failed to load attendance details."}
          onRetry={() => mutate(`/api/attendance/${eventId}?status=${statusFilter}&search=${search}`)}
        />
      </Container>
    );
  }

  return (
    <Box>
      {/* Event Details Card */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" fontWeight={800} gutterBottom>
          {event?.title || "Event Details"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOn /> {event?.eventVenue || "Location not set"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Schedule /> {event?.startTime ? `${event.startTime} Onwards` : "Time not set"}
        </Typography>
      </Card>

      {/* Summary Bar */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { display: "none" } }}>
        <Card sx={{ flex: "1 0 auto", p: 2, borderRadius: 3, minWidth: 120, bgcolor: "rgba(var(--primary-rgb), 0.05)", border: "1px solid", borderColor: "rgba(var(--primary-rgb), 0.1)" }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Staff</Typography>
          <Typography variant="h5" fontWeight={800} color="primary.main">{counts.total}</Typography>
        </Card>
        <Card sx={{ flex: "1 0 auto", p: 2, borderRadius: 3, minWidth: 120, bgcolor: "success.50", border: "1px solid", borderColor: "success.100" }}>
          <Typography variant="body2" color="success.dark" fontWeight={600}>Reported</Typography>
          <Typography variant="h5" fontWeight={800} color="success.main">{counts.reported}</Typography>
        </Card>
        <Card sx={{ flex: "1 0 auto", p: 2, borderRadius: 3, minWidth: 120, bgcolor: "warning.50", border: "1px solid", borderColor: "warning.100" }}>
          <Typography variant="body2" color="warning.dark" fontWeight={600}>Not Reported</Typography>
          <Typography variant="h5" fontWeight={800} color="warning.main">{counts.notReported}</Typography>
        </Card>
      </Box>

      {/* Filters */}
      <Box sx={{ position: "sticky", top: { xs: 56, md: 64 }, zIndex: 10, bgcolor: "background.default", py: 2, mb: 1, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "center" }}>
          <Box sx={{ flexGrow: 1, width: {xs: "100%", sm: "70%"} }}>
            <SearchInput value={search} setValue={setSearch} placeholder="Search staff name" fullWidth />
          </Box>
          <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" }, overflowX: "auto", pb: { xs: 1, sm: 0 }, "&::-webkit-scrollbar": { display: "none" } }}>
            <Chip 
              label="All" 
              onClick={() => setStatusFilter("all")}
              color={statusFilter === "all" ? "primary" : "default"}
              variant={statusFilter === "all" ? "filled" : "outlined"}
              sx={{ fontWeight: 600 }}
            />
            <Chip 
              label="Not Reported" 
              onClick={() => setStatusFilter("not_reported")}
              color={statusFilter === "not_reported" ? "warning" : "default"}
              variant={statusFilter === "not_reported" ? "filled" : "outlined"}
              sx={{ fontWeight: 600 }}
            />
            <Chip 
              label="Reported" 
              onClick={() => setStatusFilter("reported")}
              color={statusFilter === "reported" ? "success" : "default"}
              variant={statusFilter === "reported" ? "filled" : "outlined"}
              sx={{ fontWeight: 600 }}
            />
            
          </Box>
        </Box>
      </Box>

      {/* Staff List */}
      <Box sx={{ pb: 10 }}>
        {Object.keys(groupedStaff).length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <People sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No staff found matching the criteria.
            </Typography>
          </Box>
        ) : (
          Object.entries(groupedStaff).map(({role, roleStaff}) => (
            <Box key={role} sx={{ mb: 3 }}>
              <Box 
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, cursor: "pointer", p: 1, borderRadius: 2, "&:hover": { bgcolor: "action.hover" } }}
                onClick={() => toggleRole(role)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700}>{role}s</Typography>
                  <Chip size="small" label={roleStaff.length} sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {statusFilter !== "reported" && roleStaff.some(s => s.attendanceStatus !== "reported") && (
                    <Button 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); markAllRoleReported(role); }}
                      sx={{ textTransform: "none", mr: 1, display: { xs: "none", sm: "flex" }, fontWeight: 700 }}
                    >
                      Mark All Present
                    </Button>
                  )}
                  {expandedRoles[role] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </Box>
              </Box>
              
              <Collapse in={expandedRoles[role]}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {roleStaff.map((staff) => (
                    <Card key={staff.userId} sx={{ p: 2, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar 
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
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {staff.firstName} {staff.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
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
                  ))}
                </Box>
              </Collapse>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};
