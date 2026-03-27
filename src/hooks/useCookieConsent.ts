"use client";

import { useSyncExternalStore } from "react";

type CookieConsent = "accepted" | "rejected" | null;

const STORAGE_KEY = "cookie-consent";

function readStoredConsent(): CookieConsent {
  if (typeof window === "undefined") {
    return null;
  }

  const storedConsent = window.localStorage.getItem(STORAGE_KEY);
  return storedConsent === "accepted" || storedConsent === "rejected" ? storedConsent : null;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener("mi-cookie-consent-change", handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener("mi-cookie-consent-change", handleChange);
  };
}

export function useCookieConsent() {
  const consent = useSyncExternalStore(subscribe, readStoredConsent, () => null);

  const setCookieConsent = (value: Exclude<CookieConsent, null>) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event("mi-cookie-consent-change"));
  };

  return {
    consent,
    isReady: true,
    isVisible: consent === null,
    accept: () => setCookieConsent("accepted"),
    reject: () => setCookieConsent("rejected"),
  };
}
