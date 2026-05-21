type Column = { key: string; label: string };

function quoteCell(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function downloadCsv(
  rows: Record<string, unknown>[],
  columns: Column[],
  filename: string
): void {
  const header = columns.map((c) => quoteCell(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => quoteCell(row[c.key])).join(","))
    .join("\n");

  const blob = new Blob([`${header}\n${body}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
