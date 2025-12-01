import React, { useRef, useState } from 'react'
import './App.css'

export default function App() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [message, setMessage] = useState<string | null>(null);

  // Upload logic
  const uploadFile = async (f: File) => {
    // TODO: handle upload logic (e.g., send to API)
    const formdata = new FormData();
    formdata.append('file', f);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try{
      const response = await fetch('http://127.0.0.1:8000/upload/file/', {
        method: 'POST',
        body: formdata,
      });
      
      const result = await response.json();

      setMessage(result.message);

      if (!response.ok) {
        let errorMsg = result.message || 'Upload failed';

        if (result.detail) {
        if (typeof result.detail === "string") {
          errorMsg = result.detail;
        } else if (Array.isArray(result.detail)) {
          errorMsg = result.detail.map((d: any) => d.msg).join("\n");
        }
      } else if (result.message) {
        errorMsg = result.message;
      }

      setMessage(`❌ ${errorMsg}`);
      setFile(null);
      return;
    }
    // Success
    setMessage(`✅ ${result.message}`);
    console.log("Upload successful:", result);

  } catch (error) {
    setMessage("❌ Network error: Unable to upload file.");
  }
};
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

        {message && (
          <p className={message.includes("Invalid") ? "message-error" : "message-success"}>
            {message}
          </p>
        )}
      </section>
    </main>
  )
}