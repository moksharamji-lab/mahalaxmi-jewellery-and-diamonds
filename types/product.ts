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
  purity: string;
  weight: number;
  makingCharges: number;
  description: string;
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