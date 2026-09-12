import pb from "@/lib/pocketbase";

export async function getDashboardCounts() {
  const [
    products,
    categories,
    brands,
    heroSlides,
    rates,
    stores,
  ] = await Promise.all([
    pb.collection("Products").getList(1, 1, {
      requestKey: null,
    }),

    pb.collection("Categories").getList(1, 1, {
      requestKey: null,
    }),

    pb.collection("Brands").getList(1, 1, {
      requestKey: null,
    }),

    pb.collection("HeroSliders").getList(1, 1, {
      requestKey: null,
    }),

    pb.collection("Rates").getList(1, 1, {
      requestKey: null,
    }),

    pb.collection("Stores").getList(1, 1, {
      requestKey: null,
    }),
  ]);

  return {
    products: products.totalItems,
    categories: categories.totalItems,
    brands: brands.totalItems,
    heroSlides: heroSlides.totalItems,
    rates: rates.totalItems,
    stores: stores.totalItems,
  };
}