import en from "../src/locales/en.json";

let cache: Record<string, string> | null = null;

function catalog(): Record<string, string> {
  if (cache) return cache;
  const el = document.getElementById("ui-i18n");
  try {
    cache = el?.textContent ? (JSON.parse(el.textContent) as Record<string, string>) : {};
  } catch {
    cache = {};
  }
  return cache;
}

export function clientT(key: string, params?: Record<string, string | number>): string {
  let text = catalog()[key] ?? (en as Record<string, string>)[key] ?? key;
  if (!params) return text;
  for (const [name, value] of Object.entries(params)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}
