import React, { useRef, useState } from 'react'
import './App.css'

export default function App() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [message, setMessage] = useState<string | null>(null);

  // Upload logic
  const uploadFile = (f: File) => {
    // TODO: handle upload logic (e.g., send to API)
    alert(`Uploading: ${f.name}`)
    setMessage(`File "${f.name}" uploaded successfully!`);
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

        {/* Upload button removed for auto-upload */}
        {/* Notification message */}
        {message && <div className="uploadMessage">{message}</div>}
      </section>
    </main>
  )
}