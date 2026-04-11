"use client";

import {
  DashboardOutlined,
  EventOutlined,
  PeopleAltOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export const API_URL = "http://172.20.10.7:5000";

export const navItems = [
  { label: "Overview", icon: <DashboardOutlined />, path: "/" },
  { label: "Events", icon: <EventOutlined />, path: "/events" },
  { label: "Create", icon: <AddCircleOutlineIcon />, path: "/events/create" },
  { label: "Users", icon: <PeopleAltOutlined />, path: "/users" },
  { label: "Settings", icon: <SettingsOutlined />, path: "/settings" },
];  