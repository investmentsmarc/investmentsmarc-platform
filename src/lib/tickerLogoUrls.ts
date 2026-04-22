/** CDN público de logos (TradingView). Usado también por `/api/ticker-logo` vía servidor. */
export const TV_LOGO = "https://s3-symbol-logo.tradingview.com";

/**
 * URLs upstream por símbolo (TradingView slug + CoinGecko para crypto).
 * El cliente no carga estos hosts directamente: pasan por el proxy API.
 */
export const TICKER_LOGO_UPSTREAM: Record<string, string> = {
  AAPL: `${TV_LOGO}/apple.svg`,
  MSFT: `${TV_LOGO}/microsoft.svg`,
  NVDA: `${TV_LOGO}/nvidia.svg`,
  GOOGL: `${TV_LOGO}/alphabet.svg`,
  GOOG: `${TV_LOGO}/alphabet.svg`,
  AMZN: `${TV_LOGO}/amazon.svg`,
  META: `${TV_LOGO}/meta-platforms.svg`,
  TSLA: `${TV_LOGO}/tesla.svg`,
  SPY: `${TV_LOGO}/state-street.svg`,
  QQQ: `${TV_LOGO}/invesco.svg`,
  "^VIX": `${TV_LOGO}/cboe-global-markets.svg`,
  PLTR: `${TV_LOGO}/palantir.svg`,
  UNH: `${TV_LOGO}/unitedhealth.svg`,
  ASML: `${TV_LOGO}/asml.svg`,
  AMD: `${TV_LOGO}/advanced-micro-devices.svg`,
  INTC: `${TV_LOGO}/intel.svg`,
  COIN: `${TV_LOGO}/coinbase.svg`,
  MSTR: `${TV_LOGO}/microstrategy.svg`,
  RIOT: `${TV_LOGO}/riot-blockchain.svg`,
  MARA: `${TV_LOGO}/marathon-digital-holdings.svg`,
  HUT: `${TV_LOGO}/hut-8-mining.svg`,
  JPM: `${TV_LOGO}/jpmorgan-chase.svg`,
  GS: `${TV_LOGO}/goldman-sachs.svg`,
  SPOT: `${TV_LOGO}/spotify-technology.svg`,
  NFLX: `${TV_LOGO}/netflix.svg`,
  UBER: `${TV_LOGO}/uber.svg`,
  "^GSPC": `${TV_LOGO}/indices/s-and-p-500--big.svg`,
  "^NDX": `${TV_LOGO}/indices/nasdaq-100--big.svg`,
  "^DJI": `${TV_LOGO}/indices/dow-30--big.svg`,
  "^RUT": `${TV_LOGO}/indices/russell-2000--big.svg`,
  "BTC-USD":
    "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  "ETH-USD":
    "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  "SOL-USD":
    "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  "BNB-USD":
    "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
};
