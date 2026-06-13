import { useEffect, useState } from "react";

/**
 * Returns seconds elapsed since `startedAt`. Updates once per second.
 * Returns 0 when `startedAt` is null.
 */
export function useElapsedTime(startedAt: number | null): number {
  const [seconds, setSeconds] = useState(() =>
    startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0,
  );

  useEffect(() => {
    if (!startedAt) {
      setSeconds(0);
      return;
    }
    setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    const interval = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return seconds;
}
