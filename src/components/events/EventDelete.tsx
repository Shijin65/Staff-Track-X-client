"use client";

import React, { FormEvent } from "react";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import { useToast } from "@/lib/store/useToastStore";
import { useAxios } from "@/lib/hooks/useAxios";
import { handleAxiosError } from "@/lib/utils/axiosError";
import { DeleteConfirmation } from "../ui";

interface EventDeleteProps {
    uid: string[];
    handleClose: () => void;
    mutate: () => void;
}

const EventDelete = ({ uid, handleClose, mutate }: EventDeleteProps) => {
    const api = useAxios();
    const { setToast } = useToast();

    const title = uid.length === 1 ? "Event" : "Events";

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!uid || uid.length === 0) return;

        try {
            let response;

            if (uid.length === 1) {
                response = await api.delete(`/api/events/${uid[0]}`);
            } else {
                response = await api.post(`/api/events/multiple-delete`, {
                    ids: uid,
                });
            }

            if (response.status === 200) {
                mutate();
                handleClose();

                setToast({
                    message: uid.length === 1
                        ? "Event Deleted."
                        : `${uid.length} Events Deleted.`,
                    type: "success",
                    open: true,
                });
            }
        } catch (error: unknown) {
            const message = handleAxiosError(error, "Failed to delete event.");
            setToast({
                message: message,
                type: "error",
                open: true
            });
        }
    };

    return (
        <DeleteConfirmation
            icon={<EventBusyOutlinedIcon fontSize="large" color="error" />}
            title={`Deleting ${title}?`}
            subtitle={`Warning: Permanent deletion of ${title}.`}
            handleSubmit={handleSubmit}
            handleClose={handleClose}
        />
    );
};

export default EventDelete;
