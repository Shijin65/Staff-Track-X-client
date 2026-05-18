import React from 'react';
import { Box, Typography } from '@mui/material';

interface DateBadgeProps {
  dateStr: string;
}

export const DateBadge: React.FC<DateBadgeProps> = ({ dateStr }) => {
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
