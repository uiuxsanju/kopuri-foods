import { useEffect, useState } from "react";
import { Check, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/lib/cart";
import { variantsOf, type Product } from "@/data/products";

export function ProductDialog({
  product,
  initialSize,
  onOpenChange,
}: {
  product: Product | null;
  initialSize?: string | undefined;
  onOpenChange: (open: boolean) => void;
}) {
  const [size, setSize] = useState(initialSize ?? "250g");
  const [qty, setQty] = useState(1);
  const { add, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    if (product) {
      setSize(initialSize ?? "250g");
      setQty(1);
    }
  }, [product, initialSize]);

  if (!product) return null;

  const variants = variantsOf(product);
  const selected = variants.find((v) => v.size === size) ?? variants[0]!;

  const handleAdd = () => {
    add(product, selected.size, selected.price, qty);
    onOpenChange(false);
    setCartOpen(true);
    toast.success("Added to cart", {
      description: `${product.name} · ${selected.size} × ${qty}`,
    });
  };

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="product-modal max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-y-auto rounded-3xl border-border bg-card p-0 sm:w-full">
        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-square overflow-hidden sm:rounded-l-3xl">
            <img
              src={product.image}
              alt={`${product.name} — ${product.blurb}`}
              width={1008}
              height={1008}
              className="h-full w-full object-cover"
            />
            {product.tag && (
              <span className={`product-tag tag-${product.tag.split(" ")[0]!.toLowerCase()}`}>
                {product.tag}
              </span>
            )}
          </div>

          <div className="flex flex-col p-5 sm:p-7">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="font-display text-2xl font-bold leading-tight tracking-tight">
                {product.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">{product.te}</p>
              <DialogDescription className="text-[0.95rem] leading-relaxed">
                {product.blurb}
              </DialogDescription>
            </DialogHeader>

            {product.rating && (
              <div className="mt-3 flex items-center gap-1.5">
                <span className="flex gap-0.5 text-accent" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < Math.round(product.rating!.stars) ? "fill-current" : "opacity-30"
                      }`}
                    />
                  ))}
                </span>
                <span className="text-sm font-semibold">({product.rating.stars})</span>
                <span className="text-sm text-muted-foreground">
                  {product.rating.reviews}+ reviews
                </span>
              </div>
            )}

            <div className="price-box mt-5">
              <p className="price-label">{selected.size} pack</p>
              <p className="price-main text-3xl">{selected.price}</p>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Choose size
              </p>
              <div className="flex gap-2">
                {variants.map((v) => (
                  <button
                    key={v.size}
                    type="button"
                    onClick={() => setSize(v.size)}
                    aria-pressed={v.size === size}
                    aria-label={`${v.size} — ${v.price}`}
                    className="size-chip flex-1"
                    data-active={v.size === size}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Qty
              </p>
              <div className="flex items-center gap-1 rounded-full border border-border p-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="qty-btn"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="qty-btn"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <ul className="mt-5 space-y-1.5 text-sm text-muted-foreground">
              {[
                "Stone ground in small batches",
                "No added colour or preservatives",
                "Leak-proof, double-sealed packing",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-leaf" />
                  {line}
                </li>
              ))}
            </ul>

            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <Truck className="mt-0.5 size-4 shrink-0" />
              Delivery ₹80/kg in AP &amp; Telangana · ₹110/kg Chennai &amp; Bangalore · ₹150/kg
              elsewhere
            </p>

            <button type="button" onClick={handleAdd} className="btn-base btn-hero mt-6 w-full">
              <ShoppingCart className="size-4 shrink-0" />
              Add {qty > 1 ? `${qty} ` : ""}to Cart · ₹{selected.amount * qty}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
