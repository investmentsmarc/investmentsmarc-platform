"use client";

import { useEffect, useMemo, useState } from "react";

function getNextSaturdayAt8PmEst() {
  const now = new Date();
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
  const estNow = new Date(utcNow - 4 * 60 * 60000);

  const day = estNow.getDay();
  const daysUntilSaturday = (6 - day + 7) % 7;
  const target = new Date(estNow);
  target.setDate(estNow.getDate() + daysUntilSaturday);
  target.setHours(20, 0, 0, 0);

  if (target <= estNow) {
    target.setDate(target.getDate() + 7);
  }

  return target;
}

export function useCountdown() {
  const targetDate = useMemo(() => getNextSaturdayAt8PmEst(), []);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const diff = targetDate.getTime() - now.getTime();
  const safeDiff = Math.max(diff, 0);

  const days = Math.floor(safeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safeDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((safeDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((safeDiff / 1000) % 60);

  return {
    targetDate,
    parts: [days, hours, minutes, seconds],
  };
}
