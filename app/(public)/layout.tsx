
import type { ReactNode } from "react";

import PublicNavbar from "@/components/public/PublicNavbar";
import RatesTicker from "@/components/public/RatesTicker";

type Props = {
  children: ReactNode;
};

function SocialButton({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-10.5 items-center justify-center rounded-full border border-[#66583f] px-5 text-[11px] font-medium tracking-[0.04em] text-[#e6dccb] transition-colors duration-300 hover:border-[#d6b878] hover:text-[#d6b878]"
    >
      {children}
    </a>
  );
}

export default function PublicLayout({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#1c1a17]">

      {/* RATES TICKER */}
      <RatesTicker />

      {/* NAVBAR */}
      <PublicNavbar />

      {/* PAGE CONTENT */}
      <div>{children}</div>

      {/* FOOTER */}
      <footer className="border-t border-[#3a342c] bg-[#211e1a] text-[#e6dccb]">

        <div className="mx-auto max-w-375 px-6 py-16 sm:px-8 lg:px-10">

          {/* THREE COLUMN FOOTER */}
          <div className="grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-14">

            {/* COMPANY */}
            <div className="flex flex-col justify-center md:pr-8">

              <h2 className="font-display text-4xl font-normal leading-none tracking-[0.16em] text-[#d6b878] sm:text-5xl">
                MAHALAXMI
              </h2>

              <p className="mt-4 text-[12px] font-semibold uppercase leading-6 tracking-[0.28em] text-[#f5eee2] sm:text-[13px]">
                JEWELLERS AND DIAMONDS
                <br />
                (SINCE - 1996)
              </p>

            </div>

            {/* GOLD STORE */}
            <div className="md:border-l md:border-[#4a4237] md:pl-8">

              <h3 className="text-xl font-semibold uppercase tracking-[0.18em] text-[#d6b878]">
                GOLD STORE
              </h3>

              <div className="mt-6 flex flex-wrap gap-3">

                <SocialButton href="https://www.instagram.com/mahalaxmi_jewellery_916?dlrf=OXIxcmtlamZqODcx">
                  Instagram
                </SocialButton>

                <SocialButton href="https://www.facebook.com/share/1DfZfnjmZa/">
                  Facebook
                </SocialButton>

              </div>

            </div>

            {/* DIAMOND STORE */}
            <div className="md:border-l md:border-[#4a4237] md:pl-8">

              <h3 className="text-xl font-semibold uppercase tracking-[0.18em] text-[#d6b878]">
                DIAMOND STORE
              </h3>

              <div className="mt-6 flex flex-wrap gap-3">

                <SocialButton href="https://www.instagram.com/mahalaxmi_jewels_diamonds?xtok=ZnRya2lmbms1Mmgy">
                  Instagram
                </SocialButton>

                <SocialButton href="https://www.facebook.com/share/1CBGE3Chij/">
                  Facebook
                </SocialButton>

                <SocialButton href="https://youtube.com/@mahalaxmijewelsanddiamonds?si=PIz6FCxPJUhGqIVx">
                  YouTube
                </SocialButton>

              </div>

            </div>

          </div>

          {/* DIVIDER */}
          <div className="mt-14 border-t border-[#4a4237]" />

          {/* COPYRIGHT */}
          <div className="pt-7 text-center">

            <p className="text-[12px] leading-6 text-[#a99e8e] sm:text-[13px]">
              © {new Date().getFullYear()} Mahalaxmi Jewellers and
              Diamonds. All rights reserved.
            </p>

            <p className="mt-2 text-[11px] tracking-[0.04em] text-[#817668]">
              Website by AdSpark Technologies
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}
