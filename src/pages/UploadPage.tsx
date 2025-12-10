import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../Layout";

import "../Layout.css";
import "../App.css";
import "../index.css";

export default function UploadPage() {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const token = localStorage.getItem("token");
    const bankName = localStorage.getItem("bank_name") || "default_Bank";

    // ----------------------------
    // Upload File -> /upload/file/
    // ----------------------------
    const uploadFile = async (f: File) => {
        const formData = new FormData();
        formData.append("file", f);
        formData.append("bank_name", bankName);

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

            setMessage("Processing completed.");
            return data.result_key;
        } catch (err: any) {
            console.error("Prediction error:", err);
            setMessage("❌ Prediction failed.");
            return null;
        }
    };

    // ----------------------------
    // File selection handler
    // ----------------------------
    const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);

        if (f) {
            const uploadKey = await uploadFile(f);
            if (!uploadKey) return;

            const predictionKey = await runPrediction(uploadKey);
            if (!predictionKey) return;

            navigate(`/download?key=${encodeURIComponent(predictionKey)}`);
        }
    };

    // ----------------------------
    // Drag & drop handlers
    // ----------------------------
    const fileName = file?.name ?? "FileName.csv";

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

            const uploadKey = await uploadFile(f);
            if (!uploadKey) return;

            const predictionKey = await runPrediction(uploadKey);
            if (!predictionKey) return;

            navigate(`/download?key=${encodeURIComponent(predictionKey)}`);
        }
    };

    // ----------------------------
    // UI
    // ----------------------------
    return (
        <Layout>
            <main className="centerArea">
                <section className="content">
                    <h2 className="subtitle">Please upload your transactions file</h2>
                    <p className="note">(Note: Must be CSV or Excel)</p>

                    <div className="fileInputRow">
                        <input
                            ref={inputRef}
                            id="file-input"
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={onSelectFile}
                            className="hiddenFileInput"
                        />

                        <label
                            htmlFor="file-input"
                            className={`fileInputBox${dragActive ? " dragActive" : ""}`}
                            aria-label="Select file"
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                        >
                            <span className="fileButton">Select file</span>
                            <span className="fileName" title={fileName}>
                                {fileName}
                            </span>
                        </label>
                    </div>

                    {message && <div className="uploadMessage">{message}</div>}
                </section>
            </main>
        </Layout>
    );
}
