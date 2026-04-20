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
  Skeleton,
} from "@mui/material";
import { SearchInput } from "@/components/ui/search";
import { useAxios } from "@/lib/hooks";
import { useToast } from "@/lib/store/useToastStore";
import { 
  DialogActions, 
  CircularProgress 
} from "@mui/material";
import { handleAxiosError } from "@/lib/utils/axiosError";

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

const SummaryCard = ({ title, value, icon, color }: { title: string; value: number | string | undefined; icon: React.ReactNode; color: string }) => {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-2.5 md:p-5 shadow-sm border border-gray-100 flex flex-row md:flex-row items-center gap-3 md:gap-4 transition-transform hover:-translate-y-1 hover:shadow-md text-left flex-shrink-0 min-w-[125px] md:min-w-0">
      <div className={`p-2 w-9 h-9 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center ${color} bg-opacity-10 text-current text-lg md:text-2xl flex-shrink-0`}>
        <div style={{ color: "currentColor", display: "flex" }}>{icon}</div>
      </div>
      <div className="overflow-hidden flex-1">
        <p className="text-gray-500 text-[9px] md:text-sm font-semibold uppercase tracking-wider mb-0.5 md:mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{title}</p>
        <h3 className="text-base md:text-2xl font-bold text-gray-900 leading-none">{value}</h3>
      </div>
    </div>
  );
};

// --- Event Detail Modal ---

const EventDetailModal = ({ open, onClose, event, roles, onApply, isAdmin, hasApplied }: { 
  open: boolean; 
  onClose: () => void; 
  event: any; 
  roles: any[]; 
  onApply: (event: any) => void;
  isAdmin: boolean;
  hasApplied: boolean;
}) => {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={800}>{event.title}</Typography>
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
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}><LocationIcon fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Address" secondary={`${event.address}, ${event.city}, ${event.district}`} />
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
      {!isAdmin && !hasApplied && (
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={onClose} 
            sx={{ fontWeight: 600, textTransform: 'none', color: 'text.secondary' }}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              onClose();
              onApply(event);
            }}
            sx={{ 
              borderRadius: 2.5, 
              fontWeight: 700, 
              textTransform: 'none',
              px: 4,
              boxShadow: '0 4px 14px rgba(var(--primary-rgb), 0.4)'
            }}
          >
            Apply for Event
          </Button>
        </DialogActions>
      )}
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
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [applyingEvent, setApplyingEvent] = useState<any>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const api = useAxios();
  const { setToast } = useToast();
  const { mutate } = useSWR(`/api/events?isUpcoming=true&SearchQuery=${debouncedQuery}`);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: eventsData, isLoading: eventsLoading } = useSWR(`/api/events?isUpcoming=true&SearchQuery=${debouncedQuery}`);
  const { data: rolesData, isLoading: rolesLoading } = useSWR("/api/meta/roles");

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

  const handleApplyClick = (event: any) => {
    setApplyingEvent(event);
    // Use user's pre-assigned role
    const userRoleId = userRole?.roleId;
    setSelectedRoleId(userRoleId || "");
    setIsApplyDialogOpen(true);
  };

  const handleConfirmApply = async () => {
    if (!selectedRoleId) {
      setToast({ message: "Please select a role to apply.", type: "warning", open: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(`/api/events/${applyingEvent.eventId}/request`, {
        roleId: selectedRoleId,
      });

      if (response.status === 200 || response.status === 201) {
        setToast({ message: "Application submitted successfully!", type: "success", open: true });
        setIsApplyDialogOpen(false);
        mutate(); // Refresh the events list
      }
    } catch (err: unknown) {
      handleAxiosError(err, "Failed to submit application");
    } finally {
      setIsSubmitting(false);
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

      <div className="flex flex-col gap-4">
        {/* Unified Summary Cards */}
        <div className="flex flex-row md:grid md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
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

              {eventsLoading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height={110}
                      sx={{
                        borderRadius: 3,
                        bgcolor: "rgba(0,0,0,0.06)",
                        width: '100%'
                      }}
                      animation="wave"
                    />
                  ))}
                </div>
              ) : events.length === 0 ? (
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
                            <span className="flex items-center gap-1"><LocationIcon fontSize="small" /> {event.eventVenue || event.city}{event.district ? `, ${event.district}` : ""}</span>
                            <span className="flex items-center gap-1 text-primary-dark font-medium"><AccessTime fontSize="small" /> {event.reportingTime}</span>
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
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{ borderRadius: 2, textTransform: "none", px: 2 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            >
                              View Details
                            </Button>
                            {!hasApplied && (
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  borderRadius: 2,
                                  textTransform: "none",
                                  px: 2,
                                  boxShadow: "none",
                                  "&:hover": { boxShadow: "none" }
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApplyClick(event);
                                }}
                              >
                                Apply
                              </Button>
                            )}
                          </Box>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EventDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        roles={roles}
        onApply={handleApplyClick}
        isAdmin={isAdmin}
        hasApplied={selectedEvent?.eventRequests?.some((r: any) => r.userId === user?.userId)}
      />

      <Dialog 
        open={isApplyDialogOpen} 
        onClose={() => !isSubmitting && setIsApplyDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={{ 
          '& .MuiDialog-paper': { 
            borderRadius: 4, 
            p: 1,
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          } 
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2,
          pt: 3
        }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '50%', 
            bgcolor: 'primary.main', 
            color: 'white',
            boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.3)',
            display: 'flex'
          }}>
            <WorkOutlineIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography fontWeight={800} textAlign="center">
            Confirm Application
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Review the event details before submitting your application.
          </Typography>

          <Box sx={{ 
            p: 2.5, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.08) 0%, rgba(var(--primary-rgb), 0.02) 100%)',
            border: '1px solid rgba(var(--primary-rgb), 0.1)',
            mb: 3
          }}>
            <Typography variant="caption" color="primary.main" fontWeight={700} sx={{ textTransform: 'uppercase', tracking: 1.5 }}>
              Event Details
            </Typography>
            <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5, mb: 1, lineHeight: 1.2 }}>
              {applyingEvent?.title}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <TodayIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" fontWeight={500}>{applyingEvent?.eventDate}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <LocationIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" fontWeight={500}>{applyingEvent?.eventVenue || applyingEvent?.city}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                <AccessTime sx={{ fontSize: 16 }} />
                <Typography variant="caption" fontWeight={700}>Reporting: {applyingEvent?.reportingTime}</Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', fontStyle: 'italic', px: 2 }}>
            * Your application will be reviewed. You will be notified once it is approved.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
          <Button 
            fullWidth
            onClick={() => setIsApplyDialogOpen(false)} 
            disabled={isSubmitting}
            sx={{ 
              fontWeight: 700, 
              textTransform: 'none', 
              color: 'text.secondary',
              py: 1.2
            }}
          >
            Cancel
          </Button>
          <Button 
            fullWidth
            variant="contained" 
            onClick={handleConfirmApply}
            disabled={isSubmitting || !selectedRoleId}
            sx={{ 
              borderRadius: 2.5, 
              fontWeight: 700, 
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(var(--primary-rgb), 0.4)',
              py: 1.2,
              '&:hover': {
                boxShadow: '0 6px 20px rgba(var(--primary-rgb), 0.6)',
              }
            }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Confirm Apply"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
