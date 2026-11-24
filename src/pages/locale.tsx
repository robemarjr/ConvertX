import { Elysia, t } from "elysia";

import { HTTP_ALLOWED, WEBROOT } from "../helpers/env";
import { normalizeLocale } from "../helpers/i18n";

export const locale = new Elysia().get(
  "/locale",
  ({ query, cookie: { locale: localeCookie }, redirect, request }) => {
    const next = normalizeLocale(query.lang);
    if (next && localeCookie) {
      localeCookie.set({
        value: next,
        httpOnly: false,
        secure: !HTTP_ALLOWED,
        maxAge: 365 * 24 * 60 * 60,
        sameSite: "lax",
        path: "/",
      });
    }

    const referer = request.headers.get("referer");
    const fallback = `${WEBROOT || ""}/` || "/";
    return redirect(referer && referer.startsWith("http") ? referer : fallback, 302);
  },
  {
    query: t.Object({
      lang: t.String(),
    }),
    cookie: t.Cookie({
      locale: t.Optional(t.String()),
    }),
  },
);
