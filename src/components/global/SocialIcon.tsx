type IconName = "Instagram" | "YouTube" | "WhatsApp" | "TikTok" | "Telegram";

export function SocialIcon({ name, size = 18 }: { name: IconName; size?: number }) {
  switch (name) {
    case "Instagram":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );

    case "YouTube":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M21.58 7.19a2.5 2.5 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.5 2.5 0 0 0-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.5 2.5 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 0 0 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15V9l5.2 3L10 15Z" />
        </svg>
      );

    case "WhatsApp":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.07 4.93A10 10 0 0 0 12 2C6.48 2 2 6.48 2 12a9.94 9.94 0 0 0 1.39 5.08L2 22l5.03-1.36A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.67-1.04-5.18-2.93-7.07ZM12 20.15c-1.49 0-2.94-.4-4.2-1.16l-.3-.18-2.99.81.8-2.91-.2-.31A8.15 8.15 0 1 1 12 20.15Zm4.47-6.11c-.25-.12-1.45-.72-1.68-.8-.23-.08-.39-.12-.55.13-.16.25-.63.8-.77.96-.14.16-.28.18-.53.06a6.72 6.72 0 0 1-1.98-1.22 7.34 7.34 0 0 1-1.37-1.7c-.14-.25-.02-.38.11-.5.12-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.56.13.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.45-.59 1.65-1.16.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28Z" />
        </svg>
      );

    case "TikTok":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.3 7.35a5.66 5.66 0 0 1-3.43-1.13 5.68 5.68 0 0 1-2.3-3.72h-3.04v12.2a2.75 2.75 0 1 1-1.93-2.63V9.02a5.82 5.82 0 0 0-.82-.06 5.82 5.82 0 1 0 5.82 5.82V9.37a8.69 8.69 0 0 0 5.7 2.1V8.43l-.1-.08Z" />
        </svg>
      );

    case "Telegram":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.67 6.88-1.57 7.4c-.12.53-.44.66-.89.41l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.5 4.58-4.14c.2-.18-.04-.28-.31-.1l-5.67 3.57-2.44-.76c-.53-.17-.54-.53.11-.78l9.53-3.67c.44-.16.83.11.67.7Z" />
        </svg>
      );

    default:
      return null;
  }
}
