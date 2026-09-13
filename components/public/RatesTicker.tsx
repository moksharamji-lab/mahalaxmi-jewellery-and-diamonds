import { getActiveRates } from "@/services/rate.service";

export default async function RatesTicker() {
  const rates = await getActiveRates();

  const goldRates = rates.filter(
    (rate) => rate.collection === "Gold"
  );

  if (goldRates.length === 0) {
    return null;
  }

  const rateMap = new Map(
    goldRates.map((rate) => [rate.purity.toLowerCase(), rate])
  );

  const getRate = (purity: string) => {
    const rate = rateMap.get(purity.toLowerCase());

    return rate
      ? `₹${rate.rate.toLocaleString("en-IN")}`
      : "₹00,000";
  };

  const tickerGroup = (
    <div className="flex shrink-0 items-center whitespace-nowrap">
      <span className="font-sans text-[10px] font-semibold text-white sm:text-[11px]">
        Today&apos;s Gold Rate
      </span>

      <span className="mx-2 text-[10px] text-white/80 sm:mx-3">
        |
      </span>

      <span className="font-sans text-[10px] font-medium text-white sm:text-[11px]">
        24K - {getRate("24K")}
      </span>

      <span className="mx-2 text-[10px] text-white/80 sm:mx-3">
        |
      </span>

      <span className="font-sans text-[10px] font-medium text-white sm:text-[11px]">
        22K - {getRate("22K")}
      </span>

      <span className="mx-2 text-[10px] text-white/80 sm:mx-3">
        |
      </span>

      <span className="font-sans text-[10px] font-medium text-white sm:text-[11px]">
        18K - {getRate("18K")}
      </span>

      <span className="mx-2 text-[10px] text-white/80 sm:mx-3">
        |
      </span>

      <span className="font-sans text-[10px] font-medium text-white sm:text-[11px]">
        14K - {getRate("14K")}
      </span>

      <span className="mx-5 text-[10px] text-white/70 sm:mx-6">
        |
      </span>
    </div>
  );

  return (
    <div className="relative z-40 overflow-hidden border-b border-[#9f7d25] bg-[#D4AF37]">
      <div className="flex h-10 items-center overflow-hidden sm:h-11">
        <div
          className="rates-ticker flex min-w-max items-center"
          style={{
            animationDuration: "45s",
          }}
        >
          {tickerGroup}
          {tickerGroup}
          {tickerGroup}
          {tickerGroup}
        </div>
      </div>
    </div>
  );
}