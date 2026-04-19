"use client";

import React, { useState } from "react";
import {
  Event as EventIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  WarningAmber as WarningIcon,
  LocationOn as LocationIcon,
  Today as TodayIcon,
  WorkOutline as WorkOutlineIcon,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon,
} from "@mui/icons-material";
import { useAuthContext } from "@/context/auth-provider";

// --- Mock Data ---

const mockAdminData = {
  summary: {
    totalEvents: 156,
    activeEvents: 24,
    totalStaff: 89,
    pendingApps: 12,
  },
  upcomingEvents: [
    { id: 1, name: "Grand Corporate Gala", date: "Oct 25, 2026 - 6:00 PM", venue: "Grand Hyatt, Trivandrum", required: 20, assigned: 15 },
    { id: 2, name: "Sunset Beach Wedding", date: "Oct 28, 2026 - 4:00 PM", venue: "Kovalam Beach Resort", required: 15, assigned: 15 },
    { id: 3, name: "Tech Summit 2026", date: "Nov 02, 2026 - 9:00 AM", venue: "Technopark, Trivandrum", required: 30, assigned: 5 },
  ],
  recentApplications: [
    { id: 1, staffName: "Arjun Kumar", eventName: "Grand Corporate Gala", status: "Pending" },
    { id: 2, staffName: "Meera Menon", eventName: "Tech Summit 2026", status: "Approved" },
    { id: 3, staffName: "Rahul R", eventName: "Sunset Beach Wedding", status: "Rejected" },
    { id: 4, staffName: "Priya V", eventName: "Grand Corporate Gala", status: "Pending" },
  ],
  alerts: [
    { id: 1, message: "Tech Summit 2026 is severely understaffed (5/30 assigned)." },
    { id: 2, message: "Weekend Catering event has no staff assigned yet." },
  ]
};

const mockStaffData = {
  summary: {
    applied: 14,
    approved: 8,
    upcoming: 2,
  },
  availableEvents: [
    { id: 1, name: "Grand Corporate Gala", location: "Grand Hyatt, Trivandrum", date: "Oct 25, 2026 - 6:00 PM", description: "Large corporate dinner requiring servers and ushers." },
    { id: 2, name: "Tech Summit 2026", location: "Technopark, Trivandrum", date: "Nov 02, 2026 - 9:00 AM", description: "Multi-day tech conference catering support." },
  ],
  myApplications: [
    { id: 1, eventName: "Grand Corporate Gala", status: "Pending", appliedDate: "Oct 18, 2026" },
    { id: 2, eventName: "Tech Summit 2026", status: "Approved", appliedDate: "Oct 15, 2026" },
    { id: 3, eventName: "Sunset Beach Wedding", status: "Rejected", appliedDate: "Oct 10, 2026" },
  ],
  upcomingAssigned: [
    { id: 1, eventName: "Tech Summit 2026", reportingTime: "08:00 AM", location: "Technopark Main Hall" },
    { id: 2, eventName: "Annual Dinner Party", reportingTime: "05:00 PM", location: "Hilton Garden Inn" },
  ]
};

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

const SummaryCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 transition-transform hover:-translate-y-1 hover:shadow-md text-center md:text-left">
      <div className={`p-2 w-10 md:w-auto md:p-4 rounded-lg md:rounded-xl flex items-center justify-center ${color} bg-opacity-10 text-current text-lg md:text-2xl`}>
        <div style={{ color: "currentColor", display: "flex" }}>{icon}</div>
      </div>
      <div>
        <p className="text-gray-500 text-[10px] md:text-sm font-medium mb-0 md:mb-1 whitespace-nowrap overflow-hidden text-ellipsis px-1">{title}</p>
        <h3 className="text-lg md:text-2xl font-bold text-gray-800 leading-none">{value}</h3>
      </div>
    </div>
  );
};

// --- Staff View ---

const StaffOverview = () => {
  const { summary, availableEvents, myApplications, upcomingAssigned } = mockStaffData;

  return (
    <div className="flex flex-col gap-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        <SummaryCard title="Applied" value={summary.applied} icon={<WorkOutlineIcon fontSize="inherit" />} color="text-blue-500" />
        <SummaryCard title="Approved" value={summary.approved} icon={<CheckCircleIcon fontSize="inherit" />} color="text-green-500" />
        <SummaryCard title="Upcoming" value={summary.upcoming} icon={<TodayIcon fontSize="inherit" />} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Main Sections */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <EventIcon className="text-blue-500" /> Available Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableEvents.map(event => (
                <div key={event.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{event.name}</h3>
                  <div className="flex flex-col gap-2 mt-3 mb-4">
                    <div className="flex items-center text-sm text-gray-500 gap-1.5">
                      <TodayIcon fontSize="small" /> <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-1.5">
                      <LocationIcon fontSize="small" /> <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-5 line-clamp-2">{event.description}</p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebars */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Upcoming Assigned</h2>
            <div className="flex flex-col gap-4">
              {upcomingAssigned.map(event => (
                <div key={event.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-2">{event.eventName}</h4>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                    <span>Reporting Time:</span>
                    <span className="font-medium text-gray-900">{event.reportingTime}</span>
                  </div>
                  <div className="flex justify-between items-start text-sm text-gray-600">
                    <span>Location:</span>
                    <span className="font-medium text-gray-900 text-right max-w-[60%]">{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Recent Applications</h2>
            <div className="flex flex-col divide-y divide-gray-100">
              {myApplications.map((app, index) => (
                <div key={app.id} className={`flex flex-col py-3 ${index === 0 ? 'pt-0' : ''} ${index === myApplications.length - 1 ? 'pb-0' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{app.eventName}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <span className="text-xs text-gray-500">Applied on {app.appliedDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin View ---

const AdminOverview = () => {
  const { summary, upcomingEvents, recentApplications, alerts } = mockAdminData;

  return (
    <div className="flex flex-col gap-8">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <SummaryCard title="Total Events" value={summary.totalEvents} icon={<EventIcon fontSize="inherit" />} color="text-indigo-500" />
        <SummaryCard title="Active Events" value={summary.activeEvents} icon={<ScheduleIcon fontSize="inherit" />} color="text-blue-500" />
        <SummaryCard title="Total Staff" value={summary.totalStaff} icon={<PeopleIcon fontSize="inherit" />} color="text-emerald-500" />
        <SummaryCard title="Pending Apps" value={summary.pendingApps} icon={<WorkOutlineIcon fontSize="inherit" />} color="text-amber-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <EventIcon className="text-indigo-500" /> Upcoming Events
                </h2>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</button>
             </div>
            
            <div className="flex flex-col gap-4">
              {upcomingEvents.map(event => {
                const staffingRatio = event.assigned / event.required;
                let barColor = "bg-green-500";
                if (staffingRatio < 0.5) barColor = "bg-red-500";
                else if (staffingRatio < 1) barColor = "bg-yellow-500";

                return (
                  <div key={event.id} className="p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">{event.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-1 sm:gap-4">
                        <span className="flex items-center gap-1"><TodayIcon fontSize="small" /> {event.date}</span>
                        <span className="hidden sm:inline text-gray-300">|</span>
                        <span className="flex items-center gap-1"><LocationIcon fontSize="small" /> {event.venue}</span>
                      </div>
                    </div>
                    
                    {/* Staff Requirement Bar */}
                    <div className="w-full md:w-48 flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-semibold text-gray-600">
                        <span>Staff Assigned</span>
                        <span>{event.assigned} / {event.required}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min((event.assigned / event.required) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-5">
              <h2 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <WarningIcon fontSize="small" /> Attention Needed
              </h2>
              <div className="flex flex-col gap-3">
                {alerts.map(alert => (
                  <div key={alert.id} className="text-sm text-red-700 bg-white bg-opacity-60 px-3 py-2 rounded-lg border border-red-200">
                    {alert.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Recent Applications</h2>
            <div className="flex flex-col divide-y divide-gray-100">
              {recentApplications.map((app, index) => (
                <div key={app.id} className={`flex flex-col py-4 ${index === 0 ? 'pt-0' : ''} ${index === recentApplications.length - 1 ? 'pb-0' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{app.staffName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{app.eventName}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  {app.status === "Pending" && (
                     <div className="flex gap-2 mt-2">
                        <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold py-1.5 rounded-lg border border-green-200 transition-colors flex items-center justify-center gap-1">
                          <ApproveIcon sx={{ fontSize: 16 }} /> Approve
                        </button>
                        <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold py-1.5 rounded-lg border border-red-200 transition-colors flex items-center justify-center gap-1">
                          <RejectIcon sx={{ fontSize: 16 }} /> Reject
                        </button>
                     </div>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm font-semibold text-gray-500 hover:text-gray-800 py-2 transition-colors">
              View All Applications
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function OverviewDashboard() {
  const auth = useAuthContext();
  const userRole = auth?.user?.user?.role;
  
  console.log(userRole);
  const [activeRole, setActiveRole] = useState(userRole?.name === "staff" ? "Staff" : "Admin");

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 w-full px-4 md:px-4">
      {/* Header Area */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview Dashboard</h1>
          <p className="text-gray-500 mt-1">Here is what is happening with your catering events today.</p>
        </div> */}
        
        {/* Role Toggle (For Demo Purposes) */}
        {userRole?.name === "super_admin" && <div className="flex bg-gray-100 p-1 rounded-xl items-center shadow-sm border border-gray-200">
          <button 
            onClick={() => setActiveRole("Admin")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeRole === "Admin" ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Admin View
          </button>
          <button 
            onClick={() => setActiveRole("Staff")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeRole === "Staff" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Staff View
          </button>
        </div>}
      </div>

      {/* Render Role-based View */}
      {activeRole === "Admin" ? <AdminOverview /> : <StaffOverview />}
    </div>
  );
}
