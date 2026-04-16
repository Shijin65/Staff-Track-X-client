"use client";

import React, { ReactNode, FormEvent } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Button, IconButton, useMediaQuery, useTheme, Box, Typography } from "@mui/material";

interface DeleteConfirmationProps {
    title: string;
    subtitle: string;
    icon?: ReactNode;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleClose: () => void;
    buttonLabels?: [string, string]; // [confirm, cancel]
}

const DeleteConfirmation = ({
    title,
    subtitle,
    icon,
    handleSubmit,
    handleClose,
    buttonLabels = ["Delete", "Cancel"],
}: DeleteConfirmationProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 items-center justify-center ">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: { xs: 2, sm: 3 },
                        borderRadius: "50%",
                        bgcolor: "rgba(239, 68, 68, 0.08)",
                        color: "error.main",
                        mb: 2,
                        "& > svg": { fontSize: { xs: 32, sm: 44 } }
                    }}
                >
                    {icon ?? <DeleteOutlineIcon />}
                </Box>

                <div className="text-center space-y-2">
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 700, 
                            color: "text.primary",
                            fontSize: { xs: "1.125rem", sm: "1.25rem" }
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: "text.secondary",
                            maxWidth: "280px",
                            mx: "auto",
                            lineHeight: 1.6
                        }}
                    >
                        {subtitle}
                    </Typography>
                </div>
            </div>

            <div 
                className={`flex  gap-3 items-center justify-center pt-8 w-full`}
            >
                <Button
                    variant="outlined"
                    startIcon={<CancelOutlinedIcon />}
                    onClick={handleClose}
                    size={isMobile ? "small" : "medium"}
                    sx={{ 
                        borderRadius: 2.5, 
                        px: { xs: 2, sm: 4 },
                        // minWidth: isMobile ? "100%" : "auto",
                        borderColor: "divider",
                        color: "text.secondary",
                        "&:hover": {
                            bgcolor: "action.hover",
                            borderColor: "divider",
                        }
                    }}
                >
                    {buttonLabels[1]}
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    size={isMobile ? "small" : "medium"}
                    sx={{ 
                        borderRadius: 2.5, 
                        px: { xs: 4, sm: 4 },
                        // minWidth: isMobile ? "100%" : "auto",
                        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
                        "&:hover": {
                            boxShadow: "0 6px 16px rgba(239, 68, 68, 0.35)",
                        }
                    }}
                >
                    {buttonLabels[0]}
                </Button>
            </div>
        </form>
    );
};

export default DeleteConfirmation;