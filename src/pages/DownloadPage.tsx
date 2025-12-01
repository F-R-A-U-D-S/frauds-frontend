import { useSearchParams } from "react-router-dom";
import Layout from "../Layout";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import "./DownloadPage.css";
import handleDownloadCsv from "../api/downloadCSV";

export default function DownloadPage() {
  const [params] = useSearchParams();
  const resultKey = params.get("key");

  return (
    <Layout>
      <div className="download-container">
        <div>
          <h3>The Fraud Report is ready to download.</h3>
        </div>

        <div>
          <Button
            className="download-box"
            variant="contained"
            endIcon={<FileDownloadIcon />}
            disabled={!resultKey}
            onClick={() => handleDownloadCsv(resultKey!)}
          >
            Download CSV
          </Button>
        </div>

        <div>
          <Button variant="contained" endIcon={<FileDownloadIcon />}>
            Download PDF
          </Button>
        </div>
      </div>
    </Layout>
  );
}
