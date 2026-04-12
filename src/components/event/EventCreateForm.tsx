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
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Grid,
  Paper,
} from "@mui/material";
import {
  Event,
  LocationOn,
  Category,
  CalendarMonth,
  AccessTime,
  Person,
  Phone,
  Email,
  Note,
} from "@mui/icons-material";
import { useToast } from "@/lib/store/useToastStore";
import { useAxios } from "@/lib/hooks";
import { useRouter } from "next/navigation";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  eventVenue: yup.string().required("Venue is required"),
  eventType: yup.string().required("Event type is required"),
  eventDate: yup.string().required("Date is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  clientName: yup.string().required("Client name is required"),
  clientPhone: yup.string().required("Client phone is required"),
  clientEmail: yup.string().email("Invalid email").required("Client email is required"),
  address: yup.string().optional(),
  city: yup.string().optional(),
  pincode: yup.string().optional(),
  status: yup.string().default("Pending"),
  notes: yup.string().optional(),
}).required();

type EventFormData = yup.InferType<typeof schema>;

interface EventCreateFormProps {
  initialData?: any;
  onCancel?: () => void;
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

export const EventCreateForm: React.FC<EventCreateFormProps> = ({ initialData, onCancel }) => {
  const isEdit = !!initialData;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fieldSize = isMobile ? "small" : "medium";
  const { setToast } = useToast();
  const api = useAxios();
  const router = useRouter();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<EventFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData || { status: "Pending" }
  });

  const onSubmit = async (data: any) => {
    const request = isEdit ? api.put(`/api/events/${initialData.eventId}`, data) : api.post("/api/events", data);
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
            <TextField fullWidth size={fieldSize} label="Event Title" {...register("title")} error={!!errors.title} helperText={errors.title?.message ?? ""} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size={fieldSize} label="Venue" {...register("eventVenue")} error={!!errors.eventVenue} helperText={errors.eventVenue?.message ?? ""} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select fullWidth size={fieldSize} label="Event Type" defaultValue={initialData?.eventType || ""} {...register("eventType")} error={!!errors.eventType} helperText={errors.eventType?.message ?? ""}>
              <MenuItem value="Wedding">Wedding</MenuItem>
              <MenuItem value="Corporate">Corporate</MenuItem>
              <MenuItem value="Birthday">Birthday</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth size={fieldSize} label="Date" type="date" InputLabelProps={{ shrink: true }} {...register("eventDate")} error={!!errors.eventDate} helperText={errors.eventDate?.message ?? ""} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth size={fieldSize} label="Start Time" type="time" InputLabelProps={{ shrink: true }} {...register("startTime")} error={!!errors.startTime} helperText={errors.startTime?.message ?? ""} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth size={fieldSize} label="End Time" type="time" InputLabelProps={{ shrink: true }} {...register("endTime")} error={!!errors.endTime} helperText={errors.endTime?.message ?? ""} />
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard icon={Person} title="Client Information" subtitle="Client contact details">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size={fieldSize} label="Client Name" {...register("clientName")} error={!!errors.clientName} helperText={errors.clientName?.message ?? ""} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size={fieldSize} label="Client Phone" {...register("clientPhone")} error={!!errors.clientPhone} helperText={errors.clientPhone?.message ?? ""} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth size={fieldSize} label="Client Email" {...register("clientEmail")} error={!!errors.clientEmail} helperText={errors.clientEmail?.message ?? ""} />
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
