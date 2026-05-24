import { useState, useRef } from 'react';
import axios from 'axios';
import QRCodeDisplay from '../components/QRCodeDisplay';
import './AdminUpload.css';

function AdminUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [certificateNumber, setCertificateNumber] = useState('');
  const inputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowed.includes(selectedFile.type)) {
      setError('Only image and PDF files are allowed');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);

    // Preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleUpload = async () => {
    if (!file) return;
    if (!certificateNumber.trim()) {
      setError('Please enter a certificate number');
      return;
    }
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('certificate', file);
      formData.append('certificateNumber', certificateNumber.trim());

      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setResult(res.data.certificate);
        setFile(null);
        setPreview(null);
        setCertificateNumber('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setCertificateNumber('');
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-header">
          <h1 className="admin-title">Certificate Upload</h1>
          <p className="admin-subtitle">Upload certificate to generate QR code</p>
        </div>

        {!result ? (
          <>
            {/* Drop Zone */}
            <div
              className={`dropzone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e.target.files[0])}
                hidden
              />

              {preview ? (
                <div className="dropzone-preview">
                  <img src={preview} alt="Preview" className="preview-img" />
                </div>
              ) : file ? (
                <div className="dropzone-file-info">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{file.name}</span>
                </div>
              ) : (
                <div className="dropzone-content">
                  <div className="dropzone-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="dropzone-text">Drop certificate here or click to browse</p>
                  <p className="dropzone-hint">Supports JPG, PNG, WebP, PDF (max 10MB)</p>
                </div>
              )}
            </div>

            {/* Custom Certificate Number Input Field */}
            {file && (
              <div className="admin-input-group">
                <label htmlFor="certificateNumber" className="admin-input-label">
                  Enter Certificate Number
                </label>
                <input
                  id="certificateNumber"
                  type="text"
                  className="admin-text-input"
                  placeholder="e.g. CERT-101, VISHU-001, AI-2025-77"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            )}

            {/* Error */}
            {error && <div className="admin-error">{error}</div>}

            {/* Upload Button */}
            {file && (
              <button
                className={`upload-btn ${uploading ? 'uploading' : ''}`}
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Uploading...
                  </>
                ) : (
                  'Upload & Generate QR'
                )}
              </button>
            )}
          </>
        ) : (
          /* Result with QR Code */
          <div className="upload-result">
            <QRCodeDisplay
              qrDataUrl={result.qrCode}
              publicUrl={result.publicUrl}
              certificateId={result.id}
            />
            <button className="reset-btn" onClick={handleReset}>
              Upload Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUpload;
