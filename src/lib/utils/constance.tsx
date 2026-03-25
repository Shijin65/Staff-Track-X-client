"use client";

import {
  DashboardOutlined,
  EventOutlined,
  PeopleAltOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export const API_URL = "http://localhost:5000";

export const navItems = [
  { label: "Overview", icon: <DashboardOutlined /> },
  { label: "Events", icon: <EventOutlined /> },
  { label: "Create", icon: <AddCircleOutlineIcon /> },
  { label: "Staff", icon: <PeopleAltOutlined /> },
  { label: "Settings", icon: <SettingsOutlined /> },
];