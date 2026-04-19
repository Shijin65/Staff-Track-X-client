"use client";

import React, { useState, useEffect } from "react";
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
  Skeleton,
  Container,
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
import { KERALA_DISTRICTS } from "@/lib/utils/constance";
import { useToast } from "@/lib/store/useToastStore";
import { useAxios } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { schema } from "./user-schema";
import { MainLoader } from "../../../../components/ui/main-loader";
import { handleAxiosError } from "@/lib/utils/axiosError";



// ── Validation Schema ─────────────────────────────────────────────────────────

const fields = ["firstName",
  "lastName",
  'email',
  "mobileNumber",
  "gender",
  "role",
  "emergencyContact",
  "bloodGroup",
  "dateOfBirth",
  "address",
  "district",
  "city",
  "whiteShirt",
  "blackPant",
  "executiveBlackShoe",
  "grooming",
  "isActive",
  "isVerified",
  "profilePic"]

type FormData = yup.InferType<typeof schema>;

interface UserFormProps {
  uid?: string;
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
export const UserForm: React.FC<UserFormProps> = ({
  uid,
}) => {
  const isEdit = !!uid;
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fieldSize = !mounted ? "medium" : (isMobile ? "small" : "medium");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const { setToast } = useToast();
  const api = useAxios();
  const router = useRouter();
  const [imageId, setImageId] = useState<string | null>(null);

  const fetcher = (resource: string) =>
    api.get(resource, { responseType: "blob" }).then((res) => res.data);

  const shouldFetch = imageId ? `/api/users/attachment/${imageId}` : null;

  const { data: imageBlob } = useSWR(shouldFetch, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      setProfilePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageBlob]);


  const { data: rolesData, isLoading: rolesLoading } = useSWR("/api/meta/roles");
  const roles = rolesData?.payload?.roles || [];

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      whiteShirt: false,
      blackPant: false,
      executiveBlackShoe: false,
      grooming: false,
      isActive: true,
      isVerified: false,
    },
  });

  async function getUser() {
    setIsLoading(true);
    if (!uid) return;
    try {
      const res = await api.get(`/api/users/${uid}`);
      if (res.status === 200) {
        const data = res?.data?.payload || {};
        fields.forEach((field) => {
          switch (field) {
            case "role":
              setValue(field as keyof FormData, data.role?.roleId || "");
              break;
            case "whiteShirt":
              setValue(field as keyof FormData, data.uniform?.whiteShirt || false);
              break;
            case "blackPant":
              setValue(field as keyof FormData, data.uniform?.blackPant || false);
              break;
            case "executiveBlackShoe":
              setValue(field as keyof FormData, data.uniform?.executiveBlackShoe || false);
              break;
            case "grooming":
              setValue(field as keyof FormData, data.uniform?.grooming || false);
              break;
            default:
              setValue(field as keyof FormData, data[field] || "");
              break;
          }
        });
        if (data.attachment?.picId) {
          setImageId(data.attachment.picId);
        }
      }
    } catch (error: unknown) {
      const message = handleAxiosError(error, "Failed to fetch user details.");
      setToast({
        message: message,
        type: "error",
        open: true
      });
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (formData: Record<string, any>) => {
    const data = new FormData();

    // Append all form fields to FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        data.append(key, formData[key] as any);
      }
    });

    const request = isEdit
      ? api.put(`/api/users/${uid}`, data)
      : api.post("/api/users", data);

    request
      .then(() => {
        mutate(`/api/users/${uid}`);
        setToast({
          message: isEdit ? "User Updated." : "User Created.",
          type: "success",
          open: true,
        });
        if (!isEdit) router.push("/users");
      })
      .catch((error) => {
        setToast({
          message: error.response?.data?.message || `Failed To ${isEdit ? "Update" : "Create"} User.`,
          type: "error",
          open: true,
        });
      });
  };

  const handleResetPassword = async () => {
    if (!uid) return;
    setIsResettingPassword(true);
    try {
      const password = Math.floor(1000 + Math.random() * 9000).toString();
      const res = await api.put(`/api/users/reset-password/${uid}`, { password });
      if (res.status === 200) {
        setToast({
          message: "Password Reset Successful.",
          type: "success",
          open: true,
        });
      }
    } catch (error: unknown) {
      const message = handleAxiosError(error, "Failed to reset password.");
      setToast({
        message: message,
        type: "error",
        open: true,
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profilePic", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (uid) {
      getUser();
    }
  }, [uid]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <MainLoader />
      </div>
    );
  }
  return (
    <>
      {/* Header Section */}
      <Box sx={{
        height: 180,
        bgcolor: '#f1f5f9', // Light gray background to match image
        pt: 2,
        px: { xs: 0, md: 5 },
        position: 'relative'
      }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "100%" }}>
            <IconButton
              onClick={() => router.back()}
              sx={{
                bgcolor: '#e2e8f0',
                color: '#1e293b',
                '&:hover': { bgcolor: '#cbd5e1' },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h5" fontWeight={800} color="text.primary" sx={{ opacity: 0.8 }}>
              {isEdit ? "Update" : "Create"} Staff
            </Typography>

            <Box sx={{ width: 45 }} /> {/* Spacer to center or balance */}
          </Box>
        </Container>
      </Box>

      {/* Form Section */}
      <Container maxWidth="xl" sx={{ mt: -6, pb: 8 }}>

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
                  width: { xs: 100, md: 150 },
                  height: { xs: 100, md: 150 },
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
                <Controller
                  name="firstName"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size={fieldSize}
                      label="First Name"
                      placeholder="John"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        startAdornment: (
                          <Person sx={{ mr: 1, color: "action.active" }} fontSize="small" />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="lastName"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size={fieldSize}
                      label="Last Name"
                      placeholder="Doe"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size={fieldSize}
                      label="Email Address"
                      placeholder="john@example.com"
                      disabled={isEdit}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        startAdornment: (
                          <Email sx={{ mr: 1, color: "action.active" }} fontSize="small" />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="mobileNumber"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size={fieldSize}
                      label="Mobile Number"
                      placeholder="9876543210"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        startAdornment: (
                          <Phone sx={{ mr: 1, color: "action.active" }} fontSize="small" />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      size={fieldSize}
                      label="Gender"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
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
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="role"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      size={fieldSize}
                      label="Role"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        startAdornment: (
                          <Work sx={{ mr: 1, color: "action.active" }} fontSize="small" />
                        ),
                      }}
                    >
                      {!mounted || rolesLoading ? (
                        <MenuItem disabled value="">
                          <Skeleton width="100%" />
                        </MenuItem>
                      ) : (
                        roles.map((r: { roleId: string, name: string }) => (
                          <MenuItem key={r.roleId} value={r.roleId}>
                            {r.name.charAt(0).toUpperCase() + r.name.slice(1).replace(/_/g, " ")}
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  )}
                />
              </Grid>
              {/* Account Status Fields */}
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Checkbox {...field} checked={!!field.value} color="primary" />
                      )}
                    />
                  }
                  label="Active Account"
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4, mt: -0.5 }}>
                  * Allows the staff to log in and be assigned to events.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="isVerified"
                      control={control}
                      render={({ field }) => (
                        <Checkbox {...field} checked={!!field.value} color="primary" />
                      )}
                    />
                  }
                  label="Verified Member"
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4, mt: -0.5 }}>
                  * Indicates that the account has been verified.
                </Typography>
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
                <Controller
                  name="dateOfBirth"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size={fieldSize}
                      label="Date of Birth"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        startAdornment: (
                          <CalendarMonth
                            sx={{ mr: 1, color: "action.active" }}
                            fontSize="small"
                          />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="bloodGroup"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      size={fieldSize}
                      label="Blood Group"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
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
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="emergencyContact"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size={fieldSize}
                      label="Emergency Contact"
                      placeholder="9876543210"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        startAdornment: (
                          <Emergency
                            sx={{ mr: 1, color: "action.active" }}
                            fontSize="small"
                          />
                        ),
                      }}
                    />
                  )}
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
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size={fieldSize}
                      label="Permanent Address"
                      multiline
                      maxRows={2}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        startAdornment: (
                          <Home
                            sx={{ mr: 1, mt: 1, color: "action.active", alignSelf: "flex-start" }}
                            fontSize="small"
                          />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="district"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      size={fieldSize}
                      label="District"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
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
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="city"
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size={fieldSize}
                      label="City / Town"
                      placeholder=""
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        startAdornment: (
                          <LocationCity
                            sx={{ mr: 1, color: "action.active" }}
                            fontSize="small"
                          />
                        ),
                      }}
                    />
                  )}
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
                  { name: "whiteShirt", label: "White Shirt Issued", caption: "Top-wear uniform provided" },
                  { name: "blackPant", label: "Black Pant Issued", caption: "Bottom-wear uniform provided" },
                  { name: "executiveBlackShoe", label: "Executive Black Shoes", caption: "Formal footwear provided" },
                  { name: "grooming", label: "Grooming Standards Met", caption: "Meets appearance standards" },
                ].map(({ name, label, caption }) => (
                  <Grid key={name} size={{ xs: 12, sm: 6 }}>
                    <Box>
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
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4, mt: -1, mb: 1 }}>
                        {caption}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </SectionCard>

          {/* ── Form Actions ── */}
          <Divider sx={{ my: 3 }} />
          <Stack direction="row" spacing={2} justifyContent={isEdit ? "space-between" : "flex-end"}>
            {isEdit && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleResetPassword}
                disabled={isResettingPassword}
                sx={{ px: isMobile ? 2 : 4, py: isMobile ? .8 : 1.5, borderRadius: 2 }}
              >
                {isResettingPassword ? "Resetting..." : "Reset Password"}
              </Button>
            )}
            <Stack direction="row" spacing={2}></Stack>
            <Button
              onClick={() => router.back()}
              variant="outlined"
              color="inherit"
              sx={{ px: isMobile ? 2 : 4, py: isMobile ? .8 : 1.5, borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              size="small"
              sx={{
                px: isMobile ? 2 : 6,
                py: isMobile ? .8 : 1.5,
                borderRadius: 2,
                boxShadow: theme.shadows[4],
                fontWeight: 600,
              }}
            >
              {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Account" : "Create Account")}
            </Button>
          </Stack>
        </Box>

      </Container>
    </>
  );
};
