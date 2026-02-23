import { handleFileDownload } from "./downloadResult";

export function handleDownloadCsv(key: string) {
  return handleFileDownload(key, {
    url: "/predict/download/csv",
    accept: "text/csv",
    mimeType: "text/csv",
    fallbackFilename: "flagged_results.csv",
  });
}

export function handleDownloadPdf(key: string) {
  return handleFileDownload(key, {
    url: "/predict/download/pdf",
    accept: "application/pdf",
    mimeType: "application/pdf",
    fallbackFilename: "flagged_results.pdf",
  });
}
