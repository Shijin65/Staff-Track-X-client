import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    isSuperAdmin: boolean;
    isActive: boolean;
    role: {
      roleId: string;
      name: string;
    };
  };
  availableAccess?: {
    CreateUser?: boolean;
    DeleteUser?: boolean;
    UpdateUser?: boolean;
    ViewUser?: boolean;
    VerifyUser?: boolean;
    ViewEvent?: boolean;
    CreateEvent?: boolean;
    DeleteEvent?: boolean;
    UpdateEvent?: boolean;
    MarkAttendance?: boolean;
    ViewAttendance?: boolean;
    ViewClientInfo?: boolean;
  };
}

interface UserStore {
  user: User | null;
  setUser: (data: User) => void;
  clearUser: () => void;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      hasHydrated: false,

      setUser: (data) => set({ user: data }),

      clearUser: () => set({ user: null }),

      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }

  )
);