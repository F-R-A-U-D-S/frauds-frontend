import axiosClient from "../api/axiosClient";

export default async function handleDownloadCsv(key: string) {
  try {
    const response = await axiosClient.get(`/predict/download/${key}`, {
      responseType: "blob",
      headers: {
        Accept: "text/csv",
      },
    });

    // Get blob data
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // Extract filename from Content-Disposition header
    const disposition = response.headers["content-disposition"];
    let filename = "flagged_results.csv";

    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
    }

    // Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV download error:", error);
  }
}
