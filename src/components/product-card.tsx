import { useEffect, useRef, useState } from "react";
import { Check, Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { variantsOf, type Product } from "@/data/products";

function Rating({ stars, reviews }: { stars: number; reviews: number }) {
  return (
    <div className="mt-2 flex items-center gap-1.5">
      <span className="flex gap-0.5 text-accent" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`size-3.5 ${i < Math.round(stars) ? "fill-current" : "opacity-30"}`}
          />
        ))}
      </span>
      <span className="sr-only">{`Rated ${stars} out of 5 from ${reviews} reviews`}</span>
      <span aria-hidden="true" className="text-[0.8rem] font-semibold">
        ({stars})
      </span>
      <span aria-hidden="true" className="text-[0.8rem] text-muted-foreground">
        {reviews}+ reviews
      </span>
    </div>
  );
}

export function ProductCard({
  product,
  onView,
}: {
  product: Product;
  onView: (product: Product, size: string) => void;
}) {
  const variants = variantsOf(product);
  // Smallest pack is pre-selected, so the headline price is the "starting from" price.
  const [active, setActive] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selected = variants[active]!;
  const { add, setOpen } = useCart();
  const wishlist = useWishlist();
  const wished = wishlist.has(product.name);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const handleAdd = () => {
    add(product, selected.size, selected.price);
    setOpen(true);
    setJustAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1600);
    toast.success("Added to cart", {
      description: `${product.name} · ${selected.size} · ${selected.price}`,
    });
  };

  const handleWish = () => {
    const now = wishlist.toggle(product.name);
    toast.success(now ? "Saved to wishlist" : "Removed from wishlist", {
      description: product.name,
    });
  };

  return (
    <article className="product-card group">
      <div className="product-media">
        <img
          src={product.image}
          alt={`${product.name} — ${product.blurb}`}
          loading="lazy"
          width={1008}
          height={1008}
          className="product-img"
        />
        {product.tag && (
          <span className={`product-tag tag-${product.tag.split(" ")[0]!.toLowerCase()}`}>
            {product.tag}
          </span>
        )}
        <button
          type="button"
          onClick={handleWish}
          aria-pressed={wished}
          aria-label={
            wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`
          }
          className="wish-btn"
        >
          <Heart className={`size-[18px] ${wished ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-blurb">{product.blurb}</p>

        {product.rating && <Rating stars={product.rating.stars} reviews={product.rating.reviews} />}

        <div className="price-box mt-3">
          <p className="price-label">{active === 0 ? "Starting from" : `${selected.size} pack`}</p>
          <p className="price-main">{selected.price}</p>
        </div>

        <div className="mt-3 flex gap-2" role="group" aria-label="Pack size">
          {variants.map((v, i) => (
            <button
              key={v.size}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`${v.size} — ${v.price}`}
              className="size-chip flex-1"
              data-active={i === active}
            >
              {v.size}
            </button>
          ))}
        </div>

        {/* mt-auto pins the actions to the bottom so every card ends at the same line */}
        <div className="mt-auto flex flex-col gap-2 pt-4 min-[360px]:flex-row">
          <button
            type="button"
            onClick={() => onView(product, selected.size)}
            className="btn-base btn-soft flex-1 whitespace-nowrap px-2 text-[0.8rem]"
          >
            <Eye className="size-4 shrink-0" />
            View Details
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="btn-base btn-hero flex-1 whitespace-nowrap px-2 text-[0.8rem]"
          >
            {justAdded ? (
              <>
                <Check className="size-4 shrink-0" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="size-4 shrink-0" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
