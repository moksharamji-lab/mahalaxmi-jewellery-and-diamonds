import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

export type Store = {
  id: string;
  name: string;
  collection: "Gold" | "Diamond";
  logo: string;
  address: string;
  phone: string;
  whatsapp: string;
  whatsappUrl: string;
  googleMapsUrl: string;
  email: string;
  description: string;
  active: boolean;
};

function normalizeCollection(
  value: unknown
): "Gold" | "Diamond" {
  const text = String(value ?? "")
    .replace("☑", "")
    .trim()
    .toLowerCase();

  if (text === "diamond") {
    return "Diamond";
  }

  if (text === "gold") {
    return "Gold";
  }

  console.warn(
    `Unknown storeType value: "${text}". Defaulting to Gold.`
  );

  return "Gold";
}

function mapStore(
  record: Record<string, unknown>
): Store {
  return {
    id: String(record.$id ?? ""),

    name: String(
      record.name ?? ""
    ),

    collection: normalizeCollection(
      record.storeType
    ),

    logo: record.driveLogo
      ? `/api/media/${encodeURIComponent(
          String(record.driveLogo)
        )}`
      : "",

    address: String(
      record.address ?? ""
    ),

    phone: String(
      record.phone ?? ""
    ),

    whatsapp: String(
      record.whatsapp ?? ""
    ),

    whatsappUrl: String(
      record.whatsappUrl ?? ""
    ),

    googleMapsUrl: String(
      record.googleMapsUrl ?? ""
    ),

    email: String(
      record.email ?? ""
    ),

    description: String(
      record.description ?? ""
    ),

    active: Boolean(
      record.active
    ),
  };
}

function sortStores(
  stores: Store[]
): Store[] {
  return [...stores].sort(
    (a, b) => {
      if (
        a.collection === "Gold" &&
        b.collection === "Diamond"
      ) {
        return -1;
      }

      if (
        a.collection === "Diamond" &&
        b.collection === "Gold"
      ) {
        return 1;
      }

      return 0;
    }
  );
}

export async function getStores(): Promise<
  Store[]
> {
  try {
    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,
        tableId: "stores",
      });

    const stores =
      result.rows
        .map((row) =>
          mapStore(
            row as unknown as Record<
              string,
              unknown
            >
          )
        )
        .filter(
          (store) => store.active
        );

    return sortStores(stores);
  } catch (error) {
    console.error(
      "Failed to load stores:",
      error
    );

    return [];
  }
}

export async function getStoreByCollection(
  collection: "Gold" | "Diamond"
): Promise<Store | null> {
  try {
    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,
        tableId: "stores",
      });

    const stores =
      result.rows
        .map((row) =>
          mapStore(
            row as unknown as Record<
              string,
              unknown
            >
          )
        )
        .filter(
          (store) =>
            store.collection ===
              collection &&
            store.active
        );

    if (stores.length === 0) {
      console.error(
        `NO ACTIVE ${collection} STORE FOUND.`
      );

      return null;
    }

    return stores[0];
  } catch (error) {
    console.error(
      `Failed to load ${collection} store:`,
      error
    );

    return null;
  }
}

export async function getAllStores(): Promise<
  Store[]
> {
  try {
    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,
        tableId: "stores",
      });

    const stores =
      result.rows.map((row) =>
        mapStore(
          row as unknown as Record<
            string,
            unknown
          >
        )
      );

    return sortStores(stores);
  } catch (error) {
    console.error(
      "Failed to load all stores:",
      error
    );

    return [];
  }
}

export async function getStoreById(
  id: string
): Promise<Store | null> {
  if (!id) {
    return null;
  }

  try {
    const record =
      await tablesDB.getRow({
        databaseId:
          APPWRITE_DATABASE_ID,
        tableId: "stores",
        rowId: id,
      });

    return mapStore(
      record as unknown as Record<
        string,
        unknown
      >
    );
  } catch (error) {
    console.error(
      "Failed to load store:",
      error
    );

    return null;
  }
}