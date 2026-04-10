"use client";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Fragment, ReactNode } from "react";
import { IconButton } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { Close } from "@mui/icons-material";

type ModalSize = "small" | "medium" | "large";

interface CustomModalProps {
  isOpen: boolean;
  handleClose: () => void;
  children: ReactNode;
  title?: string;
  size?: ModalSize;
  boxProps?: SxProps<Theme>;
}

export const CustomModal = ({
  isOpen,
  handleClose,
  children,
  title,
  size = "medium",
  boxProps,
}: CustomModalProps) => {
  const style: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "98%",
    maxHeight: "98%",
    bgcolor: "transparent",
    boxShadow: 24,
    overflowX: "hidden",
    ...boxProps,
  };

  return (
    <Fragment>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={style}
          className={
            size === "medium"
              ? "modal-box modal-width"
              : size === "small"
              ? "w-[30%]"
              : ""
          }
        >
          <div className="bg-white px-4 rounded-2xl py-4 pb-5 2xl:py-5 2xl:pb-6">
            <header className="flex items-center justify-between mb-3">
              <h1 className="w-[90%] font-semibold text-lg 2xl:text-xl text-ellipsis text-gray-500 pl-0 sm:pl-3">
                {title || ""}
              </h1>

              <IconButton onClick={handleClose} className="modalCloseBtn">
                <Close className="w-5 h-5" />
              </IconButton>
            </header>

            <div className="mt-2 2xl:mt-3 mx-0 sm:mx-3">
              {children}
            </div>
          </div>
        </Box>
      </Modal>
    </Fragment>
  );
};