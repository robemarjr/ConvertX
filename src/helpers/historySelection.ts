export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

export function selectionState(checked: boolean[]) {
  const count = checked.filter(Boolean).length;
  const all = checked.length > 0 && count === checked.length;
  return { count, all, some: count > 0 && !all };
}

export function arrowPath(collapsed: boolean): string {
  return collapsed
    ? '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />'
    : '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />';
}

export function deleteConfirmMessage(count: number, tr?: TranslateFn): string {
  if (tr) return tr("history.confirmDeleteJobs", { count });
  return `Are you sure you want to delete ${count} job(s)? This action cannot be undone.`;
}

export function deleteResultMessage(
  result: {
    success: boolean;
    deleted?: number;
    failed?: number;
  },
  tr?: TranslateFn,
): {
  message: string;
  reload: boolean;
} {
  const deleted = result.deleted ?? 0;
  const failedCount = result.failed ?? 0;
  if (result.success || deleted > 0) {
    const base = tr
      ? tr("history.deleteSuccess", { deleted })
      : `Successfully deleted ${deleted} job(s).`;
    const failed = failedCount > 0
      ? tr
        ? tr("history.deletePartialFail", { failed: failedCount })
        : ` Failed to delete ${failedCount} job(s).`
      : "";
    return { message: `${base}${failed}`, reload: true };
  }
  return {
    message: tr
      ? tr("history.deleteFailed")
      : "Failed to delete jobs. Please try again.",
    reload: false,
  };
}

export function chunk<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += size) batches.push(items.slice(i, i + size));
  return batches;
}
