"use client";

import Script from "next/script";
import { useEffect } from "react";

const PIXEL_ID = "2501291453635404";
const CONSENT_KEY = "cookie-consent";

type FbqFn = (command: string, ...args: unknown[]) => void;

function getFbq(): FbqFn | null {
  const fn = (window as unknown as { fbq?: FbqFn }).fbq;
  return typeof fn === "function" ? fn : null;
}

export function MetaPixel() {
  useEffect(() => {
    const apply = () => {
      const fbq = getFbq();
      if (!fbq) return;
      const stored = window.localStorage.getItem(CONSENT_KEY);
      fbq("consent", stored === "accepted" ? "grant" : "revoke");
    };

    // Run once fbq is ready — poll briefly since <Script afterInteractive>
    // may not have executed yet.
    let tries = 0;
    const id = window.setInterval(() => {
      if (getFbq() || tries++ > 20) {
        window.clearInterval(id);
        apply();
      }
    }, 100);

    window.addEventListener("mi-cookie-consent-change", apply);
    window.addEventListener("storage", apply);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("mi-cookie-consent-change", apply);
      window.removeEventListener("storage", apply);
    };
  }, []);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('consent', 'revoke');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
