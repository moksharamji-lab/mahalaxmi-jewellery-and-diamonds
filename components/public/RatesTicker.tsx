import { Gem, Coins } from "lucide-react";

import { getActiveRates } from "@/services/rate.service";

export default async function RatesTicker() {
  const rates = await getActiveRates();

  if (rates.length === 0) {
    return null;
  }

  const tickerRates = [...rates, ...rates];

  return (
    <div className="relative z-40 overflow-hidden border-b border-[#9f7d25] bg-[#D4AF37]">
      <div className="flex h-10 items-center overflow-hidden sm:h-11">
        <div
          className="rates-ticker flex min-w-max items-center"
          style={{
            animationDuration: "45s",
          }}
        >
          {tickerRates.map((rate, index) => {
            const isGold = rate.collection === "Gold";

            return (
              <div
                key={`${rate.id}-${index}`}
                className="flex shrink-0 items-center"
              >
                {/* COLLECTION ICON */}
                <span className="ml-4 flex items-center sm:ml-6">
                  {isGold ? (
                    <Coins className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
                  ) : (
                    <Gem className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
                  )}
                </span>

                {/* COLLECTION */}
                <span className="ml-2 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:text-[11px]">
                  {rate.collection}
                </span>

                {/* PURITY */}
                <span className="ml-2 font-sans text-[10px] font-medium uppercase tracking-[0.08em] text-[#fffdf5] sm:text-[11px]">
                  {rate.purity}
                </span>

                {/* RATE */}
                <span className="ml-2 font-sans text-[11px] font-bold tracking-[0.03em] text-white sm:text-[12px]">
                  ₹{rate.rate.toLocaleString("en-IN")}
                </span>

                {/* UNIT */}
                <span className="ml-1 font-sans text-[9px] font-medium uppercase tracking-[0.06em] text-[#fffdf5] sm:text-[10px]">
                  {rate.unit}
                </span>

                {/* SEPARATOR */}
                <span className="mx-5 font-sans text-[10px] text-white sm:mx-7 sm:text-[11px]">
                  ✦
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}