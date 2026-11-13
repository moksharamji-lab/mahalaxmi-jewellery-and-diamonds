
import type { ReactNode } from "react";

import PublicNavbar from "@/components/public/PublicNavbar";
import RatesTicker from "@/components/public/RatesTicker";



function InstagramIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
      <defs>
        <linearGradient id="instagramGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="35%" stopColor="#FC466B" />
          <stop offset="70%" stopColor="#E1306C" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill="url(#instagramGradient)" />
      <rect x="12" y="12" width="24" height="24" rx="7" fill="none" stroke="white" strokeWidth="2.8" />
      <circle cx="24" cy="24" r="6" fill="none" stroke="white" strokeWidth="2.8" />
      <circle cx="31.5" cy="16.5" r="1.8" fill="white" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#1877F2" />
      <path
        fill="white"
        d="M27 40V26h5l.8-6H27v-3.5c0-1.8.6-3 3-3h3V8.2c-.5-.1-2.3-.2-4.4-.2-4.4 0-7.4 2.7-7.4 7.6V20h-5v6h5v14H27Z"
      />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#FF0000" />
      <rect x="11" y="16" width="26" height="16" rx="5" fill="white" />
      <path d="M21 19.5L29 24L21 28.5V19.5Z" fill="#FF0000" />
    </svg>
  );
}


type Props = {
  children: ReactNode;
};

// Reusable social media button
function SocialButton({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#66583f] text-[#e6dccb] transition-all duration-300 hover:border-[#d6b878] hover:bg-[#d6b878]/10 hover:text-[#d6b878]"
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

                <SocialButton
                  href="https://www.instagram.com/mahalaxmi_jewellery_916?dlrf=OXIxcmtlamZqODcx"
                  label="Gold Store Instagram"
                >
                  <InstagramIcon />
                </SocialButton>

                <SocialButton
                  href="https://www.facebook.com/share/1DfZfnjmZa/"
                  label="Gold Store Facebook"
                >
                  <FacebookIcon />
                </SocialButton>

              </div>

            </div>

            {/* DIAMOND STORE */}
            <div className="md:border-l md:border-[#4a4237] md:pl-8">

              <h3 className="text-xl font-semibold uppercase tracking-[0.18em] text-[#d6b878]">
                DIAMOND STORE
              </h3>

              <div className="mt-6 flex flex-wrap gap-3">

                <SocialButton
                  href="https://www.instagram.com/mahalaxmi_jewels_diamonds?xtok=ZnRya2lmbms1Mmgy"
                  label="Diamond Store Instagram"
                >
                  <InstagramIcon />
                </SocialButton>

                <SocialButton
                  href="https://www.facebook.com/share/1CBGE3Chij/"
                  label="Diamond Store Facebook"
                >
                  <FacebookIcon />
                </SocialButton>

                <SocialButton
                  href="https://youtube.com/@mahalaxmijewelsanddiamonds?si=PIz6FCxPJUhGqIVx"
                  label="Diamond Store YouTube"
                >
                  <YoutubeIcon />
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
  Website by{" "}
  <a
    href="https://adsparkcom.lovable.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#d6b878] transition-colors duration-300 hover:text-[#fff0c2]"
  >
    AdSpark Technologies
  </a>
</p>
          </div>

        </div>

      </footer>

    </div>
  );
}
