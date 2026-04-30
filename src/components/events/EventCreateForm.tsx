/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
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
  CircularProgress,
} from "@mui/material";
import {
  Event,
  LocationOn,
  Person,
  Info,
  GroupAdd,
  Add,
  Delete,
} from "@mui/icons-material";
import useSWR from "swr";
import { useToast } from "@/lib/store/useToastStore";
import { useAuthUser, useAxios } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { EventLocationPickerWrapper } from "./EventLocationWrapper";
import { handleAxiosError } from "@/lib/utils/axiosError";
import { ModuleHeader } from "@/components/ui";

const schema = yup.object({
  title: yup.string().required("Title is required."),
  eventVenue: yup.string().required("Venue is required."),
  eventType: yup.string().required("Event type is required."),
  eventDate: yup.string().required("Date is required."),
  startTime: yup.string().required("Start time is required."),
  reportingTime: yup.string().required("Reporting time is required."),
  clientName: yup.string().required("Client name is required."),
  clientPhone: yup.string().required("Client phone is required."),
  address: yup.string().optional().notRequired(),
  district: yup.string().optional().notRequired(),
  city: yup.string().optional().notRequired(),
  state: yup.string().optional().notRequired(),
  country: yup.string().optional().notRequired(),
  status: yup.string().default("Pending"),
  description: yup.string().optional().notRequired(),
  locationInstructions: yup.string().optional().notRequired(),
  latitude: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .optional(),
  longitude: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .optional(),
  staffRequirements: yup.array().of(
    yup.object({
      roleId: yup.string().required("Role is required"),
      count: yup.number()
        .transform((value) => (Number.isNaN(value) ? undefined : value))
        .required("Count is required")
        .min(1, "At least 1"),
    })
  ).default([]),
}).required();

const fields = [
  "title",
  "eventVenue",
  "eventType",
  "eventDate",
  "startTime",
  "reportingTime",
  "clientName",
  "clientPhone",
  "address",
  "district",
  "city",
  "state",
  "country",
  "status",
  "description",
  "locationInstructions",
  "latitude",
  "longitude",
  "staffRequirements",
]

type EventFormData = yup.InferType<typeof schema>;

interface eventFormProps {
  eId?: string;
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

export const EventCreateForm: React.FC<eventFormProps> = ({
  eId,
}) => {
  const isEdit = !!eId;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fieldSize = isMobile ? "small" : "medium";
  const { setToast } = useToast();
  const api = useAxios();
  const router = useRouter();
  const { user } = useAuthUser();
  const canViewClientInfo = user?.availableAccess?.ViewClientInfo || false;
  const [isLoading, setIsLoading] = useState(false);

  const { data: rolesData, isLoading: rolesLoading } = useSWR("/api/meta/roles");
  const roles = rolesData?.payload?.roles || [];

  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<EventFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: "",
      eventVenue: "",
      eventType: "",
      eventDate: "",
      startTime: "",
      reportingTime: "",
      clientName: "",
      clientPhone: "",
      address: "",
      district: "",
      city: "",
      state: "",
      country: "",
      status: "Pending",
      description: "",
      locationInstructions: "",
      latitude: null,
      longitude: null,
      staffRequirements: [],
    }
  });
  const { fields: staffFields, append: appendStaff, remove: removeStaff } = useFieldArray({
    control,
    name: "staffRequirements",
  });

  const currentRequirements = watch("staffRequirements") || [];

  async function getEvent() {
    setIsLoading(true);
    if (!eId) return;
    try {
      const res = await api.get(`/api/events/${eId}`);
      if (res.status === 200) {
        const data = res?.data?.payload || {};
        fields.forEach((f) => {
          const field = f as keyof EventFormData;
          switch (field) {
            case "staffRequirements":
              setValue(field as "staffRequirements", data[field] ?? []);
              break;
            case "latitude":
            case "longitude":
              setValue(field as any, data[field] ?? null);
              break;
            default:
              setValue(field as any, data[field] ?? "");
              break;
          }
        });
      }
    } catch (err: unknown) {
      handleAxiosError(err, "Failed to fetch user");
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      if (isEdit) {
        await api.put(`/api/events/${eId}`, data)
      } else {
        await api.post("/api/events", data);
      }
      setToast({ message: `Event ${isEdit ? "updated" : "created"} successfully.`, type: "success", open: true });
    } catch (err: unknown) {
      const message = handleAxiosError(err, "Failed to create event");
      setToast({ message, type: "error", open: true });
    }
  };

  useEffect(() => {
    if (eId) {
      getEvent()
    }
  }, [eId]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={50} color="primary" />
      </Box>
    );
  }
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: "100%" }}>
      <ModuleHeader
        title={isEdit ? "Update Event" : "Create Event"}
        onBack={() => router.push("/events")}
      />
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
                <TextField {...field} value={field.value || ""} select fullWidth size={fieldSize} label="Event Type" error={!!errors.eventType} helperText={errors.eventType?.message ?? ""}>
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
                <TextField {...field} value={field.value || ""} select fullWidth size={fieldSize} label="Status" error={!!errors.status} helperText={errors.status?.message ?? ""}>
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
              name="reportingTime"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="Reporting Time" type="time" InputLabelProps={{ shrink: true }} error={!!errors.reportingTime} helperText={errors.reportingTime?.message ?? ""} />
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

        </Grid>
      </SectionCard>

      {canViewClientInfo && <SectionCard icon={Person} title="Client Information" subtitle="Client contact details">
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
      </SectionCard>}

      <SectionCard icon={GroupAdd} title="Staff Requirements" subtitle="Specify roles and headcount needed">
        {staffFields.map((item, index) => (
          <Grid container spacing={2} key={item.id} sx={{ mb: 2, alignItems: "flex-start" }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name={`staffRequirements.${index}.roleId` as const}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    size={fieldSize}
                    label="Role"
                    error={!!errors.staffRequirements?.[index]?.roleId}
                    helperText={errors.staffRequirements?.[index]?.roleId?.message ?? ""}
                  >
                    <MenuItem disabled value="">
                      <em>Select a role</em>
                    </MenuItem>
                    {!rolesLoading && roles.map((r: { roleId: string; name: string }) => {
                      const isSelected = currentRequirements.some((req: { roleId: string; count: number }, i: number) => i !== index && req.roleId === r.roleId);
                      return (
                        <MenuItem key={r.roleId} value={r.roleId} disabled={isSelected}>
                          {r.name.charAt(0).toUpperCase() + r.name.slice(1).replace(/_/g, " ")}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 10, sm: 4 }}>
              <Controller
                name={`staffRequirements.${index}.count` as const}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    size={fieldSize}
                    label="Count"
                    error={!!errors.staffRequirements?.[index]?.count}
                    helperText={errors.staffRequirements?.[index]?.count?.message ?? ""}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 2, sm: 2 }} sx={{ display: "flex", justifyContent: "center", pt: 0.5 }}>
              <Button color="error" onClick={() => removeStaff(index)}>
                <Delete />
              </Button>
            </Grid>
          </Grid>
        ))}
        <Button
          startIcon={<Add />}
          variant="outlined"
          onClick={() => appendStaff({ roleId: "", count: 1 })}
          sx={{ mt: 1 }}
        >
          Add Role Requirement
        </Button>
      </SectionCard>

      <SectionCard icon={LocationOn} title="Location Details" subtitle="Address and area details">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="latitude"
              control={control}
              render={({ field: latField }) => (
                <Controller
                  name="longitude"
                  control={control}
                  render={({ field: lngField }) => (
                    <Controller
                      name="address"
                      control={control}
                      render={({ field: addressField }) => (
                        <EventLocationPickerWrapper
                          location={
                            latField.value && lngField.value
                              ? { lat: latField.value, lng: lngField.value, name: addressField.value || "" }
                              : null
                          }
                          onChange={(loc) => {
                            if (loc) {
                              latField.onChange(loc.lat);
                              lngField.onChange(loc.lng);
                              if (loc.name) {
                                addressField.onChange(loc.name);
                              }
                              if (loc.address) {
                                const addr = loc.address;
                                const cty = addr.county || addr.town || addr.village || "";
                                const dist = addr.state_district || addr.county || "";
                                const st = addr.state || "";
                                const ctr = addr.country || "";

                                if (cty) setValue("city", cty, { shouldValidate: true });
                                if (dist) {
                                  setValue("district", dist.replace(" District", ""), { shouldValidate: true });
                                }
                                if (st) setValue("state", st, { shouldValidate: true });
                                if (ctr) setValue("country", ctr, { shouldValidate: true });
                              }
                            } else {
                              latField.onChange(null);
                              lngField.onChange(null);
                            }
                          }}
                        />
                      )}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="Address" multiline rows={2} error={!!errors.address} helperText={errors.address?.message ?? ""} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="District" error={!!errors.district} helperText={errors.district?.message ?? ""} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="City" error={!!errors.city} helperText={errors.city?.message ?? ""} />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth size={fieldSize} label="State" error={!!errors.state} helperText={errors.state?.message ?? ""} />
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
