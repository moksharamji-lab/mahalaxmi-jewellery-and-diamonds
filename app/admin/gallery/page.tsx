import { getGalleryImages } from "@/services/gallery.service";
import GalleryAdmin from "./GalleryAdmin";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <GalleryAdmin
      initialImages={images}
    />
  );
}