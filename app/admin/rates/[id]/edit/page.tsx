import Link from "next/link";
import { notFound } from "next/navigation";

import { getRates } from "@/services/rate.service";
import EditRateForm from "@/components/admin/rates/EditRateForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRatePage({
  params,
}: Props) {
  const { id } = await params;

  const rates = await getRates();

  const rate = rates.find((item) => item.id === id);

  if (!rate) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F3EDE2] p-4 text-[#302A23] sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/rates"
            className="inline-flex items-center text-sm font-semibold text-[#6F665B] transition-colors duration-200 hover:text-[#8F6F3F]"
          >
            ← Back to Rates
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
            {rate.collection} Rate
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302A23] sm:text-4xl">
            Edit {rate.purity} Rate
          </h1>

          <p className="mt-2 text-[#6F665B]">
            Update the current rate below.
          </p>
        </div>

        {/* Edit Form */}
        <EditRateForm rate={rate} />
      </div>
    </main>
  );
}