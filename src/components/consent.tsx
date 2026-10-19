"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "analytics-consent";
const OPEN_EVENT = "open-cookie-settings";
// Set one of these in the Cloudflare Pages build settings. Neither loads until the visitor accepts.
const CF_TOKEN = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type Choice = "accepted" | "declined";

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch { return null; }
}

function loadAnalytics() {
  if (CF_TOKEN && !document.getElementById("cf-beacon")) {
    const script = document.createElement("script");
    script.id = "cf-beacon";
    script.defer = true;
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.dataset.cfBeacon = JSON.stringify({ token: CF_TOKEN });
    document.body.appendChild(script);
  }
  if (GA_ID && !document.getElementById("ga-script")) {
    const script = document.createElement("script");
    script.id = "ga-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    // gtag.js only reads the Arguments object, not arrays.
    // eslint-disable-next-line prefer-rest-params
    w.gtag = function gtag() { w.dataLayer.push(arguments); };
    w.gtag("js", new Date());
    w.gtag("config", GA_ID, { anonymize_ip: true });
  }
}

export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    if (choice === "accepted") loadAnalytics();
    // localStorage only exists in the browser, so the banner opens after hydration.
    const frame = choice === null ? requestAnimationFrame(() => setOpen(true)) : 0;
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => { cancelAnimationFrame(frame); window.removeEventListener(OPEN_EVENT, reopen); };
  }, []);

  function decide(choice: Choice) {
    try { localStorage.setItem(STORAGE_KEY, choice); } catch {}
    if (choice === "accepted") loadAnalytics();
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div className="consent-banner" role="dialog" aria-live="polite" aria-label="Cookie and analytics choice">
      <p>I use analytics to see which pages people read. It only runs if you accept. <a href="/privacy/">Privacy policy</a></p>
      <div className="consent-actions">
        <button type="button" className="button button-dark" onClick={() => decide("accepted")}>Accept</button>
        <button type="button" className="consent-decline" onClick={() => decide("declined")}>Decline</button>
      </div>
    </div>
  );
}

export function CookieSettingsButton() {
  return <button type="button" className="footer-button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>Cookie settings</button>;
}
