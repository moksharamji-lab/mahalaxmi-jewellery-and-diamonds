import Link from "next/link";

import DashboardCard from "@/components/admin/DashboardCard";
import { getDashboardCounts } from "@/services/dashboard-service";

export default async function AdminDashboard() {
  const counts = await getDashboardCounts();

  return (
    <div className="text-[#302A23]">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47C3A]">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302A23] md:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F665B]">
          Manage your jewellery catalogue, collections, rates, stores and
          website content from one place.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Products"
          value={String(counts.products)}
        />

        <DashboardCard
          title="Categories"
          value={String(counts.categories)}
        />

        <DashboardCard
          title="Hero Slides"
          value={String(counts.heroSlides)}
        />

        <DashboardCard
          title="Rates"
          value={String(counts.rates)}
        />

        <DashboardCard
          title="Stores"
          value={String(counts.stores)}
        />
      </div>

      <section className="mt-10">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47C3A]">
            Quick Actions
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#302A23]">
            Manage Website
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/admin/products/new"
            className="group rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-5 shadow-[0_4px_18px_rgba(80,60,30,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B08D57] hover:bg-[#FDF9F1] hover:shadow-[0_10px_28px_rgba(80,60,30,0.08)]"
          >
            <p className="text-sm font-semibold text-[#302A23] group-hover:text-[#A47C3A]">
              Add Product
            </p>

            <p className="mt-2 text-xs leading-5 text-[#6F665B]">
              Add a new jewellery item to your catalogue.
            </p>

            <p className="mt-4 text-sm font-semibold text-[#A47C3A] group-hover:text-[#8F6F3F]">
              Add Product →
            </p>
          </Link>

          <Link
            href="/admin/categories"
            className="group rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-5 shadow-[0_4px_18px_rgba(80,60,30,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B08D57] hover:bg-[#FDF9F1] hover:shadow-[0_10px_28px_rgba(80,60,30,0.08)]"
          >
            <p className="text-sm font-semibold text-[#302A23] group-hover:text-[#A47C3A]">
              Categories
            </p>

            <p className="mt-2 text-xs leading-5 text-[#6F665B]">
              Organise jewellery into website categories.
            </p>

            <p className="mt-4 text-sm font-semibold text-[#A47C3A] group-hover:text-[#8F6F3F]">
              Manage Categories →
            </p>
          </Link>

          <Link
            href="/admin/rates"
            className="group rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-5 shadow-[0_4px_18px_rgba(80,60,30,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B08D57] hover:bg-[#FDF9F1] hover:shadow-[0_10px_28px_rgba(80,60,30,0.08)]"
          >
            <p className="text-sm font-semibold text-[#302A23] group-hover:text-[#A47C3A]">
              Update Rates
            </p>

            <p className="mt-2 text-xs leading-5 text-[#6F665B]">
              Update Gold and Diamond rates shown on the website.
            </p>

            <p className="mt-4 text-sm font-semibold text-[#A47C3A] group-hover:text-[#8F6F3F]">
              Manage Rates →
            </p>
          </Link>

          <Link
            href="/admin/stores"
            className="group rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-5 shadow-[0_4px_18px_rgba(80,60,30,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B08D57] hover:bg-[#FDF9F1] hover:shadow-[0_10px_28px_rgba(80,60,30,0.08)]"
          >
            <p className="text-sm font-semibold text-[#302A23] group-hover:text-[#A47C3A]">
              Store Details
            </p>

            <p className="mt-2 text-xs leading-5 text-[#6F665B]">
              Update Gold and Diamond store information.
            </p>

            <p className="mt-4 text-sm font-semibold text-[#A47C3A] group-hover:text-[#8F6F3F]">
              Manage Stores →
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}