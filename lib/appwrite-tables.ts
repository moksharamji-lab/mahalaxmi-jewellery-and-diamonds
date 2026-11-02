/**
 * Appwrite table IDs whose values are not human-readable table names.
 *
 * The fallback values preserve the current production configuration while
 * allowing each deployment to supply its own table IDs through environment
 * variables.
 */
export const APPWRITE_GALLERY_TABLE_ID =
  process.env.APPWRITE_GALLERY_TABLE_ID ||
  "6aae5f6c002ac74a8072";

export const APPWRITE_PRODUCT_SETTINGS_TABLE_ID =
  process.env.APPWRITE_PRODUCT_SETTINGS_TABLE_ID ||
  "6aaebf3a00378a020cde";
