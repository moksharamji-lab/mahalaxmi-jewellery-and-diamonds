import Link from "next/link";
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Pencil,
  ExternalLink,
} from "lucide-react";

import { getAllStores } from "@/services/store.service";

export default async function AdminStoresPage() {
  const stores = await getAllStores();

  return (
    <div className="text-[#302A23]">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47C3A]">
          Store Management
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302A23] md:text-4xl">
          Stores
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F665B]">
          Manage the Gold and Diamond store information
          displayed across the website.
        </p>
      </div>

      {/* Empty State */}
      {stores.length === 0 ? (
        <div className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-10 text-center shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#B08D57]/30 bg-[#B08D57]/10">
            <MapPin className="h-7 w-7 text-[#A47C3A]" />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-[#302A23]">
            No Stores Found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6F665B]">
            No store records were found in Appwrite.
            Add your Gold and Diamond stores in the
            Appwrite Stores collection before managing
            them here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {stores.map((store) => {
            const whatsappUrl = store.whatsapp
              ? `https://wa.me/${store.whatsapp}`
              : "";

            return (
              <div
                key={store.id}
                className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B08D57] hover:bg-[#FDF9F1] hover:shadow-[0_12px_30px_rgba(80,60,30,0.08)]"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47C3A]">
                      {store.collection} Store
                    </p>

                    <h2 className="mt-2 break-words text-2xl font-bold text-[#302A23]">
                      {store.name || "Unnamed Store"}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      store.active
                        ? "border border-[#9BC7A9] bg-[#EDF7EF] text-[#39734A]"
                        : "border border-[#C58B84] bg-[#F7E9E7] text-[#9A4F49]"
                    }`}
                  >
                    {store.active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Description */}
                {store.description && (
                  <p className="mt-5 text-sm leading-6 text-[#6F665B]">
                    {store.description}
                  </p>
                )}

                {/* Store Information */}
                <div className="mt-6 space-y-5">
                  {/* Address */}
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#A47C3A]" />

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#817668]">
                        Address
                      </p>

                      <p className="mt-1 break-words text-sm leading-6 text-[#554C42]">
                        {store.address || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#A47C3A]" />

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#817668]">
                        Phone
                      </p>

                      <p className="mt-1 text-sm text-[#554C42]">
                        {store.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex gap-3">
                    <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#A47C3A]" />

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#817668]">
                        WhatsApp
                      </p>

                      <p className="mt-1 text-sm text-[#554C42]">
                        {store.whatsapp || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#A47C3A]" />

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#817668]">
                        Email
                      </p>

                      <p className="mt-1 break-words text-sm text-[#554C42]">
                        {store.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col gap-3 border-t border-[#E3D7C5] pt-6 sm:flex-row">
                  <Link
                    href={`/admin/stores/${store.id}/edit`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#B08D57] bg-[#B08D57] px-5 py-3 text-sm font-semibold text-[#FFF9EF] shadow-sm transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-md"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Store
                  </Link>

                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-5 py-3 text-sm font-semibold text-[#554C42] transition-all duration-200 hover:border-[#B08D57] hover:bg-[#F3EDE2] hover:text-[#8F6F3F]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  )}

                  {store.googleMapsUrl && (
                    <a
                      href={store.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-5 py-3 text-sm font-semibold text-[#554C42] transition-all duration-200 hover:border-[#B08D57] hover:bg-[#F3EDE2] hover:text-[#8F6F3F]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Maps
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}