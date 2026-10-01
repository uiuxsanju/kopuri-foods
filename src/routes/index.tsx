import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Flame,
  Leaf,
  Truck,
  Star,
  ChevronDown,
  Soup,
  Phone,
  Mail,
  MapPin,
  Heart,
} from "lucide-react";

import hero from "@/assets/hero.jpg";
import logo from "@/assets/logo.png";
import catKaram from "@/assets/cat-karam.jpg";
import catPickle from "@/assets/cat-pickle.jpg";
import catPowder from "@/assets/cat-powder.jpg";

import { CartSheet } from "@/components/cart-sheet";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { ProductCard } from "@/components/product-card";
import { ProductDialog } from "@/components/product-dialog";
import { Reveal } from "@/components/reveal";
import { ShopControls } from "@/components/shop-controls";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider, useCart } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { BRAND, GENERAL_ENQUIRY, MAP_URL, mailtoUrl } from "@/lib/site";
import {
  allProducts,
  karam,
  pickles,
  powders,
  searchProducts,
  type Category,
  type Product,
} from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kopuri Foods — Authentic Andhra Karam, Pickles & Spice Powders" },
      {
        name: "description",
        content:
          "Traditional Andhra karam powders, homemade non-veg pickles and freshly ground spice powders from Kopuri Foods. Delivered across India.",
      },
      { property: "og:title", content: "Kopuri Foods — Authentic Andhra Flavours" },
      {
        property: "og:description",
        content:
          "Traditional karam, homemade chicken and mutton pickles, and freshly ground spice powders made with love.",
      },
    ],
  }),
  component: IndexPage,
});

const faqs = [
  {
    q: "What products do you offer?",
    a: "Traditional Andhra karam and mirchi powders, homemade non-veg pickles (chicken, mutton, prawn and gongura varieties) and freshly ground spice powders like turmeric, dhaniya, sambar and rasam.",
  },
  {
    q: "What sizes are available?",
    a: "Every product is available in 250g, 500g and 1kg packs. Larger bulk quantities can be arranged on request.",
  },
  {
    q: "Do you deliver across India?",
    a: "Yes. We ship pan-India with careful leak-proof packing for the pickles.",
  },
  {
    q: "What are the delivery charges?",
    a: "AP & Telangana ₹80/kg, Chennai & Bangalore ₹110/kg, and all other states ₹150/kg. The cart works the charge out for you once you pick your region.",
  },
  {
    q: "How can I place an order?",
    a: "Add items to your cart and hit Proceed to Checkout — we confirm the order and share payment details on WhatsApp. You can also call or email us directly.",
  },
];

function Logo({ className = "h-11" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Kopuri Foods — Andhra Originals"
      width={900}
      height={450}
      className={`${className} w-auto object-contain`}
    />
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className={tone === "dark" ? "eyebrow text-accent" : "eyebrow"}>{eyebrow}</p>
      <h2 className="mt-3 text-[1.75rem] font-bold leading-tight sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {copy && (
        <p
          className={`mt-4 text-[0.95rem] sm:text-base ${
            tone === "dark" ? "text-maroon-foreground/80" : "text-muted-foreground"
          }`}
        >
          {copy}
        </p>
      )}
    </div>
  );
}

function ProductGrid({
  items,
  onView,
}: {
  items: Product[];
  onView: (p: Product, size: string) => void;
}) {
  return (
    <div className="product-grid mt-10 sm:mt-12">
      {items.map((p, i) => (
        // Stagger only within a row so a long grid never feels slow.
        <Reveal key={p.name} delay={(i % 4) * 60} className="h-full">
          <ProductCard product={p} onView={onView} />
        </Reveal>
      ))}
    </div>
  );
}

function Header({
  onSearch,
  onCategory,
}: {
  onSearch: () => void;
  onCategory: (c: Category | "all") => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setOpen } = useCart();

  const links: { label: string; category?: Category | "all"; href: string }[] = [
    { label: "Home", href: "#home" },
    { label: "Shop", href: "#shop", category: "all" },
    { label: "Karam & Powders", href: "#shop", category: "karam" },
    { label: "Pickles", href: "#shop", category: "pickles" },
    { label: "About", href: "#story" },
    { label: "Contact", href: "#footer" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-3 py-2.5">
        <a href="#home" aria-label="Kopuri Foods home" className="shrink-0">
          <Logo className="h-10 sm:h-12" />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => l.category && onCategory(l.category)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1.5">
          <button
            type="button"
            aria-label="Search products"
            onClick={onSearch}
            className="icon-btn"
          >
            <Search className="size-[18px]" />
          </button>
          <button
            type="button"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            onClick={() => setOpen(true)}
            className="icon-btn relative"
          >
            <ShoppingCart className="size-[18px]" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
          <a
            href={GENERAL_ENQUIRY}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-base btn-whatsapp hidden px-4 text-xs sm:inline-flex"
          >
            <WhatsAppIcon className="size-4" /> WhatsApp
          </a>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="icon-btn lg:hidden"
          >
            {menuOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-background lg:hidden">
          <div className="shell py-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => {
                  if (l.category) onCategory(l.category);
                  setMenuOpen(false);
                }}
                className="block border-b border-border/60 py-3 text-sm font-medium last:border-0"
              >
                {l.label}
              </a>
            ))}
            <a
              href={GENERAL_ENQUIRY}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-whatsapp mt-3 w-full text-sm"
            >
              <WhatsAppIcon className="size-4" /> WhatsApp {BRAND.phoneDisplay}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

function QuickSearch({
  open,
  onClose,
  onView,
}: {
  open: boolean;
  onClose: () => void;
  onView: (p: Product, size: string) => void;
}) {
  const [q, setQ] = useState("");
  if (!open) return null;

  const results = q.trim() ? searchProducts(allProducts, q) : [];

  return (
    <div className="fixed inset-0 z-50 bg-maroon/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="shell pt-20 sm:pt-28"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Search products"
      >
        <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-lift)]">
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search karam, pickles, పొడి…"
              aria-label="Search products in English or Telugu"
              className="w-full bg-transparent py-4 text-base outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="max-h-[55dvh] overflow-y-auto">
            {q.trim() && results.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">
                Nothing matched “{q}”. Try “karam”, “pickle” or “పొడి”.
              </p>
            )}
            {results.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  onView(p, "250g");
                  onClose();
                }}
                className="flex w-full items-center gap-3 border-b border-border/60 p-3 text-left transition-colors last:border-0 hover:bg-secondary/60"
              >
                <img
                  src={p.image}
                  alt=""
                  width={120}
                  height={120}
                  className="size-12 shrink-0 rounded-xl object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{p.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{p.te}</span>
                </span>
                <span className="font-display text-sm font-bold text-primary">{p.prices[2]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IndexPage() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Index />
      </WishlistProvider>
    </CartProvider>
  );
}

function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [viewing, setViewing] = useState<{ product: Product; size: string } | null>(null);
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");

  const handleView = (product: Product, size: string) => setViewing({ product, size });

  const shopItems = useMemo(() => {
    const byCategory =
      category === "all" ? allProducts : allProducts.filter((p) => p.category === category);
    return searchProducts(byCategory, query);
  }, [category, query]);

  const jumpToShop = (c: Category | "all") => {
    setCategory(c);
    setQuery("");
  };

  return (
    <div id="home" className="min-h-screen bg-background">
      <Header onSearch={() => setSearchOpen(true)} onCategory={jumpToShop} />
      <QuickSearch open={searchOpen} onClose={() => setSearchOpen(false)} onView={handleView} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Andhra chilli powder, dried red chillies and traditional spices"
          width={1600}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-maroon/82" />
        <div className="shell relative py-16 sm:py-24 md:py-32">
          <div className="reveal max-w-2xl text-maroon-foreground">
            <span className="btn-outline-cream inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] sm:text-xs">
              <Leaf className="size-3.5" /> Stone ground in small batches
            </span>
            <h1 className="mt-6 text-[2.1rem] font-black leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl">
              Authentic Andhra Flavours, Made With Love
            </h1>
            <p className="mt-5 max-w-lg text-[0.95rem] text-maroon-foreground/85 sm:text-lg">
              Traditional Karam, Homemade Pickles &amp; Authentic Spice Powders
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#shop"
                onClick={() => jumpToShop("all")}
                className="btn-base btn-hero px-7 py-3.5"
              >
                Shop Now
              </a>
              <a href="#categories" className="btn-base btn-outline-cream px-7 py-3.5">
                Explore Products
              </a>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-6 sm:mt-12">
              {[
                ["18+", "Traditional recipes"],
                ["3", "Pack sizes"],
                ["Pan-India", "Delivery"],
              ].map(([v, k]) => (
                <div key={k}>
                  <dt className="font-display text-2xl font-bold text-accent">{v}</dt>
                  <dd className="text-[0.7rem] uppercase tracking-[0.16em] text-maroon-foreground/70 sm:text-xs">
                    {k}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="section-pad shell">
        <SectionHeading
          eyebrow="Shop by category"
          title="Three tastes of Andhra"
          copy="Ground, cured and packed the way it has always been done at home."
        />
        <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-3">
          {[
            {
              t: "Mirchi Powders & Karam",
              img: catKaram,
              d: `${karam.length} traditional varieties`,
              c: "karam" as const,
            },
            {
              t: "Andhra Non-Veg Pickles",
              img: catPickle,
              d: "Chicken, mutton & prawn",
              c: "pickles" as const,
            },
            {
              t: "Traditional Powders",
              img: catPowder,
              d: "Turmeric, sambar & rasam",
              c: "powders" as const,
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 70} className="h-full">
              <a
                href="#shop"
                onClick={() => jumpToShop(c.c)}
                className="surface-card group block h-full overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[23px]">
                  <img
                    src={c.img}
                    alt={c.t}
                    loading="lazy"
                    width={1008}
                    height={1008}
                    className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold sm:text-2xl">{c.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section id="featured" className="bg-secondary/40">
        <div className="section-pad shell">
          <SectionHeading
            eyebrow="Featured"
            title="Our most loved jars"
            copy="The ones that keep coming back to the same kitchens, month after month."
          />
          <ProductGrid
            items={[karam[0]!, pickles[1]!, powders[2]!, pickles[3]!]}
            onView={handleView}
          />
        </div>
      </section>

      {/* SHOP — search, filters and the full catalogue */}
      <section id="shop" className="section-pad shell">
        <SectionHeading
          eyebrow="Shop"
          title="The full Kopuri range"
          copy="Search in English or Telugu, filter by what you are cooking, and pick your pack size."
        />
        <ShopControls
          query={query}
          onQuery={setQuery}
          category={category}
          onCategory={setCategory}
          resultCount={shopItems.length}
        />
        {shopItems.length > 0 ? (
          <ProductGrid items={shopItems} onView={handleView} />
        ) : (
          <div className="surface-card mt-10 p-10 text-center">
            <p className="font-display text-lg font-bold">Nothing here yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different word, or clear the filters to see everything.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="btn-base btn-soft mt-5 px-6"
            >
              Show all products
            </button>
          </div>
        )}
      </section>

      {/* WHY */}
      <section className="bg-secondary/40">
        <div className="section-pad shell">
          <SectionHeading eyebrow="Why Kopuri Foods" title="Made the slow way" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                i: Flame,
                t: "Authentic Andhra Taste",
                d: "The real heat and tang of Andhra kitchens, never toned down.",
              },
              {
                i: Soup,
                t: "Traditional Recipes",
                d: "Family recipes passed down and followed to the gram.",
              },
              {
                i: Leaf,
                t: "Quality Ingredients",
                d: "Hand-picked chillies, cold-pressed oils, no preservatives.",
              },
              {
                i: Truck,
                t: "Freshly Prepared",
                d: "Made in small batches only after your order is confirmed.",
              },
            ].map(({ i: Icon, t, d }, idx) => (
              <Reveal key={t} delay={idx * 60} className="h-full">
                <div className="surface-card h-full p-6">
                  <span className="ember-panel flex size-11 items-center justify-center rounded-xl">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="section-pad shell">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="grid grid-cols-2 gap-4">
            <img
              src={catPickle}
              alt="Andhra chicken pickle in a clay bowl"
              loading="lazy"
              width={1008}
              height={1008}
              className="aspect-[3/4] w-full rounded-3xl object-cover shadow-[var(--shadow-card)]"
            />
            <img
              src={catKaram}
              alt="Freshly ground mirchi karam"
              loading="lazy"
              width={1008}
              height={1008}
              className="mt-8 aspect-[3/4] w-full rounded-3xl object-cover shadow-[var(--shadow-card)] sm:mt-10"
            />
          </div>
          <div>
            <p className="eyebrow">Our food story</p>
            <h2 className="mt-3 text-[1.75rem] font-bold leading-tight sm:text-4xl md:text-[2.75rem]">
              From Our Kitchen To Your Table
            </h2>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground sm:text-base">
              Kopuri Foods began the way most Andhra kitchens do — with chillies drying on a terrace
              and a grinding stone that never really rested. Every karam we make still follows that
              rhythm: chillies sorted by hand, spices dry-roasted until they speak, and jars filled
              only when there is an order waiting.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground sm:text-base">
              Nothing is stored for months. Nothing is coloured to look brighter. What reaches your
              table is simply the food we cook for our own family.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#shop"
                onClick={() => jumpToShop("all")}
                className="btn-base btn-hero px-7 py-3.5"
              >
                Shop the range
              </a>
              <a href="#faq" className="btn-base btn-soft px-7 py-3.5">
                Read FAQs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERY */}
      <section className="shell pb-16 sm:pb-20">
        <div className="surface-card overflow-hidden">
          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_1.4fr] md:p-12">
            <div>
              <span className="ember-panel flex size-11 items-center justify-center rounded-xl">
                <Truck className="size-5" />
              </span>
              <h2 className="mt-5 text-2xl font-bold sm:text-3xl">Delivery Information</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Charges are calculated per kilogram and worked out in your cart. Pickles travel in
                leak-proof, double-sealed packs.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["AP & Telangana", "₹80", "per kg"],
                ["Chennai & Bangalore", "₹110", "per kg"],
                ["Other States", "₹150", "per kg"],
              ].map(([region, price, unit]) => (
                <div key={region} className="rounded-2xl bg-secondary/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {region}
                  </p>
                  <p className="mt-3 font-display text-3xl font-bold text-primary">{price}</p>
                  <p className="text-xs text-muted-foreground">{unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-secondary/40">
        <div className="section-pad shell">
          <SectionHeading eyebrow="Reviews" title="What our customers say" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "Lakshmi P.",
                c: "Hyderabad",
                r: "The gongura chicken pickle tastes exactly like my grandmother's. Finished the 500g jar in two weeks.",
              },
              {
                n: "Ravi Teja K.",
                c: "Bangalore",
                r: "Byadgi karam has beautiful colour without burning your tongue. Packing was spotless.",
              },
              {
                n: "Sowmya R.",
                c: "Chennai",
                r: "Ordered the idly karam and rasam powder. The aroma when you open the pack says everything.",
              },
            ].map((t, i) => (
              <Reveal key={t.n} delay={i * 70} className="h-full">
                <figure className="surface-card h-full p-6 sm:p-7">
                  <div className="flex gap-1 text-accent">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="size-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    “{t.r}”
                  </blockquote>
                  <figcaption className="mt-5 text-sm font-semibold">
                    {t.n}
                    <span className="block text-xs font-normal text-muted-foreground">{t.c}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-pad shell max-w-3xl!">
        <SectionHeading eyebrow="FAQ" title="Good to know" />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className="surface-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-sm font-semibold sm:text-base">{f.q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-primary transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="ember-panel">
        <div className="shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <span className="inline-flex rounded-2xl bg-cream p-3">
              <Logo className="h-12" />
            </span>
            <p className="mt-4 max-w-sm text-sm text-maroon-foreground/75">
              Authentic Andhra flavours crafted with traditional taste.
            </p>
            <a
              href={GENERAL_ENQUIRY}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-whatsapp-solid mt-6 px-5 text-xs sm:text-sm"
            >
              <WhatsAppIcon className="size-4" /> Chat on WhatsApp
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-maroon-foreground/75">
              {(
                [
                  { l: "Shop all", c: "all" },
                  { l: "Karam & Powders", c: "karam" },
                  { l: "Pickles", c: "pickles" },
                  { l: "Spice Powders", c: "powders" },
                ] satisfies { l: string; c: Category | "all" }[]
              ).map(({ l, c }) => (
                <li key={l}>
                  <a href="#shop" onClick={() => jumpToShop(c)} className="footer-link">
                    {l}
                  </a>
                </li>
              ))}
              <li>
                <a href="#story" className="footer-link">
                  About
                </a>
              </li>
              <li>
                <a href="#faq" className="footer-link">
                  Delivery &amp; FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-maroon-foreground/75">
              <li>
                <a href={BRAND.telHref} className="footer-link flex items-start gap-2.5">
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                  {BRAND.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={mailtoUrl("Order enquiry — Kopuri Foods")}
                  className="footer-link flex items-start gap-2.5 break-all"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link flex items-start gap-2.5"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                  <address className="not-italic leading-relaxed">
                    {BRAND.address.line1},
                    <br />
                    {BRAND.address.line2},
                    <br />
                    {BRAND.address.line3}
                  </address>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-maroon-foreground/15">
          <div className="shell flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-maroon-foreground/60 sm:flex-row sm:text-left">
            <span>© {new Date().getFullYear()} Kopuri Foods. All rights reserved.</span>
            <span className="flex items-center gap-1.5">
              Made with <Heart className="size-3.5 fill-current text-accent" /> in Andhra Pradesh
            </span>
          </div>
        </div>
      </footer>

      <FloatingWhatsApp />

      <ProductDialog
        product={viewing?.product ?? null}
        initialSize={viewing?.size}
        onOpenChange={(o) => !o && setViewing(null)}
      />
      <CartSheet />
      <Toaster position="top-center" richColors />
    </div>
  );
}
