import { TELEGRAM_URL } from "@/lib/site";

export function TelegramFloat() {
  return (
    <a
      href={TELEGRAM_URL}
      className="mi-telegram-float"
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Canal de Telegram Marc Investments"
    >
      <span className="mi-telegram-float-pulse" aria-hidden="true" />
      <svg
        className="mi-telegram-float-icon"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.67 6.88-1.57 7.4c-.12.53-.44.66-.89.41l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.5 4.58-4.14c.2-.18-.04-.28-.31-.1l-5.67 3.57-2.44-.76c-.53-.17-.54-.53.11-.78l9.53-3.67c.44-.16.83.11.67.7Z" />
      </svg>
    </a>
  );
}
