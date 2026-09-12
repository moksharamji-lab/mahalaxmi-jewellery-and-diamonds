import Link from "next/link";

import { getRates } from "@/services/rate.service";

export default async function RatesPage() {
  const rates = await getRates();

  return (
    <div className="space-y-6 text-[#302A23]">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
            Management
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-[#302A23]">
            Rates
          </h1>

          <p className="mt-2 text-[#6F665B]">
            Manage Gold and Diamond rates displayed on the website.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {rates.length === 0 ? (
        <div className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-10 text-center shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
          <p className="text-lg font-semibold text-[#302A23]">
            No rates found
          </p>

          <p className="mt-2 text-sm text-[#6F665B]">
            No Gold or Diamond rates are currently available.
          </p>
        </div>
      ) : (
        /* Rates Table */
        <div className="overflow-x-auto rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
          <table className="w-full min-w-[850px]">
            <thead className="bg-[#EDE3D3]">
              <tr className="border-b border-[#D8C9B5]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#A47C3A]">
                  Collection
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-[#A47C3A]">
                  Purity
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-[#A47C3A]">
                  Rate
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-[#A47C3A]">
                  Unit
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-[#A47C3A]">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-sm font-semibold text-[#A47C3A]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {rates.map((rate) => (
                <tr
                  key={rate.id}
                  className="border-b border-[#E3D7C5] last:border-b-0 transition-colors duration-200 hover:bg-[#F7F1E7]"
                >
                  {/* Collection */}
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#302A23]">
                      {rate.collection}
                    </span>
                  </td>

                  {/* Purity */}
                  <td className="px-6 py-4">
                    <span className="rounded-md border border-[#D8C9B5] bg-[#F0E9DE] px-2.5 py-1 text-sm font-medium text-[#5F574D]">
                      {rate.purity}
                    </span>
                  </td>

                  {/* Rate */}
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#302A23]">
                      ₹{Number(rate.rate).toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* Unit */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#5F574D]">
                      {rate.unit}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {rate.active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8EAF8F] bg-[#E8F1E6] px-3 py-1 text-sm font-semibold text-[#47704A]">
                        <span className="text-xs">●</span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5A3A0] bg-[#F7E9E7] px-3 py-1 text-sm font-semibold text-[#9A4F49]">
                        <span className="text-xs">●</span>
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <Link
                        href={`/admin/rates/${rate.id}/edit`}
                        className="rounded-lg border border-[#B08D57] bg-[#B08D57] px-4 py-2 text-sm font-semibold text-[#FFF9EF] transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-sm"
                      >
                        ✏ Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}