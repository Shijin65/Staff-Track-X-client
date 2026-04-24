import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from "@mui/material";

interface ButtonProps extends MuiButtonProps {
  isLoading?: boolean;
}

function Button({ isLoading = false, disabled, children, ...props }: ButtonProps) {
  return (
    <MuiButton
      {...props}
      disabled={isLoading || disabled}
      startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : props.startIcon}
    >
      {children}
    </MuiButton>
  );
}

export { Button };
