import { useDeferredValue, useEffect, useState } from "react";

type WindowSize = {
  width: number;
  height: number;
};

export const useWindowSize = (): WindowSize => {
  const hasWindow = typeof window !== "undefined";

  const [windowSize, setWindowSize] = useState<WindowSize>({
    height: hasWindow ? window.innerHeight : 0,
    width: hasWindow ? window.innerWidth : 0,
  });

  const deferred = useDeferredValue(windowSize);

  useEffect(() => {
    if (!hasWindow) return;

    const handleResize = (): void => {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [hasWindow]);

  return deferred;
};