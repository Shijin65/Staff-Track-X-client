import axios from "axios";
import memoize from "memoize";
import { API_URL } from "../utils/constance";
import { useLoader } from "../store";
import { useUserStore } from "../store";
import { useRouter } from "next/navigation";

export const useAxios = () => {
  const { setLoading } = useLoader();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();

  const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  const refreshTokenHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );
      setUser({
        user: data.payload.user,
        availableAccess: data.payload.permissions,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.log(err?.response?.data?.message || err?.message || "Refresh token failed");
      } else {
        console.log("Refresh token failed");
      }
      clearUser();
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const memorizedRefresh = memoize(refreshTokenHandler, {
    maxAge: 10000,
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const { config, response } = error;

      if (response?.status === 401 && !config._retry) {
        config._retry = true;

        try {
          await memorizedRefresh();
          return instance(config);
        } catch (err) {
          router.push("/auth/login");
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};