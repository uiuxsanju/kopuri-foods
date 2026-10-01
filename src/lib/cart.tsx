import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { sizeToKg, toNumber, type Product } from "@/data/products";

export type CartLine = {
  /** `${product name}__${size}` — one line per pack size. */
  id: string;
  name: string;
  size: string;
  price: string;
  amount: number;
  image: string;
  kg: number;
  qty: number;
};

/** Published delivery rates, charged per kilogram. */
export const DELIVERY_ZONES = [
  { id: "ap-ts", label: "AP & Telangana", rate: 80 },
  { id: "chn-blr", label: "Chennai & Bangalore", rate: 110 },
  { id: "other", label: "Other States", rate: 150 },
] as const;

export type ZoneId = (typeof DELIVERY_ZONES)[number]["id"];

type CartValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  weightKg: number;
  zone: ZoneId;
  setZone: (z: ZoneId) => void;
  deliveryRate: number;
  delivery: number;
  total: number;
  add: (product: Product, size: string, price: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const STORAGE_KEY = "kopuri-cart";
const ZONE_KEY = "kopuri-zone";
const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [zone, setZone] = useState<ZoneId>("ap-ts");
  const [open, setOpen] = useState(false);

  // Hydrate after mount so server and client markup match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
      const z = window.localStorage.getItem(ZONE_KEY) as ZoneId | null;
      if (z && DELIVERY_ZONES.some((d) => d.id === z)) setZone(z);
    } catch {
      /* storage unavailable — the cart just starts empty */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      window.localStorage.setItem(ZONE_KEY, zone);
    } catch {
      /* storage unavailable — cart still works for this visit */
    }
  }, [lines, zone]);

  const add = useCallback((product: Product, size: string, price: string, qty = 1) => {
    const id = `${product.name}__${size}`;
    setLines((prev) => {
      const found = prev.find((l) => l.id === id);
      // Same product and size already in the cart: raise the quantity, don't duplicate.
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      return [
        ...prev,
        {
          id,
          name: product.name,
          size,
          price,
          amount: toNumber(price),
          image: product.image,
          kg: sizeToKg(size),
          qty,
        },
      ];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.amount * l.qty, 0);
    const weightKg = lines.reduce((n, l) => n + l.kg * l.qty, 0);
    const deliveryRate = DELIVERY_ZONES.find((d) => d.id === zone)!.rate;
    const delivery = lines.length ? Math.round(weightKg * deliveryRate) : 0;
    return {
      lines,
      count,
      subtotal,
      weightKg,
      zone,
      setZone,
      deliveryRate,
      delivery,
      total: subtotal + delivery,
      add,
      setQty,
      remove,
      clear,
      open,
      setOpen,
    };
  }, [lines, zone, add, setQty, remove, clear, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** Formats the cart as a readable WhatsApp order message. */
export function cartMessage(
  lines: CartLine[],
  subtotal: number,
  delivery: number,
  total: number,
  zoneLabel: string,
): string {
  const items = lines
    .map((l, i) => `${i + 1}. ${l.name} — ${l.size} x ${l.qty} = ₹${l.amount * l.qty}`)
    .join("\n");
  return [
    "Hello Kopuri Foods, I would like to place this order:",
    "",
    items,
    "",
    `Subtotal: ₹${subtotal}`,
    `Delivery (${zoneLabel}): ₹${delivery}`,
    `*Total: ₹${total}*`,
    "",
    "Please confirm and share the payment details.",
  ].join("\n");
}
