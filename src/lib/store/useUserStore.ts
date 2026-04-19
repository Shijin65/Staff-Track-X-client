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
    CreateUserRole?: boolean;
    DeleteUser?: boolean;
    DeleteUserRole?: boolean;
    UpdateUser?: boolean;
    UpdateUserRole?: boolean;
    ViewUser?: boolean;
    ViewUserRole?: boolean;
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