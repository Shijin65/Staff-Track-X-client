"use client";

import React, { ReactNode, FormEvent } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Button, IconButton } from "@mui/material";

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
    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col text-black gap-6 items-center justify-center">

                <IconButton
                    disabled
                    sx={{
                        p: 4,
                        bgcolor: "rgba(239, 68, 68, 0.1)",
                        color: "error.main",
                        "&.Mui-disabled": {
                            bgcolor: "rgba(239, 68, 68, 0.1)",
                            color: "error.main",
                        }
                    }}
                >
                    {icon ?? <DeleteOutlineIcon sx={{ fontSize: 40 }} />}
                </IconButton>

                <div className="text-center space-y-3">
                    <p className="text-gray-600 dark:text-slate-50 text-lg font-semibold">
                        {title}
                    </p>
                    <p className="text-gray-600 dark:text-slate-50">
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="text-gray-500 flex gap-2 items-center justify-center pt-6">

                <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    {buttonLabels[0]}
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<CancelOutlinedIcon />}
                    onClick={handleClose}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    {buttonLabels[1]}
                </Button>

            </div>
        </form>
    );
};

export default DeleteConfirmation;