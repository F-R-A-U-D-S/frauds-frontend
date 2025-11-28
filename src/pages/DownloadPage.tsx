import Layout from "../Layout";
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import './DownloadPage.css'
import handleDownloadCsv from "../api/downloadCSV";

export default function DownloadPage(/*report_id:number*/) {
    const report_id = 17;
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
                        onClick={() => handleDownloadCsv(report_id)}
                    >
                        Download CSV
                    </Button>
                </div>
                <div>
                    <Button variant="contained" endIcon={<FileDownloadIcon />}>Download PDF</Button>
                </div>
            </div>    
        </Layout>
    );
}
