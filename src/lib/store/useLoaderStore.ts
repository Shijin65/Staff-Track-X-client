import { create } from "zustand";

// Define the store type
interface LoaderType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Create store with type
const useLoaderStore = create<LoaderType>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

// Typed selector hook
export const useLoader = (): LoaderType =>
  useLoaderStore((state) => state);