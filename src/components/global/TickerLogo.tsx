"use client";

import { useState } from "react";

import { TICKER_LOGO_UPSTREAM } from "@/lib/tickerLogoUrls";

interface LogoProps {
  size?: number;
}

interface TickerLogoProps extends LogoProps {
  symbol: string;
}

function LetterFallback({
  size,
  symbol,
}: {
  size: number;
  symbol: string;
}) {
  const letter = symbol.replace(/[-^].*$/, "").slice(0, 3).toUpperCase();
  const hue =
    [...letter].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const bg = `hsl(${hue}, 55%, 38%)`;
  const fs = letter.length > 2 ? 6.5 : letter.length > 1 ? 7.5 : 10;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="9" fill={bg} />
      <text
        x="9"
        y="12.8"
        textAnchor="middle"
        fontSize={fs}
        fontWeight="700"
        fill="#fff"
        fontFamily="Arial,sans-serif"
      >
        {letter}
      </text>
    </svg>
  );
}

export function TickerLogo({ symbol, size = 18 }: TickerLogoProps) {
  const [failed, setFailed] = useState(false);
  const hasUpstream = Boolean(TICKER_LOGO_UPSTREAM[symbol]);

  if (hasUpstream && !failed) {
    const src = `/api/ticker-logo?symbol=${encodeURIComponent(symbol)}`;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          background: "#fff",
          flexShrink: 0,
        }}
      />
    );
  }

  return <LetterFallback size={size} symbol={symbol} />;
}
