"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  IconButton,
  Button,
  Chip,
  Collapse,
  Divider,
} from "@mui/material";
import { SearchInput } from "@/components/ui/search";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

// Mock Data
const MOCK_STAFF = [
  { id: "s1", name: "Rahul Krishna", role: "Chef", status: "not_reported", phone: "+91 9876543210" },
  { id: "s2", name: "Arun Thomas", role: "Chef", status: "reported", phone: "+91 9876543211", time: "09:45 AM" },
  { id: "s3", name: "Sara Jacob", role: "Server", status: "not_reported", phone: "+91 9876543212" },
  { id: "s4", name: "Midhun P", role: "Server", status: "not_reported", phone: "+91 9876543213" },
  { id: "s5", name: "Anoop V", role: "Server", status: "reported", phone: "+91 9876543214", time: "09:50 AM" },
  { id: "s6", name: "Biju M", role: "Helper", status: "not_reported", phone: "+91 9876543215" },
];

const MOCK_EVENT = {
  id: "evt_001",
  title: "Grand Wedding Reception",
  location: "Kochi Marriott Hotel, Ernakulam",
  time: "10:00 AM - 4:00 PM",
};

export const EventCheckIn = ({ eventId }: { eventId: string }) => {
  const [staffList, setStaffList] = useState(MOCK_STAFF);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "reported" | "not_reported">("not_reported");
  
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({
    Chef: true,
    Server: true,
    Helper: true,
  });

  const toggleRole = (role: string) => {
    setExpandedRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: newStatus,
            time: newStatus === "reported" ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        }
        return s;
      })
    );
  };

  const markAllRoleReported = (role: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.role === role && s.status !== "reported") {
          return { ...s, status: "reported", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        }
        return s;
      })
    );
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [staffList, search, statusFilter]);

  const groupedStaff = useMemo(() => {
    return filteredStaff.reduce((acc, curr) => {
      if (!acc[curr.role]) acc[curr.role] = [];
      acc[curr.role].push(curr);
      return acc;
    }, {} as Record<string, typeof staffList>);
  }, [filteredStaff]);

  const reportedCount = staffList.filter((s) => s.status === "reported").length;
  const totalCount = staffList.length;

  return (
    <Box>
      {/* Event Details Card */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" fontWeight={800} gutterBottom>
          {MOCK_EVENT.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          📍 {MOCK_EVENT.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ⏰ {MOCK_EVENT.time}
        </Typography>
      </Card>

      {/* Summary Bar */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, overflowX: "auto", pb: 1, "&::-webkit-scrollbar": { display: "none" } }}>
        <Card sx={{ flex: "1 0 auto", p: 2, borderRadius: 3, minWidth: 120, bgcolor: "primary.50", border: "1px solid", borderColor: "primary.100" }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>Total Staff</Typography>
          <Typography variant="h5" fontWeight={800} color="primary.main">{totalCount}</Typography>
        </Card>
        <Card sx={{ flex: "1 0 auto", p: 2, borderRadius: 3, minWidth: 120, bgcolor: "success.50", border: "1px solid", borderColor: "success.100" }}>
          <Typography variant="body2" color="success.dark" fontWeight={600}>Reported</Typography>
          <Typography variant="h5" fontWeight={800} color="success.main">{reportedCount}</Typography>
        </Card>
        <Card sx={{ flex: "1 0 auto", p: 2, borderRadius: 3, minWidth: 120, bgcolor: "warning.50", border: "1px solid", borderColor: "warning.100" }}>
          <Typography variant="body2" color="warning.dark" fontWeight={600}>Not Reported</Typography>
          <Typography variant="h5" fontWeight={800} color="warning.main">{totalCount - reportedCount}</Typography>
        </Card>
      </Box>

      {/* Filters */}
      <Box sx={{ position: "sticky", top: { xs: 60, md: 80 }, zIndex: 10, bgcolor: "background.default", py: 2, mb: 1, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "center" }}>
          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <SearchInput value={search} setValue={setSearch} placeholder="Search staff name..." fullWidth />
          </Box>
          <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" }, overflowX: "auto", pb: { xs: 1, sm: 0 }, "&::-webkit-scrollbar": { display: "none" } }}>
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
            <Chip 
              label="All" 
              onClick={() => setStatusFilter("all")}
              color={statusFilter === "all" ? "primary" : "default"}
              variant={statusFilter === "all" ? "filled" : "outlined"}
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>
      </Box>

      {/* Staff List */}
      <Box sx={{ pb: 10 }}>
        {Object.keys(groupedStaff).length === 0 ? (
          <Typography sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
            No staff found matching the criteria.
          </Typography>
        ) : (
          Object.entries(groupedStaff).map(([role, roleStaff]) => (
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
                  {statusFilter !== "reported" && roleStaff.some(s => s.status !== "reported") && (
                    <Button 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); markAllRoleReported(role); }}
                      sx={{ textTransform: "none", mr: 1, display: { xs: "none", sm: "flex" } }}
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
                    <Card key={staff.id} sx={{ p: 2, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ width: 44, height: 44, bgcolor: staff.status === "reported" ? "success.light" : "grey.300", color: staff.status === "reported" ? "success.dark" : "grey.700" }}>
                          {staff.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {staff.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {staff.phone}
                          </Typography>
                          {staff.status === "reported" && (
                            <Typography variant="caption" color="success.main" fontWeight={600}>
                              Reported at {staff.time}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {staff.status !== "reported" ? (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleStatusChange(staff.id, "reported")}
                            sx={{ borderRadius: 2, minWidth: 80, textTransform: "none", fontWeight: 600 }}
                          >
                            Check In
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            color="inherit"
                            size="small"
                            onClick={() => handleStatusChange(staff.id, "not_reported")}
                            sx={{ borderRadius: 2, minWidth: 80, textTransform: "none", color: "text.secondary", borderColor: "divider" }}
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
