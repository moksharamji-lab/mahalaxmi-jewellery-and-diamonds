import pb from "@/lib/pocketbase";

export async function uploadImages(files: File[]) {
  const uploadedFiles: string[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const result = await pb.collection("_pb_files").create(formData);

    uploadedFiles.push(result.id);
  }

  return uploadedFiles;
}