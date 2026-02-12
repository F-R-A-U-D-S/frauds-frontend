import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../Layout";
import axiosClient from "../api/axiosClient";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import "./SecureDownloadPage.css";

export default function SecureDownloadPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
    const [errorMsg, setErrorMsg] = useState<string>("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setErrorMsg("No token provided.");
            return;
        }

        const consumeToken = async () => {
            try {
                // Attempt to fetch the file blob directly
                // Assuming backend route is GET /export/download?token=...
                const response = await axiosClient.get(`/export/download`, {
                    params: { token },
                    responseType: "blob",
                });

                // Check content type to distinguish JSON error from file blob
                const contentType = response.headers["content-type"];
                if (contentType && contentType.includes("application/json")) {
                    // It's likely an error blob, read it as text
                    const text = await response.data.text();
                    const json = JSON.parse(text);
                    throw new Error(json.detail || "Download failed");
                }

                // Success! Create object URL and trigger download
                const blob = new Blob([response.data], {
                    type: contentType || "application/octet-stream"
                });
                const url = window.URL.createObjectURL(blob);

                // Try to get filename
                const disposition = response.headers["content-disposition"];
                let filename = "secure_export.csv"; // Default
                if (disposition) {
                    const match = disposition.match(/filename="?([^"]+)"?/);
                    if (match) filename = match[1];
                }

                const link = document.createElement("a");
                link.href = url;
                link.download = filename;
                link.click();
                window.URL.revokeObjectURL(url);

                setStatus("success");
            } catch (err: any) {
                console.error("Secure download error:", err);
                // Axios handling
                if (err.response?.data instanceof Blob) {
                    // Try to read error from blob
                    const text = await err.response.data.text();
                    try {
                        const json = JSON.parse(text);
                        setErrorMsg(json.detail || "Link expired or invalid.");
                    } catch {
                        setErrorMsg("Link expired or invalid.");
                    }
                } else {
                    setErrorMsg(err.response?.data?.detail || "Link expired or invalid.");
                }
                setStatus("error");
            }
        };

        consumeToken();
    }, [token]);

    return (
        <Layout>
            <div className="secure-download-container">
                <div className="secure-card">
                    {status === "loading" && (
                        <>
                            <CircularProgress size={60} thickness={4} className="loader" />
                            <h2>Verifying Link...</h2>
                            <p>Please wait while we validate your secure token.</p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            {/* Error Icon */}
                            <div className="icon-wrapper error-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <h2>Link Expired</h2>
                            <Alert severity="error" className="status-alert">
                                {errorMsg}
                            </Alert>
                            <p>This download link is no longer valid or has already been used.</p>
                            <button className="action-btn" onClick={() => navigate("/")}>
                                Return Home
                            </button>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            {/* Success Icon */}
                            <div className="icon-wrapper success-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h2>Download Started</h2>
                            <Alert severity="success" className="status-alert">
                                Your file is downloading.
                            </Alert>
                            <p>You can close this page if the download has finished.</p>
                            <button className="action-btn" onClick={() => navigate("/")}>
                                Return Home
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
