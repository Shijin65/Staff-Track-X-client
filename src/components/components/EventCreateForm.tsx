"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
  Grid,
  Paper,
} from "@mui/material";
import {
  Event,
  LocationOn,
  Person,
  Info,
} from "@mui/icons-material";
import { useToast } from "@/lib/store/useToastStore";
import { useAxios } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { KERALA_DISTRICTS } from "@/lib/utils/constance";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  eventVenue: yup.string().required("Venue is required"),
  eventType: yup.string().required("Event type is required"),
  eventDate: yup.string().required("Date is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  clientName: yup.string().required("Client name is required"),
  clientPhone: yup.string().required("Client phone is required"),
  address: yup.string().optional(),
  district: yup.string().optional(),
  city: yup.string().optional(),
  status: yup.string().default("Pending"),
  description: yup.string().optional(),
  locationInstructions: yup.string().optional(),
}).required();

type EventFormData = yup.InferType<typeof schema>;

interface EventCreateFormProps {
  initialData?: any;
}

const SectionCard = ({ icon: Icon, title, subtitle, children }: any) => {
  const theme = useTheme();
  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", mb: 3 }}>
      <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "center", gap: 2, bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(var(--primary-rgb), 0.04)", borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ p: 0.8, borderRadius: 1.5, bgcolor: "rgba(var(--primary-rgb), 0.1)", color: "primary.main", display: "flex" }}>
          <Icon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
      </Box>
      <Box sx={{ p: { xs: 3, md: 4 } }}>{children}</Box>
    </Paper>
  );
};

export const EventCreateForm: React.FC<EventCreateFormProps> = ({ initialData }) => {
  const isEdit = !!initialData;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fieldSize = isMobile ? "small" : "medium";
  const { setToast } = useToast();
  const api = useAxios();
  const router = useRouter();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EventFormData>({
    resolver: yupResolver(schema),
    defaultValues: { status: "Pending" }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        eventVenue: initialData.eventVenue || "",
        eventType: initialData.eventType || "",
        eventDate: initialData.eventDate ? new Date(initialData.eventDate).toISOString().split('T')[0] : "",
        startTime: initialData.startTime || "",
        endTime: initialData.endTime || "",
        clientName: initialData.clientName || "",
        clientPhone: initialData.clientPhone || "",
        address: initialData.address || "",
        district: initialData.district || "",
        city: initialData.city || "",
        status: initialData.status || "Pending",
        description: initialData.description || "",
        locationInstructions: initialData.locationInstructions || "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    const request = isEdit ? api.put(`/api/events/${initialData.eventId || initialData.id}`, data) : api.post("/api/events", data);
    try {
      await request;
      setToast({ message: `Event ${isEdit ? "updated" : "created"} successfully.`, type: "success", open: true });
      router.push("/events");
    } catch (err: any) {
      setToast({ message: err.response?.data?.message || "Operation failed", type: "error", open: true });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
      <SectionCard icon={Event} title="Event Details" subtitle="Main information and schedule">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="Event Title" error={!!errors.title} helperText={errors.title?.message ?? ""} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="eventVenue"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="Venue" error={!!errors.eventVenue} helperText={errors.eventVenue?.message ?? ""} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="eventType"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth size={fieldSize} label="Event Type" error={!!errors.eventType} helperText={errors.eventType?.message ?? ""}>
                  <MenuItem value="Wedding">Wedding</MenuItem>
                  <MenuItem value="Corporate">Corporate</MenuItem>
                  <MenuItem value="Birthday">Birthday</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth size={fieldSize} label="Status" error={!!errors.status} helperText={errors.status?.message ?? ""}>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="eventDate"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="Date" type="date" InputLabelProps={{ shrink: true }} error={!!errors.eventDate} helperText={errors.eventDate?.message ?? ""} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="Start Time" type="time" InputLabelProps={{ shrink: true }} error={!!errors.startTime} helperText={errors.startTime?.message ?? ""} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="End Time" type="time" InputLabelProps={{ shrink: true }} error={!!errors.endTime} helperText={errors.endTime?.message ?? ""} />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard icon={Person} title="Client Information" subtitle="Client contact details">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="clientName"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="Client Name" error={!!errors.clientName} helperText={errors.clientName?.message ?? ""} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="clientPhone"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="Client Phone" error={!!errors.clientPhone} helperText={errors.clientPhone?.message ?? ""} />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard icon={LocationOn} title="Location Details" subtitle="Address and area details">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="Address" multiline rows={2} error={!!errors.address} helperText={errors.address?.message ?? ""} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth size={fieldSize} label="District" error={!!errors.district} helperText={errors.district?.message ?? ""}>
                  {KERALA_DISTRICTS.map((dst) => (
                    <MenuItem key={dst} value={dst}>{dst}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="City" error={!!errors.city} helperText={errors.city?.message ?? ""} />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard icon={Info} title="Additional Information" subtitle="Extra details and instructions">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="Description" multiline rows={3} error={!!errors.description} helperText={errors.description?.message ?? ""} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="locationInstructions"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="Location Instructions" multiline rows={2} error={!!errors.locationInstructions} helperText={errors.locationInstructions?.message ?? ""} />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={() => router.push("/events")} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (isEdit ? "Update Event" : "Create Event")}
        </Button>
      </Stack>
    </Box>
  );
};
