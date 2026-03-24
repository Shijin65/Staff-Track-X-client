"use client";

import React, { useState } from "react";
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface PasswordInputProps {
  name?: string;
  placeholder?: string;
  required?: boolean;
  label?: string;
  className?: string;
  size?: "small" | "medium";
  autoComplete?: string;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
  startAdornment?: React.ReactNode;
  sx?: any;
  [key: string]: any;
}

function PasswordField({
  name,
  placeholder,
  required,
  label,
  size = "medium",
  autoComplete = "off",
  fullWidth = true,
  variant = "outlined",
  startAdornment,
  sx,
  ...rest
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl fullWidth={fullWidth} variant={variant} sx={sx}>
      {label && (
        <InputLabel shrink={true} size={size}>
          {label}
        </InputLabel>
      )}
      <OutlinedInput
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        required={required}
        label={label || ""}
        size={size}
        autoComplete={autoComplete}
        startAdornment={startAdornment}
        {...rest}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

export { PasswordField }; 