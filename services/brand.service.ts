import pb from "@/lib/pocketbase";
import { Brand } from "@/types/brand";

export async function getBrands(): Promise<Brand[]> {
  const records = await pb.collection("Brands").getFullList({
    sort: "name",
  });

  return records.map((record) => ({
    id: record.id,
    name: record.name,
    slug: record.slug,
    logo: record.logo ?? "",
    logoUrl: record.logo ? pb.files.getURL(record, record.logo) : "",
    active: Boolean(record.active),
    created: record.created,
    updated: record.updated,
  }));
}

export async function getBrand(id: string): Promise<Brand> {
  const record = await pb.collection("Brands").getOne(id);

  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    logo: record.logo ?? "",
    logoUrl: record.logo ? pb.files.getURL(record, record.logo) : "",
    active: Boolean(record.active),
    created: record.created,
    updated: record.updated,
  };
}

export async function createBrand(data: FormData) {
  return pb.collection("Brands").create(data);
}

export async function updateBrand(id: string, data: FormData) {
  return pb.collection("Brands").update(id, data);
}

export async function deleteBrand(id: string) {
  return pb.collection("Brands").delete(id);
}
