import { type Locale, t } from "../helpers/i18n";

export const Header = ({
  loggedIn,
  accountRegistration,
  allowUnauthenticated,
  hideHistory,
  webroot = "",
  branding = "ConvertX",
  locale = "en",
}: {
  loggedIn?: boolean;
  accountRegistration?: boolean;
  allowUnauthenticated?: boolean;
  hideHistory?: boolean;
  webroot?: string;
  branding?: string;
  locale?: Locale;
}) => {
  const tr = (key: string) => t(key, undefined, locale);

  let rightNav: JSX.Element;
  if (loggedIn) {
    rightNav = (
      <ul class="flex flex-wrap items-center gap-4">
        {!hideHistory && (
          <li>
            <a
              class={`
                text-accent-600 transition-all
                hover:text-accent-500 hover:underline
              `}
              href={`${webroot}/history`}
            >
              {tr("nav.history")}
            </a>
          </li>
        )}
        {!allowUnauthenticated ? (
          <li>
            <a
              class={`
                text-accent-600 transition-all
                hover:text-accent-500 hover:underline
              `}
              href={`${webroot}/account`}
            >
              {tr("nav.account")}
            </a>
          </li>
        ) : null}
        {!allowUnauthenticated ? (
          <li>
            <a
              class={`
                text-accent-600 transition-all
                hover:text-accent-500 hover:underline
              `}
              href={`${webroot}/logoff`}
            >
              {tr("nav.logout")}
            </a>
          </li>
        ) : null}
        <li>
          <LanguageSelect webroot={webroot} locale={locale} />
        </li>
      </ul>
    );
  } else {
    rightNav = (
      <ul class="flex flex-wrap items-center gap-4">
        <li>
          <a
            class={`
              text-accent-600 transition-all
              hover:text-accent-500 hover:underline
            `}
            href={`${webroot}/login`}
          >
            {tr("nav.login")}
          </a>
        </li>
        {accountRegistration ? (
          <li>
            <a
              class={`
                text-accent-600 transition-all
                hover:text-accent-500 hover:underline
              `}
              href={`${webroot}/register`}
            >
              {tr("nav.register")}
            </a>
          </li>
        ) : null}
        <li>
          <LanguageSelect webroot={webroot} locale={locale} />
        </li>
      </ul>
    );
  }

  return (
    <header class="w-full p-4">
      <nav class={`mx-auto flex max-w-4xl justify-between rounded-sm bg-neutral-900 p-4`}>
        <ul>
          <li>
            <strong>
              <a href={`${webroot}/`} safe>
                {branding.length < 26 ? branding : branding.slice(0, 26)}
              </a>
            </strong>
          </li>
        </ul>
        {rightNav}
      </nav>
    </header>
  );
};

function LanguageSelect({ webroot, locale }: { webroot: string; locale: Locale }) {
  return (
    <form method="get" action={`${webroot}/locale`} class="flex items-center gap-2">
      <label for="ui-language" class="sr-only">
        {t("common.language", undefined, locale)}
      </label>
      <select
        id="ui-language"
        name="lang"
        class="rounded-sm bg-neutral-800 px-2 py-1 text-sm text-neutral-200"
        onchange="this.form.submit()"
      >
        <option value="en" selected={locale === "en"}>
          English
        </option>
        <option value="pt-BR" selected={locale === "pt-BR"}>
          Português (Brasil)
        </option>
      </select>
    </form>
  );
}
