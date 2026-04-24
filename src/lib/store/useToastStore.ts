import { create } from "zustand";
import { produce } from "immer";

/* -------------------- TYPES -------------------- */

export type Toast = {
  message: string;
  type: "success" | "error" | "info" | "warning";
  open: boolean;
  sticky: boolean;
};

type ToastStoreType = {
  toast: Toast;
  closeToast: () => void;
  setToast: (toast: Partial<Toast>) => void;
};

/* -------------------- INITIAL STATE -------------------- */

const initialState: Pick<ToastStoreType, "toast"> = {
  toast: {
    message: "",
    type: "success",
    open: false,
    sticky: false,
  },
};

/* -------------------- STORE -------------------- */

const useToastStore = create<ToastStoreType>((set, get) => ({
  ...initialState,

  closeToast: () =>
    set(
      produce((state: ToastStoreType) => {
        state.toast.open = false;
      })
    ),

  setToast: (toast) => {
    set(
      produce((state: ToastStoreType) => {
        state.toast = { ...state.toast, ...toast };
      })
    );

    if (toast.open && !toast.sticky) {
      setTimeout(() => {
        get().closeToast();
      }, 3000);
    }
  },
}));

/* -------------------- HOOK -------------------- */

export const useToast = (): ToastStoreType =>
  useToastStore((state) => state);