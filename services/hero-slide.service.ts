import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

import type {
  HeroSlide,
  HeroSliderPage,
  HeroMediaType,
} from "@/types/hero-slide";

/* =========================================================
   MAP APPWRITE RECORD
========================================================= */

function mapHeroSlide(
  record: Record<string, unknown>
): HeroSlide {
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

  const driveImage = String(
    record.driveImage ?? ""
  ).trim();

  const driveVideo = String(
    record.driveVideo ?? ""
  ).trim();

  const imageUrl = driveImage
    ? `/api/media/${encodeURIComponent(driveImage)}`
    : "";

  const videoUrl = driveVideo
    ? `/api/media/${encodeURIComponent(driveVideo)}`
    : "";

  return {
    id: String(record.$id ?? ""),

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

    // Google Drive media IDs
    image: driveImage,
    imageUrl,

    video: driveVideo,
    videoUrl,

    active: Boolean(
      record.active
    ),

    order: Number(
      record.order ?? 0
    ),

    created: String(
      record.$createdAt ?? ""
    ),

    updated: String(
      record.$updatedAt ?? ""
    ),
  };
}

/* =========================================================
   SORT HERO SLIDES
========================================================= */

function sortHeroSlides(
  slides: HeroSlide[]
): HeroSlide[] {
  return [...slides].sort(
    (a, b) => a.order - b.order
  );
}

/* =========================================================
   GET ALL HERO SLIDES
========================================================= */

export async function getHeroSlides(): Promise<
  HeroSlide[]
> {
  try {
    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId: "herosliders",

        /*
         * Do not use Appwrite Query.orderAsc()
         * here. Sorting is done below in JavaScript
         * so the Hero does not depend on an
         * Appwrite database index.
         */
      });

    const slides =
      result.rows.map((row) =>
        mapHeroSlide(
          row as unknown as Record<
            string,
            unknown
          >
        )
      );

    return sortHeroSlides(slides);
  } catch (error) {
    console.error(
      "Failed to load hero slides:",
      error
    );

    return [];
  }
}

/* =========================================================
   GET HERO SLIDES BY PAGE
========================================================= */

export async function getHeroSlidesByPage(
  page: HeroSliderPage
): Promise<HeroSlide[]> {
  try {
    /*
     * Load all Hero slides first.
     *
     * We intentionally avoid Query.equal()
     * because Appwrite queries can require
     * database indexes.
     */
    const result =
      await tablesDB.listRows({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId: "herosliders",
      });

    const slides =
      result.rows.map((row) =>
        mapHeroSlide(
          row as unknown as Record<
            string,
            unknown
          >
        )
      );

    return sortHeroSlides(
      slides.filter(
        (slide) =>
          slide.page === page
      )
    );
  } catch (error) {
    console.error(
      `Failed to load ${page} hero slides:`,
      error
    );

    return [];
  }
}

/* =========================================================
   GET SINGLE HERO SLIDE
========================================================= */

export async function getHeroSlide(
  id: string
): Promise<HeroSlide> {
  try {
    const record =
      await tablesDB.getRow({
        databaseId:
          APPWRITE_DATABASE_ID,

        tableId: "herosliders",

        rowId: id,
      });

    return mapHeroSlide(
      record as unknown as Record<
        string,
        unknown
      >
    );
  } catch (error) {
    console.error(
      `Failed to load hero slide ${id}:`,
      error
    );

    throw error;
  }
}

/* =========================================================
   DELETE HERO SLIDE
========================================================= */

export async function deleteHeroSlide(
  id: string
) {
  return await tablesDB.deleteRow({
    databaseId:
      APPWRITE_DATABASE_ID,

    tableId: "herosliders",

    rowId: id,
  });
}