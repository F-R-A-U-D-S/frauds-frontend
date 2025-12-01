import React, { useRef, useState } from 'react'
// import { AuthContext } from "./authcontext";
import { useNavigate } from "react-router-dom";
import Layout from '../Layout'
import '../Layout.css'
import '../App.css'
import '../index.css'

export default function UploadPage() {
const navigate = useNavigate();
const inputRef = useRef<HTMLInputElement | null>(null)
const [file, setFile] = useState<File | null>(null)
const [dragActive, setDragActive] = useState(false)
const [message, setMessage] = useState<string | null>(null);

// Upload logic
const uploadFile = async (f: File) => {
    const formData = new FormData();
    formData.append("file", f);

    const token = localStorage.getItem("token");

    try {
    const res = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Upload failed");
    }

    const data = await res.json(); // { result_key: "..." }

    setMessage("File uploaded. Processing started.");
    console.log("Result key:", data.result_key);
    navigate(`/download?key=${encodeURIComponent(data.result_key)}`);

    } catch (err) {
    console.error(err);
    setMessage("Failed to upload file.");
    }
}

const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    if (f) uploadFile(f)
}

const fileName = file?.name ?? 'FileName.csv'

// Drag and drop handlers
const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
}

const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
}

const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0] ?? null
    if (f) {
    setFile(f)
    uploadFile(f)
    }
}

return (
        <Layout>
            <main className="centerArea">
                <section className="content">
                    <h2 className="subtitle">Please Upload Your Transactions File</h2>
                    <p className="note">(Note: The file must be either CSV/Excel)</p>

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
                            className={`fileInputBox${dragActive ? ' dragActive' : ''}`}
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

                    {/* Upload button not present for auto-upload */}
                    {/* Notification message */}
                    {message && <div className="uploadMessage">{message}</div>}
                </section>
            </main>
        </Layout>
)
}