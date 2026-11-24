import en from "../locales/en.json";
import ptBR from "../locales/pt-BR.json";
import { UI_LANGUAGE } from "./env";

export const SUPPORTED_LOCALES = ["en", "pt-BR"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const catalogs: Record<Locale, Record<string, string>> = {
  en,
  "pt-BR": ptBR,
};

export function normalizeLocale(value?: string | null): Locale | null {
  if (!value) return null;
  const raw = value.trim().replaceAll("_", "-");
  const lower = raw.toLowerCase();
  if (lower === "pt-br" || lower === "pt") return "pt-BR";
  if (lower === "en" || lower.startsWith("en-")) return "en";
  return null;
}

function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

/** Preferência do usuário > Accept-Language > UI_LANGUAGE > en */
export function resolveLocale(opts: {
  cookie?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  const fromCookie = normalizeLocale(opts.cookie);
  if (fromCookie) return fromCookie;

  const accept = opts.acceptLanguage?.split(",")[0]?.split(";")[0];
  const fromAccept = normalizeLocale(accept);
  if (fromAccept) return fromAccept;

  return normalizeLocale(UI_LANGUAGE) ?? "en";
}

export function localeFromRequest(request: Request): Locale {
  return resolveLocale({
    cookie: readCookie(request.headers.get("cookie"), "locale"),
    acceptLanguage: request.headers.get("accept-language"),
  });
}

export function t(
  key: string,
  params?: Record<string, string | number>,
  locale: Locale = "en",
): string {
  const text = catalogs[locale]?.[key] ?? catalogs.en[key] ?? key;
  if (!params) return text;
  return Object.entries(params).reduce(
    (acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)),
    text,
  );
}

export function catalogKeys(locale: Locale = "en"): string[] {
  return Object.keys(catalogs[locale]).sort();
}

/** Keys read by browser scripts via `#ui-i18n`. */
const CLIENT_KEYS = [
  "conversion.start",
  "conversion.titleWithExt",
  "upload.remove",
  "upload.uploading",
  "history.confirmDeleteJobs",
  "history.deleteSuccess",
  "history.deletePartialFail",
  "history.deleteFailed",
  "history.deleteError",
] as const;

export function clientCatalog(locale: Locale): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of CLIENT_KEYS) {
    out[key] = t(key, undefined, locale);
  }
  return out;
}

/** Map stored English status codes to UI text. Do not change DB values. */
const STATUS_KEYS: Record<string, string> = {
  pending: "status.pending",
  completed: "status.completed",
  "Failed, check logs": "status.failedCheckLogs",
  "File type not supported": "status.fileTypeNotSupported",
};

export function displayStatus(status: string, locale: Locale): string {
  const key = STATUS_KEYS[status];
  return key ? t(key, undefined, locale) : status;
}
