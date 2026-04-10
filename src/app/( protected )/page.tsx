'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import Image from 'next/image';
import { useAxios } from '@/lib/hooks/useAxios';
import LayersIcon from '@mui/icons-material/Layers';
import DevicesIcon from '@mui/icons-material/Devices';
import ExtensionIcon from '@mui/icons-material/Extension';

const features = [
  {
    icon: <LayersIcon fontSize="large" color="primary" />,
    title: 'Modern Stack',
    desc: 'Next.js 16, MUI, Zustand, Axios, and more.',
  },
  {
    icon: <DevicesIcon fontSize="large" color="primary" />,
    title: 'Beautiful & Responsive',
    desc: 'Ready for all devices, with dark mode and accessibility in mind.',
  },
  {
    icon: <ExtensionIcon fontSize="large" color="primary" />,
    title: 'Easy to Extend',
    desc: 'Component-driven, customizable, and production-ready.',
  },
];

export default function Home() {
  const axiosBase = useAxios();

  const handleGetUser = () => {
    axiosBase.get('/api/users').then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div>
      <Typography variant="h4">Overview</Typography>
      <Button
        onClick={handleGetUser}
        variant="contained"
        size="large"
        color="primary"
        sx={{ px: 4, py: 1.5, fontWeight: 600 }}
      >
        Get Started
      </Button>
    </div>
  );
}
