import React from "react";
import { Portal } from "@mui/material";
import { MainLoader } from "./main-loader";

export const GlobalLoader = ({ loading }: { loading: boolean }) => {
    return loading ? (
        <Portal>
            <MainLoader />
        </Portal>
    ) : null
}


