import { useEffect, useRef, useState } from "react";

/**
 * Hook for debouncing values
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};