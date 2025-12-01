export default async function handleDownloadCsv(key: string) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/predict/download/${key}`, {
      method: "GET",
      headers: {
        "Accept": "text/csv",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download CSV");
    }

    // Get blob data
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Extract filename from backend header if present
    const disposition = response.headers.get("Content-Disposition");
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
