"use client";

import {
  DashboardOutlined,
  EventOutlined,
  PeopleAltOutlined,
  PersonOutlined,
} from "@mui/icons-material";

export const API_URL = "http://172.20.10.7:5000";

export const navItems = [
  { label: "Overview", icon: <DashboardOutlined />, path: "/" },
  { label: "My Events", icon: <EventOutlined />, path: "/my-events" },
  { label: "Events", icon: <EventOutlined />, path: "/events" },
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
