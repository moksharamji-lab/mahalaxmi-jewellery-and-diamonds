import pb from "@/lib/pocketbase";
import type { RecordModel } from "pocketbase";

import type { OurStory } from "@/types/our-story";

function mapOurStory(record: RecordModel): OurStory {
  return {
    id: record.id,
    title: String(record.title ?? ""),
    paragraphOne: String(record.paragraphOne ?? ""),
    paragraphTwo: String(record.paragraphTwo ?? ""),
    buttonText: String(record.buttonText ?? ""),
    buttonLink: String(record.buttonLink ?? ""),
    active: Boolean(record.active),
  };
}

export async function getOurStory(): Promise<OurStory | null> {
  try {
    const records = await pb
      .collection("OurStory")
      .getFullList({
        requestKey: null,
      });

    const activeStory = records
      .map(mapOurStory)
      .find((story) => story.active === true);

    return activeStory ?? null;
  } catch (error) {
    console.error("Failed to load Our Story:", error);
    return null;
  }
}

export async function getOurStoryForAdmin(): Promise<OurStory | null> {
  try {
    const records = await pb
      .collection("OurStory")
      .getFullList({
        requestKey: null,
      });

    if (records.length === 0) {
      return null;
    }

    return mapOurStory(records[0]);
  } catch (error) {
    console.error("Failed to load Our Story for admin:", error);
    return null;
  }
}