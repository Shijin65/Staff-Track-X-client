"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store";


/** Hook options type */
type UseAuthUserOptions = {
    redirectTo?: string;
    redirectIfFound?: boolean;
    preventRedirection?: boolean;
    isLandingPage?: boolean;
};

export const useAuthUser = (
    {
        redirectTo,
        redirectIfFound = false,
        preventRedirection = false,
        isLandingPage = false,
    }: UseAuthUserOptions = {}
) => {
    const user = useUserStore((state) => state.user);
    const hasHydrated = useUserStore((state) => state.hasHydrated);
    const router = useRouter();

    useEffect(() => {
        if (!hasHydrated || preventRedirection || (!redirectTo && !isLandingPage)) return;

        const isLoggedOut = !user;

        if (isLoggedOut) {
            router.push("/auth/login");
            return;
        }

        if (user && redirectIfFound && redirectTo) {
            router.push(redirectTo);
        }
    }, [user, redirectIfFound, redirectTo, preventRedirection, isLandingPage, router, hasHydrated]);

    return { user };
};
