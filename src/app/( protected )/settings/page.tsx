"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  useTheme,
} from "@mui/material";
import {
  InfoOutlined,
  ContactSupportOutlined,
  HelpOutline,
  Settings as SettingsIcon,
} from "@mui/icons-material";

export default function SettingsPage() {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", maxWidth: 1536, px: { xs: 2, xl: 4 }, margin: "0 auto", pb: 10 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(var(--primary-rgb), 0.1)", color: "primary.main" }}>
             <SettingsIcon fontSize="large" />
        </Box>
        <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ mb: 0 }}>
             Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
            Manage your preferences and find help resources.
            </Typography>
        </Box>
      </Box>

      {/* Help & Resources Section */}
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
          Help and Resources
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, textAlign: "center", cursor: "pointer", "&:hover": { bgcolor: "rgba(var(--primary-rgb), 0.03)", borderColor: "primary.main", transform: "translateY(-4px)", boxShadow: "0 10px 20px rgba(0,0,0,0.04)" }, transition: "all 0.2s" }}>
              <InfoOutlined color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle2" fontWeight={700}>User Guide</Typography>
              <Typography variant="caption" color="text.secondary">Learn Caters Hub</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, textAlign: "center", cursor: "pointer", "&:hover": { bgcolor: "rgba(var(--primary-rgb), 0.03)", borderColor: "primary.main", transform: "translateY(-4px)", boxShadow: "0 10px 20px rgba(0,0,0,0.04)" }, transition: "all 0.2s" }}>
              <ContactSupportOutlined color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle2" fontWeight={700}>Support Team</Typography>
              <Typography variant="caption" color="text.secondary">Get assisted help</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, textAlign: "center", cursor: "pointer", "&:hover": { bgcolor: "rgba(var(--primary-rgb), 0.03)", borderColor: "primary.main", transform: "translateY(-4px)", boxShadow: "0 10px 20px rgba(0,0,0,0.04)" }, transition: "all 0.2s" }}>
              <HelpOutline color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle2" fontWeight={700}>FAQs</Typography>
              <Typography variant="caption" color="text.secondary">Quick answers</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
