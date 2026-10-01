import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { cartMessage, DELIVERY_ZONES, useCart, type ZoneId } from "@/lib/cart";
import { whatsappUrl } from "@/lib/site";

export function CartSheet() {
  const {
    lines,
    count,
    subtotal,
    weightKg,
    zone,
    setZone,
    deliveryRate,
    delivery,
    total,
    setQty,
    remove,
    clear,
    open,
    setOpen,
  } = useCart();

  const zoneLabel = DELIVERY_ZONES.find((z) => z.id === zone)!.label;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="cart-panel flex w-full flex-col gap-0 bg-background p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border p-5 text-left">
          <SheetTitle className="font-display text-xl font-bold">
            Cart <span className="text-muted-foreground">({count})</span>
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-secondary">
              <ShoppingCart className="size-6 text-muted-foreground" />
            </span>
            <p className="font-display text-lg font-bold">Your cart is empty</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Add a karam, pickle or spice powder and it will show up here.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-base btn-soft mt-2 px-6"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-3 p-4">
                  <img
                    src={l.image}
                    alt={l.name}
                    width={160}
                    height={160}
                    className="size-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{l.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {l.size} · {l.price} each
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${l.name} ${l.size} from cart`}
                        onClick={() => remove(l.id)}
                        className="-mr-1 -mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-primary sm:size-9"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${l.name} ${l.size}`}
                          onClick={() => setQty(l.id, l.qty - 1)}
                          className="qty-btn size-10 sm:size-8"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">
                          {l.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${l.name} ${l.size}`}
                          onClick={() => setQty(l.id, l.qty + 1)}
                          className="qty-btn size-10 sm:size-8"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="font-display text-base font-bold text-primary tabular-nums">
                        ₹{l.amount * l.qty}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border bg-card p-5">
              <label
                htmlFor="delivery-zone"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                Deliver to
              </label>
              <select
                id="delivery-zone"
                value={zone}
                onChange={(e) => setZone(e.target.value as ZoneId)}
                className="zone-select mt-2"
              >
                {DELIVERY_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.label} — ₹{z.rate}/kg
                  </option>
                ))}
              </select>

              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold tabular-nums">₹{subtotal}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    Delivery · {weightKg.toFixed(2)}kg × ₹{deliveryRate}
                  </dt>
                  <dd className="font-semibold tabular-nums">₹{delivery}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-border pt-2.5">
                  <dt className="font-display text-base font-bold">Grand Total</dt>
                  <dd className="font-display text-2xl font-bold text-primary tabular-nums">
                    ₹{total}
                  </dd>
                </div>
              </dl>

              <a
                href={whatsappUrl(cartMessage(lines, subtotal, delivery, total, zoneLabel))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-hero mt-4 w-full"
              >
                Proceed to Checkout
              </a>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <WhatsAppIcon className="size-3.5 shrink-0 text-leaf" />
                Your order is confirmed over WhatsApp
              </p>
              <button type="button" onClick={clear} className="btn-base btn-soft mt-3 w-full">
                Clear cart
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
