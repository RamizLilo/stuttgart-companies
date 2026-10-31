import { NextResponse } from "next/server";

// Sends "/" to /de or /en by browser language
export function proxy(request) {
  const preferred = (request.headers.get("accept-language") || "").trim().toLowerCase();
  const lang = preferred.startsWith("de") ? "de" : "en";
  const res = NextResponse.redirect(new URL(`/${lang}`, request.url));
  res.headers.set("Vary", "Accept-Language");
  return res;
}

export const config = { matcher: ["/"] };
