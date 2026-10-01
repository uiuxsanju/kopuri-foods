import { Search, X } from "lucide-react";

import { CATEGORIES, type Category } from "@/data/products";

export function ShopControls({
  query,
  onQuery,
  category,
  onCategory,
  resultCount,
}: {
  query: string;
  onQuery: (v: string) => void;
  category: Category | "all";
  onCategory: (c: Category | "all") => void;
  resultCount: number;
}) {
  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div className="search-field">
        <Search className="size-[18px] shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search karam, pickles, పొడి…"
          aria-label="Search products in English or Telugu"
          className="w-full bg-transparent py-3 text-[0.95rem] outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQuery("")}
            aria-label="Clear search"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div
        className="flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Filter by category"
      >
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onCategory(c.id)}
            aria-pressed={category === c.id}
            className="filter-chip"
            data-active={category === c.id}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="text-sm text-muted-foreground">
        {resultCount === 0
          ? "No products match that search."
          : `${resultCount} ${resultCount === 1 ? "product" : "products"}`}
      </p>
    </div>
  );
}
