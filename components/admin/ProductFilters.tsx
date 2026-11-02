"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Category } from "@/types/category";
import type { ProductFilters } from "@/services/product.service";

type Props = {
  categories: Category[];
  filters: ProductFilters;
  active?: boolean;
  hasFilters: boolean;
};

export default function ProductFilters({
  categories,
  filters,
  active,
  hasFilters,
}: Props) {
  const [collection, setCollection] =
    useState(filters.collection ?? "");

  const [category, setCategory] =
    useState(filters.category ?? "");

  /*
   * Immediately filter categories when the
   * Collection dropdown changes.
   */
  const visibleCategories = useMemo(() => {
    return categories.filter(
      (item) =>
        item.active &&
        (
          !collection ||
          item.collection === collection
        )
    );
  }, [categories, collection]);

  return (
    <form
      action="/admin/products"
      method="GET"
      className="mb-6 space-y-4 rounded-2xl border border-[#D8C9B5] bg-[#EDE3D3] p-4 shadow-[0_4px_18px_rgba(80,60,30,0.04)] sm:p-5"
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {/* SEARCH */}

        <div className="xl:col-span-2">
          <label
            className="sr-only"
            htmlFor="product-search"
          >
            Search products
          </label>

          <input
            id="product-search"
            name="q"
            type="search"
            defaultValue={
              filters.search ?? ""
            }
            placeholder="Search by product name or slug"
            className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
          />
        </div>

        {/* COLLECTION */}

        <div>
          <label
            className="sr-only"
            htmlFor="collection-filter"
          >
            Filter by collection
          </label>

          <select
            id="collection-filter"
            name="collection"
            value={collection}
            onChange={(e) => {
              setCollection(e.target.value);
              setCategory("");
            }}
            className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#40382F] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
          >
            <option value="">
              All Collections
            </option>

            <option value="Gold">
              Gold
            </option>

            <option value="Diamond">
              Diamond
            </option>
          </select>
        </div>

        {/* CATEGORY */}

        <div>
          <label
            className="sr-only"
            htmlFor="category-filter"
          >
            Filter by category
          </label>

          <select
            id="category-filter"
            name="category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#40382F] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
          >
            <option value="">
              All Categories
            </option>

            {visibleCategories.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* STATUS + BUTTONS */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-48">
          <label
            className="sr-only"
            htmlFor="active-filter"
          >
            Filter by status
          </label>

          <select
            id="active-filter"
            name="active"
            defaultValue={
              typeof active === "boolean"
                ? String(active)
                : ""
            }
            className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#40382F] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
          >
            <option value="">
              All Statuses
            </option>

            <option value="true">
              Active
            </option>

            <option value="false">
              Inactive
            </option>
          </select>
        </div>

        {/* APPLY */}

        <button
          type="submit"
          className="rounded-xl bg-[#B08D57] px-6 py-3 font-semibold text-[#FFF9EF] shadow-[0_5px_14px_rgba(176,141,87,0.15)] transition-all duration-300 hover:bg-[#8F6F3F]"
        >
          Apply Filters
        </button>

        {/* CLEAR */}

        {hasFilters && (
          <Link
            href="/admin/products"
            className="rounded-xl border border-[#CDBDA8] bg-[#F8F2E8] px-6 py-3 text-center font-semibold text-[#554C42] transition-all duration-300 hover:border-[#B08D57] hover:bg-[#FDF9F1] hover:text-[#8F6F3F]"
          >
            Clear All
          </Link>
        )}
      </div>
    </form>
  );
}
