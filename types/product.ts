export interface Product {
  id: string;

  name: string;
  slug: string;

  collection: string;
  collectionId: string;

  category: string;
  categoryName: string;

  purity: string;
  tagNumber: string;

  description: string;

  /*
   * Weight is intentionally kept in the product model.
   * The client may want to display it in the future.
   * For now it will NOT be shown on the public website.
   */
  weight: number;

  featured: boolean;
  active: boolean;

  /*
   * Google Drive / media fields
   */
  images: string[];
  driveImages: string[];
  imageUrls: string[];
  imageUrl: string;

  driveVideo: string;
  video: string;

  created: string;
  updated: string;
}