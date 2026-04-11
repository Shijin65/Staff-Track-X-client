"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
  Stack,
  useTheme,
  useMediaQuery,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Wc,
  Work,
  Emergency,
  Bloodtype,
  CalendarMonth,
  Home,
  LocationCity,
  Checkroom,
  AutoFixHigh,
  AssignmentInd,
  BadgeOutlined,
} from "@mui/icons-material";

// ── Kerala Districts ─────────────────────────────────────────────────────────
const KERALA_DISTRICTS = [
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Thrissur",
  "Wayanad",
];

// ── Validation Schema ─────────────────────────────────────────────────────────
const schema = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().optional(),
    email: yup.string().email("Invalid email").required("Email is required"),
    mobileNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    gender: yup.string().required("Gender is required"),
    role: yup.string().required("Role is required"),

    emergencyContact:  yup
      .string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .optional(),
    bloodGroup: yup.string().optional(),
    dateOfBirth: yup.string().optional(),
    address: yup.string().optional(),
    district: yup.string().optional(),
    city: yup.string().optional(),

    whiteShirt: yup.boolean().default(false),
    blackPant: yup.boolean().default(false),
    executiveBlackShoe: yup.boolean().default(false),
    grooming: yup.boolean().default(false),

    profilePic: yup.string().optional(),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface UserCreateFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// ── Section Card Wrapper ──────────────────────────────────────────────────────
const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        mb: 3,
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        },
      }}
    >
      {/* Section Header Bar */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          background:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.04)"
              : "rgba(var(--primary-rgb), 0.04)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            p: 0.8,
            borderRadius: 1.5,
            bgcolor: "rgba(var(--primary-rgb), 0.1)",
            color: "primary.main",
            display: "flex",
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Section Body */}
      <Box sx={{ p: { xs: 3, md: 4 } }}>{children}</Box>
    </Paper>
  );
};

// ── Main Form ─────────────────────────────────────────────────────────────────
export const UserCreateForm: React.FC<UserCreateFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fieldSize = isMobile ? "small" : "medium";
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      whiteShirt: false,
      blackPant: false,
      executiveBlackShoe: false,
      grooming: false,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePreview(base64String);
        setValue("profilePic", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ width: "100%", position: "relative" }}
    >
      {/* ── Avatar ── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: { xs: -8, md: -14 },
          mb: 4,
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={profilePreview || ""}
            sx={{
              width: {xs:100,md:150},
              height: {xs:100,md:150},
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              border: "6px solid #ffffff",
              bgcolor: "#f1f5f9",
            }}
          >
            {!profilePreview && (
              <Person sx={{ fontSize: 70, color: "#94a3b8" }} />
            )}
          </Avatar>

          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 5,
              bgcolor: "#f1f5f9",
              color: "#334155",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              "&:hover": { bgcolor: "#e2e8f0" },
              width: 38,
              height: 38,
            }}
          >
            <input hidden accept="image/*" type="file" onChange={handleImageChange} />
            <AutoFixHigh sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      {/* ── SECTION 1: Basic Info ── */}
      <SectionCard
        icon={BadgeOutlined}
        title="Basic Information"
        subtitle="Name, contact & role details"
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size={fieldSize}
              label="First Name"
              placeholder="John"
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              InputProps={{
                startAdornment: (
                  <Person sx={{ mr: 1, color: "action.active" }} fontSize="small" />
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size={fieldSize}
              label="Last Name"
              placeholder="Doe"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size={fieldSize}
              label="Email Address"
              placeholder="john@example.com"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <Email sx={{ mr: 1, color: "action.active" }} fontSize="small" />
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size={fieldSize}
              label="Mobile Number"
              placeholder="9876543210"
              {...register("mobileNumber")}
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber?.message}
              InputProps={{
                startAdornment: (
                  <Phone sx={{ mr: 1, color: "action.active" }} fontSize="small" />
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              size={fieldSize}
              label="Gender"
              defaultValue=""
              {...register("gender")}
              error={!!errors.gender}
              helperText={errors.gender?.message}
              InputProps={{
                startAdornment: (
                  <Wc sx={{ mr: 1, color: "action.active" }} fontSize="small" />
                ),
              }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              size={fieldSize}
              label="Role"
              defaultValue=""
              {...register("role")}
              error={!!errors.role}
              helperText={errors.role?.message}
              InputProps={{
                startAdornment: (
                  <Work sx={{ mr: 1, color: "action.active" }} fontSize="small" />
                ),
              }}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Senior Captain">Senior Captain</MenuItem>
              <MenuItem value="Staff Member">Staff Member</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </SectionCard>

      {/* ── SECTION 2: Personal Details ── */}
      <SectionCard
        icon={AssignmentInd}
        title="Personal Details"
        subtitle="Date of birth, blood group & emergency contact"
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size={fieldSize}
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register("dateOfBirth")}
              InputProps={{
                startAdornment: (
                  <CalendarMonth
                    sx={{ mr: 1, color: "action.active" }}
                    fontSize="small"
                  />
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              size={fieldSize}
              label="Blood Group"
              defaultValue=""
              {...register("bloodGroup")}
              InputProps={{
                startAdornment: (
                  <Bloodtype
                    sx={{ mr: 1, color: "action.active" }}
                    fontSize="small"
                  />
                ),
              }}
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <MenuItem key={bg} value={bg}>
                  {bg}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size={fieldSize}
              label="Emergency Contact"
              placeholder="9876543210"
              {...register("emergencyContact")}
              InputProps={{
                startAdornment: (
                  <Emergency
                    sx={{ mr: 1, color: "action.active" }}
                    fontSize="small"
                  />
                ),
              }}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* ── SECTION 3: Location & Address ── */}
      <SectionCard
        icon={Home}
        title="Location & Address"
        subtitle="Permanent address and district"
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size={fieldSize}
              label="Permanent Address"
              multiline
              rows={2}
              {...register("address")}
              InputProps={{
                startAdornment: (
                  <Home
                    sx={{ mr: 1, mt: 1, color: "action.active", alignSelf: "flex-start" }}
                    fontSize="small"
                  />
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              size={fieldSize}
              label="District"
              defaultValue=""
              {...register("district")}
              InputProps={{
                startAdornment: (
                  <LocationCity
                    sx={{ mr: 1, color: "action.active" }}
                    fontSize="small"
                  />
                ),
              }}
            >
              {KERALA_DISTRICTS.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size={fieldSize}
              label="City / Town"
              placeholder="e.g. Thrissur"
              {...register("city")}
              InputProps={{
                startAdornment: (
                  <LocationCity
                    sx={{ mr: 1, color: "action.active" }}
                    fontSize="small"
                  />
                ),
              }}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* ── SECTION 4: Uniform & Compliance ── */}
      <SectionCard
        icon={Checkroom}
        title="Uniform & Compliance"
        subtitle="Mark issued items and grooming status"
      >
        <Box
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 2.5,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(var(--secondary-rgb), 0.03)",
            border: "1px dashed",
            borderColor: "rgba(var(--secondary-rgb), 0.2)",
          }}
        >
          <Grid container spacing={1}>
            {[
              { name: "whiteShirt", label: "White Shirt Issued" },
              { name: "blackPant", label: "Black Pant Issued" },
              { name: "executiveBlackShoe", label: "Executive Black Shoes" },
              { name: "grooming", label: "Grooming Standards Met" },
            ].map(({ name, label }) => (
              <Grid key={name} size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Controller
                      name={name as "whiteShirt" | "blackPant" | "executiveBlackShoe" | "grooming"}
                      control={control}
                      render={({ field }) => (
                        <Checkbox {...field} checked={!!field.value} color="primary" />
                      )}
                    />
                  }
                  label={label}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </SectionCard>

      {/* ── Form Actions ── */}
      <Divider sx={{ my: 3 }} />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          onClick={onCancel}
          variant="outlined"
          color="inherit"
          sx={{ px: 4, py: 1.5, borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            fontWeight: 600,
          }}
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </Button>
      </Stack>
    </Box>
  );
};
