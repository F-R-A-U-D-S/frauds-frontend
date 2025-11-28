export default async function handleDownloadCsv(report_id: number) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/report/csv/${report_id}`, {
      method: "GET",
      headers: {
        "Accept": "text/csv",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download CSV");
    }

    const blob = await response.blob();                
    const url = window.URL.createObjectURL(blob);       

    const link = document.createElement("a");
    link.href = url;
    link.download = `fraud-report-${report_id}.csv`;                 
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV download error:", error);
  }
}


