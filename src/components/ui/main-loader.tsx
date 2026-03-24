import React from "react";
import { CircularProgress, Backdrop, Box } from "@mui/material";

export const MainLoader = () => {
  return (
    <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 1, color: "#fff" }}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress color="primary" size={52} thickness={4} />
        <CircularProgress
          color="secondary"
          size={36}
          thickness={5}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animationDirection: "reverse",
          }}
        />
      </Box>
    </Backdrop>
  );
};