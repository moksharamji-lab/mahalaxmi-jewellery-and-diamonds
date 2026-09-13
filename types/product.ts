export interface Product {
  id: string;
  name: string;
  slug: string;
  collection: string;
  category: string;
  brand: string;
  categoryName: string;
  brandName: string;
  collectionId: string;

  // Common product details
  purity: string;
  description: string;

  // Gold product details
  hyd: string;
  hallmark: string;

  // Diamond product details
  igi: string;
  sgl: string;

  // Existing fields
  weight: number;
  makingCharges: number;
  featured: boolean;
  active: boolean;
  images: string[];
  imageUrls: string[];
  imageUrl: string;

  // Product video
  video: string;

  created: string;
  updated: string;
}