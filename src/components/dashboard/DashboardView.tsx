/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Event as EventIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Today as TodayIcon,
  WorkOutline as WorkOutlineIcon,
  AccessTime,
  Star as StarIcon,
  EventOutlined,
  DashboardOutlined,
} from "@mui/icons-material";
import { EventDetailContent } from "./EventDetailContent";
import { useAuthContext } from "@/context/auth-provider";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Chip,
  Button,
  Skeleton,
  Divider,
} from "@mui/material";
import { CustomDialog, ModuleTitle, SearchInput} from "../ui";
import { useAxios } from "@/lib/hooks";
import { useToast } from "@/lib/store/useToastStore";
import {
  DialogActions,
  CircularProgress
} from "@mui/material";
import { handleAxiosError } from "@/lib/utils/axiosError";

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
    <Box sx={{ position: 'relative', flexShrink: 0 }}>
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

const SummaryCard = ({ title, value, icon, color }: { title: string; value: number | string | undefined; icon: React.ReactNode; color: string }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl p-2.5 md:p-5 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-row md:flex-row items-center gap-3 md:gap-4 transition-transform hover:-translate-y-1 hover:shadow-md text-left flex-shrink-0 min-w-[125px] md:min-w-0">
      <div className={`p-2 w-9 h-9 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center ${color} bg-opacity-10 dark:bg-opacity-20 text-current text-lg md:text-2xl flex-shrink-0`}>
        <div style={{ color: "currentColor", display: "flex" }}>{icon}</div>
      </div>
      <div className="overflow-hidden flex-1">
        <p className="text-gray-500 dark:text-gray-400 text-[9px] md:text-sm font-semibold uppercase tracking-wider mb-0.5 md:mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{title}</p>
        <h3 className="text-base md:text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</h3>
      </div>
    </div>
  );
};


const MajorEventCard = ({ event, onClick }: { event: any; onClick: () => void }) => {
  const required = event.staffRequirementCount || 0;
  const confirmed = event.confirmedStaffCount || 0;
  const isFilled = required > 0 && confirmed >= required;

  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        minWidth: 260,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : '0 4px 12px rgba(0,0,0,0.05)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      {renderDateBadge(event.eventDate)}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={800} noWrap sx={{ mb: 0.5, color: 'text.primary' }}>
          {event.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <LocationIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={600} noWrap sx={{ maxWidth: 100 }}>{event.city}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon sx={{ fontSize: 14, color: isFilled ? 'success.main' : 'primary.main' }} />
            <Typography variant="caption" fontWeight={700} color={isFilled ? 'success.main' : 'primary.main'}>
              {confirmed}/{required}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
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

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isAdmin = userRole?.name === "super_admin" || userRole?.name === "supervisor";
  const canViewUsers = (auth as any).user?.availableAccess?.ViewUser;

  const eventsEndpoint = isAdmin
    ? `/api/events?type=upcoming&SearchQuery=${debouncedQuery}`
    : `/api/events/available?SearchQuery=${debouncedQuery}`;

  const { data: eventsData, isLoading: eventsLoading, mutate } = useSWR(eventsEndpoint);
  const { data: summaryData } = useSWR("/api/dashboard/summary");
  const { data: highDemandData, mutate: mutateMajor } = useSWR(!isAdmin ? "/api/events/high-demand" : null);

  const events = eventsData?.payload || [];
  const dashboardStats = summaryData?.payload || {};
  const majorEvents = highDemandData?.payload || [];

  const summary = isAdmin ? {
    totalEvents: dashboardStats.totalEvents || 0,
    activeEvents: dashboardStats.activeEvents || 0,
    totalStaff: dashboardStats.totalStaff || 0,
    pendingApps: dashboardStats.pendingApps || 0,
  } : {
    applied: dashboardStats.applied || 0,
    approved: dashboardStats.approved || 0,
    upcoming: dashboardStats.upcoming || 0,
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
      const response = await api.post(`/api/events/${applyingEvent.eventId}/applications`, {
        roleId: selectedRoleId,
      });

      if (response.status === 200 || response.status === 201) {
        setToast({ message: "Application submitted successfully!", type: "success", open: true });
        setIsApplyDialogOpen(false);
        mutate(); // Refresh the events list
        mutateMajor(); // Refresh high demand events
      }
    } catch (err: unknown) {
      handleAxiosError(err, "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 w-full px-4 md:px-4">
      <Box sx={{ mb: 2 }}>
        <ModuleTitle title="Overview Dashboard" icon={<DashboardOutlined />} />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <div className="flex flex-col gap-4">
        {/* Unified Summary Cards */}
        <div className="flex flex-row md:grid md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
          {isAdmin ? (
            <>
              <SummaryCard title="Total Events" value={summary.totalEvents} icon={<EventOutlined fontSize="inherit" />} color="text-indigo-500" />
              <SummaryCard title="Active Events" value={summary.activeEvents} icon={<ScheduleIcon fontSize="inherit" />} color="text-blue-500" />
              {canViewUsers && (
                <SummaryCard title="Total Staff" value={summary.totalStaff} icon={<PeopleIcon fontSize="inherit" />} color="text-emerald-500" />
              )}
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

        {!isAdmin && majorEvents.length > 0 && (
          <Box sx={{ mt: 1, mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
              <StarIcon sx={{ fontSize: 18, color: '#f59e0b' }} /> High-Demand Events
            </Typography>
            <div className="flex gap-4 overflow-x-auto py-4 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {majorEvents.map((event: any) => (
                <MajorEventCard key={event.eventId} event={event} onClick={() => handleEventClick(event)} />
              ))}
            </div>
          </Box>
        )}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Events List */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
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

                    // Staff shouldn't see events they've already applied to in this list
                    if (!isAdmin && hasApplied) return null;

                    const required = event.staffRequirementCount || 0;
                    const assigned = event.confirmedStaffCount || 0;
                    const staffingRatio = required > 0 ? (assigned / required) : 1;

                    let barColor = "bg-green-500";
                    if (staffingRatio < 0.5) barColor = "bg-red-500";
                    else if (staffingRatio < 1) barColor = "bg-yellow-500";

                    let isToday = false;
                    if (event.eventDate) {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const ed = new Date(event.eventDate);
                      ed.setHours(0, 0, 0, 0);
                      isToday = ed.getTime() === today.getTime();
                    }

                    return (
                      <div
                        key={event.eventId}
                        className={`p-4 border rounded-xl transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer ${isToday
                          ? "bg-blue-50/40 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 hover:bg-blue-50/80 dark:hover:bg-blue-900/20"
                          : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                          }`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex-1 flex flex-row items-center gap-4">
                          {renderDateBadge(event.eventDate)}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-800 dark:text-white text-lg truncate">{event.title}</h3>
                              {hasApplied && <Chip label="Applied" size="small" color="success" variant="outlined" />}
                            </div>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-4 gap-y-1">
                              <span className="flex items-center gap-1"><LocationIcon fontSize="small" /> {event.eventVenue || event.city}{event.district ? `, ${event.district}` : ""}</span>
                              <span className="flex items-center gap-1 text-primary-dark dark:text-primary-light font-medium"><AccessTime fontSize="small" /> {event.reportingTime}</span>
                            </div>
                          </div>
                        </div>

                        {isAdmin ? (
                          <div className="w-full md:w-48 flex flex-col gap-1.5">
                            <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
                              <span>Staffing</span>
                              <span>{assigned} / {required}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                              <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min(staffingRatio * 100, 100)}%` }}></div>
                            </div>
                          </div>
                        ) : (!hasApplied && (
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              px: 2,
                              fontWeight: 600,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            View Details
                          </Button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CustomDialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        actions={
          !isAdmin && !selectedEvent?.eventRequests?.some((r: any) => r.userId === user?.userId) ? (
            <>
              <Button
                onClick={() => setIsModalOpen(false)}
                sx={{ fontWeight: 600, textTransform: "none", color: "text.secondary" }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setIsModalOpen(false);
                  handleApplyClick(selectedEvent);
                }}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 700,
                  textTransform: "none",
                  px: 4,
                  boxShadow: "0 4px 14px rgba(var(--primary-rgb), 0.4)",
                }}
              >
                Apply for Event
              </Button>
            </>
          ) : null
        }
      >
        <EventDetailContent event={selectedEvent} />
      </CustomDialog>


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
