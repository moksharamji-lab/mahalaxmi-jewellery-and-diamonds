const adminResources = {
  products: "Products",
  categories: "Categories",
  collections: "Collections",
  stores: "Stores",
  rates: "Rates",
  "hero-slides": "HeroSliders",
  "our-story": "OurStory",
  enquiries: "Enquiries",
} as const;

export function getAdminResource(resource: string) {
  return (
    adminResources[
      resource as keyof typeof adminResources
    ] ?? null
  );
}