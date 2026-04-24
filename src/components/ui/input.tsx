import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

function Input({ className, type, placeholder, ...props }: TextFieldProps & { placeholder?: string }) {
  return (
    <TextField
      fullWidth
      type={type as string}
      placeholder={placeholder}
      variant="outlined"
      size="small"
      {...props}
    />
  );
}

export { Input };
