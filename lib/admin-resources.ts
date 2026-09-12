const adminResources = {
  products: "Products",
  categories: "Categories",
  brands: "Brands",
  "hero-slides": "HeroSliders",
} as const;

export function getAdminResource(resource: string) {
  return (
    adminResources[resource as keyof typeof adminResources] ??
    null
  );
}