"use client";

import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import {
  DashboardOutlined,
  EventOutlined,
  PeopleAltOutlined,
  PersonOutlined,
} from "@mui/icons-material";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const navItems = [
  { label: "Overview", icon: <DashboardOutlined />, path: "/" },
  { label: "My Events", icon: <EventOutlined />, path: "/my-events" },
  { label: "Events", icon: <EventOutlined />, path: "/events" },
  { label: "Attendance", icon: <ClipboardDocumentCheckIcon className="h-6 w-6" />, path: "/mark-attendance" },
  { label: "Users", icon: <PeopleAltOutlined />, path: "/users" },
  { label: "Profile", icon: <PersonOutlined />, path: "/profile" },
];

// ── Kerala Districts ─────────────────────────────────────────────────────────
export const KERALA_DISTRICTS = [
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Thrissur",
  "Wayanad",
];
