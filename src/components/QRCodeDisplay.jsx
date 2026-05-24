import { useRef } from 'react';
import './QRCodeDisplay.css';

function QRCodeDisplay({ qrDataUrl, publicUrl, certificateId }) {
  const qrRef = useRef(null);

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.download = `certificate-${certificateId}-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      // Brief visual feedback
      const btn = document.querySelector('.copy-btn');
      if (btn) {
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = 'Copy URL'), 1500);
      }
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = publicUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
  };

  return (
    <div className="qr-display">
      <div className="qr-success-badge">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>Certificate Uploaded</span>
      </div>

      <div className="qr-image-wrap" ref={qrRef}>
        <img src={qrDataUrl} alt="QR Code" className="qr-image" />
      </div>

      <div className="qr-url-bar">
        <span className="qr-url-text">{publicUrl}</span>
      </div>

      <div className="qr-actions">
        <button className="qr-btn download-btn" onClick={handleDownloadQR}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download QR
        </button>
        <button className="qr-btn copy-btn" onClick={handleCopyUrl}>
          Copy URL
        </button>
      </div>
    </div>
  );
}

export default QRCodeDisplay;
