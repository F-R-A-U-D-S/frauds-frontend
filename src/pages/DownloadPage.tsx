import { useSearchParams } from "react-router-dom";
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
import ReportTable from "../components/reportTable";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";

export default function DownloadPage() {
  const [params] = useSearchParams();
  const resultKey = params.get("key");
  //   const navigate = useNavigate();
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
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setExportMessage(null);
      }, 3000);
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
        {/* Decorative HUD Elements */}
        {/* Note: Shapes can remain or be removed/changed as per new CSS. Keeping them simple. */}
        <div className="download-shape download-shape-1"></div>
        <div className="download-shape download-shape-2"></div>

        {/* 1. Chart Section */}
        <Stack spacing={4}>
          <ReportPieChart keyValue={resultKey!} />
          <ReportTable keyValue={resultKey!} />
        </Stack>

        {/* 2. Status Text */}
        <Stack>
          <Typography variant="h3">REPORT GENERATED</Typography>
        </Stack>

        {/* 3. Main Actions */}
        <Stack direction="row" spacing={4}>
          <Button
            className="download-box"
            variant="contained"
            endIcon={<FileDownloadIcon />}
            disabled={!resultKey}
            onClick={downloadCSVAndRedirect}
            size="large"
          >
            Download Raw Data (CSV)
          </Button>
          <Button
            className="download-box"
            variant="contained"
            endIcon={<FileDownloadIcon />}
            disabled={!resultKey}
            onClick={downloadPDFAndRedirect}
            size="large"
          >
            Download Summary Report (PDF)
          </Button>
        </Stack>

        {/* 4. Secure Export HUD Bar */}
        <Stack direction="row" className="secure-export-container">
          <Stack className="secure-export-header" direction="row" spacing={1}>
            <SecurityIcon fontSize="small" /> 
            <Typography>Secure Transfer</Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              className="secure-export-btn"
              variant="text"
              size="small"
              startIcon={<EmailIcon />}
              onClick={() => handleSecureExport("csv")}
              disabled={exportLoading.csv}
            >
              {exportLoading.csv ? "Sending..." : "Email Raw Data (CSV)"}
            </Button>
            <Button
              variant="text"
              className="secure-export-btn"
              size="small"
              startIcon={<EmailIcon />}
              onClick={() => handleSecureExport("pdf")}
              disabled={exportLoading.pdf}
            >
              {exportLoading.pdf ? "Sending..." : "Email  Summary Report (PDF)"}
            </Button>
          </Stack>

          {exportMessage && (
            <Alert severity={exportMessage.type} sx={{ marginTop: "16px", position: "absolute", bottom: "100%", right: "20px" }}>
              {exportMessage.text}
            </Alert>
          )}
        </Stack>
      </div>
    </Layout>
  );
}
