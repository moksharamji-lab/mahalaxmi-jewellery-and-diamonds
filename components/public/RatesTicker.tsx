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
      {/* TODAY'S GOLD RATE */}

      <span className="font-sans text-[13px] font-extrabold uppercase tracking-[0.04em] text-[#fffdf7] sm:text-[14px]">
        Today&apos;s Gold Rate
      </span>

      <span className="mx-3 text-[13px] font-bold text-[#f7f2e8]/80 sm:mx-4 sm:text-[14px]">
        |
      </span>

      {/* 24K */}

      <span className="font-sans text-[13px] font-extrabold text-[#fffdf7] sm:text-[14px]">
        24K - {getRate("24K")}
      </span>

      <span className="mx-3 text-[13px] font-bold text-[#f7f2e8]/80 sm:mx-4 sm:text-[14px]">
        |
      </span>

      {/* 22K */}

      <span className="font-sans text-[13px] font-extrabold text-[#fffdf7] sm:text-[14px]">
        22K - {getRate("22K")}
      </span>

      <span className="mx-3 text-[13px] font-bold text-[#f7f2e8]/80 sm:mx-4 sm:text-[14px]">
        |
      </span>

      {/* 18K */}

      <span className="font-sans text-[13px] font-extrabold text-[#fffdf7] sm:text-[14px]">
        18K - {getRate("18K")}
      </span>

      <span className="mx-3 text-[13px] font-bold text-[#f7f2e8]/80 sm:mx-4 sm:text-[14px]">
        |
      </span>

      {/* 14K */}

      <span className="font-sans text-[13px] font-extrabold text-[#fffdf7] sm:text-[14px]">
        14K - {getRate("14K")}
      </span>

      <span className="mx-5 text-[13px] font-bold text-[#f7f2e8]/80 sm:mx-7 sm:text-[14px]">
        |
      </span>
    </div>
  );

  return (
    <div className="relative z-40 overflow-hidden border-b border-[#8f7335] bg-[#b9933f]">
      <div className="flex h-11 items-center overflow-hidden sm:h-12">
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