import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type WishlistValue = {
  has: (name: string) => boolean;
  toggle: (name: string) => boolean;
  count: number;
};

const STORAGE_KEY = "kopuri-wishlist";
const WishlistContext = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [names, setNames] = useState<string[]>([]);

  // Hydrate after mount so server and client markup match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setNames(JSON.parse(raw) as string[]);
    } catch {
      /* storage unavailable — the wishlist just starts empty */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    } catch {
      /* ignore */
    }
  }, [names]);

  const value = useMemo<WishlistValue>(() => {
    const has = (name: string) => names.includes(name);
    return {
      has,
      count: names.length,
      toggle: (name: string) => {
        const next = !names.includes(name);
        setNames((prev) => (next ? [...prev, name] : prev.filter((n) => n !== name)));
        return next;
      },
    };
  }, [names]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
