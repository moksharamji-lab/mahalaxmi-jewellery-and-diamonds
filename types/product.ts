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

  // Product details
  purity: string;
  description: string;

  // Gold product details
  hyd: string;
  hallmark: string;

  // Diamond product details
  igi: string;
  sgl: string;

  // Existing product fields
  weight: number;
  makingCharges: number;

  featured: boolean;
  active: boolean;

  // Legacy-compatible media fields
  images: string[];
  imageUrls: string[];
  imageUrl: string;

  // Google Drive media
  driveImages: string[];
  driveVideo: string;

  // Final video URL
  video: string;

  created: string;
  updated: string;
}