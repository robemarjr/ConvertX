import { Elysia } from "elysia";

import { BaseHtml } from "../components/base";
import { Header } from "../components/header";
import db from "../db/db";
import { Filename, Jobs } from "../db/types";
import { buildDownloadUrl } from "../helpers/buildDownloadUrl";
import { ALLOW_UNAUTHENTICATED, BRANDING, WEBROOT } from "../helpers/env";
import { displayStatus, type Locale, localeFromRequest, t } from "../helpers/i18n";
import { DeleteIcon } from "../icons/delete";
import { DownloadIcon } from "../icons/download";
import { EyeIcon } from "../icons/eye";
import { userService } from "./user";

function ResultsArticle({
  job,
  files,
  outputPath,
  locale,
}: {
  job: Jobs;
  files: Filename[];
  outputPath: string;
  locale: Locale;
}) {
  const tr = (key: string) => t(key, undefined, locale);
  const isCompleted =
    job.status === "completed" || (job.status !== "pending" && files.length >= job.num_files);
  const progressMax = Math.max(job.num_files, files.length);
  const pendingStyle = isCompleted ? "" : "pointer-events: none;";
  const pendingAttrs = isCompleted ? "" : { disabled: true, "aria-busy": "true" };

  return (
    <article class="article">
      <div class="mb-4 flex items-center justify-between">
        <h1 class="text-xl">{tr("history.title")}</h1>
        <div class="flex flex-row gap-4">
          <form action={`${WEBROOT}/delete/${job.id}`} method="POST">
            <button
              type="submit"
              style={pendingStyle}
              class="flex btn-secondary flex-row gap-2 text-contrast"
              {...pendingAttrs}
            >
              <DeleteIcon /> <p>{tr("history.delete")}</p>
            </button>
          </form>
          <a
            style={pendingStyle}
            href={`${WEBROOT}/archive/${job.id}`}
            download={`converted_files_${job.id}.tar`}
            class="flex btn-primary flex-row gap-2 text-contrast"
            {...pendingAttrs}
          >
            <DownloadIcon /> <p>{tr("results.downloadTar")}</p>
          </a>
          <button class="flex btn-primary flex-row gap-2 text-contrast" data-action="download-all">
            <DownloadIcon /> <p>{tr("results.downloadAll")}</p>
          </button>
        </div>
      </div>
      <progress
        max={progressMax}
        {...(isCompleted ? { value: progressMax } : "")}
        class={`
          mb-4 inline-block h-2 w-full appearance-none overflow-hidden rounded-full border-0
          bg-neutral-700 bg-none text-accent-500 accent-accent-500
          [&::-moz-progress-bar]:bg-accent-500
          [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:[background:none]
          [&[value]::-webkit-progress-value]:bg-accent-500
          [&[value]::-webkit-progress-value]:transition-[inline-size]
        `}
      />
      <table
        class={`
          w-full table-auto rounded-sm bg-neutral-900 text-left
          [&_td]:p-4
          [&_tr]:rounded-sm [&_tr]:border-b [&_tr]:border-neutral-800
        `}
      >
        <thead>
          <tr>
            <th
              class={`
                p-2
                sm:px-4
              `}
            >
              {tr("results.convertedFileName")}
            </th>
            <th
              class={`
                p-2
                sm:px-4
              `}
            >
              {tr("common.status")}
            </th>
            <th
              class={`
                p-2
                sm:px-4
              `}
            >
              {tr("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const conversionFailed = ["Failed, check logs", "File type not supported"].includes(
              file.status,
            );

            return (
              <tr>
                <td safe class="max-w-[20vw] truncate">
                  {file.output_file_name}
                </td>
                <td safe>{displayStatus(file.status, locale)}</td>
                <td class="flex flex-row gap-4">
                  {conversionFailed ? (
                    <span class="text-neutral-500">{tr("results.unavailable")}</span>
                  ) : (
                    <>
                      <a
                        class={`
                          text-accent-500 underline
                          hover:text-accent-400
                        `}
                        href={buildDownloadUrl(WEBROOT, outputPath, file.output_file_name)}
                      >
                        <EyeIcon />
                      </a>
                      <a
                        class={`
                          text-accent-500 underline
                          hover:text-accent-400
                        `}
                        href={buildDownloadUrl(WEBROOT, outputPath, file.output_file_name)}
                        download={file.output_file_name}
                      >
                        <DownloadIcon />
                      </a>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </article>
  );
}

export const results = new Elysia()
  .use(userService)
  .get(
    "/results/:jobId",
    async ({ params, set, cookie: { job_id }, user, request }) => {
      const locale = localeFromRequest(request);
      const tr = (key: string) => t(key, undefined, locale);

      if (job_id?.value) {
        // Clear the job_id cookie since we are viewing the results
        job_id.remove();
      }

      const job = db
        .query("SELECT * FROM jobs WHERE user_id = ? AND id = ?")
        .as(Jobs)
        .get(user.id, params.jobId);

      if (!job) {
        set.status = 404;
        return {
          message: tr("error.jobNotFound"),
        };
      }

      const outputPath = `${user.id}/${params.jobId}/`;

      const files = db
        .query("SELECT * FROM file_names WHERE job_id = ?")
        .as(Filename)
        .all(params.jobId);

      return (
        <BaseHtml
          webroot={WEBROOT}
          title={`${BRANDING} | ${tr("results.title")}`}
          locale={locale}
        >
          <>
            <Header
              webroot={WEBROOT}
              allowUnauthenticated={ALLOW_UNAUTHENTICATED}
              loggedIn
              branding={BRANDING}
              locale={locale}
            />
            <main
              class={`
                w-full flex-1 px-2
                sm:px-4
              `}
            >
              <ResultsArticle job={job} files={files} outputPath={outputPath} locale={locale} />
            </main>
            <script src={`${WEBROOT}/results.js`} defer />
          </>
        </BaseHtml>
      );
    },
    { auth: true },
  )
  .post(
    "/progress/:jobId",
    async ({ set, params, cookie: { job_id }, user, request }) => {
      const locale = localeFromRequest(request);

      if (job_id?.value) {
        // Clear the job_id cookie since we are viewing the results
        job_id.remove();
      }

      const job = db
        .query("SELECT * FROM jobs WHERE user_id = ? AND id = ?")
        .as(Jobs)
        .get(user.id, params.jobId);

      if (!job) {
        set.status = 404;
        return {
          message: t("error.jobNotFound", undefined, locale),
        };
      }

      const outputPath = `${user.id}/${params.jobId}/`;

      const files = db
        .query("SELECT * FROM file_names WHERE job_id = ?")
        .as(Filename)
        .all(params.jobId);

      return <ResultsArticle job={job} files={files} outputPath={outputPath} locale={locale} />;
    },
    { auth: true },
  );
