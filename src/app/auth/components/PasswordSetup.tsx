'use client';

import React from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { useLoader } from "@/lib/store";
import { PasswordField } from "../../../components/ui/password-input";
import { LockOutlined, ArrowBackIosNew } from "@mui/icons-material";
import { useToast } from "@/lib/store/useToastStore";
import { useAxios } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { handleAxiosError } from "@/lib/utils/axiosError";

interface PasswordSetupProps {
  token: string;
}

const PasswordSetup: React.FC<PasswordSetupProps> = ({ token }) => {
  const { loading, setLoading } = useLoader();
  const { setToast } = useToast();
  const api = useAxios();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const password = (form.elements.namedItem("new_password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirm_password") as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match", type: "error", open: true });
      setLoading(false);
      return;
    }

    try {
      await api.post(`/api/users/new-password/${token}`, { password });
      setToast({ message: "Password set successfully. Please login.", type: "success", open: true });
      router.push("/auth/login");
    } catch (error: unknown) {
      const message = handleAxiosError(error, "Failed to set password");
      setToast({ message: message, type: "error", open: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: { xs: "white", md: "transparent" },
        borderTopLeftRadius: { xs: "30px", md: 0 },
        borderTopRightRadius: { xs: "30px", md: 0 },
        p: { xs: 3, md: 0 },
        boxShadow: { xs: "0 -10px 40px rgba(0,0,0,0.05)", md: "none" },
        position: "relative",
        zIndex: 20,
      }}
    >
      <Box sx={{ mb: { xs: 2.5, md: 4 }, textAlign: { xs: "center", md: "left" } }}>
        <Typography variant="h4" fontWeight={800} color="primary" sx={{ mb: 1, fontSize: { xs: "1.75rem", md: "2.125rem" } }}>
          Set Your Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create a secure password for your account
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 3 } }}>
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, ml: 0.5 }}>
              New Password
            </Typography>
            <PasswordField
              fullWidth
              name="new_password"
              placeholder="**********"
              required
              size="small"
              autoComplete="new-password"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "rgba(0,0,0,0.02)",
                },
              }}
              startAdornment={
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              }
            />
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, ml: 0.5 }}>
              Confirm Password
            </Typography>
            <PasswordField
              fullWidth
              name="confirm_password"
              placeholder="**********"
              required
              size="small"
              autoComplete="new-password"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "rgba(0,0,0,0.02)",
                },
              }}
              startAdornment={
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              }
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="small"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
            sx={{
              py: 1.5,
              mt: 1,
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: "var(--primary-shadow)",
              textTransform: "none",
            }}
          >
            {loading ? "Setting Password..." : "Set Password"}
          </Button>

          <Button
            variant="text"
            fullWidth
            size="small"
            onClick={() => router.push("/auth/login")}
            startIcon={<ArrowBackIosNew sx={{ fontSize: 14 }} />}
            sx={{
              mt: 1,
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              color: "text.secondary",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.02)",
                color: "primary.main",
              },
            }}
          >
            Back to Login
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PasswordSetup;
