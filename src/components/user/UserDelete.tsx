"use client";

import React, { FormEvent } from "react";
import { AxiosError } from "axios";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import DeleteConfirmation from "../ui/delete-confirmation";
import { useToast } from "@/lib/store/useToastStore";
import { useAxios } from "@/lib/hooks/useAxios";

interface UserDeleteProps {
    uid: string[];
    handleClose: () => void;
    mutate: () => void;
}

interface ApiError {
  message: string;
}

const UserDelete = ({ uid, handleClose, mutate }: UserDeleteProps) => {
    const api = useAxios();
    const { setToast } = useToast();

    const title = uid.length === 1 ? "User" : "Users";

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!uid || uid.length === 0) return;

        try {
            let response;

            if (uid.length === 1) {
                response = await api.delete(`/api/users/${uid[0]}`);
            } else {
                response = await api.post(`/api/users/multiple-delete`, {
                    ids: uid,
                });
            }

            if (response.status === 200) {
                mutate();
                handleClose();

                setToast({
                    message: uid.length === 1
                        ? "User Deleted."
                        : `${uid.length} Users Deleted.`,
                    type: "success",
                    open: true,
                });
            }
        } catch (error) {
            const err = error as AxiosError<ApiError>;
            setToast({
                message: err.response?.data?.message ||
                (uid.length === 1
                    ? "Failed to Delete User."
                    : `Failed To Delete ${uid.length} Users.`),
                type: "error",
                open: true,
            });
        }
    };

    return (
        <DeleteConfirmation
            icon={<GroupOutlinedIcon fontSize="large" color="error" />}
            title={`Deleting ${title}?`}
            subtitle={`Warning: Permanent deletion of ${title}.`}
            handleSubmit={handleSubmit}
            handleClose={handleClose}
        />
    );
};

export default UserDelete;