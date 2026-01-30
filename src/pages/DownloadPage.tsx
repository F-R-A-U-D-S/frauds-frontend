import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../Layout";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
//import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./DownloadPage.css";
import ReportPieChart from "../components/reportPieChart";
import { handleDownloadCsv, handleDownloadPdf } from "../api/downloadWrappers";

export default function DownloadPage() {
  const [params] = useSearchParams();
  const resultKey = params.get("key");
  const navigate = useNavigate();

  const downloadCSVAndRedirect = async () => {
    await handleDownloadCsv(resultKey!);
    navigate("/upload");
  };

  const downloadPDFAndRedirect = async () => {
    await handleDownloadPdf(resultKey!);
    navigate("/upload");
  };

  return (
    <Layout>
      <div className="download-container">
        <div>
          <ReportPieChart keyValue={resultKey!}/>
        </div>
        <div>
          <h3>The Fraud Report is ready to download.</h3>
        </div>

        <div>
          <Button
            className="download-box"
            variant="contained"
            endIcon={<FileDownloadIcon />}
            disabled={!resultKey}
            onClick={downloadCSVAndRedirect}
          >
            Download CSV
          </Button>
        </div>
        <div>
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

        {/* <div>
          <Button variant="contained" endIcon={<FileDownloadIcon />}>
            Download PDF
          </Button>
        </div>

        <div style={{ marginTop: "20px" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/upload")}
          >
            Back to Upload
          </Button>
        </div> */}
      </div>
    </Layout>
  );
}
