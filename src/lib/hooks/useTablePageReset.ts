import { useEffect } from "react";
import { useDebounce } from "./useDebounce";

type SetPage = React.Dispatch<React.SetStateAction<number>>;

/**
 * Hook for resetting the page number in the table.
 */
export const useTablePageReset = (
  length: number,
  query: string,
  setPage: SetPage,
  page: number,
  dependencies: unknown[] = []
): void => {
  const lengthDeferred = useDebounce<number>(length, 300);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, ...dependencies, setPage]);

  useEffect(() => {
    if (page > 1 && lengthDeferred === 0) {
      setPage((prev) => prev - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lengthDeferred, setPage]);
};