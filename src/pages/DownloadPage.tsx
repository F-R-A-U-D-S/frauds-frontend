import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Layout from "../Layout";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SecurityIcon from "@mui/icons-material/Security";
import EmailIcon from "@mui/icons-material/Email";
import Alert from "@mui/material/Alert";
import "./DownloadPage.css";
import ReportPieChart from "../components/reportPieChart";
import { handleDownloadCsv, handleDownloadPdf } from "../api/downloadWrappers";
import { requestExport } from "../api/export";
import ReportTable from "../components/reportTable";
import Stack from "@mui/material/Stack";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React from "react";
import ReportBarChart from "../components/reportBarChart";
import Footer from "../components/footer";
import Header from "../components/header";

type ViewType = 'status' | 'type';

export default function DownloadPage() {
  const [params] = useSearchParams();
  const resultKey = params.get("key");
  const [exportLoading, setExportLoading] = useState<{ csv: boolean; pdf: boolean }>({
    csv: false,
    pdf: false,
  });
  const [exportMessage, setExportMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [view, setView] = React.useState<ViewType>('status');
  
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: ViewType | null,
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

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
    <Stack spacing={4}
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}    
    >
      <Header/>

      <ToggleButtonGroup
        sx={{p:4}}
        size="medium"
        value={view}
        exclusive
        onChange={handleViewChange}
      >
        <ToggleButton value="status">View by Fraud Status</ToggleButton>
        <ToggleButton value="type">View by Fraud Type</ToggleButton>
      </ToggleButtonGroup>

      {view === 'status' ? (
        <ReportPieChart keyValue={resultKey!} />
      ) : (
        <ReportBarChart keyValue={resultKey!}/>
      )}

      <ReportTable keyValue={resultKey!} />

      <Typography variant="h3">REPORT GENERATED</Typography>

      <Stack direction="row" spacing={4}>
        <Button
          //className="download-box"
          variant="contained"
          endIcon={<FileDownloadIcon />}
          disabled={!resultKey}
          onClick={downloadCSVAndRedirect}
          size="large"
        >
          Download Raw Data (CSV)
        </Button>
        <Button
          //className="download-box"
          variant="contained"
          endIcon={<FileDownloadIcon />}
          disabled={!resultKey}
          onClick={downloadPDFAndRedirect}
          size="large"
        >
          Download Summary Report (PDF)
        </Button>
      </Stack>

      <Stack direction="row" spacing={6}>
        <Stack direction="row" spacing={1}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}  
        >
          <SecurityIcon fontSize="small" /> 
          <Typography>Secure Transfer</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
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

      <Footer/>
    </Stack>
  );
}
