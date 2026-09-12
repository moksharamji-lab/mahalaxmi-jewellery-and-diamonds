import pb from "@/lib/pocketbase";
import type { HeroSlide } from "@/types/hero-slide";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const records = await pb
    .collection("HeroSliders")
    .getFullList({
      sort: "order",
    });

  return records.map((record) => ({
    id: record.id,
    title: String(record.title ?? ""),
    subtitle: String(record.subtitle ?? ""),
    buttonText: String(record.buttonText ?? ""),
    buttonLink: String(record.buttonLink ?? ""),
    image: String(record.image ?? ""),
    imageUrl: record.image
      ? pb.files.getURL(record, record.image)
      : "",
    active: Boolean(record.active),
    order: Number(record.order ?? 0),
    created: record.created,
    updated: record.updated,
  }));
}


export async function getHeroSlide(
  id: string
): Promise<HeroSlide> {
  const record = await pb
    .collection("HeroSliders")
    .getOne(id);

  return {
    id: record.id,
    title: String(record.title ?? ""),
    subtitle: String(record.subtitle ?? ""),
    buttonText: String(record.buttonText ?? ""),
    buttonLink: String(record.buttonLink ?? ""),
    image: String(record.image ?? ""),
    imageUrl: record.image
      ? pb.files.getURL(record, record.image)
      : "",
    active: Boolean(record.active),
    order: Number(record.order ?? 0),
    created: record.created,
    updated: record.updated,
  };
}


export async function deleteHeroSlide(id: string) {
  return await pb
    .collection("HeroSliders")
    .delete(id);
}