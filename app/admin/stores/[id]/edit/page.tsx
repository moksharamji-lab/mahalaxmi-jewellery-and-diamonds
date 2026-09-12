import Link from "next/link";
import { notFound } from "next/navigation";

import { getStoreById } from "@/services/store.service";
import EditStoreForm from "@/components/admin/stores/EditStoreForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditStorePage({
  params,
}: Props) {
  const { id } = await params;

  const store = await getStoreById(id);

  if (!store) {
    notFound();
  }

  return (
    <div className="max-w-4xl text-[#302A23]">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/stores"
          className="inline-flex items-center text-sm font-semibold text-[#6F665B] transition-colors duration-200 hover:text-[#8F6F3F]"
        >
          ← Back to Stores
        </Link>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-[#A47C3A]">
          Store Management
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302A23] md:text-4xl">
          Edit Store
        </h1>

        <p className="mt-2 text-sm text-[#6F665B]">
          Update the information displayed for this store
          on the public website.
        </p>
      </div>

      {/* Edit Store Form */}
      <EditStoreForm store={store} />
    </div>
  );
}