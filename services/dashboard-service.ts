import { APPWRITE_DATABASE_ID, tablesDB } from "@/lib/appwrite";

async function getCount(tableId: string) {
  const response = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId,
    queries: [],
    total: true,
  });

  return response.total;
}

export async function getDashboardCounts() {
  const [
    products,
    categories,
    heroSlides,
    rates,
    stores,
  ] = await Promise.all([
    getCount("products"),
    getCount("categories"),
    getCount("herosliders"),
    getCount("rates"),
    getCount("stores"),
  ]);

  return {
    products,
    categories,
    heroSlides,
    rates,
    stores,
  };
}