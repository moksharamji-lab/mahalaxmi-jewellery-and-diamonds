import pb from "@/lib/pocketbase";
import type { RecordModel } from "pocketbase";

export type Store = {
  id: string;
  name: string;
  collection: "Gold" | "Diamond";
  logo: string;
  address: string;
  phone: string;
  whatsapp: string;
  googleMapsUrl: string;
  email: string;
  description: string;
  active: boolean;
};

function normalizeCollection(
  value: unknown
): "Gold" | "Diamond" | null {
  const text = String(value ?? "")
    .replace("☑", "")
    .trim()
    .toLowerCase();

  if (text === "gold") return "Gold";
  if (text === "diamond") return "Diamond";

  return null;
}

function mapStore(record: RecordModel): Store {
  const collection = normalizeCollection(record.collection);

  const logo = record.logo
    ? pb.files.getURL(record, String(record.logo))
    : "";

  return {
    id: record.id,
    name: String(record.name ?? ""),
    collection: collection ?? "Gold",
    logo,
    address: String(record.address ?? ""),
    phone: String(record.phone ?? ""),
    whatsapp: String(record.whatsapp ?? ""),
    googleMapsUrl: String(record.googleMapsUrl ?? ""),
    email: String(record.email ?? ""),
    description: String(record.description ?? ""),
    active: Boolean(record.active),
  };
}

export async function getStores(): Promise<Store[]> {
  try {
    const records = await pb
      .collection("Stores")
      .getFullList({
        sort: "collection",
        requestKey: null,
      });

    return records
      .map(mapStore)
      .filter((store) => store.active);
  } catch (error) {
    console.error("Failed to load stores:", error);
    return [];
  }
}

export async function getStoreByCollection(
  collection: "Gold" | "Diamond"
): Promise<Store | null> {
  try {
    const records = await pb
      .collection("Stores")
      .getFullList({
        requestKey: null,
      });

    const store = records
      .map(mapStore)
      .find(
        (item) =>
          item.collection === collection &&
          item.active === true
      );

    if (!store) {
      console.error(
        `NO ACTIVE ${collection} STORE FOUND.`
      );
      return null;
    }

    return store;
  } catch (error) {
    console.error(
      `Failed to load ${collection} store:`,
      error
    );

    return null;
  }
}

export async function getAllStores(): Promise<Store[]> {
  try {
    const records = await pb
      .collection("Stores")
      .getFullList({
        sort: "collection",
        requestKey: null,
      });

    return records.map(mapStore);
  } catch (error) {
    console.error("Failed to load all stores:", error);
    return [];
  }
}

export async function getStoreById(
  id: string
): Promise<Store | null> {
  if (!id) return null;

  try {
    const record = await pb
      .collection("Stores")
      .getOne(id, {
        requestKey: null,
      });

    return mapStore(record);
  } catch (error) {
    console.error("Failed to load store:", error);
    return null;
  }
}