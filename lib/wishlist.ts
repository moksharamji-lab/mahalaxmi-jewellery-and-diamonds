import { Product } from "@/types/product";

const WISHLIST_KEY = "mahalaxmi-wishlist";

export function getWishlist(): Product[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem(WISHLIST_KEY);

    if (!saved) {
      return [];
    }

    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function isInWishlist(productId: string): boolean {
  const wishlist = getWishlist();

  return wishlist.some((product) => product.id === productId);
}

export function addToWishlist(product: Product): void {
  const wishlist = getWishlist();

  if (wishlist.some((item) => item.id === product.id)) {
    return;
  }

  const updatedWishlist = [...wishlist, product];

  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(updatedWishlist)
  );
}

export function removeFromWishlist(productId: string): void {
  const wishlist = getWishlist();

  const updatedWishlist = wishlist.filter(
    (product) => product.id !== productId
  );

  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(updatedWishlist)
  );
}