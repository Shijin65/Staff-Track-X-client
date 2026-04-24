import React from "react";
import { Backdrop, Box, Typography, CircularProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { keyframes } from "@mui/system";

const pulse = keyframes`
  0%, 100% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
`;

export const MainLoader = () => {
  return (
    <Backdrop
      open
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>

        {/* Loader Container */}
        <Box sx={{ position: "relative", width: 50, height: 50 }}>

          {/* Progress Ring */}
          <CircularProgress
            size={50}
            thickness={4}
            color="primary"
          />

          {/* Center Icon (perfectly centered using flex) */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: `${pulse} 1.5s ease-in-out infinite`,
            }}
          >
            <PersonIcon sx={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.3))", fontSize: 30, color: "#fff" }} />
          </Box>
        </Box>
      </Box>
    </Backdrop>
  );
};