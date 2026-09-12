import type PocketBase from "pocketbase";

const CMS_COLLECTIONS = [
  "Products",
  "Categories",
  "Brands",
  "HeroSliders",
  "Rates",
  "Stores",
];

export async function lockCmsWriteRules(pb: PocketBase) {
  await Promise.all(
    CMS_COLLECTIONS.map(async (collectionName) => {
      const collection = await pb.collections.getOne(collectionName);

      if (
        collection.createRule === null &&
        collection.updateRule === null &&
        collection.deleteRule === null
      ) {
        return;
      }

      await pb.collections.update(collection.id, {
        createRule: null,
        updateRule: null,
        deleteRule: null,
      });
    })
  );
}