import { expect, test } from "bun:test";

import {
  catalogKeys,
  displayStatus,
  normalizeLocale,
  resolveLocale,
  t,
} from "../../src/helpers/i18n";

test("normalizeLocale maps common tags", () => {
  expect(normalizeLocale("pt-BR")).toBe("pt-BR");
  expect(normalizeLocale("pt_br")).toBe("pt-BR");
  expect(normalizeLocale("pt")).toBe("pt-BR");
  expect(normalizeLocale("en-US")).toBe("en");
  expect(normalizeLocale("de")).toBeNull();
});

test("resolveLocale prefers cookie then accept-language", () => {
  expect(resolveLocale({ cookie: "pt-BR", acceptLanguage: "en-US" })).toBe("pt-BR");
  expect(resolveLocale({ cookie: null, acceptLanguage: "pt-BR,pt;q=0.9" })).toBe("pt-BR");
});

test("t interpolates and falls back to en", () => {
  expect(t("nav.history", undefined, "pt-BR")).toBe("Histórico");
  expect(t("missing.key", undefined, "pt-BR")).toBe("missing.key");
  expect(t("auth.welcome", { name: "x" }, "en")).toContain("ConvertX");
});

test("en and pt-BR catalogs have the same keys", () => {
  expect(catalogKeys("pt-BR")).toEqual(catalogKeys("en"));
});

test("displayStatus maps known codes and leaves others", () => {
  expect(displayStatus("pending", "pt-BR")).toBe("Pendente");
  expect(displayStatus("File type not supported", "pt-BR")).toBe(
    "Tipo de arquivo não suportado",
  );
  expect(displayStatus("custom-ok", "en")).toBe("custom-ok");
});
