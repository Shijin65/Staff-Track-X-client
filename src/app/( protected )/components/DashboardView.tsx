/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Event as EventIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  WarningAmber as WarningIcon,
  LocationOn as LocationIcon,
  Today as TodayIcon,
  WorkOutline as WorkOutlineIcon,
  Close,
  AccessTime,
  InfoOutlined,
  Business,
} from "@mui/icons-material";
import { useAuthContext } from "@/context/auth-provider";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  Grid, 
  Chip, 
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { SearchInput } from "@/components/ui/search";

// --- Reusable Components ---

const StatusBadge = ({ status }: { status: string }) => {
  let colorClass = "bg-gray-100 text-gray-800";
  if (status === "Approved") colorClass = "bg-green-100 text-green-700";
  if (status === "Pending") colorClass = "bg-yellow-100 text-yellow-700";
  if (status === "Rejected") colorClass = "bg-red-100 text-red-700";

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {status}
    </span>
  );
};

const SummaryCard = ({ title, value, icon, color }: { title: string; value: number | string | undefined                                                                                                 ; icon: React.ReactNode; color: string }) => {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 transition-transform hover:-translate-y-1 hover:shadow-md text-center md:text-left">
      <div className={`p-2 w-10 md:w-auto md:p-4 rounded-lg md:rounded-xl flex items-center justify-center ${color} bg-opacity-10 text-current text-lg md:text-2xl`}>
        <div style={{ color: "currentColor", display: "flex" }}>{icon}</div>
      </div>
      <div className="overflow-hidden w-full">
        <p className="text-gray-500 text-[10px] md:text-sm font-medium mb-0 md:mb-1 whitespace-nowrap overflow-hidden text-ellipsis px-1">{title}</p>
        <h3 className="text-lg md:text-2xl font-bold text-gray-800 leading-none">{value}</h3>
      </div>
    </div>
  );
};

// --- Event Detail Modal ---

const EventDetailModal = ({ open, onClose, event, roles }: { open: boolean; onClose: () => void; event: any; roles: any[] }) => {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={800}>{event.title}</Typography>
        <IconButton onClick={onClose} size="small"><Close /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ mb: 3 }}>
               <Typography variant="subtitle2" color="text.secondary" gutterBottom>Event Details</Typography>
               <List disablePadding>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}><TodayIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Date" secondary={event.eventDate} />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}><AccessTime fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Time" secondary={`${event.startTime} (Reporting: ${event.reportingTime})`} />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}><Business fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Venue" secondary={event.eventVenue} />
                  </ListItem>
               </List>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
              <Typography variant="body2">{event.description || "No description provided."}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Staff Requirements</Typography>
              <div className="flex flex-wrap gap-2">
                {event.staffRequirements?.map((req: any) => {
                  const role = roles.find(r => r.roleId === req.roleId);
                  return (
                    <Chip 
                      key={req.roleId} 
                      label={`${role?.name || req.roleId}: ${req.count}`} 
                      variant="outlined" 
                      size="small" 
                    />
                  );
                })}
              </div>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Location</Typography>
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                 <Typography variant="body2" fontWeight={600}>{event.address}</Typography>
                 <Typography variant="caption" color="text.secondary">{event.city}, {event.district}</Typography>
              </Box>
            </Box>
            {event.locationInstructions && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} gutterBottom>
                  <InfoOutlined fontSize="inherit" /> Instructions
                </Typography>
                <Typography variant="body2" fontStyle="italic">{event.locationInstructions}</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Page Component ---

export function DashboardView() {
  const auth = useAuthContext();
  const user = auth?.user?.user;
  const userRole = user?.role;
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: eventsData } = useSWR(`/api/events?isUpcoming=true&SearchQuery=${debouncedQuery}`);
  const { data: rolesData } = useSWR("/api/meta/roles");
  
  const events = eventsData?.payload || [];
  const roles = rolesData?.payload?.roles || [];



  const isAdmin = userRole?.name === "super_admin" || userRole?.name === "admin";
  
  const summary = isAdmin ? {
    totalEvents: events.length,
    activeEvents: events.filter((e: any) => e.status === "Confirmed").length,
    totalStaff: 0, 
    pendingApps: 0, 
  } : {
    applied: events.filter((e: any) => e.eventRequests?.some((r: any) => r.userId === user?.userId)).length,
    approved: events.filter((e: any) => e.eventRequests?.some((r: any) => r.userId === user?.userId && r.status === "Approved")).length,
    upcoming: events.length,
  };

  const handleEventClick = (event: any) => {
    const hasApplied = event.eventRequests?.some((r: any) => r.userId === user?.userId);
    
    if (isAdmin || hasApplied) {
       router.push(`/events/${event.eventId}/view`);
    } else {
       setSelectedEvent(event);
       setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 w-full px-4 md:px-4">
      <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
        <Box sx={{ p: { xs: 1.25, md: 1.5 }, borderRadius: 2, bgcolor: "rgba(var(--primary-rgb), 0.1)", color: "primary.main", display: 'flex' }}>
          <EventIcon sx={{ fontSize: { xs: 28, md: 35 } }} />
        </Box>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Overview Dashboard</h1>
          <p className="text-gray-500 text-xs md:text-sm capitalize">{userRole?.name.replace('_', ' ')} Dashboard</p>
        </div>
      </Box>

      <div className="flex flex-col gap-8">
        {/* Unified Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {isAdmin ? (
            <>
              <SummaryCard title="Total Events" value={summary.totalEvents} icon={<EventIcon fontSize="inherit" />} color="text-indigo-500" />
              <SummaryCard title="Active Events" value={summary.activeEvents} icon={<ScheduleIcon fontSize="inherit" />} color="text-blue-500" />
              <SummaryCard title="Total Staff" value={summary.totalStaff} icon={<PeopleIcon fontSize="inherit" />} color="text-emerald-500" />
              <SummaryCard title="Pending Apps" value={summary.pendingApps} icon={<WorkOutlineIcon fontSize="inherit" />} color="text-amber-500" />
            </>
          ) : (
            <>
              <SummaryCard title="Applied" value={(summary as any).applied} icon={<WorkOutlineIcon fontSize="inherit" />} color="text-blue-500" />
              <SummaryCard title="Approved" value={(summary as any).approved} icon={<CheckCircleIcon fontSize="inherit" />} color="text-green-500" />
              <SummaryCard title="Upcoming" value={(summary as any).upcoming} icon={<TodayIcon fontSize="inherit" />} color="text-purple-500" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Events List */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <EventIcon className="text-primary" /> Upcoming Events
                </h2>
                <div className="w-full md:w-72">
                   <SearchInput value={searchQuery} setValue={setSearchQuery} placeholder="Search events..." fullWidth />
                </div>
              </div>

              {events.length === 0 ? (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                   <Typography color="text.secondary">No upcoming events found.</Typography>
                </Box>
              ) : (
                <div className="flex flex-col gap-4">
                  {events.map((event: any) => {
                    const hasApplied = event.eventRequests?.some((r: any) => r.userId === user?.userId);
                    const required = event.staffRequirements?.reduce((sum: number, req: any) => sum + req.count, 0) || 0;
                    const assigned = event.eventRequests?.filter((r: any) => r.status === "Approved").length || 0;
                    const staffingRatio = required > 0 ? (assigned / required) : 1;
                    
                    let barColor = "bg-green-500";
                    if (staffingRatio < 0.5) barColor = "bg-red-500";
                    else if (staffingRatio < 1) barColor = "bg-yellow-500";

                    return (
                      <div 
                        key={event.eventId} 
                        className="p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-800 text-lg">{event.title}</h3>
                            {hasApplied && <Chip label="Applied" size="small" color="success" variant="outlined" />}
                          </div>
                          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
                            <span className="flex items-center gap-1"><TodayIcon fontSize="small" /> {event.eventDate}</span>
                            <span className="flex items-center gap-1"><LocationIcon fontSize="small" /> {event.eventVenue || event.city}</span>
                          </div>
                        </div>

                        {isAdmin ? (
                          <div className="w-full md:w-48 flex flex-col gap-1.5">
                            <div className="flex justify-between text-xs font-semibold text-gray-600">
                              <span>Staffing</span>
                              <span>{assigned} / {required}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min(staffingRatio * 100, 100)}%` }}></div>
                            </div>
                          </div>
                        ) : (
                          <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                            {hasApplied ? "View Details" : "Learn More"}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Side Panels - Unified */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5">Attention Needed</h2>
              {/* This could be alerts, understaffed events for admin, or upcoming confirmed for staff */}
              <div className="flex flex-col gap-4">
                 {isAdmin ? (
                    events.filter((e: any) => {
                       const req = e.staffRequirements?.reduce((s: number, r: any) => s + r.count, 0) || 0;
                       const ass = e.eventRequests?.filter((r: any) => r.status === "Approved").length || 0;
                       return ass < req * 0.5;
                    }).slice(0, 3).map((e: any) => (
                       <div key={e.eventId} className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
                          <strong>{e.title}</strong> is severely understaffed.
                       </div>
                    ))
                 ) : (
                    events.filter((e: any) => e.eventRequests?.some((r: any) => r.userId === user?.userId && r.status === "Approved")).slice(0, 3).map((e: any) => (
                       <div key={e.eventId} className="p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm">
                          You are assigned to <strong>{e.title}</strong>. Check reporting time!
                       </div>
                    ))
                 )}
                 {events.length === 0 && <p className="text-sm text-gray-500">No urgent items.</p>}
              </div>
            </div>

            {/* Role Specific Sidebars */}
            {isAdmin ? (
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-5">Recent Activity</h2>
                  <p className="text-sm text-gray-500">New applications and system updates will appear here.</p>
                  {/* We can expand this with a dedicated notification/activity API later */}
               </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-5">Recent Applications</h2>
                <div className="flex flex-col divide-y divide-gray-100">
                  {events.filter((e: any) => e.eventRequests?.some((r: any) => r.userId === user?.userId)).slice(0, 5).map((e: any) => {
                    const req = e.eventRequests.find((r: any) => r.userId === user?.userId);
                    return (
                      <div key={e.eventId} className="flex flex-col py-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-gray-800 text-sm truncate max-w-[70%]">{e.title}</span>
                          <StatusBadge status={req.status} />
                        </div>
                        <span className="text-xs text-gray-500">Event on {e.eventDate}</span>
                      </div>
                    );
                  })}
                  {events.filter((e: any) => e.eventRequests?.some((r: any) => r.userId === user?.userId)).length === 0 && (
                    <p className="text-sm text-gray-500">No recent applications.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EventDetailModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        event={selectedEvent} 
        roles={roles} 
      />
    </div>
  );
}
