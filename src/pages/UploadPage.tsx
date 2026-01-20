import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../Layout";
import "./UploadPage.css"; // New CSS

export default function UploadPage() {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    const token = localStorage.getItem("token");
    const bankName = localStorage.getItem("bank_name") || "default_Bank";

    // ----------------------------
    // Upload File -> /upload/file/
    // ----------------------------
    const uploadFile = async (f: File) => {
        const formData = new FormData();
        formData.append("file", f);
        formData.append("bank_name", bankName);

        // Reset message
        setMessage("Uploading file...");
        setIsError(false);

        try {
            const uploadRes = await axiosClient.post(
                "/upload/file/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // DO NOT manually set multipart/form-data
                    },
                }
            );

            const data = uploadRes.data;
            console.log("Upload result:", data);
            setMessage("✅ File uploaded. Running prediction...");

            return data.result_key;
        } catch (err: any) {
            console.error("Upload error:", err);
            const msg = err.response?.data?.detail || "Upload failed.";
            setMessage(`❌ ${msg}`);
            setIsError(true);
            return null;
        }
    };

    // ----------------------------
    // Run Prediction -> /predict/
    // ----------------------------
    const runPrediction = async (resultKey: string) => {
        try {
            const res = await axiosClient.post(
                "/predict/",
                { input_key: resultKey },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = res.data;
            console.log("Prediction completed. Result key:", data.result_key);

            setMessage("Processing completed. Redirecting...");
            return data.result_key;
        } catch (err: any) {
            console.error("Prediction error:", err);
            setMessage("❌ Prediction failed.");
            setIsError(true);
            return null;
        }
    };

    // ----------------------------
    // File selection handler
    // ----------------------------
    const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) return;

        setFile(f);
        await handleProcess(f);
    };

    // ----------------------------
    // Drag & drop handlers
    // ----------------------------
    const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const onDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const f = e.dataTransfer.files?.[0] ?? null;
        if (f) {
            setFile(f);
            await handleProcess(f);
        }
    };

    // Combined process
    const handleProcess = async (f: File) => {
        const uploadKey = await uploadFile(f);
        if (!uploadKey) return;

        const predictionKey = await runPrediction(uploadKey);
        if (!predictionKey) return;

        // Small delay to let user see success message
        setTimeout(() => {
            navigate(`/download?key=${encodeURIComponent(predictionKey)}`);
        }, 1000);
    };

    const fileName = file?.name;

    return (
        <Layout>
            <div className="upload-container">
                {/* Decorative Shapes */}
                <div className="upload-shape upload-shape-1"></div>
                <div className="upload-shape upload-shape-2"></div>

                <div className="upload-card">
                    <h2>Upload Transactions</h2>
                    <p className="note">Supported formats: CSV, Excel (.xlsx)</p>

                    <input
                        ref={inputRef}
                        id="file-input"
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={onSelectFile}
                        className="hidden-file-input"
                    />

                    <label
                        htmlFor="file-input"
                        className={`upload-zone ${dragActive ? "drag-active" : ""}`}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        <div className="upload-icon">
                            {/* Simple Folder/Cloud SVG Icon */}
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24254 10.1948M12 12V21M12 12L15 15M12 12L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="upload-text">
                            {fileName ? "Selected file:" : "Drag & Drop files here"}
                        </span>
                        {fileName ? (
                            <span className="file-name-display">{fileName}</span>
                        ) : (
                            <span className="upload-subtext">or click to browse</span>
                        )}
                    </label>

                    {message && (
                        <div className={`upload-message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
