export async function uploadImages(
  files: File[]
): Promise<string[]> {
  if (!files.length) {
    return [];
  }

  throw new Error(
    "uploadImages is no longer supported. Use the Google Drive media upload flow."
  );
}