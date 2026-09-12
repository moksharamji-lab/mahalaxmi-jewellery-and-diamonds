import {
  Package,
  Folder,
  Diamond,
  Image,
  BadgeIndianRupee,
  Store,
} from "lucide-react";

type Props = {
  title: string;
  value: string;
};

const icons = {
  Products: Package,
  Categories: Folder,
  Brands: Diamond,
  "Hero Slides": Image,
  Rates: BadgeIndianRupee,
  Stores: Store,
};

export default function DashboardCard({
  title,
  value,
}: Props) {
  const Icon = icons[title as keyof typeof icons];

  return (
    <div className="group rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B08D57] hover:bg-[#FDF9F1] hover:shadow-[0_12px_30px_rgba(80,60,30,0.08)]">
      {/* Top Content */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#5F574D]">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#302A23]">
            {value}
          </h2>
        </div>

        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#B08D57]/30 bg-[#B08D57]/10 transition-colors duration-300 group-hover:border-[#B08D57]/50 group-hover:bg-[#B08D57]/15">
          {Icon && (
            <Icon className="h-6 w-6 text-[#A47C3A]" />
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mt-6 h-px bg-[#E3D7C5]" />

      {/* Footer Label */}
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-[#817668]">
        Manage {title}
      </p>
    </div>
  );
}