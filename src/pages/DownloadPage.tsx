import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "../Layout";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SecurityIcon from "@mui/icons-material/Security";
import EmailIcon from "@mui/icons-material/Email";
import Alert from "@mui/material/Alert";
//import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./DownloadPage.css";
import ReportPieChart from "../components/reportPieChart";
import { handleDownloadCsv, handleDownloadPdf } from "../api/downloadWrappers";
import { requestExport } from "../api/export";

export default function DownloadPage() {
  const [params] = useSearchParams();
  const resultKey = params.get("key");
  const navigate = useNavigate();
  const [exportLoading, setExportLoading] = useState<{ csv: boolean; pdf: boolean }>({
    csv: false,
    pdf: false,
  });
  const [exportMessage, setExportMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const downloadCSVAndRedirect = async () => {
    await handleDownloadCsv(resultKey!);
  };

  const downloadPDFAndRedirect = async () => {
    await handleDownloadPdf(resultKey!);
  };

  const handleSecureExport = async (format: "csv" | "pdf") => {
    setExportLoading((prev) => ({ ...prev, [format]: true }));
    setExportMessage(null);
    try {
      await requestExport(format);
      setExportMessage({
        type: "success",
        text: "Success! The download link has been sent to your email.",
      });
    } catch (error) {
      console.error("Export failed:", error);
      setExportMessage({
        type: "error",
        text: "Export failed. Please try again later or contact support.",
      });
    } finally {
      setExportLoading((prev) => ({ ...prev, [format]: false }));
    }
  };

  return (
    <Layout>
      <div className="download-container">
        <div>
          <ReportPieChart keyValue={resultKey!} />
        </div>
        <div>
          <h3>The Fraud Report is ready to download.</h3>
        </div>

        <div className="download-actions">
          <Button
            className="download-box"
            variant="contained"
            endIcon={<FileDownloadIcon />}
            disabled={!resultKey}
            onClick={downloadCSVAndRedirect}
          >
            Download CSV
          </Button>
          <Button
            className="download-box"
            variant="contained"
            endIcon={<FileDownloadIcon />}
            disabled={!resultKey}
            onClick={downloadPDFAndRedirect}
          >
            Download PDF
          </Button>
        </div>

        {/* Secure Export Section */}
        {/* Secure Export Section */}
        <div className="secure-export-container">
          <h4 className="secure-export-header">
            <SecurityIcon fontSize="small" /> Secure Data Export
          </h4>
          <p className="secure-export-desc">
            Request a secure, async export sent to your email.
          </p>

          <div className="secure-export-actions">
            <Button
              className="secure-export-btn"
              size="small"
              startIcon={<EmailIcon />}
              onClick={() => handleSecureExport("csv")}
              disabled={exportLoading.csv}
            >
              {exportLoading.csv ? "Sending..." : "Email CSV"}
            </Button>
            <Button
              className="secure-export-btn"
              size="small"
              startIcon={<EmailIcon />}
              onClick={() => handleSecureExport("pdf")}
              disabled={exportLoading.pdf}
            >
              {exportLoading.pdf ? "Sending..." : "Email PDF"}
            </Button>
          </div>

          {exportMessage && (
            <Alert severity={exportMessage.type} sx={{ marginTop: "16px" }}>
              {exportMessage.text}
            </Alert>
          )}
        </div>
      </div>
    </Layout>
  );
}
