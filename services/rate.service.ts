import pb from "@/lib/pocketbase";
import type { RecordModel } from "pocketbase";

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

  if (text === "per carat" || text === "carat") {
    return "Per Carat";
  }

  return "Per Gram";
}

function mapRate(record: RecordModel): Rate {
  return {
    id: record.id,

    collection: normalizeCollection(
      record.collection
    ),

    purity: normalizePurity(
      record.purity
    ),

    rate: Number(record.rate ?? 0),

    unit: normalizeUnit(record.unit),

    active: Boolean(record.active),

    updated: String(
      record.updated ?? ""
    ),
  };
}

/**
 * Get all rates.
 */
export async function getRates(): Promise<Rate[]> {
  try {
    const records = await pb
      .collection("Rates")
      .getFullList({
        sort: "collection,purity",
        requestKey: null,
      });

    return records.map(mapRate);
  } catch (error) {
    console.error("Failed to load rates:", error);

    return [];
  }
}

/**
 * Get active rates.
 */
export async function getActiveRates(): Promise<Rate[]> {
  try {
    const records = await pb
      .collection("Rates")
      .getFullList({
        filter: "active = true",
        sort: "collection,purity",
        requestKey: null,
      });

    return records.map(mapRate);
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
    const records = await pb
      .collection("Rates")
      .getFullList({
        filter: pb.filter(
          "collection = {:collection}",
          {
            collection,
          }
        ),
        sort: "purity",
        requestKey: null,
      });

    return records.map(mapRate);
  } catch (error) {
    console.error(
      `Failed to load ${collection} rates:`,
      error
    );

    return [];
  }
}