import pb from "@/lib/pocketbase";

import type {
  HeroSlide,
  HeroSliderPage,
  HeroMediaType,
} from "@/types/hero-slide";

/* =========================================================
   MAP POCKETBASE RECORD
========================================================= */

function mapHeroSlide(record: any): HeroSlide {
  const pageValue = String(
    record.page ?? "Home"
  );

  let page: HeroSliderPage = "Home";

  if (pageValue === "Gold") {
    page = "Gold";
  } else if (pageValue === "Diamonds") {
    page = "Diamonds";
  } else if (pageValue === "Categories") {
    page = "Categories";
  }

  const mediaTypeValue = String(
    record.mediaType ?? "image"
  );

  const mediaType: HeroMediaType =
    mediaTypeValue === "video"
      ? "video"
      : "image";

  return {
    id: record.id,

    title: String(
      record.title ?? ""
    ),

    subtitle: String(
      record.subtitle ?? ""
    ),

    buttonText: String(
      record.buttonText ?? ""
    ),

    buttonLink: String(
      record.buttonLink ?? ""
    ),

    page,

    mediaType,

    image: String(
      record.image ?? ""
    ),

    imageUrl: record.image
      ? pb.files.getURL(
          record,
          record.image
        )
      : "",

    video: String(
      record.video ?? ""
    ),

    videoUrl: record.video
      ? pb.files.getURL(
          record,
          record.video
        )
      : "",

    active: Boolean(
      record.active
    ),

    order: Number(
      record.order ?? 0
    ),

    created: record.created,

    updated: record.updated,
  };
}

/* =========================================================
   GET ALL HERO SLIDES
========================================================= */

export async function getHeroSlides(): Promise<
  HeroSlide[]
> {
  const records = await pb
    .collection("HeroSliders")
    .getFullList({
      sort: "order",
    });

  return records.map(
    mapHeroSlide
  );
}

/* =========================================================
   GET SINGLE HERO SLIDE
========================================================= */

export async function getHeroSlide(
  id: string
): Promise<HeroSlide> {
  const record = await pb
    .collection("HeroSliders")
    .getOne(id);

  return mapHeroSlide(
    record
  );
}

/* =========================================================
   DELETE HERO SLIDE
========================================================= */

export async function deleteHeroSlide(
  id: string
) {
  return await pb
    .collection("HeroSliders")
    .delete(id);
}