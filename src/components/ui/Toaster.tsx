"use client";

import React from "react";
import { Snackbar, Alert, Stack, Slide, SlideProps } from "@mui/material";
import { useToastStore, ToastType } from "@/lib/store/useToastStore";

function TransitionRight(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export const Toaster = () => {
  const { toasts, removeToast } = useToastStore();

  const getAlertColor = (type: ToastType) => {
    switch (type) {
      case "success": return "success";
      case "error": return "error";
      case "warning": return "warning";
      case "info":
      default: return "info";
    }
  };

  return (
    <Stack
      spacing={2}
      sx={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        maxWidth: 400,
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={5000}
          onClose={() => removeToast(toast.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={TransitionRight}
          sx={{
            position: "relative",
            pointerEvents: "auto",
          }}
        >
          <Alert
            onClose={() => removeToast(toast.id)}
            severity={getAlertColor(toast.type)}
            variant="filled"
            elevation={6}
            sx={{
              width: "100%",
              borderRadius: 2,
              fontWeight: 500,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};
