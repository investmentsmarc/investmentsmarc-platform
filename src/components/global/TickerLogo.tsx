import type { JSX, ReactNode } from "react";

// Logos circulares para el ticker — replica el estilo TradingView

interface LogoProps {
  size?: number;
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function Circle({
  size,
  fill,
  children,
}: {
  size: number;
  fill: string;
  children: ReactNode;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill={fill} />
      {children}
    </svg>
  );
}

function LetterBadge({ size, bg, letter }: { size: number; bg: string; letter: string }) {
  const fs = letter.length > 2 ? 6.5 : letter.length > 1 ? 7.5 : 10;
  return (
    <Circle size={size} fill={bg}>
      <text x="9" y="12.8" textAnchor="middle" fontSize={fs} fontWeight="700" fill="#fff" fontFamily="Arial,sans-serif">
        {letter}
      </text>
    </Circle>
  );
}

/* ─────────────────────────── Crypto ─────────────────────────── */

export function LogoBTC({ size = 18 }: LogoProps) {
  return (
    <Circle size={size} fill="#F7931A">
      <text x="9" y="13" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" fontFamily="Arial,sans-serif">₿</text>
    </Circle>
  );
}

export function LogoETH({ size = 18 }: LogoProps) {
  return (
    <Circle size={size} fill="#627EEA">
      <polygon points="9,3.5 5.5,9.2 9,11.2 12.5,9.2" fill="#fff" opacity="0.9" />
      <polygon points="9,12 5.5,10 9,14.5 12.5,10" fill="#fff" opacity="0.7" />
    </Circle>
  );
}

export function LogoSOL({ size = 18 }: LogoProps) {
  return (
    <Circle size={size} fill="#9945FF">
      <text x="9" y="13" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily="Arial,sans-serif">SOL</text>
    </Circle>
  );
}

export function LogoBNB({ size = 18 }: LogoProps) {
  return (
    <Circle size={size} fill="#F3BA2F">
      <path d="M9 4.5L10.5 6l-1.5 1.5L7.5 6zM6 7.5l1.5 1.5L6 10.5 4.5 9zm6 0L13.5 9 12 10.5 10.5 9zm-3 3L10.5 12 9 13.5 7.5 12z" fill="#1a1a1a" />
      <rect x="8.25" y="8.25" width="1.5" height="1.5" fill="#1a1a1a" transform="rotate(45 9 9)" />
    </Circle>
  );
}

/* ─────────────────────────── Índices ─────────────────────────── */

export function LogoSPX({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#1565C0" letter="SP" />;
}
export function LogoNDX({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#0D47A1" letter="NQ" />;
}
export function LogoDJI({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#B71C1C" letter="DJ" />;
}
export function LogoRUT({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#2E7D32" letter="R2" />;
}

/* ─────────────────────────── Stocks conocidos ─────────────────────────── */

// Tech megacap
export function LogoAAPL({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#555" letter="🍎" />;
}
export function LogoMSFT({ size = 18 }: LogoProps) {
  return (
    <Circle size={size} fill="#fff">
      <rect x="4"   y="4"   width="4.5" height="4.5" fill="#F25022" />
      <rect x="9.5" y="4"   width="4.5" height="4.5" fill="#7FBA00" />
      <rect x="4"   y="9.5" width="4.5" height="4.5" fill="#00A4EF" />
      <rect x="9.5" y="9.5" width="4.5" height="4.5" fill="#FFB900" />
    </Circle>
  );
}
export function LogoGOOGL({ size = 18 }: LogoProps) {
  return (
    <Circle size={size} fill="#fff">
      <text x="9" y="13" textAnchor="middle" fontSize="9" fontWeight="800" fill="#4285F4" fontFamily="Arial,sans-serif">G</text>
    </Circle>
  );
}
export function LogoMETA({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#0866FF" letter="f" />;
}
export function LogoAMZN({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#FF9900" letter="a" />;
}

// AI / Semis
export function LogoNVDA({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#76B900" letter="nv" />;
}
export function LogoAMD({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#ED1C24" letter="AMD" />;
}
export function LogoINTC({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#0071C5" letter="intel" />;
}

// EV / Auto
export function LogoTSLA({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#CC0000" letter="T" />;
}

// Crypto-related stocks
export function LogoCOIN({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#0052FF" letter="C" />;
}
export function LogoMSTR({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#FF6B35" letter="M" />;
}
export function LogoHUT({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#00BCD4" letter="H8" />;
}
export function LogoRIOT({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#7B1FA2" letter="R" />;
}
export function LogoMARa({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#1B5E20" letter="M" />;
}

// Finance
export function LogoJPM({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#0A2472" letter="JP" />;
}
export function LogoGS({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#1E3A5F" letter="GS" />;
}

// Other popular
export function LogoSPOT({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#1DB954" letter="S" />;
}
export function LogoNFLX({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#E50914" letter="N" />;
}
export function LogoUBER({ size = 18 }: LogoProps) {
  return <LetterBadge size={size} bg="#000" letter="U" />;
}

/* ─────────────────────────── Mapa symbol → Logo ─────────────────────────── */

type LogoComponent = (props: LogoProps) => JSX.Element;

const LOGO_MAP: Record<string, LogoComponent> = {
  // Índices
  "^GSPC":   LogoSPX,
  "^NDX":    LogoNDX,
  "^DJI":    LogoDJI,
  "^RUT":    LogoRUT,
  // Crypto
  "BTC-USD": LogoBTC,
  "ETH-USD": LogoETH,
  "SOL-USD": LogoSOL,
  "BNB-USD": LogoBNB,
  // Stocks
  AAPL: LogoAAPL,
  MSFT: LogoMSFT,
  GOOGL: LogoGOOGL,
  GOOG:  LogoGOOGL,
  META:  LogoMETA,
  AMZN:  LogoAMZN,
  NVDA:  LogoNVDA,
  AMD:   LogoAMD,
  INTC:  LogoINTC,
  TSLA:  LogoTSLA,
  COIN:  LogoCOIN,
  MSTR:  LogoMSTR,
  HUT:   LogoHUT,
  RIOT:  LogoRIOT,
  MARA:  LogoMARa,
  JPM:   LogoJPM,
  GS:    LogoGS,
  SPOT:  LogoSPOT,
  NFLX:  LogoNFLX,
  UBER:  LogoUBER,
};

/* ─────────────────────────── Export principal ─────────────────────────── */

interface TickerLogoProps extends LogoProps {
  symbol: string;
}

export function TickerLogo({ symbol, size = 18 }: TickerLogoProps) {
  const Logo = LOGO_MAP[symbol];
  if (Logo) return <Logo size={size} />;

  // Fallback: badge con las 2-3 primeras letras del símbolo
  const letter = symbol.replace(/[-^].*$/, "").slice(0, 3).toUpperCase();
  const hue = [...letter].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  const bg = `hsl(${hue}, 55%, 38%)`;
  return <LetterBadge size={size} bg={bg} letter={letter} />;
}
