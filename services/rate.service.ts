import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

export type Rate = {
  id: string;
  collection: "Gold" | "Diamond";
  purity: "24K" | "22K" | "18K" | "14K";
  rate: number;
  unit: "Per Gram" | "Per Carat";
  active: boolean;
  updated: string;
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

  return "Gold";
}

function normalizePurity(
  value: unknown
): "24K" | "22K" | "18K" | "14K" {
  const text = String(value ?? "")
    .trim()
    .toUpperCase();

  if (
    text === "24K" ||
    text === "22K" ||
    text === "18K" ||
    text === "14K"
  ) {
    return text;
  }

  return "24K";
}

function normalizeUnit(
  value: unknown
): "Per Gram" | "Per Carat" {
  const text = String(value ?? "")
    .trim()
    .toLowerCase();

  if (
    text === "per carat" ||
    text === "carat"
  ) {
    return "Per Carat";
  }

  return "Per Gram";
}

function mapRate(
  record: Record<string, unknown>
): Rate {
  return {
    id: String(record.$id ?? ""),

    collection: normalizeCollection(
      record.collection
    ),

    purity: normalizePurity(
      record.purity
    ),

    rate: Number(
      record.rate ?? 0
    ),

    unit: normalizeUnit(
      record.unit
    ),

    active: Boolean(
      record.active
    ),

    updated: String(
      record.$updatedAt ?? ""
    ),
  };
}

function sortRates(
  rates: Rate[]
): Rate[] {
  const collectionOrder: Record<
    "Gold" | "Diamond",
    number
  > = {
    Gold: 1,
    Diamond: 2,
  };

  const purityOrder: Record<
    "24K" | "22K" | "18K" | "14K",
    number
  > = {
    "24K": 1,
    "22K": 2,
    "18K": 3,
    "14K": 4,
  };

  return [...rates].sort(
    (a, b) => {
      const collectionDifference =
        collectionOrder[a.collection] -
        collectionOrder[b.collection];

      if (
        collectionDifference !== 0
      ) {
        return collectionDifference;
      }

      return (
        purityOrder[a.purity] -
        purityOrder[b.purity]
      );
    }
  );
}

/**
 * Get all rates.
 */
export async function getRates(): Promise<
  Rate[]
> {
  try {
    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,
        tableId: "rates",
      });

    const rates =
      result.rows.map((row) =>
        mapRate(
          row as unknown as Record<
            string,
            unknown
          >
        )
      );

    return sortRates(rates);
  } catch (error) {
    console.error(
      "Failed to load rates:",
      error
    );

    return [];
  }
}

/**
 * Get active rates.
 */
export async function getActiveRates(): Promise<
  Rate[]
> {
  try {
    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,
        tableId: "rates",
      });

    const rates =
      result.rows
        .map((row) =>
          mapRate(
            row as unknown as Record<
              string,
              unknown
            >
          )
        )
        .filter(
          (rate) => rate.active
        );

    return sortRates(rates);
  } catch (error) {
    console.error(
      "Failed to load active rates:",
      error
    );

    return [];
  }
}

/**
 * Get rates for a specific collection.
 */
export async function getRatesByCollection(
  collection: "Gold" | "Diamond"
): Promise<Rate[]> {
  try {
    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,
        tableId: "rates",
      });

    const rates =
      result.rows
        .map((row) =>
          mapRate(
            row as unknown as Record<
              string,
              unknown
            >
          )
        )
        .filter(
          (rate) =>
            rate.collection ===
            collection
        );

    return sortRates(rates);
  } catch (error) {
    console.error(
      `Failed to load ${collection} rates:`,
      error
    );

    return [];
  }
}