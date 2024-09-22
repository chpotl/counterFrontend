import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAsyncInitialize<T>(asyncFunction: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setState(await asyncFunction());
    })();
  }, deps);

  return state;
}
