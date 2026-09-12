"use client";

import { useSyncExternalStore } from "react";
import type { Product } from "@/types/product";

import {
  addToWishlist,
  isInWishlist,
  removeFromWishlist,
} from "@/lib/wishlist";

type Props = {
  product: Product;
};

const WISHLIST_EVENT = "wishlist-changed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(WISHLIST_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(WISHLIST_EVENT, callback);
  };
}

function getSnapshot(productId: string) {
  return isInWishlist(productId);
}

function getServerSnapshot() {
  return false;
}

export default function WishlistButton({ product }: Props) {
  const saved = useSyncExternalStore(
    subscribe,
    () => getSnapshot(product.id),
    getServerSnapshot
  );

  function handleWishlist() {
    if (saved) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }

    window.dispatchEvent(new Event(WISHLIST_EVENT));
  }

  return (
    <button
      type="button"
      onClick={handleWishlist}
      className={`rounded-xl border px-6 py-4 text-center font-semibold transition ${
        saved
          ? "border-[#b08a3c] bg-[#b08a3c] text-white"
          : "border-[#b08a3c] text-[#9a762f] hover:bg-[#b08a3c] hover:text-white"
      }`}
    >
      {saved ? "♥ Added to Wishlist" : "♡ Add to Wishlist"}
    </button>
  );
}