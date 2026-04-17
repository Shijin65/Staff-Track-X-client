import axios from "axios";

export const handleAxiosError = (
  err: unknown,
  fallbackMessage = "Something went wrong"
): string => {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data?.message ||
      err.message ||
      fallbackMessage
    );
  }
  return fallbackMessage;
};