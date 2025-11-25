import Layout from "../Layout";
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import './DownloadPage.css'

export default function DownloadPage() {
  return (
    <Layout>
        <div className="download-container">
            <div>
                <h3>The Fraud Report is ready to download.</h3>
            </div>
            <div>
                <Button className="download-box" variant="contained" endIcon={<FileDownloadIcon />}>Download CSV</Button>
            </div>
            <div>
                <Button variant="contained" endIcon={<FileDownloadIcon />}>Download PDF</Button>
            </div>
        </div>    
    </Layout>
  );
}
