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
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2,
      }}
    >
      {/* Hero */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 720,
          textAlign: 'center',
          py: { xs: 8, md: 14 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Image src="/next.svg" alt="Logo" width={80} height={80} />

        <Typography
          variant="h2"
          fontWeight={800}
          sx={{
            fontSize: { xs: '2.2rem', md: '3.2rem' },
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2,
          }}
        >
          Welcome to Your Modern Boilerplate
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 520, fontWeight: 400 }}>
          Kickstart your next project with a beautiful, responsive, and customizable Next.js + MUI starter. Built for speed, scalability, and developer happiness.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}>
          <Button
            onClick={handleGetUser}
            variant="contained"
            size="large"
            color="primary"
            sx={{ px: 4, py: 1.5, fontWeight: 600 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="primary"
            component="a"
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ px: 4, py: 1.5, fontWeight: 600 }}
          >
            GitHub
          </Button>
        </Box>
      </Box>

      {/* Feature Cards */}
      <Grid container spacing={3} sx={{ maxWidth: 960, pb: { xs: 6, md: 10 } }}>
        {features.map(({ icon, title, desc }) => (
          <Grid size={{ xs: 12, md: 4 }} key={title}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'box-shadow 0.25s, transform 0.25s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.5, py: 4 }}>
                {icon}
                <Typography variant="h6" fontWeight={600}>{title}</Typography>
                <Typography variant="body2" color="text.secondary">{desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
