'use client';

import React from "react";
import NextImage from "next/image";

import {
  Box,
  Typography,
  Button,
  Link,
  CircularProgress,
  TextField,
  InputAdornment,
  Slide,
} from "@mui/material";
import { useAuthContext } from "@/context/auth-provider";
import { useLoader } from "@/lib/store";
import { PasswordField } from "../../../components/ui/password-input";
import {
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
import { useToast } from "@/lib/store/useToastStore";
import { useAxios } from "@/lib/hooks";

const LoginUser: React.FC = () => {
  const { loading, setLoading } = useLoader();
  const { login } = useAuthContext();
  const [showForm, setShowForm] = React.useState(false);
  const [view, setView] = React.useState<"login" | "forgot">("login");
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [forgotSubmitted, setForgotSubmitted] = React.useState(false);
  const { setToast } = useToast();
  const axiosBase = useAxios();

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    try {
      const email = (form.elements.namedItem("user_email") as HTMLInputElement).value;
      const password = (form.elements.namedItem("user_password") as HTMLInputElement).value;
      await login({ email, password });
      setToast({ message: `Login successful ${email}`, type: "success", open: true });
    } catch (error) {
      console.log(error);
      setToast({ message: "Failed to login", type: "error", open: true });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setLoading(true);
    try {
      await axiosBase.post("/api/auth/forgot-password", { email: forgotEmail });
      setForgotSubmitted(true);
      setToast({ message: "Request processed successfully.", type: "success", open: true });
    } catch (error: any) {
      if(error.response){
        setToast({ 
          message: error.response?.data?.message || "Failed to process request", 
          type: "error", 
          open: true 
        });
      }else{
        setToast({ 
          message: "Failed to process request", 
          type: "error", 
          open: true 
        });
      }
    } finally {
      setLoading(false);
    }
  };


  const LoginForm = (
    <>
      <Box sx={{ mb: { xs: 2.5, md: 4 }, textAlign: { xs: "center", md: "left" } }}>
        <Typography variant="h4" fontWeight={800} color="primary" sx={{ mb: 1, fontSize: { xs: "1.75rem", md: "2.125rem" } }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your credentials to continue
        </Typography>
      </Box>

      <form onSubmit={handleLoginSubmit} suppressHydrationWarning>
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 3 } }}>
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, ml: 0.5 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              required
              name="user_email"
              placeholder="kristin.watson@example.com"
              type="email"
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "rgba(0,0,0,0.02)",
                },
              }}
              inputProps={{ suppressHydrationWarning: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ fontSize: 20, color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, ml: 0.5 }}>
              Password
            </Typography>
            <PasswordField
              fullWidth
              name="user_password"
              placeholder="**********"
              required
              size="small"
              autoComplete="current-password"
              inputProps={{ suppressHydrationWarning: true }}
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

          <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}>

            <Link
              component="button"
              type="button"
              variant="caption"
              underline="hover"
              color="primary"
              fontWeight={600}
              onClick={() => setView("forgot")}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="small"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
            sx={{
              py: 1,
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: "var(--primary-shadow)",
              textTransform: "none",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Box>
      </form>
    </>
  );

  const ForgotForm = (
    <Box sx={{ minHeight: { xs: "auto", md: 350 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {forgotSubmitted ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              p: 2,
              borderRadius: "50%",
              bgcolor: "rgba(34, 197, 94, 0.1)",
              color: "success.main",
              mb: 3,
            }}
          >
            <EmailOutlined sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Email Sent!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, px: 2 }}>
            Your temporary password has been successfully sent to your registered email address. Please check your inbox for further instructions.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setView("login");
              setForgotSubmitted(false);
            }}
            sx={{ borderRadius: "12px", fontWeight: 700, px: 4 }}
          >
            Back to Login
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={800} color="primary" sx={{ mb: 1 }}>
              Recover
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter email address to receive a temporary password
            </Typography>
          </Box>

          <form onSubmit={handleForgotSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1, ml: 0.5 }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                  type="email"
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: "rgba(0,0,0,0.02)",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ fontSize: 20, color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="small"
                disabled={loading || !forgotEmail}
                sx={{
                  py: 1,
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  boxShadow: "var(--primary-shadow)",
                  textTransform: "none",
                }}
              >
                {loading ? "Sending..." : "Reset Password"}
              </Button>

              <Button
                onClick={() => setView("login")}
                sx={{ fontWeight: 700, color: "text.secondary", textTransform: "none" }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );

  const FormContent = (
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
      {view === "login" ? LoginForm : ForgotForm}

    </Box>
  );

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          flexDirection: "column",
          alignItems: "center",
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          top: showForm ? "10dvh" : "38dvh",
          transition: "top 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 10,
          gap: 0.5,
        }}
      >
        <NextImage
          src="/cfx_logo.png"
          alt="Logo"
          width={showForm ? 110 : 140}
          height={showForm ? 32 : 40}
          priority
          style={{ objectFit: "contain", transition: "all 0.3s" }}
        />
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: 700,
            fontSize: showForm ? "1rem" : "1.2rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "all 0.3s",
          }}
        >
          Caters Hub
        </Typography>
      </Box>

      <Box
        sx={{
          display: { xs: showForm ? "none" : "flex", md: "none" },
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          height: "100dvh",
          pb: 10,
          width: "100%",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setShowForm(true)}
          size="large"
          sx={{
            bgcolor: "white",
            color: "primary.main",
            fontWeight: 800,
            borderRadius: "32px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            "&:hover": { bgcolor: "var(--background)" },
            textTransform: "none",
          }}
        >
          Login
        </Button>
      </Box>

      <Box sx={{ display: { xs: showForm ? "block" : "none", md: "block" }, width: "100%" }}>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <Slide direction="up" in={showForm} mountOnEnter unmountOnExit>
            {FormContent}
          </Slide>
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          {FormContent}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginUser;
