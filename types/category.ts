export interface Category {
  id: string;
  name: string;
  slug: string;
  collection: "Gold" | "Diamond";
  image: string;
  description: string;
  active: boolean;
  created: string;
  updated: string;
}