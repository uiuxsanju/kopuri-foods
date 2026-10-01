import { useEffect, useRef, useState } from "react";

import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { BRAND, GENERAL_ENQUIRY } from "@/lib/site";

/**
 * Floating WhatsApp button.
 *
 * On a phone the button sits right where a product card's "Add to Cart"
 * button scrolls past, so it steps out of the way whenever it would cover a
 * card action, and comes back as soon as the overlap is gone.
 */
export function FloatingWhatsApp() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const f = el.getBoundingClientRect();
      // A little breathing room so the button never crowds a CTA either.
      const pad = 8;
      const clash = [
        ...document.querySelectorAll<HTMLElement>(
          ".product-card .btn-base, .product-card .wish-btn",
        ),
      ].some((b) => {
        const r = b.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return false;
        return !(
          r.right < f.left - pad ||
          r.left > f.right + pad ||
          r.bottom < f.top - pad ||
          r.top > f.bottom + pad
        );
      });
      setHidden(clash);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <a
      ref={ref}
      href={GENERAL_ENQUIRY}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with Kopuri Foods on WhatsApp at ${BRAND.phoneDisplay}`}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={`fixed bottom-5 right-4 z-30 flex size-13 items-center justify-center rounded-full bg-leaf text-white shadow-[var(--shadow-lift)] transition-[opacity,transform] duration-200 sm:right-5 sm:size-14 ${
        hidden ? "pointer-events-none scale-90 opacity-0" : "opacity-100 hover:scale-105"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppIcon className="size-6 sm:size-7" />
    </a>
  );
}
