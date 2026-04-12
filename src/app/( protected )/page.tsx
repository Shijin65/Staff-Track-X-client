'use client';

import React from 'react';
import {
  Typography,
  Button,
} from '@mui/material';
import { useAxios } from '@/lib/hooks/useAxios';
import { useToast } from '@/lib/store/useToastStore';

export default function Home() {
const axiosBase = useAxios();
const {setToast} = useToast();
  const handleGetUser = () => {
    axiosBase.get('/api/users').then((res) => {
      setToast({message:"User fetched successfully",type:"success", open:true });
      console.log(res.data);
    }).catch((err) => {
      setToast({message:"User fetched failed",type:"error", open:true });
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
