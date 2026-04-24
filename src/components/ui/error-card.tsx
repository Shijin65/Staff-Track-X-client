"use client";

import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { ErrorOutline as ErrorOutlineIcon } from "@mui/icons-material";

interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  minHeight?: string | number;
  retryText?: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  title = "Oops! Something went wrong",
  message = "We encountered an error while fetching the data. This might be due to a connection issue or server maintenance.",
  onRetry,
  minHeight = "400px",
  retryText = "Try Again",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: minHeight,
        width: "100%",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4, md: 6 },
          borderRadius: { xs: 3, md: 4 },
          textAlign: "center",
          width: "100%",
          maxWidth: { xs: "none", sm: 500 },
          border: "1px solid",
          borderColor: "error.light",
          bgcolor: "rgba(239, 68, 68, 0.02)",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            p: { xs: 1.5, sm: 2 },
            borderRadius: "50%",
            bgcolor: "rgba(239, 68, 68, 0.1)",
            color: "error.main",
            mb: { xs: 2.5, sm: 3 },
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: { xs: 40, sm: 48 } }} />
        </Box>
        <Typography variant="h5" fontWeight={800} gutterBottom color="text.primary" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
          {message}
        </Typography>

        {onRetry && (
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={onRetry}
            sx={{
              borderRadius: 2.5,
              px: 4,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 8px 16px rgba(239, 68, 68, 0.2)",
            }}
          >
            Try Again
          </Button>
        )}
      </Paper>
    </Box>
  );
};
